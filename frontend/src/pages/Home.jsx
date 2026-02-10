import React from 'react'
import BannerHome from '../components/BannerHome'
import CategoriesHome from '../components/CategoriesHome'
import ComingSoonWatchPage from '../components/ComingSoonWatchPage'
import { FashionPage } from '../components/FashionPage'
import TestimonialsPage from '../components/TestimonialsPage'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <BannerHome />
        <CategoriesHome />
        <ComingSoonWatchPage />
        <FashionPage />
        <TestimonialsPage />
        <Footer />
    </div>
  )
}

export default Home