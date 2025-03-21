"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, Upload } from "lucide-react"
import { CitizenHeader } from "../components/citizen-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  { id: "Step 1", name: "Personal Details", fields: ["name", "phone", "email"] },
  { id: "Step 2", name: "Complaint Details", fields: ["category", "description", "location"] },
  { id: "Step 3", name: "Attachments", fields: ["attachments"] },
  { id: "Step 4", name: "Review", fields: [] },
]

export default function SubmitComplaintPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
    description: "",
    location: "",
    attachments: [] as File[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })

    // Clear error when user selects
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setFormData({ ...formData, attachments: [...formData.attachments, ...filesArray] })

      // Create preview URLs
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setPreviewUrls([...previewUrls, ...newPreviewUrls])
    }
  }

  const removeAttachment = (index: number) => {
    const newAttachments = [...formData.attachments]
    newAttachments.splice(index, 1)
    setFormData({ ...formData, attachments: newAttachments })

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])
    const newPreviewUrls = [...previewUrls]
    newPreviewUrls.splice(index, 1)
    setPreviewUrls(newPreviewUrls)
  }

  const validateStep = () => {
    const currentFields = steps[currentStep].fields
    const newErrors: Record<string, string> = {}
    let isValid = true

    currentFields.forEach((field) => {
      if (field === "attachments") return // Skip validation for attachments

      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        isValid = false
      }

      // Email validation
      if (field === "email" && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
        isValid = false
      }

      // Phone validation
      if (field === "phone" && formData.phone && !/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid 10-digit phone number"
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    // In a real application, you would submit the form data to your backend here
    console.log("Form submitted:", formData)

    // Generate a random complaint ID
    const complaintId = Math.random().toString(36).substring(2, 10).toUpperCase()

    // Navigate to confirmation page with the complaint ID
    router.push(`/submit-complaint/confirmation?id=${complaintId}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <CitizenHeader />

      <main className="flex-1 py-10">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Submit a Complaint</h1>
            <p className="text-gray-500 mt-2">
              Please fill out the form below to submit your complaint to the relevant department.
            </p>
          </div>

          {/* Steps */}
          <nav aria-label="Progress" className="mb-8">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
              {steps.map((step, index) => (
                <li key={step.name} className="md:flex-1">
                  <div
                    className={`flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                      index < currentStep
                        ? "border-primary"
                        : index === currentStep
                          ? "border-primary"
                          : "border-gray-200"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {index < currentStep ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                          <Check className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                      ) : index === currentStep ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary">
                          <span className="text-primary">{index + 1}</span>
                        </span>
                      ) : (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300">
                          <span className="text-gray-500">{index + 1}</span>
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-medium mt-1">{step.name}</span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].name}</CardTitle>
              <CardDescription>
                {currentStep === 0 && "Please provide your contact information"}
                {currentStep === 1 && "Tell us about your complaint"}
                {currentStep === 2 && "Upload any relevant documents or images"}
                {currentStep === 3 && "Review your information before submitting"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Personal Details */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your 10-digit phone number"
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Complaint Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Complaint Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="water">Water Supply</SelectItem>
                        <SelectItem value="electricity">Electricity</SelectItem>
                        <SelectItem value="roads">Roads & Infrastructure</SelectItem>
                        <SelectItem value="sanitation">Sanitation & Waste</SelectItem>
                        <SelectItem value="public_services">Public Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Complaint Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your complaint in detail"
                      rows={5}
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter the location of the issue"
                    />
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Attachments */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="attachments">Upload Images or Documents</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="attachments"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF (MAX. 5MB)</p>
                        </div>
                        <Input
                          id="attachments"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/png, image/jpeg, application/pdf"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Preview uploaded files */}
                  {formData.attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="relative">
                            {file.type.startsWith("image/") ? (
                              <img
                                src={previewUrls[index] || "/placeholder.svg"}
                                alt={`Preview ${index}`}
                                className="h-24 w-full object-cover rounded-md"
                              />
                            ) : (
                              <div className="h-24 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                                <p className="text-sm text-gray-500 truncate px-2">{file.name}</p>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                            >
                              <span className="sr-only">Remove</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Personal Details</h3>
                    <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-sm text-gray-500">Full Name</Label>
                        <p>{formData.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Phone Number</Label>
                        <p>{formData.phone}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-sm text-gray-500">Email Address</Label>
                        <p>{formData.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Complaint Details</h3>
                    <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-sm text-gray-500">Category</Label>
                        <p>
                          {formData.category.charAt(0).toUpperCase() + formData.category.slice(1).replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Location</Label>
                        <p>{formData.location}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-sm text-gray-500">Description</Label>
                        <p className="whitespace-pre-line">{formData.description}</p>
                      </div>
                    </div>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium">Attachments</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{formData.attachments.length} file(s) attached</p>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="relative">
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={previewUrls[index] || "/placeholder.svg"}
                                  alt={`Preview ${index}`}
                                  className="h-20 w-full object-cover rounded-md"
                                />
                              ) : (
                                <div className="h-20 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                                  <p className="text-xs text-gray-500 truncate px-2">{file.name}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>Submit Complaint</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-gray-50 dark:bg-gray-900">
        <div className="container flex flex-col gap-2 py-10 md:flex-row md:gap-4 md:py-8">
          <p className="text-center text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-left">
            © 2025 CitizenOne. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

