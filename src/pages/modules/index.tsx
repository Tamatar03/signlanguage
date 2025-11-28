import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { dbGetModules, Module, dbGetUserProgress } from '@/lib/db';

export default function Modules() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadModules = async () => {
    const data = await dbGetModules();
    setModules(data);
  };

  const loadProgress = async () => {
    if (!user) return;
    const data = await dbGetUserProgress(user.id);
    setProgress(data);
  };

  const getModuleProgress = (moduleId: string) => {
    const moduleProgress = progress.filter(p => p.moduleId === moduleId);
    if (moduleProgress.length === 0) return 0;
    const completed = moduleProgress.filter(p => p.completed).length;
    return Math.round((completed / moduleProgress.length) * 100);
  };

  const filteredModules = filter === 'all' 
    ? modules 
    : modules.filter(m => m.category === filter);

  const categories = [
    { id: 'all', name: 'All Modules', icon: '📚' },
    { id: 'alphabets', name: 'Alphabets', icon: '🔤' },
    { id: 'numbers', name: 'Numbers', icon: '🔢' },
    { id: 'words', name: 'Common Words', icon: '💬' },
    { id: 'idioms', name: 'Idioms', icon: '💭' },
    { id: 'phrases', name: 'Phrases', icon: '📝' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Modules</h1>
          <p className="text-gray-600 mt-2">Choose a module to start learning sign language</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === cat.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-sm`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Modules Grid */}
        {filteredModules.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map(module => {
              const progressPercent = getModuleProgress(module.id);
              const difficultyColors = {
                beginner: 'bg-green-100 text-green-800',
                intermediate: 'bg-yellow-100 text-yellow-800',
                advanced: 'bg-red-100 text-red-800'
              };

              return (
                <Link 
                  key={module.id}
                  href={`/modules/${module.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span className="text-6xl">
                      {module.category === 'alphabets' && '🔤'}
                      {module.category === 'numbers' && '🔢'}
                      {module.category === 'words' && '💬'}
                      {module.category === 'idioms' && '💭'}
                      {module.category === 'phrases' && '📝'}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${difficultyColors[module.difficulty]}`}>
                        {module.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                    
                    {user && progressPercent > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{module.lessons?.length || 0} lessons</span>
                      <span className="text-primary-600 font-medium">Start Learning →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No modules found in this category</p>
            <p className="text-gray-400 text-sm mt-2">Try selecting a different category</p>
          </div>
        )}

        {/* Info Box */}
        {!user && (
          <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Sign in to track your progress</h3>
            <p className="text-primary-700 mb-4">
              Create a free account to save your progress, take quizzes, and earn achievements.
            </p>
            <Link 
              href="/signup"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
