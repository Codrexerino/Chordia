import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './TreeVisualization.css';
import { TreeData_H, TreeData_C } from './TreeData.js';

function TreeVisualization() {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null); // velger node variabel
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isFiltered, setIsFiltered] = useState(false); //Tilstand for å vite om noder skal være synlige eller usynlige
  const [inFocus, setInFocus] = useState(null); // Tilstand for noden som skal være synlig i fokus

  const handleShowMoreClick = () => {
    setIsFiltered(current => !current); // Toggler filtreringstilstanden
  if (!isFiltered && selectedNode) {
    setInFocus(selectedNode); // Setter valgt node i fokus hvis filtrering ikke allerede er aktiv.
  } else {
    setInFocus(null); // Fjerner fokus fra alle noder når filtrering deaktiveres.
  }
};




  // This useEffect replaces your existing dimension setting logic
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        //console.log('New width:', width, 'New height:', height); // Debug output
        setDimensions({ width, height });
      }
    });
    if(svgRef.current) {
      observer.observe(svgRef.current);
    }
    
    // Cleanup observer on component unmount
    return () => {
      if (observer) observer.disconnect();
    };



    
  }, []);



  useEffect(() => {
    console.log("isFiltered has changed", isFiltered);
    if (dimensions.width && dimensions.height) {

    //fjerner alle tidligere elementer  
    d3.select(svgRef.current).selectAll('*').remove();

    // Define the margins inside the useEffect hook
    const margin = { top: 20, right: 20, bottom: 20, left: 120 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    
    // console.log('width', width);
    // console.log('height', height);


    
    // Now append the svg element to the ref and set up the viewBox
    const svg = d3.select(svgRef.current)
    .attr('viewBox', `0, 0, ${dimensions.width},${dimensions.height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', 'translate(0,0)');
    



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
    
    // Oppdaterer nodene basert på inFocus og isFiltered tilstandene.
    svg.selectAll(".node").each(function(d) {
      const node = d3.select(this);
      node.classed("hidden", isFiltered && selectedNode !== d); // Skjuler noder som ikke er valgt.
      node.classed("inFocus", selectedNode === d); // Markerer den valgte noden som inFocus.
    });


     
    // tegner linker
    svg.selectAll(".link")
      .data(hierarchyRoot.links())
      .enter().append("path")
      .attr("class", "link")
      .attr('d', d => linksGenerator({ source: d.source, target: { x: d.source.x, y: d.source.y }})) // Start link at source node
      .transition()
      .duration(750)
      .attr("d", linksGenerator); // Update the d attribute here


    // tegner noder
    const nodeGroups = svg.selectAll(".node")
      .data(hierarchyRoot.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .on("click", handleNodeClick);

    nodeGroups.each(function(d) {
      const node = d3.select(this);
      const isHighlighted = node.select('circle').classed('highlighted');
      node.classed("hidden", isFiltered && !isHighlighted);
      node.classed("inFocus", d === selectedNode);
    });  
    
    // Click event handler
    const handleNodeClick = (event, d) => {
      
    // Fjern utheving fra alle noder
    d3.selectAll('.node-circle')
      .classed('highlighted', false)
      .attr('stroke', null)
      .attr('stroke-width', null);
  
    // Uthev den valgte noden
    d3.select(event.currentTarget)
    .select('circle')
    .classed("highlighted", true)

    //')
    
     // Oppdater tilstanden for å vise informasjon om den valgte noden
     setSelectedNode(d);
    };  

     // Apply the click event handler
     nodeGroups.on("click", handleNodeClick);
    
    // tegner sirkler rundt nodene?  
    nodeGroups.append("circle")
    .attr("r", (dimensions.width + dimensions.height) / 70) // Set the radius as needed
    .attr("class", "node-circle")
    .classed("highlighted", d => d === selectedNode)
    .transition()
    .duration(750);     

      
    // tegner tekst i nodene
    nodeGroups.append("text")
      .attr("dy", "0.35em")
      .attr("x", d => d.children ? 0 : 0) // Position text left of parent nodes, right of leaf nodes
      .style("text-anchor", "middle")
      .style("font-size", (dimensions.width + dimensions.height) / 100) // Set the font size as needed
      .style("fill-opacity", 0)
      .transition()
      .duration(750)
      .style("fill-opacity", 1)
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
      .on("mouseover", function(event, d) {

    // Vis informasjonsboks med informasjon fra linken
    d3.select("#link-info")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px")
          .select("#link-text")
          .text(d.description); // Anta at hver link har en 'description' eiendom
    
        d3.select("#link-info").classed("hidden", false);
      })
      .on("mouseout", function() {
        // Skjul informasjonsboksen
        d3.select("#link-info").classed("hidden", true);  
      });    


      d3.selectAll(".node")
      .classed("inFocus", node => inFocus && node === inFocus)
      .classed('hidden', node => isFiltered && node !== inFocus);

    // After the tree layout is computed
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    hierarchyRoot.each(node => {
      if (node.x < minX) minX = node.x;
      if (node.x > maxX) maxX = node.x;
      if (node.y < minY) minY = node.y;
      if (node.y > maxY) maxY = node.y;
    });
    
    // Code from line 75-90
    const xOffset = (maxX - minX) / 2;
    const yOffset = (maxY - minY) / 2;

    }
  }, [dimensions, selectedNode, isFiltered, inFocus]);

  return (
  <div>
    <svg ref={svgRef} className="tree-container" width={dimensions.width} height={dimensions.height}></svg>
    {selectedNode && (
      <div className={`node-info ${selectedNode ? 'visible' : ''}`}>
        <p>Name:{selectedNode.data.name}</p>
        <p>Description:{selectedNode.data.description}</p>
        <button onClick={() => setSelectedNode(null)}>Close</button>
        <button onClick={handleShowMoreClick}>Show more</button>
      </div>
  )}
  <div id="link-info" className="hidden">
      <p id="link-text"></p>
    </div>
  </div>
  );
}

export default TreeVisualization;
