export async function uploadToBackend(file: File): Promise<string> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("Backend URL is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${backendUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();


    return data.url; // 🔥 this is your downloadable link
  } catch (error:any) {
    console.error("[Backend Upload Error]:", error);
    throw new Error(`Failed to upload file: ${error?.message}`);
  }
}