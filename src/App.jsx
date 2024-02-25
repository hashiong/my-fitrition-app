import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Menu from './pages/Menu';
import Footer from './components/Footer';
import Announcement from './components/Announcement';


function App() {
  return (
    <BrowserRouter>
      <Header />
      {/* <Announcement /> */}
      <Menu />
      <br></br>
      <Footer />
      {/* <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Routes>
      <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
