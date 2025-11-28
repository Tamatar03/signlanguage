import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
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
    if (!loading && (!user || (user?.role !== 'teacher' && user?.role !== 'admin'))) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && (user?.role === 'teacher' || user?.role === 'admin')) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      // Get data from localStorage
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      const lessonsData = JSON.parse(localStorage.getItem('lessons') || '[]');
      const progressData = JSON.parse(localStorage.getItem('progress') || '[]');
      const quizResultsData = JSON.parse(localStorage.getItem('quizResults') || '[]');
      const modulesData = JSON.parse(localStorage.getItem('modules') || '[]');

      // Calculate statistics
      const totalStudents = usersData.filter((u: any) => u.role === 'student').length;
      const totalLessons = lessonsData.length;
      const totalQuizzes = quizResultsData.length;

      // Calculate average score
      const averageScore = quizResultsData.length > 0
        ? Math.round(
            quizResultsData.reduce((acc: number, r: any) => acc + (r.score / r.totalQuestions) * 100, 0) / quizResultsData.length
          )
        : 0;

      setStats({
        totalStudents,
        totalLessons,
        totalQuizzes,
        averageScore
      });

      // Get module statistics
      const moduleData = modulesData.slice(0, 6).map((module: any) => {
        const moduleProgress = progressData.filter((p: any) => p.moduleId === module.id);
        const completed = moduleProgress.filter((p: any) => p.completed).length;
        const total = moduleProgress.length;

        return {
          name: module.title.slice(0, 20),
          completed,
          inProgress: total - completed
        };
      });

      setModuleStats(moduleData);

      // Get recent activity (sort by completedAt timestamp)
      const recentResults = quizResultsData
        .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
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
