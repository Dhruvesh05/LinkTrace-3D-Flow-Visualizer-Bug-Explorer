'use client';
import React, { useEffect, useState } from "react";
import CodeGraphVisualizer from "./CodeGraphVisualizer";

export default function Visualizer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("graphData");
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse stored graphData", err);
    }
  }, []);

  if (!data) return <p>No graph to show</p>;

  // `data` should be the graphData object itself
  return <CodeGraphVisualizer graphData={data} isVisible={true} />;
}
