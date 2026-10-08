import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import GetApp from '../components/GetApp/GetApp'
import UnlockDeals from '../components/UnlockDeals/UnlockDeals'
import AddHotel from '../components/addHotel/AddHotel'

function NewHotel() {
    return (
        <>
           <Navbar/>
           <Breadcrumb/>
            <AddHotel/>
           <GetApp/>
          <UnlockDeals/>
        </>
    )
}

export default NewHotel
