'use client'
import React, { useState } from 'react';

function CarouselXP() {
  
  const [ArrowCarousel, setArrowCarousel] = useState(false);

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <div id="containerCentral" className="w-3/4 h-3/4 md:w-3/4 md:items-end md:h-3/4 bg-slate-700 rounded-md p-2 flex flex-col md:flex-row items-center">
          
        <p>O interruptor está {ArrowCarousel.toString()}</p>
      
      </div>
      <div className='w-3/4 h-auto bg-slate-600 flex justify-end gap-2'>
        <button 
           className='w-40 h-20 bg-slate-900'
          onClick={() => ArrowCarousel==false?setArrowCarousel(true):setArrowCarousel(false)}>
            Clique aqui
         </button>
         <button 
           className='w-40 h-20 bg-slate-900'
          onClick={() => ArrowCarousel==false?setArrowCarousel(true):setArrowCarousel(false)}>
            Clique aqui
         </button>
      </div>
    </div>
  );
}
export default CarouselXP;