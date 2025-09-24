'use client';
import React, { useEffect, useState } from "react";
import GraphVisualizer from "./GraphVisualizer";

export default function Visualizer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("graphData");
    if (stored) setData(JSON.parse(stored).graphData);
  }, []);

  if (!data) return <p>No graph to show</p>;

  return <GraphVisualizer graphData={data} />;
}
