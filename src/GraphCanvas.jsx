import React, { useRef, useEffect, useState } from 'react';

const GraphCanvas = ({ 
  nodes = [], 
  edges = [], 
  onNodeClick = () => {},
  onEdgeClick = () => {},
  onAddNode = () => {},
  onAddEdge = () => {},
  onNodePositionChange = () => {},
  selectedNode = null,
  articulationPoints = [],
  flashingNodes = [],
  traversalNodes = [],
  mode = 'select',
  isDirected = false
}) => {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [edgeStart, setEdgeStart] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Drawing function
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    if (!container) return;

    // Get the actual display size of the canvas
    const displayWidth = container.clientWidth;
    const displayHeight = container.clientHeight;
    
    // Set the canvas size to match the display size
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges first (so they appear behind nodes)
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      // Adjust start and end points to be on the edge of the node circles
      const sourceX = sourceNode.x + Math.cos(angle) * 15;
      const sourceY = sourceNode.y + Math.sin(angle) * 15;
      const targetX = targetNode.x - Math.cos(angle) * 15;
      const targetY = targetNode.y - Math.sin(angle) * 15;

      // Draw edge line
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(targetX, targetY);
      
      // Style edge based on state
      if (hoveredEdge === edge.id) {
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 4;
      } else if (traversalNodes.includes(edge.source) && traversalNodes.includes(edge.target)) {
        ctx.strokeStyle = '#10B981'; // Green for traversed edges
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#6B7280';
        ctx.lineWidth = 2;
      }
      
      ctx.stroke();

      // Draw arrowhead for directed edges
      if (isDirected) {
        const arrowSize = 10;
        const arrowX = targetX - Math.cos(angle) * 10;
        const arrowY = targetY - Math.sin(angle) * 10;
        
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowSize, -arrowSize/2);
        ctx.lineTo(-arrowSize, arrowSize/2);
        ctx.closePath();
        ctx.fillStyle = hoveredEdge === edge.id ? '#FF6B6B' : 
                        (traversalNodes.includes(edge.source) && traversalNodes.includes(edge.target)) ? '#10B981' : '#6B7280';
        ctx.fill();
        
        ctx.restore();
      }
    });

    // Draw nodes on top of edges
    nodes.forEach(node => {
      const isArticulation = articulationPoints.includes(node.id);
      const isFlashing = flashingNodes.includes(node.id);
      const isTraversal = traversalNodes.includes(node.id);
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode === node.id;

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
      
      // Node fill color
      if (isFlashing) {
        ctx.fillStyle = '#F59E0B'; // Amber for flashing
      } else if (isTraversal) {
        ctx.fillStyle = '#10B981'; // Green for traversal
      } else {
        ctx.fillStyle = node.color || '#3B82F6'; // Use node's connected component color
      }
      
      // Node border - red for articulation points
      if (isArticulation) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#EF4444'; // Red outline for articulation points
      } else if (isSelected) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#1D4ED8';
      } else if (isHovered) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#4F46E5';
      } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#1F2937';
      }
      
      ctx.fill();
      ctx.stroke();

      // Draw red dot on articulation points
      if (isArticulation) {
        ctx.beginPath();
        ctx.arc(node.x + 10, node.y - 10, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(node.id, node.x, node.y);
    });
  };

  // Handle mouse down on a node
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a node
    for (const node of nodes) {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (distance < 25) {
        setDraggedNode(node.id);
        setDragOffset({
          x: x - node.x,
          y: y - node.y
        });
        return;
      }
    }
  };

  // Handle mouse movement
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle dragging
    if (draggedNode !== null) {
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;
      onNodePositionChange(draggedNode, newX, newY);
      return;
    }

    // Check for node hover
    let foundNode = null;
    for (const node of nodes) {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (distance < 25) {
        foundNode = node.id;
        break;
      }
    }
    setHoveredNode(foundNode);

    // Check for edge hover
    let foundEdge = null;
    for (const edge of edges) {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) continue;

      const distance = distanceToLineSegment(x, y, sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
      if (distance < 8) {
        foundEdge = edge.id;
        break;
      }
    }
    setHoveredEdge(foundEdge);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // Handle click events
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a node
    for (const node of nodes) {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (distance < 25) {
        if (mode === 'addEdge') {
          if (!edgeStart) {
            setEdgeStart(node.id);
          } else if (edgeStart !== node.id) {
            onAddEdge(edgeStart, node.id);
            setEdgeStart(null);
          }
        } else {
          onNodeClick(node.id);
        }
        return;
      }
    }

    // Check if clicking on an edge
    for (const edge of edges) {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) continue;

      const distance = distanceToLineSegment(x, y, sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
      if (distance < 8) {
        onEdgeClick(edge.id);
        return;
      }
    }

    // Add node on empty space if in addNode mode
    if (mode === 'addNode') {
      onAddNode(x, y);
    }
  };

  // Calculate distance from point to line segment
  const distanceToLineSegment = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Update canvas on changes
  useEffect(() => {
    draw();
  }, [nodes, edges, hoveredNode, hoveredEdge, selectedNode, articulationPoints, flashingNodes, traversalNodes, mode, edgeStart, draggedNode, isDirected]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      draw();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full bg-gray-50"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        style={{
          cursor: draggedNode ? 'grabbing' : hoveredNode ? 'grab' : 'crosshair',
          display: 'block' // Ensure canvas is a block element
        }}
      />
    </div>
  );
};

export default GraphCanvas;