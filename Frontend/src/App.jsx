import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);

  const [emotion, setEmotion] = useState("Loading...");

  // ---------------------------
  // Emotion logic
  // ---------------------------
 function getEmotion(blendshapes) {
  const map = {};

  blendshapes.forEach((b) => {
    map[b.categoryName] = b.score;
  });

  const smile =
    (map.mouthSmileLeft || 0) + (map.mouthSmileRight || 0);

  const frown =
    (map.mouthFrownLeft || 0) + (map.mouthFrownRight || 0);

  const browDown =
    (map.browDownLeft || 0) + (map.browDownRight || 0);

  const browUp =
    map.browInnerUp || 0;

  const jawOpen =
    map.jawOpen || 0;

  const blink =
    (map.eyeBlinkLeft || 0) + (map.eyeBlinkRight || 0);

  if (smile > 0.6) return "😊 Happy";

  if (frown > 0.0001 && browDown > 0.00001) return "😢 Sad";

  if (browDown > 0.6 && frown > 0.4) return "😠 Angry";

  // 😮 Surprised (FIXED)
  if (browUp > 0.01 && jawOpen > 0.01) {
    return "😮 Surprised";
  }

  return "😐 Neutral";
}

  // ---------------------------
  // SINGLE DETECTION (NO LOOP)
  // ---------------------------
  function detectOnce() {
    if (!videoRef.current || !faceLandmarkerRef.current) return;

    const results =
      faceLandmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
      );

    if (
      results.faceBlendshapes &&
      results.faceBlendshapes.length > 0
    ) {
      const blendshapes =
        results.faceBlendshapes[0].categories;

      const mood = getEmotion(blendshapes);
      setEmotion(mood);
    } else {
      setEmotion("No face detected");
    }
  }

  // ---------------------------
  // INIT CAMERA + MODEL
  // ---------------------------
  async function init() {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      faceLandmarkerRef.current =
        await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: true,
        });

      console.log("✅ Model Loaded");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = resolve;
      });

      await videoRef.current.play();

      setEmotion("Ready 👍");
    } catch (err) {
      console.error("❌ Init Error:", err);
      setEmotion("Error loading model");
    }
  }

  // ---------------------------
  // LIFECYCLE
  // ---------------------------
  useEffect(() => {
    init();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Face Emotion Detector
      </h1>

      <video
        ref={videoRef}
        className="rounded-xl shadow-md w-[320px]"
        autoPlay
        muted
      />

      <div className="mt-6 text-xl font-medium bg-white px-6 py-3 rounded-xl shadow">
        Emotion: {emotion}
      </div>

      <button
        onClick={detectOnce}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Detect Expression
      </button>
    </div>
  );
}