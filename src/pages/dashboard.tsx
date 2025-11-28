import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { dbGetUserProgress, dbGetUserQuizResults, Module, dbGetModules } from '@/lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [stats, setStats] = useState({
    completedLessons: 0,
    averageScore: 0,
    totalQuizzes: 0,
    streak: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    const [userProgress, results, allModules] = await Promise.all([
      dbGetUserProgress(user.id),
      dbGetUserQuizResults(user.id),
      dbGetModules()
    ]);

    setProgress(userProgress);
    setQuizResults(results);
    setModules(allModules);

    // Calculate stats
    const completed = userProgress.filter(p => p.completed).length;
    const avgScore = results.length > 0
      ? results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / results.length
      : 0;

    setStats({
      completedLessons: completed,
      averageScore: Math.round(avgScore),
      totalQuizzes: results.length,
      streak: calculateStreak(userProgress)
    });
  };

  const calculateStreak = (progressData: any[]) => {
    // Simple streak calculation - can be improved
    return progressData.filter(p => p.completed).length > 0 ? 
      Math.min(progressData.filter(p => p.completed).length, 7) : 0;
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

  const chartData = modules.slice(0, 5).map(module => {
    const moduleProgress = progress.filter(p => p.moduleId === module.id);
    const completed = moduleProgress.filter(p => p.completed).length;
    return {
      name: module.title.slice(0, 15),
      completed
    };
  });

  const pieData = [
    { name: 'Completed', value: stats.completedLessons },
    { name: 'In Progress', value: Math.max(0, progress.length - stats.completedLessons) }
  ];

  const COLORS = ['#0ea5e9', '#e0f2fe'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.displayName || 'Student'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Track your learning progress and continue your journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Lessons</p>
                <p className="text-3xl font-bold text-primary-600">{stats.completedLessons}</p>
              </div>
              <div className="text-4xl">✓</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-green-600">{stats.averageScore}%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalQuizzes}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Day Streak</p>
                <p className="text-3xl font-bold text-orange-600">{stats.streak}</p>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Progress by Module</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Quiz Results</h2>
          {quizResults.length > 0 ? (
            <div className="space-y-3">
              {quizResults.slice(0, 5).map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Quiz {idx + 1}</p>
                    <p className="text-sm text-gray-600">
                      Score: {result.score}/{result.totalQuestions}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    (result.score / result.totalQuestions) >= 0.7 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {Math.round((result.score / result.totalQuestions) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No quiz results yet. Start learning to see your progress!</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
          <div className="flex space-x-4">
            <Link 
              href="/modules" 
              className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Browse Modules
            </Link>
            <Link 
              href="/profile" 
              className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
