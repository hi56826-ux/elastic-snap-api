import { put } from "@vercel/blob";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed"
    });
  }

  try {
    const { imageData, fileName } = req.body || {};

    if (!imageData) {
      return res.status(400).json({
        error: "No image data received"
      });
    }

    const base64 = imageData.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const buffer = Buffer.from(base64, "base64");

    const safeFileName =
      (fileName || `elastic-snap-${Date.now()}.jpg`)
        .replace(/[^\w가-힣.-]/g, "_");

    const blob = await put(
      `elastic-snap/${Date.now()}-${safeFileName}`,
      buffer,
      {
        access: "public",
        contentType: "image/jpeg",
        addRandomSuffix: true
      }
    );

    console.log("BLOB SAVED:", blob.url);

    return res.status(200).json({
      url: blob.url,
      pathname: blob.pathname
    });

  } catch (error) {
    console.error(
      "SAVE IMAGE ERROR:",
      error?.message || error
    );

    return res.status(500).json({
      error: error?.message || "Failed to save image"
    });
  }
}
