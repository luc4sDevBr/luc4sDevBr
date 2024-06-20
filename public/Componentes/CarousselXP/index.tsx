import React from 'react';
import { Carousel } from 'antd';

const CarouselXP: React.FC = () => (
  <div className="flex flex-col items-center">
    <div className="w-10 max-w-2xl">
      <Carousel arrows infinite={false}>
        <div>
          <h3 className="m-0 w-10 h-40 text-white leading-40 text-center bg-blue-800">1</h3>
        </div>
        <div>
          <h3 className="m-0 h-40 text-white leading-40 text-center bg-blue-800">2</h3>
        </div>
        <div>
          <h3 className="m-0 h-40 text-white leading-40 text-center bg-blue-800">3</h3>
        </div>
        <div>
          <h3 className="m-0 h-40 text-white leading-40 text-center bg-blue-800">4</h3>
        </div>
      </Carousel>
      <br />
      <Carousel arrows dotPosition="left" infinite={false}>
        <div>
          <h3 className="m-0 h-40 text-white leading-40 text-center bg-blue-800">1</h3>
        </div>
        <div>
          <h3 className="m-0 h-40 text-white leading-40 text-center bg-blue-800">2</h3>
        </div>
        <div>
          <h3 className="m-0 h-40 text-white leading-40 text-center bg-blue-800">3</h3>
        </div>
        <div>
          <h3 className="m-0 h-40 text-white leading-40 text-center bg-blue-800">4</h3>
        </div>
      </Carousel>
    </div>
  </div>
);

export default CarouselXP;
