"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

// ✅ Corrected imports after moving files
// import Services from "./services";
import AboutUs from "./knowUs/AboutUs";
// import Approach from "./approach/Approach";
import ClientsSpeak from "./clients/ClientsSpeak";
import FeaturedClients from "./featuredclients/FeaturedClients";
import Blogs from "./blog/Blogs";
import Contact from "./contact/Contact";
import Footer from "./footer/Footer";

export default function SoftwareDevelopment() {
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLLIElement>(null);
  const router = useRouter();

  const services = [
    {
      title: "Web Development",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel elit ut turpis auctor vehicula.",
    },
    {
      title: "Mobile Applications",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel elit ut turpis auctor vehicula.",
    },
    {
      title: "UI/UX Design",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel elit ut turpis auctor vehicula.",
    },
    {
      title: "Cloud Solutions",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel elit ut turpis auctor vehicula.",
    },
    {
      title: "Maintenance & Support",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel elit ut turpis auctor vehicula.",
    },
  ];

  // navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleBox = (index: number) => {
    setActiveBox(activeBox === index ? null : index);
  };

  // smooth scroll helper
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <a href="#hero" onClick={(e) => handleSmoothScroll(e, "hero")}>
              <img src="/Ayunextlogo.png" alt="Ayunext Logo" />
            </a>
          </div>

          {/* Nav Menu */}
          <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
            <li>
              <a
                href="#hero"
                className="nav-link"
                onClick={(e) => handleSmoothScroll(e, "hero")}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="nav-link"
                onClick={(e) => handleSmoothScroll(e, "about")}
              >
                About Us
              </a>
            </li>

            {/* Services + Dropdown */}
            <li className="services-nav" ref={dropdownRef}>
              <a className="nav-link">
              <button
                className="dropdown-arrow"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Services ▼
              </button>
              </a>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <a
                    href="/services/software-development"
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/services/software-development");
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Software Development
                  </a>
                  <a
                    href="/services/digital-marketing"
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/services/digital-marketing");
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Digital Marketing
                  </a>
                  <a
                    href="/services/financial-services"
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/services/financial-services");
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Financial Services
                  </a>
                </div>
              )}
            </li>

            <li>
              <a
                href="#clients"
                className="nav-link"
                onClick={(e) => handleSmoothScroll(e, "clients")}
              >
                Resources
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="nav-link"
                onClick={(e) => handleSmoothScroll(e, "contact")}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Hamburger */}
          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* ================= SERVICES ================= */}
      <section id="services" className="servicePage">
        <div className="titleWrapper">
          <h1 className="serviceTitle">Digital Marketing</h1>
        </div>

        <div className="serviceGrid">
          {services.map((service, index) => (
            <div
              key={index}
              className={`serviceBox ${activeBox === index ? "active" : ""}`}
              onClick={() => toggleBox(index)}
            >
              <h2 className="boxTitle">{service.title}</h2>
              {activeBox === index && <p className="boxDesc">{service.desc}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ================= OTHER SECTIONS ================= */}
      <AboutUs />
      {/* <Approach /> */}
      <ClientsSpeak />
      <FeaturedClients />
      <Blogs />
      <Contact />
      <Footer />
    </>
  );
}
