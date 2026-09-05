import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed",
    });
  }

  try {
    const {
      who,
      elasticItem,
      action,
      place,
      moment,
      photoStyle,
      requestId,
    } = req.body;

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

IMPORTANT:

The selected elastic object "${elasticItem}" must be clearly visible.

The selected elastic object must be the main object demonstrating elasticity.

The exact deformation described in "${moment}" must be visually observable.

The action "${action}" must naturally involve "${elasticItem}".

The location must clearly feel like "${place}".

Do not introduce another prominent elastic object.

The elastic deformation must be physically realistic.

The photograph should make it possible to identify the elastic object and understand what is being deformed.

Use realistic human proportions and natural posture.

Use realistic hands and fingers.

Use realistic materials, lighting, shadows, and physical interaction.

If the elastic object is small, use a close-up or medium close-up.

If the elastic object is large, use a medium or wide action shot.

Photo style:
${photoStyle}

Create a fresh visual composition, camera angle, clothing, background arrangement, and object details for this request.

Photorealistic.
Professional photography.
High detail.
Natural lighting.
Realistic action photography.
Shallow depth of field when appropriate.

No illustration.
No cartoon.
No diagram.
No infographic.
No text inside the image.
No watermark.
No distorted hands.
No extra fingers.
No impossible anatomy.
No exaggerated elastic deformation.
`;

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      throw new Error("Image data was not returned");
    }

    return res.status(200).json({
      imageData: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("IMAGE GENERATION ERROR:", error);

    return res.status(500).json({
      error: "Image generation failed",
    });
  }
}
