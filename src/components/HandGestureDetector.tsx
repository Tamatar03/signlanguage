import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

interface HandGestureDetectorProps {
  targetLandmarks?: number[][];
  onDetection?: (confidence: number, landmarks: number[][]) => void;
  isActive?: boolean;
}

export default function HandGestureDetector({ 
  targetLandmarks, 
  onDetection,
  isActive = false 
}: HandGestureDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<handPoseDetection.HandDetector | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    initializeDetector();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isActive && detector) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive, detector]);

  const initializeDetector = async () => {
    try {
      await tf.ready();
      await tf.setBackend('webgl');

      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        modelType: 'full'
      };

      const handDetector = await handPoseDetection.createDetector(model, detectorConfig);
      setDetector(handDetector);
      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing detector:', err);
      setError('Failed to initialize hand detection. Please refresh the page.');
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStream(mediaStream);
        detectHands();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const cleanup = () => {
    stopCamera();
    if (detector) {
      detector.dispose();
    }
  };

  const detectHands = async () => {
    if (!detector || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detectHands);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const hands = await detector.estimateHands(video);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hands.length > 0) {
        const hand = hands[0];
        
        // Draw hand landmarks
        drawHand(ctx, hand.keypoints);

        // Calculate confidence if target landmarks provided
        if (targetLandmarks && hand.keypoints3D) {
          const currentLandmarks = hand.keypoints.map(kp => [kp.x, kp.y]);
          const conf = calculateConfidence(currentLandmarks, targetLandmarks);
          setConfidence(conf);
          
          if (onDetection) {
            onDetection(conf, currentLandmarks);
          }
        }
      } else {
        setConfidence(0);
      }
    } catch (err) {
      console.error('Detection error:', err);
    }

    animationRef.current = requestAnimationFrame(detectHands);
  };

  const drawHand = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm
    ];

    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
      const startPoint = keypoints[start];
      const endPoint = keypoints[end];
      
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
    });

    // Draw keypoints
    keypoints.forEach((keypoint) => {
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#0ea5e9';
      ctx.fill();
    });
  };

  const calculateConfidence = (current: number[][], target: number[][]): number => {
    if (!current || !target || current.length !== target.length) return 0;

    // Normalize landmarks to account for hand size and position
    const normalizedCurrent = normalizeLandmarks(current);
    const normalizedTarget = normalizeLandmarks(target);

    // Calculate average Euclidean distance
    let totalDistance = 0;
    for (let i = 0; i < normalizedCurrent.length; i++) {
      const dx = normalizedCurrent[i][0] - normalizedTarget[i][0];
      const dy = normalizedCurrent[i][1] - normalizedTarget[i][1];
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }

    const avgDistance = totalDistance / normalizedCurrent.length;
    
    // Convert distance to confidence (0-100)
    // Smaller distance = higher confidence
    const maxDistance = 0.5; // Threshold for acceptable match
    const confidence = Math.max(0, Math.min(100, (1 - avgDistance / maxDistance) * 100));
    
    return Math.round(confidence);
  };

  const normalizeLandmarks = (landmarks: number[][]): number[][] => {
    if (landmarks.length === 0) return landmarks;

    // Find bounding box
    const xs = landmarks.map(p => p[0]);
    const ys = landmarks.map(p => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;
    const scale = Math.max(width, height);

    // Normalize to 0-1 range
    return landmarks.map(([x, y]) => [
      (x - minX) / scale,
      (y - minY) / scale
    ]);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">Initializing hand detection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {isActive && confidence > 0 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">Confidence</p>
            <p className={`text-2xl font-bold ${
              confidence >= 80 ? 'text-green-400' :
              confidence >= 60 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {confidence}%
            </p>
          </div>
        )}

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <p className="text-white text-lg">Camera paused</p>
          </div>
        )}
      </div>

      {isActive && (
        <div className="text-center text-sm text-gray-600">
          <p>Position your hand in front of the camera to practice the sign</p>
          <p className="text-xs mt-1">All processing happens locally on your device</p>
        </div>
      )}
    </div>
  );
}
