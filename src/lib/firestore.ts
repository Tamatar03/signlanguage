import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Timestamp;
  photoURL?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: 'alphabets' | 'numbers' | 'words' | 'idioms' | 'phrases';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: string[]; // lesson IDs
  createdBy: string;
  createdAt: Timestamp;
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  sign: string; // What sign is being taught
  imageUrl?: string;
  videoUrl?: string;
  model3dUrl?: string;
  handLandmarks?: number[][]; // MediaPipe landmarks for validation
  instructions: string[];
  createdAt: Timestamp;
}

export interface UserProgress {
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  attempts: number;
  lastAttempt: Timestamp;
}

export interface Quiz {
  id: string;
  moduleId: string;
  questions: QuizQuestion[];
  passingScore: number;
  createdAt: Timestamp;
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
  userId: string;
  quizId: string;
  moduleId: string;
  score: number;
  totalQuestions: number;
  answers: any[];
  completedAt: Timestamp;
}

// User operations
export const createUser = async (uid: string, userData: Omit<User, 'uid'>) => {
  await setDoc(doc(db, 'users', uid), { uid, ...userData });
};

export const getUser = async (uid: string): Promise<User | null> => {
  const docSnap = await getDoc(doc(db, 'users', uid));
  return docSnap.exists() ? docSnap.data() as User : null;
};

export const updateUser = async (uid: string, data: Partial<User>) => {
  await updateDoc(doc(db, 'users', uid), data);
};

// Module operations
export const getModules = async (): Promise<Module[]> => {
  const querySnapshot = await getDocs(collection(db, 'modules'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
};

export const getModuleById = async (moduleId: string): Promise<Module | null> => {
  const docSnap = await getDoc(doc(db, 'modules', moduleId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Module : null;
};

export const createModule = async (moduleData: Omit<Module, 'id'>) => {
  return await addDoc(collection(db, 'modules'), moduleData);
};

// Lesson operations
export const getLessonsByModule = async (moduleId: string): Promise<Lesson[]> => {
  const q = query(collection(db, 'lessons'), where('moduleId', '==', moduleId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
};

export const getLessonById = async (lessonId: string): Promise<Lesson | null> => {
  const docSnap = await getDoc(doc(db, 'lessons', lessonId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Lesson : null;
};

export const createLesson = async (lessonData: Omit<Lesson, 'id'>) => {
  return await addDoc(collection(db, 'lessons'), lessonData);
};

// Progress operations
export const getUserProgress = async (userId: string): Promise<UserProgress[]> => {
  const q = query(collection(db, 'progress'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as UserProgress);
};

export const updateProgress = async (userId: string, moduleId: string, lessonId: string, data: Partial<UserProgress>) => {
  const progressId = `${userId}_${moduleId}_${lessonId}`;
  const progressRef = doc(db, 'progress', progressId);
  
  const existing = await getDoc(progressRef);
  if (existing.exists()) {
    await updateDoc(progressRef, { ...data, lastAttempt: Timestamp.now() });
  } else {
    await setDoc(progressRef, {
      userId,
      moduleId,
      lessonId,
      completed: false,
      attempts: 0,
      ...data,
      lastAttempt: Timestamp.now()
    });
  }
};

// Quiz operations
export const getQuizByModule = async (moduleId: string): Promise<Quiz | null> => {
  const q = query(collection(db, 'quizzes'), where('moduleId', '==', moduleId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Quiz;
};

export const saveQuizResult = async (resultData: Omit<QuizResult, 'completedAt'>) => {
  return await addDoc(collection(db, 'quizResults'), {
    ...resultData,
    completedAt: Timestamp.now()
  });
};

export const getUserQuizResults = async (userId: string): Promise<QuizResult[]> => {
  const q = query(
    collection(db, 'quizResults'), 
    where('userId', '==', userId),
    orderBy('completedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizResult));
};
