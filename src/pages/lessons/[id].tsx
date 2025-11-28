import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { dbGetLessonById, dbUpdateProgress, Lesson } from '@/lib/db';

// Dynamically import to avoid SSR issues with MediaPipe
const HandGestureDetector = dynamic(
  () => import('@/components/HandGestureDetector'),
  { ssr: false }
);

export default function LessonPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceScore, setPracticeScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadLesson();
    }
  }, [id]);

  const loadLesson = async () => {
    if (typeof id !== 'string') return;

    const lessonData = await dbGetLessonById(id);
    setLesson(lessonData);
    setLoading(false);
  };

  const handleDetection = (confidence: number, landmarks: number[][]) => {
    setPracticeScore(confidence);

    if (confidence > bestScore) {
      setBestScore(confidence);
    }

    // Auto-complete if confidence is high enough
    if (confidence >= 85 && !showSuccess) {
      handleSuccess();
    }
  };

  const handleSuccess = async () => {
    setShowSuccess(true);
    setAttempts(prev => prev + 1);

    if (user && lesson) {
      await dbUpdateProgress(user.id, lesson.moduleId, lesson.id, {
        completed: true,
        score: bestScore,
        attempts: attempts + 1
      });
    }

    // Auto-hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const togglePractice = () => {
    setIsPracticing(!isPracticing);
    if (!isPracticing) {
      setPracticeScore(0);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading lesson...</div>
        </div>
      </Layout>
    );
  }

  if (!lesson) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <Link href="/modules" className="text-primary-600 hover:text-primary-700">
            ← Back to Modules
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href={`/modules/${lesson.moduleId}`} 
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            ← Back to Module
          </Link>
        </div>

        {/* Success Banner */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-3xl">🎉</span>
              <p className="text-green-800 font-semibold">
                Great job! You've mastered this sign with {bestScore}% confidence!
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Learning Content */}
          <div className="space-y-6">
            {/* Lesson Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-primary-700 font-medium mb-1">Learning Sign:</p>
                <p className="text-2xl font-bold text-primary-900">{lesson.sign}</p>
              </div>
            </div>

            {/* Visual Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">How to Sign</h2>
              
              {/* Video */}
              {lesson.videoUrl && (
                <div className="mb-4">
                  <video
                    src={lesson.videoUrl}
                    controls
                    loop
                    className="w-full rounded-lg"
                    poster={lesson.imageUrl}
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              )}

              {/* Image */}
              {lesson.imageUrl && !lesson.videoUrl && (
                <div className="mb-4">
                  <img
                    src={lesson.imageUrl}
                    alt={`Sign for ${lesson.sign}`}
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {/* Placeholder if no media */}
              {!lesson.imageUrl && !lesson.videoUrl && (
                <div className="bg-gray-100 rounded-lg p-12 text-center">
                  <span className="text-6xl">🤟</span>
                  <p className="text-gray-600 mt-4">Visual content coming soon</p>
                </div>
              )}

              {/* 3D Model Link (if available) */}
              {lesson.model3dUrl && (
                <div className="mt-4">
                  <a
                    href={lesson.model3dUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg hover:bg-primary-700 transition font-medium"
                  >
                    View 3D Model (360° Rotation)
                  </a>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Step-by-Step Instructions</h2>
              {lesson.instructions && lesson.instructions.length > 0 ? (
                <ol className="space-y-3">
                  {lesson.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold mr-3">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 pt-1">{instruction}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500">Watch the video and practice the sign shown.</p>
              )}
            </div>
          </div>

          {/* Right Column - Practice */}
          <div className="space-y-6">
            {/* Practice Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Practice Progress</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Current Score</p>
                  <p className={`text-3xl font-bold ${
                    practiceScore >= 80 ? 'text-green-600' :
                    practiceScore >= 60 ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {practiceScore}%
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Best Score</p>
                  <p className="text-3xl font-bold text-green-600">{bestScore}%</p>
                </div>
              </div>
              <div className="mt-4 text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Practice Attempts</p>
                <p className="text-3xl font-bold text-purple-600">{attempts}</p>
              </div>
            </div>

            {/* Practice Controls */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Webcam Practice</h2>
                <button
                  onClick={togglePractice}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isPracticing
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isPracticing ? '⏸ Pause' : '▶ Start Practice'}
                </button>
              </div>

              {/* Hand Gesture Detector */}
              <HandGestureDetector
                targetLandmarks={lesson.handLandmarks}
                onDetection={handleDetection}
                isActive={isPracticing}
              />

              {/* Feedback */}
              {isPracticing && (
                <div className="mt-4">
                  {practiceScore >= 85 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-semibold">✓ Excellent! Perfect form!</p>
                    </div>
                  ) : practiceScore >= 70 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 font-semibold">↗ Almost there! Keep trying!</p>
                    </div>
                  ) : practiceScore > 0 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 font-semibold">→ Keep practicing! Review the instructions.</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700">Position your hand to start detection</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h3 className="font-semibold text-primary-900 mb-3">💡 Practice Tips</h3>
              <ul className="text-sm text-primary-800 space-y-2">
                <li>• Ensure good lighting for accurate detection</li>
                <li>• Position your hand clearly in front of the camera</li>
                <li>• Practice slowly to build muscle memory</li>
                <li>• Aim for 85%+ confidence for mastery</li>
                <li>• Your camera data stays private and local</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
