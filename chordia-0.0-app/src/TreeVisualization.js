import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './TreeVisualization.css';
import { TreeData_H, TreeData_C } from './TreeData.js';




function TreeVisualization() {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null); // velger node variabel
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showMoreActive, setShowMoreActive] = useState(false); // tilstand for Show More-modus
  const [originalPosition, setOriginalPosition] = useState({x: 0, y: 0});  // Opprinnelig posisjon for den valgte noden
  const [isTreeVisible, setIsTreeVisible] = useState(false);
  


  

  const drawTree = () => {
        //fjerner alle tidligere elementer  
        d3.select(svgRef.current).selectAll('*').remove();

        // Define the margins inside the useEffect hook
        const margin = { top: 20, right: 20, bottom: 20, left: 120 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;
    
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
        
    
         
        // tegner linker
        svg.selectAll(".link")
          .data(hierarchyRoot.links())
          .enter().append("path")
          .attr("class", "link")
          .attr('d', d => linksGenerator({ source: d.source, target: { x: d.source.x, y: d.source.y }})) // Start link at source node
          .attr("d", linksGenerator); // Update the d attribute here
    
    
        // tegner noder
        const nodeGroups = svg.selectAll(".node")
          .data(hierarchyRoot.descendants())
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", d => `translate(${d.x},${d.y})`)
          .on("click", handleNodeClick);
    
        // tegner sirkler rundt nodene?  
        nodeGroups.append("circle")
        .attr("r", (dimensions.width + dimensions.height) / 70) // Set the radius as needed
        .attr("class", "node-circle")
        
        
    
          
        // tegner tekst i nodene
        nodeGroups.append("text")
          .attr("dy", "0.35em")
          .attr("x", d => d.children ? 0 : 0) // Position text left of parent nodes, right of leaf nodes
          .style("text-anchor", "middle")
          .style("font-size", (dimensions.width + dimensions.height) / 100) // Set the font size as needed
          .text(d => d.data.name)
          .attr("class", "node-text")
    
    
    
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
    
        setTimeout(() => {
          setIsTreeVisible(true);
        }, 50);
  };

  // useEffect for å sette initielle dimensjoner og tegne treet ved oppstart
  useEffect(() => {
    const updateDimensions = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        if (!dimensions) { // Sett dimensjoner kun en gang ved initialisering
            setDimensions({ width, height });
        }
    };

    updateDimensions(); // Sett dimensjoner ved oppstart
    // Ikke legg til lytter her for vindusendring
}, []); // Tom avhengighetsliste for å kjøre kun ved første render


  useEffect(() => {
      drawTree();
  },[dimensions]);

  const handleResize = () => {
    // Hent nåværende dimensjoner fra viewport eller container
    const { width, height } = svgRef.current.getBoundingClientRect();
    setDimensions({ width, height });  // Oppdater dimensjonsstaten
};


// Highlight og inFocus logikk
const handleNodeClick = (event, d) => {  
  const currentCircle = d3.select(event.currentTarget).select('circle');
  const isAlreadyHighlighted = currentCircle.classed('highlighted');

  // Fjern utheving fra alle noder
  d3.selectAll('.node-circle')
    .classed('highlighted', false)

  if (isAlreadyHighlighted) {
      currentCircle
        .classed('inFocus', true);
      d3.selectAll('.node, .link, .cross-link').classed('hidden', true);

      d3.select(event.currentTarget).classed('hidden', false);

      setSelectedNode(d);
      setSelectedNodeKey(d.data.name);
  } else {
    currentCircle
    .classed('highlighted', true);
    d3.select('.node, .link, .cross-link').classed('hidden', false);
    setSelectedNode(d);
    setSelectedNodeKey(null);
  }
}; 


const handleBackClick = () => {
  // Remove all focus and highlighting
  d3.selectAll('.node-circle')
    .classed('inFocus', false);

  // Make all nodes visible again
  d3.selectAll('.node, .link, .cross-link')
    .classed('hidden', false);

  if (selectedNodeKey) {
    const nodeToHighlight = d3.selectAll('.node-circle').filter(function(d) {
      return d.data.name === selectedNodeKey;
    });
    nodeToHighlight
      .classed('highlighted', true);
  }


  setSelectedNode(null);
  setSelectedNodeKey(null);
};







  return (
  <div>
    <button onClick={handleResize}>Rescale Tree</button>
    <svg ref={svgRef} className={`tree-container ${isTreeVisible ? 'visible' : ''}`} width={dimensions.width} height={dimensions.height}></svg>
    <button className="back-button" onClick={handleBackClick}>Back</button>
    {selectedNode && (
      <div className={`node-info ${selectedNode ? 'visible' : ''}`}>
        <p>Name:{selectedNode.data.name}</p>
        <p>Description:{selectedNode.data.description}</p>
        {/*<button onClick={() => setSelectedNode(null)}>Close</button>*/}
      </div>
  )}
  <div id="link-info" className="hidden">
      <p id="link-text"></p>
    </div>
  </div>
  );
}

export default TreeVisualization