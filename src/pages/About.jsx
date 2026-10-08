import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import GetApp from '../components/GetApp/GetApp';
import UnlockDeals from '../components/UnlockDeals/UnlockDeals';
import HeaderHero from '../components/HeaderHero/HeaderHero';
import AboutUs from '../components/HeaderHero/AboutUs';

function About() {
    return (
        <>
           <Navbar/>
           <HeaderHero/>
           <AboutUs/>
           <GetApp/>
          <UnlockDeals/>
        </>
    )
}

export default About
