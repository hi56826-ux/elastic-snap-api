import { store } from "./save-image.js";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send("Missing id");
    }

    const item = store.get(id);

    if (!item) {
      return res.status(404).send("File not found");
    }

    const base64 = item.imageData.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const buffer = Buffer.from(base64, "base64");

    const fileName = item.fileName || "elastic-snap.jpg";

    res.statusCode = 200;

    res.setHeader(
      "Content-Type",
      "image/jpeg"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );

    res.setHeader(
      "Content-Length",
      buffer.length
    );

    res.end(buffer);

  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);

    return res.status(500).send("Download failed");
  }
}
