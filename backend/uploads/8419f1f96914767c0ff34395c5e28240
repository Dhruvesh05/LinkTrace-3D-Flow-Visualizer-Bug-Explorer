"use client";
import React from "react";
import styles from "./Blogs.module.css";

const blogs = [
  {
    id: 1,
    title: "How Cross-Platform Apps Are Changing the Customer Experience",
    date: "23-08-2025",
    author: "Ayunext",
    excerpt:
      "Discover how businesses are engaging customers anywhere, anytime with seamless apps that deliver speed, reliability, and consistent performance.",
    tags: ["Software", "Finance"],
    image: "/blogs/cross-platform.png",
    big: true,
  },
  {
    id: 2,
    title: "5 Emerging Tech Trends Every Business Should Watch",
    date: "23-08-2025",
    author: "Ayunext",
    excerpt:
      "From AI to automation, here are the technologies reshaping industries and creating new opportunities for growth in 2025.",
    tags: ["Software"],
    image: "/blogs/tech-trends.png",
  },
  {
    id: 3,
    title: "Data-Driven Marketing: Turning Analytics into Action",
    date: "23-08-2025",
    author: "Ayunext",
    excerpt:
      "See how advanced analytics helps businesses understand customers better and drive smarter campaigns that actually convert.",
    tags: ["Marketing", "Software"],
    image: "/blogs/marketing.png",
  },
  {
    id: 4,
    title: "FinTech Innovations That Are Reshaping the Industry",
    date: "23-08-2025",
    author: "Ayunext",
    excerpt:
      "Stay ahead with insights into the latest financial technologies driving efficiency, security, and smarter decision-making.",
    tags: ["Finance"],
    image: "/blogs/fintech.png",
  },
];

export default function Blogs() {
  return (
    <section className={styles.section} id="blogs">
      <div className={styles.container}>
        <h2 className={styles.heading}>Blogs & Insights</h2>
        <p className={styles.description}>
          At Ayunext, we believe our true success is measured by the trust and satisfaction of our clients.
          Every partnership is a journey, and these testimonials reflect how our solutions have helped
          businesses grow, innovate, and achieve long-term success.
        </p>

        <div className={styles.grid}>
          {/* Left big card */}
          <div className={styles.bigCard}>
            {blogs
              .filter((b) => b.big)
              .map((blog) => (
                <div key={blog.id} className={styles.card}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className={styles.image}
                  />
                  <div className={styles.cardContent}>
                    <p className={styles.meta}>
                      {blog.author} | {blog.date}
                    </p>
                    <h3 className={styles.title}>{blog.title}</h3>
                    <p className={styles.excerpt}>{blog.excerpt}</p>
                    <div className={styles.tags}>
                      {blog.tags.map((tag, i) => (
                        <span key={i} className={`${styles.tag} ${styles[tag.toLowerCase()]}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Right stacked cards */}
          <div className={styles.smallCards}>
            {blogs
              .filter((b) => !b.big)
              .map((blog) => (
                <div key={blog.id} className={styles.card}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className={styles.image}
                  />
                  <div className={styles.cardContent}>
                    <p className={styles.meta}>
                      {blog.author} | {blog.date}
                    </p>
                    <h3 className={styles.title}>{blog.title}</h3>
                    <p className={styles.excerpt}>{blog.excerpt}</p>
                    <div className={styles.tags}>
                      {blog.tags.map((tag, i) => (
                        <span key={i} className={`${styles.tag} ${styles[tag.toLowerCase()]}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
