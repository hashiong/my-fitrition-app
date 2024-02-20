import React from 'react'

function Edit() {
  return (
    <div className='flex flex-row mx-10 my-5 text-center'>

        <div className='basis-1/5 flex flex-col gap-y-4'>
          <div className='text-lg tracking-widest font-extrabold'>Monday 星期一</div>
          <div className='text-lg tracking-widest font-bold'>{data["Mon"].Date}</div>
          <div className='text-lg tracking-widest font-extrabold'>
            {data["Mon"].Ch.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
          <div className='text-lg tracking-widest font-bold'>
            {data["Mon"].En.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
        </div>

        {/* Tuesday */}
        <div className='basis-1/5 flex flex-col gap-y-4 border-l-2'>
          <div className='text-lg tracking-widest font-extrabold'>Tuesday 星期二</div>
          <div className='text-lg tracking-widest font-bold'>{data["Tue"].Date}</div>
          <div className='text-lg tracking-widest font-extrabold'>
            {data["Tue"].Ch.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
          <div className='text-lg tracking-widest font-bold'>
            {data["Tue"].En.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
        </div>

        {/* Wednesday */}
        <div className='basis-1/5 flex flex-col gap-y-4 border-l-2'>
          <div className='text-lg tracking-widest font-extrabold'>Wednesday 星期三</div>
          <div className='text-lg tracking-widest font-bold'>{data["Wed"].Date}</div>
          <div className='text-lg tracking-widest font-extrabold'>
            {data["Wed"].Ch.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
          <div className='text-lg tracking-widest font-bold'>
            {data["Wed"].En.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
        </div>

        {/* Thursday */}
        <div className='basis-1/5 flex flex-col gap-y-4 border-l-2'>
          <div className='text-lg tracking-widest font-extrabold'>Thursday 星期四</div>
          <div className='text-lg tracking-widest font-bold'>{data["Thu"].Date}</div>
          <div className='text-lg tracking-widest font-extrabold'>
            {data["Thu"].Ch.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
          <div className='text-lg tracking-widest font-bold'>
            {data["Thu"].En.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
        </div>

        {/* Friday */}
        <div className='basis-1/5 flex flex-col gap-y-4 border-l-2'>
          <div className='text-lg tracking-widest font-extrabold'>Friday 星期五</div>
          <div className='text-lg tracking-widest font-bold'>{data["Fri"].Date}</div>
          <div className='text-lg tracking-widest font-extrabold'>
            {data["Fri"].Ch.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
          <div className='text-lg tracking-widest font-bold'>
            {data["Fri"].En.map((item, index) => (
              <div key={index}>•{item}</div>
            ))}
          </div>
        </div>

      </div>
  )
}

export default Edit