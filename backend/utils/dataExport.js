import json2csv from "json2csv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import XLSX from "xlsx"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {Array} fields - Fields to include in the export
 * @param {string} filename - Output filename
 * @returns {Promise<string>} - Path to the exported file
 */
export const exportToCSV = async (data, fields, filename) => {
  return new Promise((resolve, reject) => {
    try {
      // Create export directory if it doesn't exist
      const exportDir = path.join(__dirname, "..", "exports")
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true })
      }

      // Generate CSV
      const csv = json2csv.parse(data, { fields })

      // Create full file path
      const filePath = path.join(exportDir, `${filename}.csv`)

      // Write to file
      fs.writeFileSync(filePath, csv)

      resolve(filePath)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Output filename
 * @param {string} sheetName - Excel sheet name
 * @returns {Promise<string>} - Path to the exported file
 */
export const exportToExcel = async (data, filename, sheetName = "Sheet1") => {
  return new Promise((resolve, reject) => {
    try {
      // Create export directory if it doesn't exist
      const exportDir = path.join(__dirname, "..", "exports")
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true })
      }

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

      // Create full file path
      const filePath = path.join(exportDir, `${filename}.xlsx`)

      // Write to file
      XLSX.writeFile(workbook, filePath)

      resolve(filePath)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Export data to JSON file
 * @param {Array|Object} data - Data to export
 * @param {string} filename - Output filename
 * @returns {Promise<string>} - Path to the exported file
 */
export const exportToJSON = async (data, filename) => {
  return new Promise((resolve, reject) => {
    try {
      // Create export directory if it doesn't exist
      const exportDir = path.join(__dirname, "..", "exports")
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true })
      }

      // Create full file path
      const filePath = path.join(exportDir, `${filename}.json`)

      // Write to file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

      resolve(filePath)
    } catch (error) {
      reject(error)
    }
  })
}

