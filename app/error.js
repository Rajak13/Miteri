'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080909] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-[#F4F4F0] mb-4">Oops!</h1>
        <h2 className="text-xl text-[#F4F4F0]/80 mb-6">Something went wrong</h2>
        <p className="text-[#F4F4F0]/60 mb-8">
          We're sorry for the inconvenience. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
