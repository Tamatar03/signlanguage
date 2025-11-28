/**
 * Local Storage Database
 * Mock database using browser localStorage and in-memory storage
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  photoURL?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: 'alphabets' | 'numbers' | 'words' | 'idioms' | 'phrases';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: string[];
  createdBy: string;
  createdAt: string;
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  sign: string;
  imageUrl?: string;
  videoUrl?: string;
  model3dUrl?: string;
  handLandmarks?: number[][];
  instructions: string[];
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  attempts: number;
  lastAttempt: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  questions: QuizQuestion[];
  passingScore: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'identify-sign' | 'gesture-check';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  imageUrl?: string;
  videoUrl?: string;
  gestureData?: number[][];
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  moduleId: string;
  score: number;
  totalQuestions: number;
  answers: any[];
  completedAt: string;
}

// Helper to work with localStorage
const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

// Initialize with sample data
export const initializeDatabase = () => {
  if (typeof window === 'undefined') return;
  
  // Initialize users array if not exists
  if (!storage.get('users')) {
    storage.set('users', []);
  }
  
  // Initialize modules with sample data if not exists
  if (!storage.get('modules')) {
    const sampleModules: Module[] = [
      {
        id: 'mod-1',
        title: 'ASL Alphabet Basics',
        description: 'Learn the American Sign Language alphabet from A to Z',
        category: 'alphabets',
        difficulty: 'beginner',
        lessons: ['lesson-1', 'lesson-2', 'lesson-3'],
        createdBy: 'system',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mod-2',
        title: 'Numbers 1-10',
        description: 'Master signing numbers from one to ten',
        category: 'numbers',
        difficulty: 'beginner',
        lessons: ['lesson-4', 'lesson-5', 'lesson-6'],
        createdBy: 'system',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mod-3',
        title: 'Common Greetings',
        description: 'Learn essential greeting signs',
        category: 'words',
        difficulty: 'beginner',
        lessons: ['lesson-7', 'lesson-8'],
        createdBy: 'system',
        createdAt: new Date().toISOString()
      }
    ];
    storage.set('modules', sampleModules);
  }
  
  // Initialize lessons with sample data
  if (!storage.get('lessons')) {
    const sampleLessons: Lesson[] = [
      {
        id: 'lesson-1',
        moduleId: 'mod-1',
        title: 'The Letter A',
        description: 'Learn how to sign the letter A',
        sign: 'A',
        instructions: [
          'Make a fist with your dominant hand',
          'Keep your thumb pointing upward along the side of your fist',
          'Hold your hand at chest level',
          'Ensure fingers are curled tightly'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'lesson-2',
        moduleId: 'mod-1',
        title: 'The Letter B',
        description: 'Learn how to sign the letter B',
        sign: 'B',
        instructions: [
          'Extend all four fingers straight up',
          'Keep fingers together',
          'Fold thumb across your palm',
          'Palm should face forward'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'lesson-3',
        moduleId: 'mod-1',
        title: 'The Letter C',
        description: 'Learn how to sign the letter C',
        sign: 'C',
        instructions: [
          'Curve your hand to form a C shape',
          'Keep fingers together',
          'Thumb should be opposite to fingers',
          'Hold with palm facing left'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'lesson-4',
        moduleId: 'mod-2',
        title: 'Number 1',
        description: 'Sign the number one',
        sign: '1',
        instructions: [
          'Extend your index finger straight up',
          'Keep all other fingers curled',
          'Thumb can rest against middle finger',
          'Hold at chest or shoulder height'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'lesson-5',
        moduleId: 'mod-2',
        title: 'Number 2',
        description: 'Sign the number two',
        sign: '2',
        instructions: [
          'Extend index and middle fingers',
          'Keep fingers in V shape',
          'Curl other fingers into palm',
          'Palm faces forward'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'lesson-6',
        moduleId: 'mod-2',
        title: 'Number 3',
        description: 'Sign the number three',
        sign: '3',
        instructions: [
          'Extend thumb, index, and middle finger',
          'Keep ring and pinky curled',
          'Spread the three fingers apart',
          'Palm faces forward'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'lesson-7',
        moduleId: 'mod-3',
        title: 'Hello',
        description: 'Sign hello or hi',
        sign: 'Hello',
        instructions: [
          'Start with hand near forehead',
          'Touch forehead with fingertips',
          'Move hand forward and away',
          'Can also wave hand side to side'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'lesson-8',
        moduleId: 'mod-3',
        title: 'Thank You',
        description: 'Sign thank you',
        sign: 'Thank You',
        instructions: [
          'Touch fingers to chin or lips',
          'Move hand forward toward person',
          'Keep palm facing up',
          'Show gratitude in expression'
        ],
        createdAt: new Date().toISOString()
      }
    ];
    storage.set('lessons', sampleLessons);
  }
  
  if (!storage.get('progress')) {
    storage.set('progress', []);
  }
  
  if (!storage.get('quizzes')) {
    storage.set('quizzes', []);
  }
  
  if (!storage.get('quizResults')) {
    storage.set('quizResults', []);
  }
};

// User operations
export const dbCreateUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const users: User[] = storage.get('users') || [];
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  storage.set('users', users);
  return newUser;
};

export const dbGetUser = async (email: string): Promise<User | null> => {
  const users: User[] = storage.get('users') || [];
  return users.find(u => u.email === email) || null;
};

export const dbGetUserById = async (id: string): Promise<User | null> => {
  const users: User[] = storage.get('users') || [];
  return users.find(u => u.id === id) || null;
};

export const dbUpdateUser = async (id: string, data: Partial<User>): Promise<void> => {
  const users: User[] = storage.get('users') || [];
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...data };
    storage.set('users', users);
  }
};

// Module operations
export const dbGetModules = async (): Promise<Module[]> => {
  return storage.get('modules') || [];
};

export const dbGetModuleById = async (id: string): Promise<Module | null> => {
  const modules: Module[] = storage.get('modules') || [];
  return modules.find(m => m.id === id) || null;
};

export const dbCreateModule = async (moduleData: Omit<Module, 'id' | 'createdAt'>): Promise<Module> => {
  const modules: Module[] = storage.get('modules') || [];
  const newModule: Module = {
    ...moduleData,
    id: `mod-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  modules.push(newModule);
  storage.set('modules', newModule);
  return newModule;
};

// Lesson operations
export const dbGetLessonsByModule = async (moduleId: string): Promise<Lesson[]> => {
  const lessons: Lesson[] = storage.get('lessons') || [];
  return lessons.filter(l => l.moduleId === moduleId);
};

export const dbGetLessonById = async (id: string): Promise<Lesson | null> => {
  const lessons: Lesson[] = storage.get('lessons') || [];
  return lessons.find(l => l.id === id) || null;
};

export const dbCreateLesson = async (lessonData: Omit<Lesson, 'id' | 'createdAt'>): Promise<Lesson> => {
  const lessons: Lesson[] = storage.get('lessons') || [];
  const newLesson: Lesson = {
    ...lessonData,
    id: `lesson-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  lessons.push(newLesson);
  storage.set('lessons', lessons);
  return newLesson;
};

// Progress operations
export const dbGetUserProgress = async (userId: string): Promise<UserProgress[]> => {
  const progress: UserProgress[] = storage.get('progress') || [];
  return progress.filter(p => p.userId === userId);
};

export const dbUpdateProgress = async (
  userId: string,
  moduleId: string,
  lessonId: string,
  data: Partial<UserProgress>
): Promise<void> => {
  const allProgress: UserProgress[] = storage.get('progress') || [];
  const existingIndex = allProgress.findIndex(
    p => p.userId === userId && p.moduleId === moduleId && p.lessonId === lessonId
  );
  
  if (existingIndex !== -1) {
    allProgress[existingIndex] = {
      ...allProgress[existingIndex],
      ...data,
      lastAttempt: new Date().toISOString()
    };
  } else {
    allProgress.push({
      userId,
      moduleId,
      lessonId,
      completed: false,
      attempts: 0,
      ...data,
      lastAttempt: new Date().toISOString()
    });
  }
  
  storage.set('progress', allProgress);
};

// Quiz operations
export const dbGetQuizByModule = async (moduleId: string): Promise<Quiz | null> => {
  const quizzes: Quiz[] = storage.get('quizzes') || [];
  return quizzes.find(q => q.moduleId === moduleId) || null;
};

export const dbSaveQuizResult = async (resultData: Omit<QuizResult, 'id' | 'completedAt'>): Promise<QuizResult> => {
  const results: QuizResult[] = storage.get('quizResults') || [];
  const newResult: QuizResult = {
    ...resultData,
    id: `result-${Date.now()}`,
    completedAt: new Date().toISOString()
  };
  results.push(newResult);
  storage.set('quizResults', results);
  return newResult;
};

export const dbGetUserQuizResults = async (userId: string): Promise<QuizResult[]> => {
  const results: QuizResult[] = storage.get('quizResults') || [];
  return results.filter(r => r.userId === userId).sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
};
