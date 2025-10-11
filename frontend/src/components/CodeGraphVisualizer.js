'use client';
import React, { useRef, useEffect, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import ForceGraph2D from "react-force-graph-2d";
import "./CodeGraphVisualizer.css";

export default function CodeGraphVisualizer({ graphData, isVisible = true }) {
  const fg3DRef = useRef();
  const fg2DRef = useRef();
  const [is3DView, setIs3DView] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Node colors by file type
  const extColors = {
    js: "#22c55e",
    jsx: "#7c3aed",
    ts: "#0ea5e9",
    tsx: "#0d9488",
    py: "#facc15",
    cpp: "#ef4444",
    c: "#fb923c",
    java: "#eab308",
    html: "#f43f5e",
    css: "#3b82f6",
    json: "#a855f7",
    default: "#9ca3af",
  };

  const getNodeColor = node =>
    node?.id ? (extColors[node.id.split(".").pop().toLowerCase()] || extColors.default) : extColors.default;

  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Adjust camera & force layout
  useEffect(() => {
    if (!graphData) return;
    const fg = is3DView ? fg3DRef.current : fg2DRef.current;
    if (fg?.d3Force("charge")) fg.d3Force("charge").strength(-180);
    if (fg?.cameraPosition) fg.cameraPosition({ z: 200 }, 400);
  }, [graphData, is3DView]);

  // Node tooltip with imports & exports
  const renderNodeTooltip = node => {
    if (!node) return null;
    const connectedFiles = graphData.links
      .filter(l => l.source.id === node.id || l.target.id === node.id)
      .map(l => (l.source.id === node.id ? l.target.id : l.source.id))
      .slice(0, 5);

    return (
      <div className="tooltip-box" style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}>
        <h4>{node.id}</h4>
        <p><strong>Imports:</strong> {node.imports?.length ? node.imports.join(", ") : "None"}</p>
        <p><strong>Exports:</strong> {node.exports?.length ? node.exports.join(", ") : "None"}</p>
        <p><strong>Connected Files:</strong> {connectedFiles.length ? connectedFiles.join(", ") : "None"}</p>
      </div>
    );
  };

  return (
    <section className={`visualizer-section ${isVisible ? "show" : "hide"}`}>
      <div className="visualizer-header">
        <h2>Code Connectivity Visualization</h2>
        <button className="toggle-btn" onClick={() => setIs3DView(prev => !prev)}>
          Switch to {is3DView ? "2D" : "3D"} View
        </button>
      </div>

      <div className="visualizer-container">
        {is3DView ? (
          <ForceGraph3D
            ref={fg3DRef}
            graphData={graphData}
            backgroundColor="#000"
            nodeColor={getNodeColor}
            linkColor={() => "#fff"}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.12}
            onNodeHover={setHoveredNode}
            onLinkHover={setHoveredLink}
          />
        ) : (
          <ForceGraph2D
            ref={fg2DRef}
            graphData={graphData}
            backgroundColor="#000"
            nodeColor={getNodeColor}
            linkColor={() => "#fff"}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.12}
            onNodeHover={setHoveredNode}
            onLinkHover={setHoveredLink}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const radius = 6;
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = getNodeColor(node);
              ctx.fill();
              ctx.font = `${12 / globalScale}px Sans-Serif`;
              ctx.fillStyle = "#fff";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(node.id, node.x, node.y + 12);
            }}
          />
        )}

        {/* Tooltip */}
        {hoveredNode && renderNodeTooltip(hoveredNode)}
      </div>
    </section>
  );
}
