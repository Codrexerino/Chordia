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
    .attr("width", "100%") 
    .attr("height", "100%")
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
    const treeLayout = d3.tree().size([width, height]).separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);
  
    // After setting up the tree layout
treeLayout(root);

// Calculate bounds and determine scale
let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
root.each(d => {
  if (d.x < minX) minX = d.x;
  if (d.x > maxX) maxX = d.x;
  if (d.y < minY) minY = d.y;
  if (d.y > maxY) maxY = d.y;
});

// Padding to not clip the tree edges
const margin = 20;
// Compute the scale factor based on the size of the tree and the SVG container
const scaleX = (width - margin * 2) / (maxX - minX);
const scaleY = (height - margin * 2) / (maxY - minY);
const scale = Math.min(scaleX, scaleY, 1);

// Compute the translation
const centerX = (minX + maxX) / 2;
const centerY = maxY;
const translateX = width / 2 - centerX * scale;
const translateY = height - margin - centerY * scale; // Push the tree up from the bottom by the scale-adjusted amount

// Apply the scaling and translation to center the tree
svg.attr('transform', `translate(${translateX},${translateY}) scale(${scale})`);




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

  return <svg ref={svgRef} style={{ margin: "0 auto", top: 0, left: 0 }}></svg>;
}

export default TreeVisualization;
