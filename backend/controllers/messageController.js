import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .sort({ updatedAt: -1 })
      .populate("participants", "name email");
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate(
      "participants",
      "name email"
    );
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { participantIds } = req.body;
    if (!participantIds.includes(req.user.id)) {
      participantIds.push(req.user.id);
    }
    const conversation = new Conversation({ participants: participantIds });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const attachments = req.files ? req.files.map(file => file.path) : [];
    const message = new Message({
      conversation: req.params.id,
      sender: req.user.id,
      content,
      attachments,
    });
    await message.save();
    await Conversation.findByIdAndUpdate(req.params.id, { updatedAt: new Date() });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { conversationId: req.params.id, sender: { $ne: req.user.id }, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
