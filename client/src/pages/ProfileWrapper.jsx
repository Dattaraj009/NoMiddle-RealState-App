import React, { Suspense } from 'react';

export default function ProfileWrapper() {
  const ProfilePage = React.lazy(() => import('./Profile'));

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    }>
      <ProfilePage />
    </Suspense>
  );
} 