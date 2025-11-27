import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              © 2025 SignLearn Platform. Empowering deaf and hard-of-hearing learners worldwide.
            </p>
            <p className="text-xs mt-2 text-gray-400">
              Privacy-focused • Accessible • Inclusive
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
