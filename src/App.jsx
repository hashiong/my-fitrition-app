import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Menu from './pages/Menu';
import Footer from './components/Footer';
// import HomePage from './pages/HomePage';
// import AboutPage from './pages/AboutPage';
// import ContactPage from './pages/ContactPage';
// import Header from './components/Header'; // If you have a header component
// import Footer from './components/Footer'; // If you have a footer component

function App() {
  return (
    <BrowserRouter>
      <Header />
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
