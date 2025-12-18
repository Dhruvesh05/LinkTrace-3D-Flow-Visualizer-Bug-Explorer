'use client';


import { useState, useEffect } from 'react';
import Image from 'next/image';
import './footer.css';

function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Tech Stack', href: '#tech' },
    { name: 'Upload', href: '#upload' }
  ];

  const teamMembers = [
    'Ankit Khandelwal',
    'Dhruvesh Patil',
    'Palak Lokwani',
    'Deodatta Pagar'
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Logo Section */}
          <div className="footer-section logo-section">
            <div className="footer-logo">
              <Image src="/logo.png" alt="LinkTrace Logo" className="logo-image" width={80} height={80} priority />
            </div>
            <p className="footer-tagline">
              Visualize • Debug • Navigate
            </p>
          </div>

          {/* Navigation Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Navigation</h3>
            <ul className="footer-links">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Info Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Project</h3>
            <ul className="footer-links">
              <li><a href="#mission">Our Mission</a></li>
              <li><a href="#demo">Demo</a></li>
              <li><a href="#upload">Get Started</a></li>
            </ul>
          </div>

          {/* Team Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Made By</h3>
            <ul className="footer-team">
              {teamMembers.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Code Connectivity Visualizer. All rights reserved.
            </p>
            <p className="footer-subtitle">
              Built with passion for better code understanding
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
          <span className="arrow-up">↑</span>
        </button>
      )}
    </footer>
  );
}

export default Footer;
