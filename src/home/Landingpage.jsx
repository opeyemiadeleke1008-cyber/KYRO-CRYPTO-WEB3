import React from 'react'
import Header from '../layout/Header'
import Hero from '../layout/Hero';
import About from '../layout/About';
import Footer from '../layout/Footer';
import Security from '../layout/Security';
import Faq from '../layout/Faq';
import Livemarket from '../layout/Livemarket';
import MobileNavbar from '../layout/MobileNavbar';

const Landingpage = () => (
  <div>
    <Header />
    <MobileNavbar />
    <Hero />
    <About />
    <Security />
    <Livemarket />
    <Faq />
    <Footer />
  </div>
)

export default Landingpage;
