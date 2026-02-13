import React from 'react'
import { useEffect, useState } from 'react';
import Loading from './Loading';

const Error = () => {

    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show the loader for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Clean up the timer if the user leaves the page before 2 seconds
    return () => clearTimeout(timer);
  }, []);

  // 1. If loading is true, show the Loading component
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div>
        <div className='justify-self-center mt-60 font-black text-xl flex flex-col text-center text-stone-30'><span className='text-blue-600 text-5xl'>404</span>Page Not Found</div>
    </div>
    </div>
  )
}

export default Error;
