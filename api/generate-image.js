import OpenAI from "openai";
import {
  put,
  issueSignedToken,
  presignUrl
} from "@vercel/blob";

function sanitizeWho(who) {
  const map = {
    "초등학생":
      "a fully clothed school student in a supervised recreational setting",
    "어린이":
      "a fully clothed young student in a supervised recreational setting",
    "어린이 두 명":
      "two fully clothed young students in a supervised recreational setting",
    "놀이터에서 노는 어린이":
      "a fully clothed school student playing safely in a supervised playground setting",
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
      "Show a clearly visible bouncing ball. The lower contact area should be subtly compressed against the ground and then recovering its round shape.",

    "트램펄린":
      "Show the trampoline mat clearly depressed under the person's weight or recovering upward.",

    "농구공":
      "Show the basketball clearly contacting the floor with subtle realistic compression.",

    "축구공":
      "Show the soccer ball clearly contacting the ground with subtle realistic deformation.",

    "배구공":
      "Show the volleyball clearly deforming slightly at the moment of impact.",

    "테니스공":
      "Show the tennis ball clearly deforming slightly at impact.",

    "탁구공":
      "Show the table tennis ball clearly bouncing from a hard surface. Its deformation should be subtle and realistic.",

    "고무공":
      "Show the rubber ball clearly compressed slightly where it touches the ground.",

    "고무줄":
      "Use a close-up or medium close-up showing the rubber band clearly stretched between hands.",

    "머리끈":
      "Use a close-up showing one elastic hair tie clearly stretched between two hands. The hair tie must be the main elastic object.",

    "번지점프 로프":
      "Show the bungee cord clearly stretched under tension in a safe supervised recreational setting.",

    "운동용 저항밴드":
      "Show the resistance band clearly stretched during exercise in a safe supervised setting.",

    "활":
      "Show the bow limbs clearly bent under tension while the string is pulled at a supervised archery range.",

    "낚싯대":
      "Show the fishing rod clearly bending naturally under load.",

    "다이빙보드":
      "Show the diving board visibly bending under the athlete's weight in a supervised pool setting.",

    "장대높이뛰기 장대":
      "Show the pole visibly bending during a supervised athletic vault.",

    "용수철":
      "Show the spring clearly compressed or stretched with realistic deformation.",

    "매트리스":
      "Show the mattress visibly compressed under body weight in a normal everyday setting.",

    "소파 쿠션":
      "Show the cushion clearly compressed and recovering under normal use.",

    "운동화 밑창":
      "Show the shoe sole visibly compressing slightly at ground contact.",

    "자동차 서스펜션":
      "Use a close or medium shot showing the vehicle wheel and suspension mechanism visibly compressed.",

    "자전거 서스펜션":
      "Show the bicycle suspension visibly compressed while riding over a bump.",

    "스펀지":
      "Use a close-up showing the sponge being compressed by hand and recovering.",

    "에어쿠션":
      "Show the air cushion visibly compressed under pressure."
  };

  return guides[item] ||
    "The selected elastic object must be clearly visible and its deformation must be physically realistic.";
}

function buildPrimaryPrompt({
  who,
  elasticItem,
  action,
  place,
  moment,
  photoStyle,
  requestId
}) {
  const safeWho = sanitizeWho(who);
  const objectGuide =
    getElasticObjectGuide(elasticItem);

  return `
Create ONE new photorealistic educational science photograph.

SUBJECT:
${safeWho}

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

This is a safe educational science scene.

Focus on the selected elastic object and its deformation.

${objectGuide}

The selected elastic object must be clearly visible.

The elastic deformation or recovery must be physically realistic.

Use natural human anatomy and realistic body posture.

Photorealistic professional photography.
Natural lighting.
Realistic materials.
Realistic shadows.
High-detail action photography.

No illustration.
No cartoon.
No diagram.
No infographic.
No text inside the image.
No watermark.
No distorted anatomy.
No exaggerated deformation.
`;
}

function buildSafeRetryPrompt({
  elasticItem,
  action,
  place,
  moment,
  photoStyle,
  requestId
}) {
  return `
Create one photorealistic educational science photograph.

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

This is a safe supervised science-learning scene.

Focus mainly on the elastic object.

The elastic object must be clearly visible.

The deformation must be realistic and easy to recognize.

Professional photography.
Natural lighting.
Realistic physics.

No danger.
No injury.
No illustration.
No cartoon.
No diagram.
No text in image.
`;
}

async function generateImageWithSafetyRetry(
  client,
  primaryPrompt,
  safePrompt
) {
  try {
    console.log("Trying primary image prompt");

    return await client.images.generate({
      model: "gpt-image-2",
      prompt: primaryPrompt,
      size: "1024x1024"
    });

  } catch (error) {

    const status = error?.status;
    const message =
      String(error?.message || "");

    console.error(
      "PRIMARY IMAGE ERROR:",
      status,
      message
    );

    const safetyRejected =
      status === 400 &&
      (
        message.toLowerCase().includes("safety") ||
        message.toLowerCase().includes("rejected")
      );

    if (!safetyRejected) {
      throw error;
    }

    console.log(
      "Safety rejection detected. Retrying."
    );

    return await client.images.generate({
      model: "gpt-image-2",
      prompt: safePrompt,
      size: "1024x1024"
    });
  }
}

export default async function handler(
  req,
  res
) {

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

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
      throw new Error(
        "OPENAI_API_KEY is missing"
      );
    }

    const client = new OpenAI({
      apiKey:
        process.env.OPENAI_API_KEY
    });

    const {
      who,
      elasticItem,
      action,
      place,
      moment,
      photoStyle,
      requestId
    } = req.body || {};

    console.log("REQUEST VALUES:", {
      who,
      elasticItem,
      action,
      place,
      moment,
      photoStyle,
      requestId
    });

    if (
      !elasticItem ||
      !action ||
      !place ||
      !moment ||
      !photoStyle
    ) {
      return res.status(400).json({
        error:
          "Scene information is missing"
      });
    }

    const primaryPrompt =
      buildPrimaryPrompt({
        who,
        elasticItem,
        action,
        place,
        moment,
        photoStyle,
        requestId
      });

    const safePrompt =
      buildSafeRetryPrompt({
        elasticItem,
        action,
        place,
        moment,
        photoStyle,
        requestId
      });

    const result =
      await generateImageWithSafetyRetry(
        client,
        primaryPrompt,
        safePrompt
      );

    const imageBase64 =
      result.data?.[0]?.b64_json;

    if (!imageBase64) {
      throw new Error(
        "No image data returned"
      );
    }

    console.log(
      "IMAGE BASE64 LENGTH:",
      imageBase64.length
    );

    const imageBuffer =
      Buffer.from(
        imageBase64,
        "base64"
      );

    console.log(
      "IMAGE BUFFER SIZE:",
      imageBuffer.length
    );

    /*
      중요:
      현재 Vercel Blob Store는 PRIVATE 입니다.
      따라서 access: "private" 사용.
    */

    const fileName =
      `elastic-snap/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.png`;

    const blob = await put(
      fileName,
      imageBuffer,
      {
        access: "private",
        contentType: "image/png",
        addRandomSuffix: true
      }
    );

    console.log(
      "PRIVATE BLOB SAVED:",
      blob.pathname
    );

    /*
      Private Blob은 일반 blob.url을
      브라우저에서 직접 볼 수 없으므로
      signed GET URL을 발급합니다.
    */

    const token =
      await issueSignedToken({
        operations: ["get"]
      });

    const {
      presignedUrl
    } = await presignUrl(
      token,
      {
        pathname: blob.pathname,
        operation: "get",

        // 1시간 동안 사용 가능
        validUntil:
          Date.now() +
          60 * 60 * 1000
      }
    );

    console.log(
      "SIGNED IMAGE URL CREATED"
    );

    /*
      Canva에는 signed URL을 반환.
      이 URL로 이미지 표시 및 저장 가능.
    */

    return res.status(200).json({
      imageUrl: presignedUrl,
      downloadUrl: presignedUrl,
      pathname: blob.pathname
    });

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
