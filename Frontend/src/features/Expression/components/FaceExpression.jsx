import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationRef = useRef(null);

  const [emotion, setEmotion] = useState("Detecting...");

  useEffect(() => {
    let stream;

    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: true,
        }
      );

      // camera start
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      detect();
    }

    function detect() {
      if (!videoRef.current || !faceLandmarkerRef.current) return;

      const now = Date.now();

      const results =
        faceLandmarkerRef.current.detectForVideo(
          videoRef.current,
          now
        );

      if (results.faceBlendshapes.length > 0) {
        const expressions = results.faceBlendshapes[0].categories;

        // emotion logic
        const smile = expressions.find(e => e.categoryName === "smile")?.score || 0;
        const mouthOpen = expressions.find(e => e.categoryName === "mouthOpen")?.score || 0;

        if (smile > 0.7) {
          setEmotion("😊 Happy");
        } else if (mouthOpen > 0.6) {
          setEmotion("😲 Surprised");
        } else {
          setEmotion("😐 Neutral");
        }
      }

      animationRef.current = requestAnimationFrame(detect);
    }

    init();

    // cleanup (VERY IMPORTANT)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Expression Detector</h2>

      <video
        ref={videoRef}
        width={320}
        autoPlay
        muted
        style={{ borderRadius: "10px" }}
      />

      <h3>{emotion}</h3>
    </div>
  );
}