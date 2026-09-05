import fs from "fs";
import path from "path";

const MODEL_ID = "gemini-3.1-flash-image";

/* =========================================================
   1. 등장인물 영어 변환
========================================================= */

function mapWho(who) {
  const map = {
    "초등학생":
      "a stylized elementary-school-aged animated character, clearly appearing around 8-12 years old",

    "어린이":
      "a stylized young animated child character",

    "어린이 두 명":
      "two stylized young animated child characters",

    "중학생":
      "a stylized middle-school-aged animated character, clearly appearing around 13-15 years old",

    "고등학생":
      "a stylized high-school-aged animated character, clearly appearing around 16-18 years old",

    "친구 두 명":
      "two stylized teenage animated student characters",

    "가족":
      "a stylized animated family",

    "농구선수":
      "a stylized animated basketball athlete",

    "축구선수":
      "a stylized animated soccer athlete",

    "테니스선수":
      "a stylized animated tennis athlete",

    "양궁선수":
      "a stylized animated archery athlete",

    "체조선수":
      "a stylized animated gymnastics athlete",

    "육상선수":
      "a stylized animated track-and-field athlete",

    "자전거를 타는 사람":
      "a stylized animated cyclist",

    "캠핑 중인 사람":
      "a stylized animated camper",

    "반려견과 놀고 있는 사람":
      "a stylized animated character playing with a dog"
  };

  return map[who] || "a stylized animated character";
}


/* =========================================================
   2. 탄성체 영어 변환
========================================================= */

function mapObject(item) {
  const map = {
    "점핑볼":
      "a clearly recognizable elastic jumping ball",

    "트램펄린":
      "a large clearly recognizable trampoline with a flexible fabric mat, metal frame and springs",

    "농구공":
      "a clearly recognizable orange basketball",

    "축구공":
      "a clearly recognizable soccer ball",

    "배구공":
      "a clearly recognizable volleyball",

    "테니스공":
      "a clearly recognizable bright tennis ball",

    "탁구공":
      "a clearly recognizable white table-tennis ball",

    "고무공":
      "a clearly recognizable elastic rubber ball",

    "고무줄":
      "a clearly recognizable stretched rubber band",

    "머리끈":
      "a clearly recognizable elastic hair tie",

    "번지점프 로프":
      "a clearly recognizable elastic bungee cord",

    "운동용 저항밴드":
      "a clearly recognizable elastic resistance band",

    "활":
      "a clearly recognizable archery bow with flexible bent limbs",

    "낚싯대":
      "a clearly recognizable flexible fishing rod",

    "다이빙보드":
      "a clearly recognizable flexible springboard diving board",

    "장대높이뛰기 장대":
      "a clearly recognizable flexible pole-vault pole",

    "용수철":
      "a clearly recognizable metal coil spring",

    "매트리스":
      "a clearly recognizable spring mattress",

    "소파 쿠션":
      "a clearly recognizable soft sofa cushion",

    "운동화 밑창":
      "a clearly recognizable athletic shoe sole with compressible cushioning",

    "자동차 서스펜션":
      "a clearly recognizable automobile suspension system with a visible coil spring",

    "자전거 서스펜션":
      "a clearly recognizable bicycle suspension fork",

    "스펀지":
      "a clearly recognizable porous sponge",

    "에어쿠션":
      "a clearly recognizable inflatable air cushion"
  };

  return map[item] ||
    `a clearly recognizable elastic object corresponding to ${item}`;
}


/* =========================================================
   3. 장소 영어 변환
========================================================= */

function mapPlace(place) {
  const map = {
    "학교 체육관":
      "inside a colorful animated Korean school gymnasium with polished wooden flooring, painted sports court lines, basketball hoops, wall padding and a high ceiling",

    "우레탄 농구 코트":
      "on a colorful outdoor urethane basketball court with painted court markings, basketball hoops and surrounding school facilities",

    "학교 운동장":
      "on a colorful animated Korean school athletic field with track lanes, school buildings and sports facilities",

    "공원":
      "inside a vibrant animated public park with green trees, grass, walking paths and benches",

    "놀이터":
      "inside a vibrant animated playground with slides, swings and colorful playground equipment",

    "농구장":
      "on a colorful animated basketball court with hoops, court markings and spectator surroundings",

    "축구장":
      "on a large animated soccer field with goals, grass and stadium surroundings",

    "테니스장":
      "on a colorful animated tennis court with a net, painted court lines and surrounding facilities",

    "교실":
      "inside a colorful animated Korean school classroom with desks, chairs, windows and classroom equipment",

    "집":
      "inside a richly detailed colorful animated home interior",

    "캠핑장":
      "inside a vibrant animated campsite surrounded by trees, tents and camping equipment",

    "수영장":
      "inside a colorful animated swimming pool facility with turquoise water and pool lanes",

    "실내 다이빙 수영장":
      "inside a spectacular animated indoor diving stadium with deep turquoise pool water, springboards, diving platforms, spectator seating and dramatic architectural lighting",

    "육상 경기장":
      "inside a vibrant animated track-and-field stadium with running tracks and spectator seating"
  };

  return map[place] ||
    `inside a richly detailed animated environment clearly representing ${place}`;
}


/* =========================================================
   4. 탄성 순간
========================================================= */

function mapMoment(moment, elasticItem) {

  const special = {

    "트램펄린": {
      "변형되는 순간":
        "the trampoline mat is visibly bending downward as the character lands on it",

      "최대 변형 순간":
        "the trampoline mat is dramatically curved downward at its maximum elastic deformation under the character's weight",

      "복원되는 순간":
        "the trampoline mat is rapidly springing upward toward its original flat shape and launching the character upward"
    },

    "다이빙보드": {
      "변형되는 순간":
        "the springboard is visibly bending downward under the character's force",

      "최대 변형 순간":
        "the springboard forms a dramatic downward arc at the exact instant of maximum elastic deformation",

      "복원되는 순간":
        "the springboard is rapidly straightening upward and propelling the character into the air"
    },

    "탁구공": {
      "변형되는 순간":
        "the table-tennis ball is beginning to compress at the exact instant it contacts the racket",

      "최대 변형 순간":
        "the table-tennis ball is visibly but physically plausibly compressed at the exact contact point with the racket",

      "복원되는 순간":
        "the table-tennis ball is rebounding rapidly from the racket while returning toward its original spherical shape"
    },

    "테니스공": {
      "변형되는 순간":
        "the tennis ball is beginning to compress against the racket strings",

      "최대 변형 순간":
        "the tennis ball is visibly flattened against the racket strings at maximum deformation",

      "복원되는 순간":
        "the tennis ball is explosively rebounding away while recovering its original round shape"
    },

    "농구공": {
      "변형되는 순간":
        "the basketball is beginning to flatten at the exact instant it contacts the floor",

      "최대 변형 순간":
        "the basketball is visibly compressed at the floor contact point at maximum deformation",

      "복원되는 순간":
        "the basketball is rebounding upward while rapidly recovering its original round shape"
    },

    "축구공": {
      "변형되는 순간":
        "the soccer ball is beginning to deform at the moment of impact",

      "최대 변형 순간":
        "the soccer ball is visibly compressed at maximum impact",

      "복원되는 순간":
        "the soccer ball is rebounding while recovering its original spherical shape"
    },

    "고무줄": {
      "변형되는 순간":
        "the rubber band is visibly stretching under tension",

      "최대 변형 순간":
        "the rubber band is stretched dramatically but plausibly near its maximum deformation",

      "복원되는 순간":
        "the rubber band is rapidly contracting toward its original shape"
    },

    "용수철": {
      "변형되는 순간":
        "the coil spring is visibly compressing under force",

      "최대 변형 순간":
        "the coil spring is strongly compressed at maximum deformation",

      "복원되는 순간":
        "the coil spring is rapidly expanding toward its original length"
    }
  };

  const generic = {
    "변형되는 순간":
      "capture the exact instant when the elastic object is visibly deforming under an applied force",

    "최대 변형 순간":
      "capture the exact dramatic instant of maximum elastic deformation",

    "복원되는 순간":
      "capture the exact instant when the elastic object is rapidly returning toward its original shape"
  };

  return special[elasticItem]?.[moment] ||
    generic[moment] ||
    moment;
}


/* =========================================================
   5. 비주얼 스타일
========================================================= */

function mapStyle(style) {

  const map = {

    "DREAM LAB":
      `
A spectacular science-fantasy animated world.
Premium theatrical 3D animation.
Dreamlike cyan, turquoise and golden lighting.
Magical glowing elastic-energy particles.
Whimsical cinematic atmosphere.
Colorful volumetric light.
Playful but sophisticated character design.
The scene should feel like an expensive animated science adventure movie.
`,

    "ELASTIC IMPACT":
      `
A spectacular high-energy animated action scene.
Premium 3D animation mixed with stylized action-game cinematics.
Extreme perspective.
Powerful squash-and-stretch.
Glowing impact rings.
Elastic energy trails.
Explosive particles.
Dynamic rim lighting.
The elastic event should feel visually exciting and powerful.
`,

    "3D ANIMATION":
      `
PREMIUM THEATRICAL 3D ANIMATED FEATURE-FILM STYLE.

Stylized animated characters.
Clearly non-photographic character design.
Expressive proportions.
Appealing stylized faces.
Soft sculpted 3D skin and hair.
Richly modeled 3D environments.
Colorful cinematic lighting.
Soft global illumination.
Premium animation rendering.
Dynamic action poses.
Playful visual storytelling.
Beautiful depth and atmosphere.

The final result must unmistakably look like a frame
from a high-budget 3D animated feature film,
NOT a photograph of real people.
`,

    "GAME CINEMATIC":
      `
A stylized AAA animated game cinematic.
Highly designed animated characters.
Heroic action composition.
Dramatic perspective.
Richly modeled environment.
Powerful glowing elastic-energy effects.
Volumetric lighting.
Particles and motion streaks.
Polished next-generation game cutscene aesthetics.
Clearly stylized rather than photographic.
`,

    "SPORTS ANIME":
      `
A spectacular high-energy sports anime scene.
Expressive anime character design.
Cel shading.
Extreme foreshortening.
Dynamic speed lines.
Powerful impact frames.
Glowing elastic-energy streaks.
Exaggerated action posing.
Colorful dramatic lighting.
The scene should resemble the climax of a premium sports animation.
`,

    "MOVIE SNAP":
      `
An epic animated fantasy-science blockbuster frame.
Premium animated characters.
Spectacular cinematic composition.
Dramatic environment.
Strong visual storytelling.
Colorful atmospheric lighting.
Glowing elastic energy.
Stylized cinematic action.
Clearly animated artwork rather than live-action photography.
`,

    "ULTRA SLOW MOTION":
      `
A stylized animated ultra-slow-motion freeze-frame.
Premium animated character rendering.
Frozen particles suspended in the air.
Visible elastic deformation.
Motion echoes.
Glowing impact particles.
Dramatic cinematic lighting.
Highly detailed animated materials.
A spectacular time-frozen science moment.
`
  };

  return map[style] ||
    `
Premium stylized animated cinematic artwork.
Clearly animated.
Clearly non-photographic.
`;
}


/* =========================================================
   6. 스타일 레퍼런스 이미지 읽기

   현재:
   public/style-references/3d-animation.jpg
========================================================= */

function loadReferenceImage(photoStyle) {

  const styleMap = {

    "3D ANIMATION":
      "3d-animation.jpg"

  };

  const fileName =
    styleMap[photoStyle];

  if (!fileName) {

    console.log(
      "NO STYLE REFERENCE REQUIRED FOR:",
      photoStyle
    );

    return null;
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "style-references",
    fileName
  );

  console.log(
    "LOOKING FOR STYLE REFERENCE:",
    filePath
  );

  if (!fs.existsSync(filePath)) {

    console.error(
      "REFERENCE IMAGE NOT FOUND:",
      filePath
    );

    return null;
  }

  const imageBuffer =
    fs.readFileSync(filePath);

  console.log(
    "STYLE REFERENCE:",
    fileName
  );

  console.log(
    "REFERENCE IMAGE SIZE:",
    imageBuffer.length
  );

  return {

    mimeType:
      "image/jpeg",

    data:
      imageBuffer.toString("base64")
  };
}


/* =========================================================
   7. 최종 Gemini 프롬프트 생성
========================================================= */

function buildPrompt({
  who,
  elasticItem,
  action,
  place,
  moment,
  photoStyle
}) {

  const whoDesc =
    mapWho(who);

  const objectDesc =
    mapObject(elasticItem);

  const placeDesc =
    mapPlace(place);

  const momentDesc =
    mapMoment(
      moment,
      elasticItem
    );

  const styleDesc =
    mapStyle(photoStyle);


  return `
IMPORTANT CREATIVE DIRECTION:

THIS IS AN ANIMATED ARTWORK.

THIS IS NOT LIVE-ACTION PHOTOGRAPHY.

Do NOT create a realistic photograph.
Do NOT create a real human photographed by a camera.

Build the entire scene from the beginning
as a designed animated world.

==================================================
STYLE REFERENCE
==================================================

If a reference image is attached,
use the attached image ONLY as a VISUAL STYLE REFERENCE.

Study its:

- character stylization
- animation rendering
- facial stylization
- proportions
- materials
- shading
- lighting
- color palette
- cinematic atmosphere
- degree of exaggeration
- overall visual energy

DO NOT copy:

- the exact person
- exact face
- exact pose
- clothing
- elastic object
- background
- location
- composition

Create an entirely NEW scene.

REFERENCE IMAGE = HOW THE WORLD LOOKS.

STUDENT SELECTIONS = WHAT MUST APPEAR.

==================================================
SELECTED VISUAL STYLE
==================================================

${styleDesc}

==================================================
CHARACTER
==================================================

${whoDesc}

The character must visibly match this age/category.

Show the character as a FULL-BODY
or THREE-QUARTER-BODY animated action character.

Do not create a portrait.

The character must physically interact
with the selected elastic object.

==================================================
ELASTIC OBJECT
==================================================

${objectDesc}

THIS OBJECT MUST BE CLEARLY VISIBLE.

Do not replace it with another object.

Do not hide it behind the character.

The elastic object should be one of the
main visual focal points of the entire image.

==================================================
ACTION
==================================================

The character is performing this action:

${action}

The pose must clearly communicate this action.

Avoid standing still.

Use a dynamic animated action pose.

==================================================
LOCATION
==================================================

${placeDesc}

The environment must be immediately recognizable.

Do not use:

- generic backgrounds
- empty rooms
- abstract spaces
- dark voids

Include recognizable environmental landmarks.

==================================================
ELASTIC SCIENCE MOMENT
==================================================

${momentDesc}

THIS IS THE HERO MOMENT OF THE IMAGE.

Make the deformation visually obvious enough
for a middle-school science student to notice.

However, preserve the actual identity
and physical structure of the object.

==================================================
MAKE ELASTICITY FEEL AWESOME
==================================================

Transform the scientific moment into
a spectacular animated visual event.

Use:

- dynamic perspective
- cinematic composition
- squash and stretch
- motion arcs
- glowing elastic-energy trails
- luminous particles
- impact rings
- stylized shockwave effects
- colorful rim lighting
- dramatic environmental lighting
- exaggerated but believable movement
- strong foreground / midground / background depth

The elastic force may be represented through
stylized glowing energy effects.

BUT:

The physical deformation itself must remain
scientifically understandable.

The viewer should immediately think:

"WOW! I can actually SEE elasticity happening!"

==================================================
VISUAL PRIORITY
==================================================

1. ELASTIC DEFORMATION MOMENT
2. ELASTIC OBJECT
3. ACTION
4. CHARACTER
5. LOCATION
6. DECORATIVE EFFECTS

All six selected scene conditions must
be visually represented.

==================================================
STRICTLY FORBIDDEN
==================================================

NO photorealistic humans.

NO live-action photography.

NO documentary photography.

NO realistic sports photography.

NO camera snapshot aesthetic.

NO portrait photography.

NO headshot.

NO static character pose.

NO generic empty background.

NO physics diagram.

NO stick figure.

NO flat educational clip art.

NO text.

NO labels.

NO equations.

NO arrows.

NO UI elements.

NO watermark.

Create ONE polished,
high-budget animated cinematic frame.
`;
}


/* =========================================================
   8. Gemini 응답에서 이미지 추출
========================================================= */

function extractImage(json) {

  const candidates =
    json?.candidates || [];

  for (
    const candidate of candidates
  ) {

    const parts =
      candidate?.content?.parts || [];

    for (
      const part of parts
    ) {

      if (
        part?.inlineData?.data
      ) {

        return {

          data:
            part.inlineData.data,

          mimeType:
            part.inlineData.mimeType ||
            "image/png"
        };
      }
    }
  }

  return null;
}


/* =========================================================
   9. Vercel API Handler
========================================================= */

export default async function handler(
  req,
  res
) {

  /* ---------- CORS ---------- */

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


  /* ---------- OPTIONS ---------- */

  if (
    req.method === "OPTIONS"
  ) {

    res.statusCode = 204;

    res.end();

    return;
  }


  /* ---------- POST ONLY ---------- */

  if (
    req.method !== "POST"
  ) {

    return res
      .status(405)
      .json({

        error:
          "Only POST requests are allowed"

      });
  }


  try {

    /* =====================================================
       API KEY
    ===================================================== */

    const apiKey =
      process.env.GEMINI_API_KEY;


    if (!apiKey) {

      console.error(
        "GEMINI_API_KEY IS MISSING"
      );

      return res
        .status(500)
        .json({

          error:
            "GEMINI_API_KEY is not configured"

        });
    }


    /* =====================================================
       학생 선택값
    ===================================================== */

    const {

      who,
      elasticItem,
      action,
      place,
      moment,
      photoStyle

    } = req.body || {};


    console.log(
      "SCENE SELECTIONS:",
      {
        who,
        elasticItem,
        action,
        place,
        moment,
        photoStyle
      }
    );


    if (
      !who ||
      !elasticItem ||
      !action ||
      !place ||
      !moment ||
      !photoStyle
    ) {

      return res
        .status(400)
        .json({

          error:
            "Scene information is missing"

        });
    }


    /* =====================================================
       프롬프트 생성
    ===================================================== */

    const finalImagePrompt =
      buildPrompt({

        who,
        elasticItem,
        action,
        place,
        moment,
        photoStyle

      });


    /* =====================================================
       스타일 레퍼런스
    ===================================================== */

    const referenceImage =
      loadReferenceImage(
        photoStyle
      );


    console.log(
      "SELECTED STYLE:",
      photoStyle
    );


    console.log(
      "REFERENCE IMAGE ATTACHED:",
      Boolean(referenceImage)
    );


    console.log(
      "FINAL IMAGE PROMPT:",
      finalImagePrompt
    );


    /* =====================================================
       Gemini에 전달할 parts
    ===================================================== */

    const parts = [];


    /*
      참고 이미지가 있으면
      이미지부터 Gemini에 전달
    */

    if (
      referenceImage
    ) {

      parts.push({

        inlineData: {

          mimeType:
            referenceImage.mimeType,

          data:
            referenceImage.data
        }

      });
    }


    /*
      그 다음 텍스트 프롬프트 전달
    */

    parts.push({

      text:
        finalImagePrompt

    });


    /* =====================================================
       Gemini API 호출
    ===================================================== */

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${encodeURIComponent(apiKey)}`;


    console.log(
      "CALLING GEMINI MODEL:",
      MODEL_ID
    );


    const googleResponse =
      await fetch(
        endpoint,
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              contents: [

                {

                  role:
                    "user",

                  parts

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


    /* =====================================================
       Google 응답
    ===================================================== */

    const responseText =
      await googleResponse.text();


    let responseJson =
      null;


    try {

      responseJson =
        JSON.parse(
          responseText
        );

    } catch {

      console.error(
        "GOOGLE RESPONSE WAS NOT JSON"
      );

    }


    /* =====================================================
       API 오류
    ===================================================== */

    if (
      !googleResponse.ok
    ) {

      console.error(
        "GOOGLE IMAGE GENERATION FAILED:",
        googleResponse.status,
        responseText
      );


      return res
        .status(
          googleResponse.status
        )
        .json({

          error:
            responseJson
              ?.error
              ?.message ||
            "Gemini image generation failed"

        });
    }


    /* =====================================================
       이미지 추출
    ===================================================== */

    const image =
      extractImage(
        responseJson
      );


    if (!image) {

      console.error(
        "NO IMAGE FOUND IN GEMINI RESPONSE"
      );


      return res
        .status(500)
        .json({

          error:
            "Gemini returned no image"

        });
    }


    /* =====================================================
       Base64 → Buffer
    ===================================================== */

    const imageBuffer =
      Buffer.from(
        image.data,
        "base64"
      );


    console.log(
      "IMAGE SOURCE: GOOGLE GEMINI"
    );


    console.log(
      "IMAGE BUFFER SIZE:",
      imageBuffer.length
    );


    /* =====================================================
       브라우저에 이미지 반환
    ===================================================== */

    res.statusCode =
      200;


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


    res.end(
      imageBuffer
    );


    return;


  } catch (error) {

    console.error(
      "IMAGE GENERATION SERVER ERROR:",
      error?.message ||
      error
    );


    return res
      .status(500)
      .json({

        error:
          error?.message ||
          "Image generation failed"

      });
  }
}
