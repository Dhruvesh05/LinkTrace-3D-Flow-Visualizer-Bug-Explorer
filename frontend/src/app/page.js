"use client";
import "./page.css";

export default function Home() {
  return (
    <main className="home-container">
      {/* Background bubbles */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="home-content">
        <div className="fade-in">
          <h1 className="title">
            Code Connectivity <span className="title" style={{ display: 'block' }}>Visualizer</span>
          </h1>
        </div>

        <div className="fade-in delay-1">
          <p className="description">
            Discover the gentle flow of your project’s dependencies through
            <br className="hide-on-mobile" />
            beautiful, intuitive 3D visualizations
          </p>
        </div>

        <div className="fade-in delay-2">
          <a href="#upload">
            <button className="start-button">
              <span className="button-content">
                <span className="sparkle"></span>
                Begin Your Journey
              </span>
            </button>
          </a>
        </div>

        <div className="fade-in delay-3">
          <div className="features">
            <div className="feature blue">Intuitive Navigation</div>
            <div className="feature indigo">Calming Visuals</div>
            <div className="feature slate">Mindful Analysis</div>
          </div>
        </div>
      </div>
    </main>
  );
}
