import React, { useEffect, useRef } from 'react'
import { bannerHomeStyles } from '../assets/dummyStyles'
import  video from '../assets/bannervideo.mp4'
import Navbar from './Navbar'
import BL1 from '../assets/BL1.png';
import BM1 from '../assets/BM1.png';
import BR1 from '../assets/BR1.png';

const BannerHome = () => {
  const videoRef = useRef(null);
  useEffect(()=>{
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduceMotion&&videoRef.current){
      videoRef.current.pause();
      videoRef.current.removeAttribute("autoplay");
    }
  },[])
  return (
    <div className={bannerHomeStyles.container}>
     <div className={bannerHomeStyles.navbarWrapper}>
     <Navbar/>
    </div>
    {/* bg video*/}  
    <div className={bannerHomeStyles.videoContainer}>
      <video ref={videoRef} className={bannerHomeStyles.video} autoPlay muted loop playsInline preload="metadata" poster="/fallback.jpg" role="presentation" >
      <source src={video} type="video/mp4" />
      </video>
      </div> 
      {/* content */}
      <div className={bannerHomeStyles.contentContainer}>
        <div className={bannerHomeStyles.h1Container}>
          <h1 
          style={bannerHomeStyles.playfairFont}
          className={bannerHomeStyles.h1Text}>
            <span className={bannerHomeStyles.h1SpanGray}>With every</span>
            <span className={bannerHomeStyles.h1SpanYellow}>tick and tock </span>&nbsp;
            <span className={bannerHomeStyles.h1SpanGray}>love only grows</span>

          </h1>
         <p className={bannerHomeStyles.subtext}>Experience a refined collection of expertly crafted watches that combine technical excellence with timeless design.</p>
        </div>
         {/*cards section */}
         <div className={bannerHomeStyles.cardsContainer}>
          <div className={bannerHomeStyles.grid}>
            <div className= {`${bannerHomeStyles.cardWrapper} ${bannerHomeStyles.leftCardTransform}`}>
              <div className={`${bannerHomeStyles.cardBase} ${bannerHomeStyles.cardPadding}`}>
                <img src={BL1} alt="left logo" className={` ${bannerHomeStyles.cardImage} ${bannerHomeStyles.leftCardImage}`}
                loading="lazy" />
              </div>
            <p className={` ${bannerHomeStyles.cardLabel} ${bannerHomeStyles.cardLabelGray}`}>Legacy</p>
            </div>

            <div className= {`${bannerHomeStyles.cardWrapper} ${bannerHomeStyles.middleCardTransform}`}>
              <div className={`${bannerHomeStyles.cardMiddle} ${bannerHomeStyles.cardPadding}`}>
                <img src={BM1} alt="middle logo" className={` ${bannerHomeStyles.cardImage} ${bannerHomeStyles.middleCardImage}`}
                loading="lazy" />
              </div>
            <p className={` ${bannerHomeStyles.cardLabel} ${bannerHomeStyles.cardLabelYellow}`}>Exclusive</p>
            </div>

            <div className= {`${bannerHomeStyles.cardWrapper} ${bannerHomeStyles.rightCardTransform}`}>
              <div className={`${bannerHomeStyles.cardBase} ${bannerHomeStyles.cardPadding}`}>
                <img src={BR1} alt="left logo" className={` ${bannerHomeStyles.cardImage} ${bannerHomeStyles.rightCardImage}`}
                loading="lazy" />
              </div>
            <p className={` ${bannerHomeStyles.cardLabel} ${bannerHomeStyles.cardLabelGray}`}>Accuracy</p>
            </div>

          </div>

         </div>
      </div>
    </div>
  )
}

export default BannerHome