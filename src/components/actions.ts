"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

interface ConsultationData {
  name: string
  email: string
  date: string
  message: string
}

export async function saveConsultation(data: ConsultationData) {
  try {
    const filename = `consultation-${Date.now()}.json`
    const blob = await put(filename, JSON.stringify(data), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log(`Consultation saved to ${blob.url}`)
    // revalidatePath("/book-consultation")
    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Error saving consultation:", error)
    throw new Error("Failed to save consultation")
  }
}

