import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AnalyticsPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    averageScore: 0
  });
  const [moduleStats, setModuleStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || (userData?.role !== 'teacher' && userData?.role !== 'admin'))) {
      router.push('/dashboard');
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (user && (userData?.role === 'teacher' || userData?.role === 'admin')) {
      loadAnalytics();
    }
  }, [user, userData]);

  const loadAnalytics = async () => {
    try {
      // Get total students
      const usersSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'student'))
      );
      const totalStudents = usersSnapshot.size;

      // Get total lessons
      const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
      const totalLessons = lessonsSnapshot.size;

      // Get quiz results
      const quizResultsSnapshot = await getDocs(collection(db, 'quizResults'));
      const quizResults = quizResultsSnapshot.docs.map(doc => doc.data());
      const totalQuizzes = quizResults.length;

      // Calculate average score
      const averageScore = quizResults.length > 0
        ? Math.round(
            quizResults.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / quizResults.length
          )
        : 0;

      setStats({
        totalStudents,
        totalLessons,
        totalQuizzes,
        averageScore
      });

      // Get module statistics
      const modulesSnapshot = await getDocs(collection(db, 'modules'));
      const modules = modulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const moduleData = await Promise.all(
        modules.slice(0, 6).map(async (module: any) => {
          const progressSnapshot = await getDocs(
            query(collection(db, 'progress'), where('moduleId', '==', module.id))
          );
          const completed = progressSnapshot.docs.filter(doc => doc.data().completed).length;
          const total = progressSnapshot.size;

          return {
            name: module.title.slice(0, 20),
            completed,
            inProgress: total - completed
          };
        })
      );

      setModuleStats(moduleData);

      // Get recent activity
      const recentResults = quizResults
        .sort((a, b) => b.completedAt?.seconds - a.completedAt?.seconds)
        .slice(0, 10);

      setRecentActivity(recentResults);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-gray-600 mt-2">Monitor student performance and platform usage</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalStudents}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalLessons}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalQuizzes}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Quiz Score</p>
                <p className="text-3xl font-bold text-green-600">{stats.averageScore}%</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Module Progress Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Module Progress Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
              <Bar dataKey="inProgress" stackId="a" fill="#0ea5e9" name="In Progress" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Quiz Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => {
                const percentage = Math.round((activity.score / activity.totalQuestions) * 100);
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Student Quiz Attempt</p>
                      <p className="text-sm text-gray-600">
                        Score: {activity.score}/{activity.totalQuestions}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-semibold ${
                      percentage >= 80 ? 'bg-green-100 text-green-800' :
                      percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
