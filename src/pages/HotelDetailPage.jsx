import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import HeroSearch from '../components/HeroSearch/HeroSearch'
import HotelDetail from '../components/HotelDetail/HotelDetail'
import GetApp from '../components/GetApp/GetApp'
import UnlockDeals from '../components/UnlockDeals/UnlockDeals'
import {  useParams } from 'react-router-dom';

function HotelDetailPage() {

  const { slug } = useParams();
  
  return (
    <>
      <Navbar/>
      <HeroSearch/>
      <HotelDetail slug={slug}/>
      <GetApp/>
      <UnlockDeals/>
    </>
  )
}

export default HotelDetailPage
