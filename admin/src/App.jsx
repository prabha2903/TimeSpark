import React from 'react'
import Add from './pages/Add.jsx'
import { Route, Routes } from 'react-router-dom';
import List from './pages/List.jsx';
import Booking from './pages/Booking.jsx';
const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Add/>} />
       <Route path="/list" element={<List/>} />
       <Route path="/booking" element={<Booking />} />

    </Routes>
    </>
  )
}

export default App