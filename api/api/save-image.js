const store = new Map();

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

    const id =
      Date.now().toString(36) +
      Math.random().toString(36).slice(2);

    store.set(id, {
      imageData,
      fileName: fileName || "elastic-snap.jpg",
      createdAt: Date.now()
    });

    return res.status(200).json({
      id
    });

  } catch (error) {
    console.error("SAVE IMAGE ERROR:", error);

    return res.status(500).json({
      error: "Failed to save image"
    });
  }
}

export { store };
