
import React from 'react';

interface LoadingSpinnerProps {
  message: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400"></div>
      <p className="mt-4 text-lg text-gray-300 text-center">{message}</p>
    </div>
  );
}
