'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';

export default function Footer() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const handleLoginSuccess = () => {
    router.push('/admin');
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} ECESTORMS. All rights reserved.
          </p>
          
          {/* Admin login button - slightly larger dot */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="mt-4 w-2 h-2 bg-gray-200 hover:bg-gray-400 rounded-full transition-colors"
            aria-label="Admin Login"
          />
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </footer>
  );
} 