import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getModules, Module, createModule, createLesson } from '@/lib/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

export default function AdminPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>('');
  
  // Module form state
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleCategory, setModuleCategory] = useState<'alphabets' | 'numbers' | 'words' | 'idioms' | 'phrases'>('alphabets');
  const [moduleDifficulty, setModuleDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  
  // Lesson form state
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonSign, setLessonSign] = useState('');
  const [lessonInstructions, setLessonInstructions] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || (userData?.role !== 'teacher' && userData?.role !== 'admin'))) {
      router.push('/dashboard');
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    const data = await getModules();
    setModules(data);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);

    try {
      await createModule({
        title: moduleTitle,
        description: moduleDescription,
        category: moduleCategory,
        difficulty: moduleDifficulty,
        lessons: [],
        createdBy: user.uid,
        createdAt: Timestamp.now()
      });

      // Reset form
      setModuleTitle('');
      setModuleDescription('');
      setShowModuleForm(false);
      
      // Reload modules
      loadModules();
      alert('Module created successfully!');
    } catch (error) {
      console.error('Error creating module:', error);
      alert('Failed to create module');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedModule) return;

    setUploading(true);

    try {
      let imageUrl = '';
      let videoUrl = '';

      // Upload image if provided
      if (imageFile) {
        const imageRef = ref(storage, `lessons/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Upload video if provided
      if (videoFile) {
        const videoRef = ref(storage, `lessons/${Date.now()}_${videoFile.name}`);
        await uploadBytes(videoRef, videoFile);
        videoUrl = await getDownloadURL(videoRef);
      }

      const instructions = lessonInstructions.split('\n').filter(i => i.trim());

      await createLesson({
        moduleId: selectedModule,
        title: lessonTitle,
        description: lessonDescription,
        sign: lessonSign,
        imageUrl,
        videoUrl,
        instructions,
        createdAt: Timestamp.now()
      });

      // Reset form
      setLessonTitle('');
      setLessonDescription('');
      setLessonSign('');
      setLessonInstructions('');
      setImageFile(null);
      setVideoFile(null);
      setShowLessonForm(false);
      
      alert('Lesson created successfully!');
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Failed to create lesson');
    } finally {
      setUploading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage modules, lessons, and student progress</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setShowModuleForm(!showModuleForm)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-medium"
          >
            {showModuleForm ? 'Cancel' : '+ Create Module'}
          </button>
          <button
            onClick={() => setShowLessonForm(!showLessonForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            {showLessonForm ? 'Cancel' : '+ Create Lesson'}
          </button>
          <Link
            href="/admin/analytics"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            📊 View Analytics
          </Link>
        </div>

        {/* Create Module Form */}
        {showModuleForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Module</h2>
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Title
                </label>
                <input
                  type="text"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., ASL Alphabet Basics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe what students will learn..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={moduleCategory}
                    onChange={(e) => setModuleCategory(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="alphabets">Alphabets</option>
                    <option value="numbers">Numbers</option>
                    <option value="words">Common Words</option>
                    <option value="idioms">Idioms</option>
                    <option value="phrases">Phrases</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={moduleDifficulty}
                    onChange={(e) => setModuleDifficulty(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {uploading ? 'Creating...' : 'Create Module'}
              </button>
            </form>
          </div>
        )}

        {/* Create Lesson Form */}
        {showLessonForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Lesson</h2>
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Module
                </label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a module...</option>
                  {modules.map(module => (
                    <option key={module.id} value={module.id}>{module.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., The Letter A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sign Being Taught
                </label>
                <input
                  type="text"
                  value={lessonSign}
                  onChange={(e) => setLessonSign(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  required
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions (one per line)
                </label>
                <textarea
                  value={lessonInstructions}
                  onChange={(e) => setLessonInstructions(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder="Step 1: Make a fist&#10;Step 2: Point thumb upward&#10;..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Upload
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Upload
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Create Lesson'}
              </button>
            </form>
          </div>
        )}

        {/* Modules Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Existing Modules</h2>
          {modules.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map(module => (
                <div key={module.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded">{module.category}</span>
                    <span className="text-gray-500">{module.lessons?.length || 0} lessons</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No modules created yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
