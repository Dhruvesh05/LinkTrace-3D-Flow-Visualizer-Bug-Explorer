"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./ClientsSpeak.module.css";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  { quote: "Ayunext transformed our digital strategy completely!", name: "Alice Johnson", domain: "E-commerce" },
  { quote: "The team delivered beyond our expectations.", name: "Michael Smith", domain: "Finance" },
  { quote: "Innovative solutions that actually work.", name: "Sophie Lee", domain: "Healthcare" },
  { quote: "Professional, timely, and reliable.", name: "David Brown", domain: "Education" },
];

export default function ClientsSpeak() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const speed = 0.8; // pixels per frame
    let id: number;

    const loop = () => {
      if (!isPaused && scrollRef.current) {
        scrollRef.current.scrollLeft += speed;
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      id = requestAnimationFrame(loop);
    };

    id = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(id);
  }, [isPaused]);

  return (
    <section id="clients" className={styles.clientsSection}>
      <div className={styles.container}>
        <h1 className={styles.title}>Our Clients Speak</h1>
        <p className={styles.description}>
          At Ayunext, we believe our true success is measured by the trust and satisfaction of our clients.
          Every partnership is a journey, and these testimonials reflect how our solutions have helped
          businesses grow, innovate, and achieve long-term success.
        </p>

        {/* Carousel */}
        <div
          className={styles.carouselWrapper}
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={styles.carouselContent}>
            {testimonials.concat(testimonials).map((t, idx) => (
              <div key={idx} className={styles.card}>
                <FaQuoteLeft className={styles.symbol} />
                <p className={styles.quote}>{t.quote}</p>
                <h3 className={styles.name}>{t.name}</h3>
                <span className={styles.domain}>{t.domain}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
