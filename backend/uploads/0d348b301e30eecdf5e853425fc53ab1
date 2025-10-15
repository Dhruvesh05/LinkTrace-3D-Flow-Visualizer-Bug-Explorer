"use client";
import React from "react";
import styles from "./FeaturedClients.module.css";

const clients = [
  { name: "IBM", logo: "/logos/ibm.svg" },
  { name: "Amazon", logo: "/logos/amazon.svg" },
  { name: "Cisco", logo: "/logos/cisco.svg" },
  { name: "Sony", logo: "/logos/sony.svg" },
  { name: "Visa", logo: "/logos/visa.svg" },
  { name: "Hitachi", logo: "/logos/hitachi.svg" },
  { name: "GE", logo: "/logos/ge.svg" },
  { name: "Verizon", logo: "/logos/verizon.svg" },
];

export default function FeaturedClients() {
  return (
    <section id="featured-clients" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Featured Clients</h2>

        <div className={styles.arcWrapper}>
          {clients.map((client, index) => (
            <div key={index} className={styles.card}>
              <img src={client.logo} alt={client.name} className={styles.logo} />
              <p className={styles.name}>{client.name}</p>
            </div>
          ))}
        </div>

        <div className={styles.textBlock}>
          <h3 className={styles.subtitle}>Businesses Who Grow with Us</h3>
          <p className={styles.description}>
            We’ve helped 100+ businesses across industries achieve growth,
            efficiency, and financial success.
          </p>
        </div>
      </div>
    </section>
  );
}
