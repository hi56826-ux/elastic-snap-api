export default async function handler(req, res) {
  try {
    const { url, name } = req.query;

    if (!url) {
      return res.status(400).send("Missing file URL");
    }

    const parsedUrl = new URL(url);

    // Vercel Blob 파일만 허용
    if (
      !parsedUrl.hostname.endsWith(
        ".blob.vercel-storage.com"
      )
    ) {
      return res.status(400).send("Invalid file URL");
    }

    const imageResponse = await fetch(url);

    if (!imageResponse.ok) {
      return res.status(500).send(
        "Could not load image"
      );
    }

    const arrayBuffer =
      await imageResponse.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const safeName =
      (name || "Elastic_Snap.jpg")
        .replace(/[^\w가-힣.-]/g, "_");

    res.statusCode = 200;

    res.setHeader(
      "Content-Type",
      "image/jpeg"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(
        safeName
      )}"`
    );

    res.setHeader(
      "Content-Length",
      buffer.length
    );

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    res.end(buffer);

  } catch (error) {
    console.error(
      "DOWNLOAD ERROR:",
      error
    );

    return res.status(500).send(
      "Download failed"
    );
  }
}
