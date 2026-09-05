const MODEL_ID = "gemini-3.1-flash-image";

function mapWho(who) {
  const map = {
    "초등학생":
      "a school-aged child in a safe supervised educational or recreational setting",
    "중학생":
      "a realistic middle-school-aged student around 13 to 15 years old wearing appropriate athletic clothing",
    "고등학생":
      "a realistic high-school-aged student around 16 to 18 years old wearing appropriate athletic clothing",
    "친구 두 명":
      "two realistic school-aged students in appropriate casual or athletic clothing",
    "가족":
      "a family in a safe everyday recreational setting",
    "농구선수":
      "a realistic basketball player wearing proper sportswear",
    "축구선수":
      "a realistic soccer player wearing proper sportswear",
    "테니스선수":
      "a realistic tennis player wearing proper sportswear",
    "양궁선수":
      "a realistic archery athlete at a supervised range",
    "육상선수":
      "a realistic track-and-field athlete wearing sportswear",
    "자전거를 타는 사람":
      "a realistic cyclist wearing appropriate sportswear and safety gear",
    "캠핑 중인 사람":
      "a realistic person camping outdoors safely",
    "반려견과 놀고 있는 사람":
      "a realistic person safely playing with a dog outdoors"
  };

  return map[who] ||
    "a realistic fully clothed person in a safe supervised setting";
}

function mapElasticObject(item) {
  const map = {
    "점핑볼":
      "a real inflatable jumping ball made of elastic rubber",
    "트램펄린":
      "a real full-size trampoline with a flexible mat, visible frame, and elastic springs",
    "농구공":
      "a real orange rubber basketball with realistic surface texture",
    "축구공":
      "a real soccer ball with realistic stitched panels",
    "배구공":
      "a real volleyball with realistic synthetic leather texture",
    "테니스공":
      "a real fluorescent yellow-green tennis ball",
    "탁구공":
      "a real white 40 mm table tennis ball",
    "고무공":
      "a real elastic rubber ball",
    "고무줄":
      "a real elastic rubber band",
    "머리끈":
      "a real elastic hair tie",
    "운동용 저항밴드":
      "a real elastic resistance band",
    "활":
      "a real archery bow with visibly flexible bow limbs and bowstring",
    "낚싯대":
      "a real flexible fishing rod",
    "다이빙보드":
      "a real flexible diving board",
    "장대높이뛰기 장대":
      "a real flexible pole-vault pole",
    "용수철":
      "a real metal coil spring",
    "매트리스":
      "a real soft spring mattress",
    "소파 쿠션":
      "a real soft sofa cushion",
    "운동화 밑창":
      "a real athletic shoe sole with compressible cushioning material",
    "자동차 서스펜션":
      "a real car suspension system with visible coil spring and wheel",
    "자전거 서스펜션":
      "a real bicycle suspension fork",
    "스펀지":
      "a real porous household sponge",
    "에어쿠션":
      "a real inflatable air cushion"
  };

  return map[item] ||
    `a real physical ${item}`;
}

function mapAction(action) {
  const map = {
    "점프하기":
      "jumping on the elastic object",
    "높이 점프하기":
      "jumping upward dynamically",
    "점프 후 착지":
      "landing after a jump",
    "착지하기":
      "landing with both feet on the elastic surface",
    "연속해서 튀기":
      "repeatedly bouncing the ball",
    "바닥에 튀기기":
      "bouncing the ball against the floor",
    "라켓으로 치기":
      "striking the ball with a racket",
    "탁구 라켓으로 공을 치는 순간":
      "striking a table tennis ball with a real table tennis paddle",
    "활시위 당기기":
      "pulling the bowstring backward under tension",
    "화살을 쏘기 직전":
      "holding the bow at maximum draw just before release",
    "양손으로 잡아당기기":
      "stretching the elastic object between both hands",
    "놓기 직전":
      "holding the stretched elastic object just before release",
    "달리기":
      "running naturally",
    "점프 후 착지하기":
      "landing after a jump",
    "누르기":
      "pressing downward on the elastic object",
    "압축하기":
      "compressing the elastic object",
    "휘기":
      "bending the elastic object"
  };

  return map[action] || action;
}

function mapPlace(place) {
  const map = {
    "학교 체육관":
      "inside a clearly recognizable school gymnasium with polished wooden sports flooring, painted court lines, basketball hoops, wall safety padding, a high ceiling, roof structure, and indoor sports lighting",

    "우레탄 농구 코트":
      "on a clearly recognizable outdoor urethane basketball court with a colored court surface, painted basketball markings, basketball hoops, perimeter fencing, and school sports facilities",

    "학교 운동장":
      "on a clearly recognizable school athletic field with a running track, field markings, school buildings, and sports facilities",

    "공원":
      "in a clearly recognizable public park with trees, grass, walking paths, benches, and natural daylight",

    "놀이터":
      "in a clearly recognizable playground with slides, swings, climbing equipment, and safety flooring",

    "농구장":
      "on a real basketball court with visible court lines and basketball hoops",

    "축구장":
      "on a real soccer field with grass turf, field lines, and soccer goals",

    "테니스장":
      "on a real tennis court with net, court lines, and fencing",

    "교실":
      "inside a real school classroom with desks, chairs, windows, and classroom walls",

    "집":
      "inside a realistic home interior",

    "캠핑장":
      "at a real outdoor campsite with tents, trees, grass, and camping equipment",

    "수영장":
      "at a real supervised swimming pool facility",

    "육상 경기장":
      "inside a real track-and-field stadium with running lanes and sports facilities"
  };

  return map[place] ||
    `in a clearly recognizable real-world location matching "${place}"`;
}

function mapMoment(moment, elasticItem) {
  const generic = {
    "변형되는 순간":
      "capture the exact instant when the elastic object is visibly changing shape due to an external force",

    "최대 변형 순간":
      "capture the exact instant of maximum elastic deformation, when the object is at its greatest compression, stretch, or bend",

    "복원되는 순간":
      "capture the exact instant when the elastic object is returning toward its original shape and exerting a restoring force"
  };

  const special = {
    "트램펄린": {
      "변형되는 순간":
        "the student's feet are contacting the trampoline mat and the mat is visibly bending downward under the student's weight",
      "최대 변형 순간":
        "the student's feet are firmly contacting the trampoline mat and the mat is visibly curved deeply downward at maximum deformation",
      "복원되는 순간":
        "the trampoline mat is moving back upward toward its original flat shape and visibly pushing the student upward"
    },

    "탁구공": {
      "변형되는 순간":
        "the table tennis ball is physically touching the paddle and beginning to deform slightly at the contact point",
      "최대 변형 순간":
        "the real white 40 mm table tennis ball is physically contacting the paddle surface and showing subtle but recognizable temporary compression at the impact point",
      "복원되는 순간":
        "the table tennis ball has just left the paddle and is returning to its original spherical shape"
    },

    "테니스공": {
      "변형되는 순간":
        "the tennis ball is contacting the racket strings and beginning to compress",
      "최대 변형 순간":
        "the tennis ball is visibly compressed against the racket strings at the instant of maximum deformation",
      "복원되는 순간":
        "the tennis ball has just rebounded from the racket and is returning to its original spherical shape"
    },

    "농구공": {
      "변형되는 순간":
        "the basketball is contacting the floor and beginning to flatten slightly",
      "최대 변형 순간":
        "the basketball is visibly but realistically compressed at the exact floor contact point",
      "복원되는 순간":
        "the basketball is rebounding upward while returning to its original round shape"
    },

    "고무줄": {
      "변형되는 순간":
        "the rubber band is visibly stretching under tension",
      "최대 변형 순간":
        "the rubber band is clearly stretched to its greatest safe extension",
      "복원되는 순간":
        "the rubber band is visibly contracting back toward its original length"
    },

    "활": {
      "변형되는 순간":
        "the bow limbs are visibly bending as the bowstring is being pulled",
      "최대 변형 순간":
        "the bow is at maximum draw with the bow limbs visibly curved under tension",
      "복원되는 순간":
        "the bow limbs are rapidly returning toward their original shape after release"
    },

    "스펀지": {
      "변형되는 순간":
        "the sponge is visibly being compressed by hand",
      "최대 변형 순간":
        "the sponge is visibly compressed to its smallest realistic thickness",
      "복원되는 순간":
        "the sponge is expanding back toward its original shape after the pressure is released"
    },

    "용수철": {
      "변형되는 순간":
        "the spring is visibly being compressed or stretched",
      "최대 변형 순간":
        "the spring is at its maximum safe compression or extension",
      "복원되는 순간":
        "the spring is visibly returning toward its original length"
    }
  };

  return special[elasticItem]?.[moment] ||
    generic[moment] ||
    moment;
}

function mapStyle(style) {
  const map = {
    "REAL PHOTO":
      "photorealistic professional sports photography, realistic anatomy, realistic clothing, realistic materials, natural lighting, professional camera composition, high-speed freeze-frame, shallow depth of field, high detail",

    "CINEMATIC MOVIE":
      "cinematic live-action movie still, realistic character, dramatic but natural lighting, film-quality color grading, realistic environment, dynamic camera angle, high detail",

    "3D ANIMATION":
      "high-end cinematic 3D animation, feature-film quality rendering, detailed original character design, physically based materials, realistic fabric, global illumination, cinematic lighting, polished 3D rendering, detailed environment",

    "COMIC / WEBTOON":
      "high-quality professional comic and webtoon illustration, detailed character art, dynamic perspective, rich background detail, expressive action, polished rendering",

    "SEMI-REALISTIC":
      "high-quality semi-realistic stylized rendering, realistic materials, detailed environment, cinematic lighting, slightly stylized proportions, polished visual quality",

    "SPORTS CINEMATIC":
      "professional sports advertising photography, dramatic freeze-frame action, realistic athlete, dynamic low-angle composition, cinematic lighting, shallow depth of field, high detail"
  };

  return map[style] ||
    "photorealistic professional action photography";
}

function buildFinalPrompt({
  who,
  elasticItem,
  action,
  place,
  moment,
  photoStyle
}) {
  const whoDesc = mapWho(who);
  const objectDesc = mapElasticObject(elasticItem);
  const actionDesc = mapAction(action);
  const placeDesc = mapPlace(place);
  const momentDesc = mapMoment(moment, elasticItem);
  const styleDesc = mapStyle(photoStyle);

  const isSmallObject = [
    "탁구공",
    "테니스공",
    "고무줄",
    "머리끈",
    "용수철",
    "스펀지"
  ].includes(elasticItem);

  const isLargeObject = [
    "트램펄린",
    "다이빙보드",
    "장대높이뛰기 장대"
  ].includes(elasticItem);

  let cameraDesc =
    "Use a medium-wide environmental action shot that clearly shows the person, the elastic object, the action, and the location.";

  if (isSmallObject) {
    cameraDesc =
      "Use a medium close-up or macro action composition that clearly shows the elastic object, the contact point, and enough of the person's action and surroundings to understand the scene.";
  }

  if (isLargeObject) {
    cameraDesc =
      "Use a wide or medium-wide full-body action shot. The entire elastic object and the person's interaction with it must be clearly visible.";
  }

  return `
CAMERA AND COMPOSITION:
${cameraDesc}

Do not create a portrait, headshot, face close-up, beauty photo, or upper-body portrait.
The person's face must NOT dominate the frame.

MAIN ELASTIC OBJECT:
${objectDesc}

EXACT PHYSICS MOMENT:
${momentDesc}

ACTION:
${actionDesc}

ENVIRONMENT:
${placeDesc}

PERSON:
${whoDesc}

VISUAL STYLE:
${styleDesc}

HARD VISUAL REQUIREMENTS:
- The selected elastic object must be clearly recognizable.
- The selected action must be visually obvious.
- The selected location must be visually recognizable.
- The elastic deformation or recovery must be one of the main visual features.
- The person must match the requested age group and role.
- The image must look like one coherent real scene, not a collage.
- Preserve realistic physical proportions.
- Preserve realistic material behavior.
- Do not omit the elastic object.
- Do not omit the environment.
- Do not replace the scene with a portrait.

DO NOT INCLUDE:
- physics labels
- equations
- arrows
- diagrams
- UI elements
- captions
- text inside the generated image
- stick figures
- geometric representations
- abstract stage backgrounds
- generic portrait backgrounds
`;
}

function extractBase64Image(responseJson) {
  const candidates =
    responseJson?.candidates || [];

  for (const candidate of candidates) {
    const parts =
      candidate?.content?.parts || [];

    for (const part of parts) {
      if (part?.inlineData?.data) {
        return {
          data: part.inlineData.data,
          mimeType:
            part.inlineData.mimeType ||
            "image/png"
        };
      }

      if (part?.inline_data?.data) {
        return {
          data: part.inline_data.data,
          mimeType:
            part.inline_data.mime_type ||
            "image/png"
        };
      }
    }
  }

  return null;
}

export default async function handler(req, res) {
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
      error:
        "Only POST requests are allowed"
    });
  }

  try {
    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error(
        "GEMINI_API_KEY IS MISSING"
      );

      return res.status(500).json({
        error:
          "GEMINI_API_KEY is not configured"
      });
    }

    const {
      who,
      elasticItem,
      action,
      place,
      moment,
      photoStyle
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
        error:
          "Scene information is missing"
      });
    }

    const finalImagePrompt =
      buildFinalPrompt({
        who,
        elasticItem,
        action,
        place,
        moment,
        photoStyle
      });

    console.log(
      "===== FINAL IMAGE GENERATION DATA ====="
    );

    console.log("WHO:", who);
    console.log(
      "ELASTIC OBJECT:",
      elasticItem
    );
    console.log("ACTION:", action);
    console.log("PLACE:", place);
    console.log(
      "ELASTIC MOMENT:",
      moment
    );
    console.log(
      "VISUAL STYLE:",
      photoStyle
    );

    console.log(
      "IMAGE MODEL:",
      MODEL_ID
    );

    console.log(
      "FINAL IMAGE PROMPT:",
      finalImagePrompt
    );

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const googleResponse =
      await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text:
                      finalImagePrompt
                  }
                ]
              }
            ],

            generationConfig: {
              responseModalities: [
                "IMAGE"
              ]
            }
          })
        }
      );

    const responseText =
      await googleResponse.text();

    let responseJson;

    try {
      responseJson =
        JSON.parse(responseText);
    } catch {
      responseJson = null;
    }

    if (!googleResponse.ok) {
      console.error(
        "GOOGLE IMAGE GENERATION FAILED:",
        googleResponse.status,
        responseText
      );

      return res.status(
        googleResponse.status
      ).json({
        error:
          responseJson?.error?.message ||
          "Gemini image generation failed"
      });
    }

    const image =
      extractBase64Image(
        responseJson
      );

    if (!image?.data) {
      console.error(
        "NO IMAGE DATA RETURNED:",
        responseText
      );

      return res.status(500).json({
        error:
          "Gemini returned no image data"
      });
    }

    const imageBuffer =
      Buffer.from(
        image.data,
        "base64"
      );

    console.log(
      "IMAGE SOURCE: GOOGLE GEMINI"
    );

    console.log(
      "IMAGE MIME TYPE:",
      image.mimeType
    );

    console.log(
      "IMAGE BUFFER SIZE:",
      imageBuffer.length
    );

    res.statusCode = 200;

    res.setHeader(
      "Content-Type",
      image.mimeType
    );

    res.setHeader(
      "Content-Length",
      imageBuffer.length
    );

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    res.setHeader(
      "X-Image-Source",
      "GOOGLE-GEMINI"
    );

    res.end(imageBuffer);
    return;

  } catch (error) {
    console.error(
      "GEMINI SERVER ERROR:",
      error?.message || error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Image generation failed"
    });
  }
}
