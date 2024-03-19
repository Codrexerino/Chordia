import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './TreeVisualization.css';

function TreeVisualization() {
  const svgRef = useRef();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const hierarchyData = {
        name: "Harmony",
        children: [
          {
            name: "Scales",
            children: [
              { name: "Major scale" }
            ]
          },
          {
            name: "Intervals",
            children: [
              { name: "Perfect Intervals" },
              { name: "Major and Minor Intervals" }
            ]
          },
          {
            name: "Chords",
            children: [
              { name: "Major Chords" },
              { name: "Minor Chords" }
            ]
          }
        ]
      };


    // Setup the SVG and group element transformations
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height})`); // Start the tree from the bottom center

    // Create the hierarchical data structure and tree layout
    const root = d3.hierarchy(hierarchyData);
    const treeLayout = d3.tree().size([width - 160, height - 200]); // Provide some padding

    // Assign the calculated positions to the nodes
    treeLayout(root);

    // Draw the links (paths)
    svg.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => -d.y)); // Use vertical links and invert y position

    // Draw the nodes (groups)
    svg.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${-d.y})`); // Invert y position

    // Draw circles for each node
    svg.selectAll('.node')
      .append('circle')
      .attr("r", 10)
      .attr("class", "nodeCircle");

    // Add labels to each node
    svg.selectAll('.node')
      .append('text')
      .attr("dy", ".35em")
      .attr("x", d => d.children && d.depth !== 0 ? -13 : 13) // Offset the text slightly based on whether it's a leaf or has children
      .attr("text-anchor", d => d.children && d.depth !== 0 ? "end" : "start")
      .text(d => d.data.name)


  }, []);

  return <svg ref={svgRef} style={{ position: "absolute", top: 0, left: 0 }}></svg>;
}

export default TreeVisualization;
