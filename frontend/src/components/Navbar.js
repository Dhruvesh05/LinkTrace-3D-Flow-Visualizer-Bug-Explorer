
'use client';
import Image from 'next/image';

export default function Navbar() {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav>
      <Image
        src="/logo.png"
        alt="LinkTrace Logo"
        className="nav-logo"
        width={44}
        height={44}
        onClick={handleLogoClick}
        priority
      />
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#upload">Upload</a>
        <a href="#about">About</a>
      </div>
    </nav>
  );
}
