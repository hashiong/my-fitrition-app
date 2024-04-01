import React from 'react';

function Announcement() {
  return (
    <div className="mx-auto px-4 md:px-8 lg:px-16">
      <div className="flex flex-col items-center justify-center my-5">
        <p className="text-black tracking-widest text-lg md:text-xl lg:text-2xl font-extrabold">
          <span className='text-2xl md:text-3xl text-red-500'>Announcement:</span> (Site Under Maintenance)Empty
        </p>
      </div>
    </div>
  );
}

export default Announcement;
