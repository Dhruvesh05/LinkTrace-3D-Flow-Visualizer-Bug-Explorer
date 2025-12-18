'use client';

export default function Navbar() {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav>
      <img 
        src="/logo.png" 
        alt="LinkTrace Logo" 
        className="nav-logo" 
        onClick={handleLogoClick}
      />
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#upload">Upload</a>
        <a href="#about">About</a>
      </div>
    </nav>
  );
}
