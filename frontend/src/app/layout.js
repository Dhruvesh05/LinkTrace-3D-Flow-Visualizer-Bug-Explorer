import ScrollToTop from './scroll-to-top';
import UploadSection from '../components/UploadSection';
import AboutSection from '../components/About';
import Footer from '../components/footer';
import Navbar from '../components/Navbar';

import './globals.css';

export const metadata = {
  title: 'LinkTrace - Code Connectivity Visualizer',
  description: '3D visualization of project structure with bug tracking',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
          html { scroll-behavior: smooth; }
          nav { background: transparent; padding: 16px 32px; position: sticky; top: 0; z-index: 1000; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 8px 16px rgba(0,0,0,0.15); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.1); }
          .nav-logo { height: 50px; width: auto; cursor: pointer; transition: transform 0.3s ease; }
          .nav-logo:hover { transform: scale(1.05); }
          .nav-links { display: flex; gap: 24px; align-items: center; }
          nav a { color: black; text-decoration: none; font-weight: 500; font-family: "Inter", sans-serif; font-size: 1rem; position: relative; padding: 8px 14px; border-radius: 8px; transition: all 0.3s ease; }
          nav a:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
          section { padding: 80px 20px; min-height: 100vh; }
          @media (max-width: 768px) {
            nav { padding: 12px 20px; }
            .nav-logo { height: 40px; }
            .nav-links { gap: 16px; }
            nav a { font-size: 0.9rem; padding: 6px 10px; }
          }
          @media (max-width: 480px) {
            nav { padding: 10px 15px; }
            .nav-logo { height: 35px; }
            .nav-links { gap: 12px; }
            nav a { font-size: 0.85rem; padding: 5px 8px; }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif' }}>
        <ScrollToTop />
        <Navbar />

        <section id="home">{children}</section>
        <section id="upload"><UploadSection /></section>
        {/* <section id="visualizer">Visualizer Section</section>
        <section id="errors">Errors Section</section>
        <section id="explorer">Explorer Section</section>
        <section id="report">Report Section</section> */}
        <section id="about"><AboutSection /></section>
        <Footer />
      </body>
    </html>
  );
}
