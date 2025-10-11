import ScrollToTop from './scroll-to-top';
import UploadSection from '../components/UploadSection';
import AboutSection from '../components/About';

import './globals.css';

export const metadata = {
  title: 'Code Connectivity Visualizer',
  description: '3D visualization of project structure with bug tracking',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
          html { scroll-behavior: smooth; }
          nav { background: transparent; padding: 16px 32px; position: sticky; top: 0; z-index: 1000; display: flex; justify-content: center; align-items: center; gap: 24px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.1); }
          nav a { color: black; text-decoration: none; font-weight: 500; font-family: "Inter", sans-serif; font-size: 1rem; position: relative; padding: 8px 14px; border-radius: 8px; transition: all 0.3s ease; }
          nav a:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
          section { padding: 80px 20px; min-height: 100vh; }
        `}</style>
      </head>
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif' }}>
        <ScrollToTop />
        <nav>
          <a href="#home">Home</a>
          <a href="#upload">Upload</a>
          {/* <a href="/visualizer">Visualizer</a>
          <a href="#errors">Errors</a>
          <a href="#report">Report</a> */}
          <a href="#about">About</a>
          {/* <a href="#explorer">Join Us</a> */}
        </nav>

        <section id="home">{children}</section>
        <section id="upload"><UploadSection /></section>
        {/* <section id="visualizer">Visualizer Section</section>
        <section id="errors">Errors Section</section>
        <section id="explorer">Explorer Section</section>
        <section id="report">Report Section</section> */}
        <section id="about"><AboutSection /></section>
      </body>
    </html>
  );
}
