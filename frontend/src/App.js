import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { FlavourProvider } from "./context/FlavourContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import StickyMobileBar from "./components/StickyMobileBar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import StoryBehindYourKrunch from "./pages/StoryBehindYourKrunch";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <FlavourProvider>
      <CartProvider>
        <ScrollToTop />
        <Header />
        <main data-testid="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/story-behind-your-krunch" element={<StoryBehindYourKrunch />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <StickyMobileBar />
      </CartProvider>
    </FlavourProvider>
  );
}
