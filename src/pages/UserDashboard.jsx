import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import GetApp from '../components/GetApp/GetApp'
import UnlockDeals from '../components/UnlockDeals/UnlockDeals'
import Dashboard from '../components/Dashboard/Dashboard'
import AssetsLoader from '../components/Dashboard/AssetsLoader'

function UserDashboard() {
    return (
        <>
           <Navbar/>
           <Dashboard/>
           <AssetsLoader/>
           {/* <GetApp/> */}
           <UnlockDeals/>
        </>
    )
}

export default UserDashboard
