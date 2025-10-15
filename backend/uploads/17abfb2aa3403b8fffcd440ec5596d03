"use client";
import React from "react";
import styles from "./Services.module.css";
import { FaCode, FaBullhorn, FaChartLine } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Services() {
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
    <section id="services" className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Services</h2>
        <div className={styles.cards}>
          {services.map((service, index) => (
            <button
              key={index}
              className={styles.card}
              onClick={() => router.push(service.link)}
            >
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <div className={styles.icon}>{service.icon}</div>
              <p className={styles.description}>{service.desc}</p>
              <span className={styles.arrowButton}>→</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
