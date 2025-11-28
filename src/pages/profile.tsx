import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { dbGetUserProgress, dbGetUserQuizResults } from '@/lib/db';
import { format } from 'date-fns';

export default function Profile() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    const [userProgress, results] = await Promise.all([
      dbGetUserProgress(user.id),
      dbGetUserQuizResults(user.id)
    ]);

    setProgress(userProgress);
    setQuizResults(results);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  const totalLessons = progress.length;
  const completedLessons = progress.filter(p => p.completed).length;
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-600">
                {user?.displayName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.displayName}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {user?.role === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Learning Statistics</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">Overall Completion</span>
                <span className="text-gray-900 font-bold">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-primary-600 h-4 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{completedLessons}</p>
                <p className="text-sm text-gray-600">Lessons Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{quizResults.length}</p>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {quizResults.length > 0 
                    ? Math.round(quizResults.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / quizResults.length)
                    : 0}%
                </p>
                <p className="text-sm text-gray-600">Avg Quiz Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Quiz History</h2>
          
          {quizResults.length > 0 ? (
            <div className="space-y-3">
              {quizResults.map((result, idx) => {
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                const passed = percentage >= 70;
                
                return (
                  <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Quiz #{quizResults.length - idx}</h3>
                        <p className="text-sm text-gray-600">
                          {result.completedAt?.toDate ? format(result.completedAt.toDate(), 'PPp') : 'Recently'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                          {percentage}%
                        </div>
                        <p className="text-sm text-gray-600">
                          {result.score}/{result.totalQuestions} correct
                        </p>
                      </div>
                      <div className="ml-4">
                        {passed ? (
                          <span className="text-3xl">✓</span>
                        ) : (
                          <span className="text-3xl">⚠️</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No quiz history yet</p>
              <p className="text-sm text-gray-400">Complete modules to start taking quizzes!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
