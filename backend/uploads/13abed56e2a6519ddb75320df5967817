"use client";
import React from "react";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        {/* Heading */}
        <h2 className={styles.heading}>Book a Call</h2>

        <div className={styles.formWrapper}>
          {/* Green Banner */}
          <div className={styles.banner}>
            <h3 className={styles.bannerTitle}>Let’s Get In Touch</h3>
            <p className={styles.bannerText}>
              Your next big step starts here. Let’s build the technology and
              strategies to help your business grow.
            </p>
            <button className={styles.bannerButton}>Get Advice</button>
          </div>

          {/* Contact Form */}
          <form className={styles.form}>
            <div className={styles.row}>
              <input
                type="text"
                placeholder="Full Name"
                required
                className={styles.formInput}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className={styles.formInput}
              />
              <input
                type="text"
                placeholder="Phone No."
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.row}>
              <select required className={styles.formSelect}>
                <option value="">Service Interest</option>
                <option value="software">Software Development</option>
                <option value="marketing">Digital Marketing</option>
                <option value="finance">Financial Services</option>
              </select>
              <input
                type="text"
                placeholder="Address"
                className={styles.formInput}
              />
              <input
                type="text"
                placeholder="Company Name"
                className={styles.formInput}
              />
            </div>

            <textarea
              placeholder="Message....."
              rows={5}
              className={styles.formTextarea}
            ></textarea>

            <div className={styles.checkboxRow}>
              <input type="checkbox" id="newsletter" />
              <label htmlFor="newsletter">Newsletter Signup</label>
            </div>

            <button type="submit" className={styles.submitButton}>
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
