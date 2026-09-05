import OpenAI from "openai";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS 요청은 OpenAI를 전혀 호출하지 않고 바로 종료
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed",
    });
  }

  try {
    // 여기서 API KEY 확인
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing");

      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured",
      });
    }

    // POST일 때만 OpenAI client 생성
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const {
      who,
      elasticItem,
      action,
      place,
      moment,
      photoStyle,
      requestId,
    } = req.body || {};

    if (
      !who ||
      !elasticItem ||
      !action ||
      !place ||
      !moment ||
      !photoStyle
    ) {
      return res.status(400).json({
        error: "Scene information is missing",
      });
    }

    const prompt = `
Create one completely new photorealistic professional photograph.

SUBJECT:
${who}

SELECTED ELASTIC OBJECT:
${elasticItem}

ACTION:
${action}

LOCATION:
${place}

EXACT ELASTIC MOMENT:
${moment}

PHOTO STYLE:
${photoStyle}

REQUEST ID:
${requestId || Date.now()}

The selected elastic object "${elasticItem}" must be clearly visible.
The selected elastic deformation must be physically realistic.
The action must naturally involve the selected elastic object.
Do not introduce another prominent elastic object.

Photorealistic professional photography.
Natural human anatomy.
Realistic hands and fingers.
Realistic materials and lighting.
No illustration.
No cartoon.
No diagram.
No text inside the image.
`;

    const result = await client.images.generate({
      model: "gpt-image-2",
      prompt,
      size: "1024x1024",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    console.log(
      "IMAGE BASE64 LENGTH:",
      imageBase64?.length || 0
    );

    if (!imageBase64) {
      throw new Error("No image data returned");
    }

    return res.status(200).json({
      imageData: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error(
      "IMAGE GENERATION ERROR:",
      error?.message || error
    );

    return res.status(500).json({
      error: error?.message || "Image generation failed",
    });
  }
}
