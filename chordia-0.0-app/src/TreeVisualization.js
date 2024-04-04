import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './TreeVisualization.css';
import { TreeData_H, TreeData_C } from './TreeData.js';

function TreeVisualization() {
  const svgRef = useRef();

  useEffect(() => {

    // Define margins
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    // definer bredde og høyde med marginer
    const width = 960 - margin.right - margin.left;
    const height = 600 - margin.top - margin.bottom;


    // Fjern eksisterende graf (hvis den finnes)
    d3.select(svgRef.current).selectAll("*").remove();


    // Create SVG element
    const svg = d3.select(svgRef.current)
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Definer grafen/hieraki
    const hierarchyRoot = d3.hierarchy(TreeData_H);

    // definer tree layout
    const treeLayout = d3.tree()
      .size([width, height]);
    treeLayout(hierarchyRoot);

    hierarchyRoot.descendants().forEach(node => {
      node.y = height - node.y - margin.bottom; // This will flip the tree

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
      .attr("d", linksGenerator);


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
    .attr("stroke", "#ff0000") // Example: Red color for distinction
    .attr("stroke-dasharray", "2,2"); // Example: Dashed line for visual differentiation



    }, []);

  return <svg ref={svgRef} className="tree-container"></svg>;
}

export default TreeVisualization;
