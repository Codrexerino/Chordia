import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './TreeVisualization.css';
import { TreeData_H, TreeData_C } from './TreeData.js';

function TreeVisualization() {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // This useEffect replaces your existing dimension setting logic
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
        console.log('New width:', width, 'New height:', height); // Debug output
      }
    });
    if(svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }
    
    // Cleanup observer on component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);



  useEffect(() => {
    if (dimensions.width && dimensions.height) {
    // Define the margins inside the useEffect hook
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    
    console.log('width', width);
    console.log('height', height);


    
    // Now append the svg element to the ref and set up the viewBox
    const svg = d3.select(svgRef.current)
    .attr('viewBox', `0, 0, ${dimensions.width},${dimensions.height}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);



    // Definer grafen/hieraki
    const hierarchyRoot = d3.hierarchy(TreeData_H);

    // definer tree layout
    const treeLayout = d3.tree()
      .size([width, height]);
    treeLayout(hierarchyRoot);

    hierarchyRoot.descendants().forEach(node => {
      node.y = height - node.y - margin.bottom; // This will flip the tree

      // Update the x and y attributes of the nodes and links
      node.x += margin.left;
      node.y += margin.top;
    });

    // Definerer linker basert på hierakial verdier

    const linksGenerator = d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y);
    
    // tegner linker
    svg.selectAll(".link")
      .data(hierarchyRoot.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", linksGenerator); // Update the d attribute here


    // tegner noder
    const nodeGroups = svg.selectAll(".node")
      .data(hierarchyRoot.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);
    
    // tegner sirkler rundt nodene?  
    nodeGroups.append("circle")
      .attr("r", 10); // Set the radius as needed
    
    // tegner tekst i nodene
    nodeGroups.append("text")
      .attr("dy", "0.35em")
      .attr("x", d => d.children ? -15 : 15) // Position text left of parent nodes, right of leaf nodes
      .style("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name);


    // lager et kartover hvor nodene er lagd over er
    const nodesMap = new Map();
    hierarchyRoot.descendants().forEach(d => {
      nodesMap.set(d.data.name, d);
    });

    // Konverterer source og target til D3 nodene ifølge kartet
    const crossLinks = TreeData_C.map(link => ({
      source: nodesMap.get(link.source),
      target: nodesMap.get(link.target),
    }));
    

    // tegner linkene fra TreeData_C
    svg.selectAll(".cross-link")
    .data(crossLinks)
    .enter().append("path")
    .attr("class", "cross-link")
    .attr("d", d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y))
    .attr("fill", "none")
    .attr("stroke", "grey") // Example: Red color for distinction
    .attr("stroke-dasharray", "2,2")
    .attr("stroke-width", "2px"); // Example: Dashed line for visual differentiation

    // After the tree layout is computed
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    hierarchyRoot.each(node => {
      if (node.x < minX) minX = node.x;
      if (node.x > maxX) maxX = node.x;
      if (node.y < minY) minY = node.y;
      if (node.y > maxY) maxY = node.y;
    });
    }
  }, [dimensions]);

  return <svg ref={svgRef} className="tree-container" style={{ width: '100%', height: '100%' }} ></svg>
}

export default TreeVisualization;
