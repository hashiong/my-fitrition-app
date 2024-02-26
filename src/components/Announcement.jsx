import React from 'react';

function Announcement() {
  return (
    <div className="mx-auto px-4 md:px-8 lg:px-16">
      <div className="flex flex-col items-center justify-center my-5">
        <p className="text-black tracking-widest text-lg md:text-xl lg:text-2xl font-extrabold">
          <span className='text-2xl md:text-3xl text-red-500'>Announcement:</span> Dear loyal customers, Fitrition Kitchen will be on vacation from March 1, 2024, to March 31, 2024. We will be reopening and resuming all services on April 1, 2024. Thank you for your unwavering support throughout the years, and we hope to serve you soon!
        </p>
      </div>
    </div>
  );
}

export default Announcement;
