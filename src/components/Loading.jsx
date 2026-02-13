import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black">
      {/* Stylish Spinner - You can replace this with a plane icon if preferred */}
      <div className="w-12 h-12 border-2 border-black border-t-white rounded-full animate-spin"></div>
      
      <h2 className="mt-4 text-lg font-semibold text-gray-300 tracking-wide animate-pulse">
        Preparing...
      </h2>
    </div>
  );
};

export default Loading;