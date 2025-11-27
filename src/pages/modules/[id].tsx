import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getModuleById, getLessonsByModule, Module, Lesson, getUserProgress } from '@/lib/firestore';

export default function ModulePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [module, setModule] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadModuleData();
    }
  }, [id, user]);

  const loadModuleData = async () => {
    if (typeof id !== 'string') return;

    const [moduleData, lessonsData] = await Promise.all([
      getModuleById(id),
      getLessonsByModule(id)
    ]);

    setModule(moduleData);
    setLessons(lessonsData);

    if (user) {
      const userProgress = await getUserProgress(user.uid);
      setProgress(userProgress.filter(p => p.moduleId === id));
    }

    setLoading(false);
  };

  const getLessonStatus = (lessonId: string) => {
    const lessonProgress = progress.find(p => p.lessonId === lessonId);
    return lessonProgress?.completed ? 'completed' : lessonProgress ? 'in-progress' : 'not-started';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading module...</div>
        </div>
      </Layout>
    );
  }

  if (!module) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module not found</h1>
          <Link href="/modules" className="text-primary-600 hover:text-primary-700">
            ← Back to Modules
          </Link>
        </div>
      </Layout>
    );
  }

  const completedLessons = progress.filter(p => p.completed).length;
  const completionRate = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/modules" className="text-primary-600 hover:text-primary-700 text-sm">
            ← Back to Modules
          </Link>
        </div>

        {/* Module Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{module.title}</h1>
              <p className="text-gray-600">{module.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              module.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              module.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {module.difficulty}
            </span>
          </div>

          {user && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Your Progress</span>
                <span>{completedLessons}/{lessons.length} lessons • {completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Lessons</h2>
          
          {lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((lesson, idx) => {
                const status = getLessonStatus(lesson.id);
                const statusIcons = {
                  'completed': '✓',
                  'in-progress': '▶',
                  'not-started': '○'
                };
                const statusColors = {
                  'completed': 'text-green-600',
                  'in-progress': 'text-blue-600',
                  'not-started': 'text-gray-400'
                };

                return (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="block border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        status === 'completed' ? 'bg-green-100' :
                        status === 'in-progress' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <span className={`text-xl ${statusColors[status]}`}>
                          {statusIcons[status]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {idx + 1}. {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Sign: {lesson.sign}</p>
                      </div>
                      <div className="text-primary-600">→</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No lessons available yet. Check back soon!
            </p>
          )}
        </div>

        {/* Quiz Button */}
        {completionRate === 100 && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">🎉 Module Completed!</h3>
            <p className="mb-4">You've finished all lessons. Ready to test your knowledge?</p>
            <Link
              href={`/quiz/${module.id}`}
              className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Take Quiz
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
