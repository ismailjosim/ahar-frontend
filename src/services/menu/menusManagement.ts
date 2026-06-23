/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch"
// ======================================================
//* CREATE MENU
// ======================================================
export const createMenu = async (_prevState: any, formData: FormData) => {
  try {
    const payload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isActive: formData.get("isActive") === "true",
    }
    const response = await serverFetch.post("/menu", {
      body: JSON.stringify(payload),
    })
    return response
  } catch (error) {
    console.error("Error creating menu:", error)
    throw error
  }
}
