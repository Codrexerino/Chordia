// Highlight og inFocus logikk
const handleNodeClick = (event, d) => {
    //console.log("nodesMap inside handleNodeClick:", nodesMap.get(node.data.name));
  
    const currentNode = d3.select(event.currentTarget);  
    const currentCircle = d3.select(event.currentTarget).select('circle');
    const isCurrentlyHighlighted = currentCircle.classed('highlighted');
    const isCurrentlyFocused = currentCircle.classed('inFocus');
    
  
     // Fjern fokus og highlight fra alle noder, og skjul deres barn
     d3.selectAll('.node-circle').classed('highlighted', false);
     d3.selectAll('.node-circle').classed('inFocus', false);
     d3.selectAll('.node').each(function(d) {
       d3.select(this).selectAll('.node').classed('hidden', true);
     });
  
  
    if (isCurrentlyFocused) {
      // Node is currently focused and clicked again, remove focus
      toggleFocus(false, currentNode, d);
      d3.selectAll('.node-circle').classed('highlighted', false);
      d3.selectAll('.node').each(function(d) {
        d3.select(this).selectAll('.node').classed('hidden', true);
      });
      
      currentCircle.classed('highlighted', true);
      currentCircle.classed('inFocus', false);
      
    
        d.children.forEach(child => {
          const childNode = d3.select(`[id='${child.data.name}']`);
          childNode.classed('hidden', false);
          // Finn og vis linken mellom parent og child
          d3.selectAll('.link').filter(link => {
            return (link.source === d && link.target === child.data) || (link.source === child.data && link.target === d);
          }).classed('hidden', false);
        });
      
  
    } else if (isCurrentlyHighlighted) {
      // Node is highlighted and clicked, set focus
      toggleFocus(true, currentNode, d);
      currentCircle
      .classed('highlighted', false)
      .classed('inFocus', true);
      
  
    } else {
      // Node is not highlighted, set it as highlighted
      d3.selectAll('.node-circle')
        .classed('highlighted', false)
        .classed('inFocus', false);
      currentCircle.classed('highlighted', true);
      d.children && d.children.forEach(child => {
        d3.select(`[id='${child.data.name}']`).classed('hidden', false);
      });
    }
  };
      
  
  function toggleFocus(shouldFocus, currentNode, node, d) {
    setIsInFocus(shouldFocus);
    if (shouldFocus) {
      // Set focus on the node
      displayFocus(currentNode, node, d);
    } else {
      // Remove focus from the node
      hideFocus(currentNode, node, d);
    }
  }
  
  
  
  function displayFocus(currentNode, node, d) {
    setSelectedNode(node);
    setSelectedNodeKey(node.data.name);
  
  
  
    const infoContainer = d3.select('#node-info-container');
    infoContainer.html('')
      .append('div')
      .attr('class', 'node-info visible')
      .html(`<strong>Name:</strong> ${node.data.name}<br><strong>Description:</strong> ${node.data.description}`);
  
    d3.selectAll('.node, .link, .cross-link').classed('hidden', true);
  
  
    currentNode.classed('hidden', false)
      .classed('inFocus', true)
      .transition()
      .duration(500)
      .attr("transform", "translate(100, 100)"); // Adjust node position for focus
  }
  
  
  function hideFocus(currentNode, d) {
    const originalPosition = nodePositions[d.data.name];
    
    currentNode.transition()
      .duration(500)
      .attr("transform", `translate(${originalPosition.x},${originalPosition.y})`);
      
    d3.selectAll('.node-circle').classed('inFocus', false);    
    d3.selectAll('.node, .link, .cross-link').classed('hidden', false)
    
  
    // Clear any node-specific information display
    const infoContainer = d3.select('#node-info-container');
    infoContainer.html('');
  
    // Update the state to reflect that no node is in focus
    //setSelectedNode(null);
    //setSelectedNodeKey(null);
  
    currentNode.select('.node-circle').classed('highlighted', true);
    // Set the node as 'highlighted' to indicate it's the previously focused node
  
  }