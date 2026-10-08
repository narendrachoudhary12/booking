import React from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch/HeroSearch'
import Navbar from '../components/Navbar/Navbar';
import SuggestedDestinations from '../components/SuggestedDestinations/SuggestedDestinations';
import TopDeals from '../components/TopDeals/TopDeals';
import PopularCities from '../components/PopularCities/PopularCities';
import CityHotels from '../components/CityHotels/CityHotels';
import SecretDeals from '../components/SecretDeals/SecretDeals';
import HotelOwners from '../components/HotelOwners/HotelOwners';
import Press from '../components/Press/Press';
import GetApp from '../components/GetApp/GetApp';
import UnlockDeals from '../components/UnlockDeals/UnlockDeals';

function Home() {
    return (
        <>
          <Navbar/>
          {/* <HeroSearch/> */}
          <HeroSearch/>
          <SuggestedDestinations />
          <TopDeals/>
          <PopularCities/>
          <CityHotels/>
          <SecretDeals/>
          <HotelOwners/>
          {/* <Press/> */}
          <GetApp/>
          <UnlockDeals/>
        </>
    )
}

export default Home
