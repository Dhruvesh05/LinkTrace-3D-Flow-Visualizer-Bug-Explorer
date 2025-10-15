"use client";
import React from "react";
import styles from "./page.module.css";
import { FaCode, FaBullhorn, FaChartLine } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const services = [
    {
      title: "Software Development",
      icon: <FaCode />,
      desc: "Custom web and mobile applications tailored to your business needs with scalable and secure solutions.",
      link: "/services/software-development",
    },
    {
      title: "Digital Marketing",
      icon: <FaBullhorn />,
      desc: "Boost your online presence with SEO, social media, and digital strategies that drive measurable growth.",
      link: "/services/digital-marketing",
    },
    {
      title: "Financial Services",
      icon: <FaChartLine />,
      desc: "Expert financial consulting to streamline operations, manage risks, and secure your company’s future.",
      link: "/services/financial-services",
    },
  ];

  return (
    <section id="services" className={styles.servicePage}>
      {/* Background */}
      <div className={styles.bgWrapper}>
        <img src="/HeroSection.svg" alt="Background" className={styles.bgImage} />
      </div>

      <div className={styles.contentWrapper}>
        {/* Logo */}
        <div className={styles.logo}>
          <img src="/Ayunextlogo.png" alt="Ayunext Logo" />
        </div>

        {/* Services Section */}
        <h2 className={styles.title}>Our Services</h2>
        <div className={styles.cards}>
          {services.map((service, index) => (
            <div
              key={index}
              className={styles.card}
              onClick={() => router.push(service.link)}
            >
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <div className={styles.icon}>{service.icon}</div>
              <p className={styles.description}>{service.desc}</p>

              {/* Circle arrow button */}
              <div className={styles.arrowWrapper}>
                <span className={styles.arrowButton}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
