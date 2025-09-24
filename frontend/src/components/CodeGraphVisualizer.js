    'use client';
import React, { useRef, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";

export default function CodeGraphVisualizer({ graphData }) {
  const fgRef = useRef();

  useEffect(() => {
    if (!graphData) return;
    // Spread nodes for better visualization
    fgRef.current.d3Force('charge').strength(-200);
  }, [graphData]);

  if (!graphData) return <p>No graph data to display</p>;

  return (
    <div style={{ height: "600px", width: "100%", marginTop: "2rem" }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="id"
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        nodeLabel={node => node.id}
        linkLabel={link => `${link.source} → ${link.target}`}
      />
    </div>
  );
}
