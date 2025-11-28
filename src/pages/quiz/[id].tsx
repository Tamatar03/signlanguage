import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  dbGetModuleById, 
  dbGetQuizByModule, 
  dbGetLessonsByModule,
  dbSaveQuizResult,
  Module,
  Quiz,
  QuizQuestion 
} from '@/lib/db';

const HandGestureDetector = dynamic(
  () => import('@/components/HandGestureDetector'),
  { ssr: false }
);

export default function QuizPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [module, setModule] = useState<Module | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gestureConfidence, setGestureConfidence] = useState(0);
  const [isPracticing, setIsPracticing] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuizData();
    }
  }, [id]);

  const loadQuizData = async () => {
    if (typeof id !== 'string') return;

    const [moduleData, quizData] = await Promise.all([
      dbGetModuleById(id),
      dbGetQuizByModule(id)
    ]);

    setModule(moduleData);

    // If no quiz exists, generate one
    if (!quizData) {
      const generatedQuiz = await generateQuiz(id);
      setQuiz(generatedQuiz);
    } else {
      setQuiz(quizData);
    }

    setLoading(false);
  };

  const generateQuiz = async (moduleId: string): Promise<Quiz> => {
    const lessons = await dbGetLessonsByModule(moduleId);
    
    const questions: QuizQuestion[] = [];
    
    // Generate MCQ questions
    lessons.slice(0, 3).forEach((lesson, idx) => {
      questions.push({
        id: `mcq-${idx}`,
        type: 'mcq',
        question: `What does this sign mean?`,
        imageUrl: lesson.imageUrl,
        videoUrl: lesson.videoUrl,
        options: [lesson.sign, 'Random Option 1', 'Random Option 2', 'Random Option 3'].sort(() => Math.random() - 0.5),
        correctAnswer: lesson.sign
      });
    });

    // Generate identify-sign questions
    lessons.slice(3, 5).forEach((lesson, idx) => {
      questions.push({
        id: `identify-${idx}`,
        type: 'identify-sign',
        question: `Which video shows the sign for "${lesson.sign}"?`,
        correctAnswer: 0,
        options: ['Video 1', 'Video 2', 'Video 3']
      });
    });

    // Generate gesture-check question
    if (lessons.length > 0 && lessons[0].handLandmarks) {
      questions.push({
        id: 'gesture-0',
        type: 'gesture-check',
        question: `Perform the sign for "${lessons[0].sign}" using your webcam`,
        gestureData: lessons[0].handLandmarks,
        correctAnswer: lessons[0].sign
      });
    }

    return {
      id: `quiz-${moduleId}`,
      moduleId,
      questions,
      passingScore: 70,
      createdAt: new Date().toISOString()
    };
  };

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsPracticing(false);
      setGestureConfidence(0);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    if (!quiz || !user) return;

    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (q.type === 'gesture-check') {
        if (answers[idx] >= 80) correctCount++;
      } else {
        if (answers[idx] === q.correctAnswer) correctCount++;
      }
    });

    setScore(correctCount);
    setIsComplete(true);

    // Save result to local storage
    await dbSaveQuizResult({
      userId: user.id,
      quizId: quiz.id,
      moduleId: quiz.moduleId,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      answers
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading quiz...</div>
        </div>
      </Layout>
    );
  }

  if (!quiz || !module) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz not available</h1>
          <Link href="/modules" className="text-primary-600 hover:text-primary-700">
            ← Back to Modules
          </Link>
        </div>
      </Layout>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passingScore;

    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">
              {passed ? '🎉' : '📚'}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-gray-600 mb-6">
              {passed 
                ? 'You passed the quiz! Great job mastering this module.' 
                : 'You need more practice. Review the lessons and try again.'}
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-5xl font-bold mb-2" style={{ color: passed ? '#10b981' : '#f59e0b' }}>
                {percentage}%
              </div>
              <p className="text-gray-600">
                {score} out of {quiz.questions.length} correct
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Passing score: {quiz.passingScore}%
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href={`/modules/${module.id}`}
                className="block w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium"
              >
                Back to Module
              </Link>
              {!passed && (
                <button
                  onClick={() => {
                    setIsComplete(false);
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setScore(0);
                  }}
                  className="block w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Retry Quiz
                </button>
              )}
              <Link
                href="/dashboard"
                className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(((currentQuestion) / quiz.questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              {question.type === 'mcq' ? 'Multiple Choice' : 
               question.type === 'identify-sign' ? 'Identify Sign' : 
               'Webcam Practice'}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{question.question}</h2>
          </div>

          {/* MCQ Question */}
          {question.type === 'mcq' && (
            <div className="space-y-4">
              {question.imageUrl && (
                <img src={question.imageUrl} alt="Sign" className="w-full max-w-md mx-auto rounded-lg mb-6" />
              )}
              {question.videoUrl && (
                <video src={question.videoUrl} controls loop className="w-full max-w-md mx-auto rounded-lg mb-6" />
              )}
              
              <div className="space-y-3">
                {question.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers[currentQuestion] === option
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Identify Sign Question */}
          {question.type === 'identify-sign' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {question.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`p-4 rounded-lg border-2 transition ${
                      answers[currentQuestion] === idx
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="bg-gray-200 h-32 rounded mb-2 flex items-center justify-center">
                      <span className="text-4xl">🤟</span>
                    </div>
                    <p className="text-center font-medium">{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gesture Check Question */}
          {question.type === 'gesture-check' && (
            <div className="space-y-4">
              <button
                onClick={() => setIsPracticing(!isPracticing)}
                className={`w-full mb-4 px-6 py-3 rounded-lg font-medium transition ${
                  isPracticing
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isPracticing ? '⏸ Stop Camera' : '▶ Start Camera'}
              </button>

              <HandGestureDetector
                targetLandmarks={question.gestureData}
                onDetection={(confidence) => {
                  setGestureConfidence(confidence);
                  handleAnswer(confidence);
                }}
                isActive={isPracticing}
              />

              {gestureConfidence > 0 && (
                <div className={`p-4 rounded-lg ${
                  gestureConfidence >= 80 ? 'bg-green-50 border-green-200' :
                  gestureConfidence >= 60 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                } border`}>
                  <p className="font-semibold">
                    {gestureConfidence >= 80 ? '✓ Excellent! You got it!' :
                     gestureConfidence >= 60 ? '↗ Almost there!' :
                     '→ Keep trying!'}
                  </p>
                  <p className="text-sm mt-1">Confidence: {gestureConfidence}%</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
