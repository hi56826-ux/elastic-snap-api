import OpenAI from "openai";

function sanitizeWho(who) {
  const map = {
    "초등학생":
      "a fully clothed school student in a supervised recreational setting",
    "어린이":
      "a fully clothed young student in a supervised recreational setting",
    "어린이 두 명":
      "two fully clothed young students in a supervised recreational setting",
    "중학생":
      "a fully clothed middle-school student",
    "고등학생":
      "a fully clothed high-school student",
    "친구 두 명":
      "two fully clothed students in a safe supervised setting",
    "가족":
      "a family in a safe everyday recreational setting",
    "농구선수":
      "a fully clothed basketball player",
    "축구선수":
      "a fully clothed soccer player",
    "테니스선수":
      "a fully clothed tennis player",
    "양궁선수":
      "a fully clothed archery athlete at a supervised range",
    "체조선수":
      "a fully clothed gymnastics athlete in a supervised sports setting",
    "육상선수":
      "a fully clothed track-and-field athlete",
    "자전거를 타는 사람":
      "a fully clothed cyclist in a safe recreational setting",
    "캠핑 중인 사람":
      "a fully clothed person camping outdoors safely",
    "반려견과 놀고 있는 사람":
      "a fully clothed person safely playing with a dog outdoors"
  };

  return map[who] ||
    "a fully clothed person in a safe supervised setting";
}

function getElasticObjectGuide(item) {
  const guides = {
    "점핑볼":
      "Show a clearly visible bouncing ball. The lower contact area should be subtly compressed against the ground and recovering its round shape.",

    "트램펄린":
      "Show the trampoline mat clearly depressed under the person's weight or recovering upward.",

    "농구공":
      "Show the basketball contacting the floor with subtle realistic compression.",

    "축구공":
      "Show the soccer ball contacting the ground with subtle realistic deformation.",

    "배구공":
      "Show the volleyball deforming slightly at impact.",

    "테니스공":
      "Show the tennis ball deforming slightly at impact.",

    "탁구공":
      "Show the table tennis ball clearly bouncing from a hard surface with subtle realistic deformation.",

    "고무공":
      "Show the rubber ball slightly compressed at the point of contact.",

    "고무줄":
      "Use a close-up showing the rubber band clearly stretched between hands.",

    "머리끈":
      "Use a close-up showing one elastic hair tie clearly stretched between two hands.",

    "운동용 저항밴드":
      "Show the resistance band clearly stretched during safe exercise.",

    "활":
      "Show the bow limbs clearly bent under tension at a supervised archery range.",

    "낚싯대":
      "Show the fishing rod clearly bending naturally under load.",

    "다이빙보드":
      "Show the diving board visibly bending in a supervised pool setting.",

    "장대높이뛰기 장대":
      "Show the pole visibly bending during a supervised athletic vault.",

    "용수철":
      "Show the spring clearly compressed or stretched.",

    "매트리스":
      "Show the mattress visibly compressed under normal use.",

    "소파 쿠션":
      "Show the cushion clearly compressed and recovering.",

    "운동화 밑창":
      "Show the shoe sole compressing slightly at ground contact.",

    "자동차 서스펜션":
      "Show the vehicle wheel and suspension mechanism visibly compressed.",

    "자전거 서스펜션":
      "Show the bicycle suspension visibly compressed over a bump.",

    "스펀지":
      "Use a close-up showing the sponge being compressed by hand.",

    "에어쿠션":
      "Show the air cushion visibly compressed under pressure."
  };

  return guides[item] ||
    "The elastic object must be clearly visible and its deformation must be physically realistic.";
}

function buildPrompt({
  who,
  elasticItem,
  action,
  place,
  moment,
  photoStyle,
  requestId
}) {
  const safeWho = sanitizeWho(who);
  const guide = getElasticObjectGuide(elasticItem);

  return `
Create one new photorealistic educational science photograph.

SUBJECT:
${safeWho}

ELASTIC OBJECT:
${elasticItem}

ACTION:
${action}

LOCATION:
${place}

ELASTIC MOMENT:
${moment}

PHOTO STYLE:
${photoStyle}

REQUEST ID:
${requestId || Date.now()}

This is a safe educational science scene about elasticity.

${guide}

The selected elastic object must be clearly visible.
The deformation or recovery must be physically realistic.
Focus mainly on the elastic object and the scientific moment.

Use natural lighting.
Use realistic materials.
Use realistic human anatomy and natural posture.
Use professional photography composition.

No illustration.
No cartoon.
No diagram.
No text inside the image.
No watermark.
No distorted anatomy.
No exaggerated deformation.
`;
}

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
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured"
      });
    }

    const {
      who,
      elasticItem,
      action,
      place,
      moment,
      photoStyle,
      requestId
    } = req.body || {};

    if (
      !elasticItem ||
      !action ||
      !place ||
      !moment ||
      !photoStyle
    ) {
      return res.status(400).json({
        error: "Scene information is missing"
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = buildPrompt({
      who,
      elasticItem,
      action,
      place,
      moment,
      photoStyle,
      requestId
    });

    console.log("GENERATING IMAGE:", {
      who,
      elasticItem,
      action,
      place,
      moment,
      photoStyle
    });

    const result = await client.images.generate({
      model: "gpt-image-2",
      prompt,
      size: "1024x1024"
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      throw new Error("No image data returned");
    }

    const imageBuffer = Buffer.from(
      imageBase64,
      "base64"
    );

    console.log(
      "IMAGE BUFFER SIZE:",
      imageBuffer.length
    );

    res.statusCode = 200;

    res.setHeader(
      "Content-Type",
      "image/png"
    );

    res.setHeader(
      "Content-Length",
      imageBuffer.length
    );

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    res.end(imageBuffer);
    return;

  } catch (error) {
    console.error(
      "IMAGE GENERATION ERROR:",
      error?.status || "",
      error?.message || error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Image generation failed"
    });
  }
}
