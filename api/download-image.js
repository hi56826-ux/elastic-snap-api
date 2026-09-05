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
        error: "No image data"
      });
    }

    const base64 = imageData.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const buffer = Buffer.from(base64, "base64");

    const safeName =
      (fileName || "elastic-snap.jpg")
        .replace(/[^\w가-힣.-]/g, "_");

    res.statusCode = 200;

    res.setHeader(
      "Content-Type",
      "image/jpeg"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(safeName)}"`
    );

    res.setHeader(
      "Content-Length",
      buffer.length
    );

    res.end(buffer);
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);

    return res.status(500).json({
      error: "Download failed"
    });
  }
}
