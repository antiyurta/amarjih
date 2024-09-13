import React from 'react';
import style from './loader.module.scss';

const Loader = () => {
  return (
    <div className="flex justify-center h-screen w-full bg-loadingBg absolute opacity-50 z-50">
      <div className={style.ldsellipsis}>
        {/* <div className="bg-[#177AD6]"></div>
        <div className="bg-[#F1583C]"></div>
        <div className="bg-[#177AD6]"></div>
        <div className="bg-[#177AD6]"></div> */}
      </div>
      {/* <img src={'../../assets/svgIcons/NewLogo.svg'} width="200px" /> */}
    </div>
  );
};

export default Loader;
