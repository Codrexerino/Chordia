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

    const svg = d3.select(svgRef.current)
    .attr('width', width)
    .attr('height', height)
    .append('g');

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




    // Create the hierarchical data structure and tree layout
    const root = d3.hierarchy(hierarchyData);
    const treeLayout = d3.tree().size([height - 200, (width / 2) - 100]); // Provide some padding
    // Assign the calculated positions to the nodes
    treeLayout(root);


    let minX = Infinity;
    let maxX = -Infinity;
    root.each(d => {
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x);
    });

    const scale = 0.5;
    const translateX = width / 2;
    const translateY = height - 100; // Space from the bottom of the SVG
    svg.attr('transform', `translate(${translateX}, ${translateY})`);



    // Draw the links (paths)
    svg.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => -d.y)); // Use vertical links and invert y position



    // Draw the nodes (groups)
    const node = svg.selectAll('.node')
    .data(root.descendants())
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x},${-d.y})`);

    // Draw rounded rectangles for each node
    node.append('rect')
    .attr('width', 120) // Width of the rectangle
    .attr('height', 40) // Height of the rectangle
    .attr('x', -60) // Position the rectangle center on the node center
    .attr('y', -20) // Position the rectangle center on the node center
    .attr('rx', 15) // Set the x-axis radius for rounded corners
    .attr('ry', 15) // Set the y-axis radius for rounded corners (optional)
    .attr('class', 'nodeRect');

    // Add labels to each node
    node.append('text')
    .attr('dy', 4) // Adjust to vertically center the text in the rectangle
    .attr('text-anchor', 'middle') // Center the text horizontally
    .text(d => d.data.name)
    .attr('class', 'nodeLabel');





  }, []);

  return <svg ref={svgRef} style={{ position: "absolute", top: 0, left: 0 }}></svg>;
}

export default TreeVisualization;
