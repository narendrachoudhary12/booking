import React from 'react'
import {  useParams } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar'
import GetApp from '../components/GetApp/GetApp';
import UnlockDeals from '../components/UnlockDeals/UnlockDeals';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import HeroSearch from '../components/HeroSearch/HeroSearch'
import HotelListing from '../components/HotelListing/HotelListing';
import AboutFAQ from '../components/AboutFAQ/AboutFAQ';

function Hotels() {

    const { slug } = useParams(); // 👈 correct way

    

    return (
        <>
          <Navbar/>
          <HeroSearch/>
          <HotelListing slug={slug}/>
          <AboutFAQ slug={slug}/>
          <GetApp/>
          <UnlockDeals/>
        </>
    )
}

export default Hotels
