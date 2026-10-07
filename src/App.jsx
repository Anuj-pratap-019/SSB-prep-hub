import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import PPDT from './pages/PPDT';
import WAT from './pages/WAT';
import SRT from './pages/SRT';
import TAT from './pages/TAT';
import OIR from './pages/OIR';
import PIMock from './pages/PIMock';
import SD from './pages/SD';
import GTOGuide from './pages/GTOGuide';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-transparent text-[#e8e4d0] selection:bg-[#c8a84b] selection:text-[#12160a]">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Dedicated Test Pages & Hub */}
        <main className="flex-1 w-full pt-3 sm:pt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ppdt" element={<PPDT />} />
            <Route path="/oir" element={<OIR />} />
            <Route path="/wat" element={<WAT />} />
            <Route path="/srt" element={<SRT />} />
            <Route path="/tat" element={<TAT />} />
            <Route path="/sd" element={<SD />} />
            <Route path="/pi" element={<PIMock />} />
            <Route path="/gto" element={<GTOGuide />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
