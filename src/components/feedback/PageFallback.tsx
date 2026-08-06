import React from 'react';

export const PageFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

export default PageFallback;
