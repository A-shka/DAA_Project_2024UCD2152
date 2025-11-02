import React, { useRef, useEffect, useState } from 'react';

const GraphCanvas = ({ 
  nodes, 
  edges, 
  onNodeClick,
  onEdgeClick,
  onAddNode,
  onAddEdge,
  onNodePositionChange,
  selectedNode,
  articulationPoints,
  flashingNodes,
  traversalNodes,
  mode
}) => {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [edgeStart, setEdgeStart] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return;

      // Check if edge is part of traversal
      const fromTraversed = traversalNodes.includes(edge.from);
      const toTraversed = traversalNodes.includes(edge.to);
      const edgeTraversed = fromTraversed && toTraversed;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      // Highlight hovered, selected, or traversed edge
      if (hoveredEdge === edge.id) {
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 4;
      } else if (edgeTraversed) {
        ctx.strokeStyle = '#10B981'; // Green for traversed edges
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#6B7280';
        ctx.lineWidth = 2;
      }
      
      ctx.stroke();

      // Draw edge label
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.fillStyle = edgeTraversed ? '#10B981' : '#4B5563';
      ctx.font = '12px sans-serif';
      ctx.fillText(edge.id, midX + 5, midY - 5);
    });

    // Draw temporary edge when creating
    if (mode === 'addEdge' && edgeStart) {
      const startNode = nodes.find(n => n.id === edgeStart);
      if (startNode && hoveredNode) {
        const endNode = nodes.find(n => n.id === hoveredNode);
        if (endNode) {
          ctx.beginPath();
          ctx.moveTo(startNode.x, startNode.y);
          ctx.lineTo(endNode.x, endNode.y);
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // Draw nodes
    nodes.forEach(node => {
      const isArticulation = articulationPoints.includes(node.id);
      const isFlashing = flashingNodes.includes(node.id);
      const isTraversal = traversalNodes.includes(node.id);
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode === node.id;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      
      // Fill color
      if (isFlashing) {
        ctx.fillStyle = '#FCD34D'; // Flashing yellow
      } else if (isTraversal) {
        ctx.fillStyle = '#34D399'; // Traversal green
      } else {
        ctx.fillStyle = node.color || '#3B82F6';
      }
      ctx.fill();

      // Border
      if (isArticulation && !isFlashing) {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 4;
      } else if (isSelected) {
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 4;
      } else if (isHovered) {
        ctx.strokeStyle = '#1E40AF';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 2;
      }
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);

      // Articulation point indicator (when not flashing)
      if (isArticulation && !isFlashing) {
        ctx.beginPath();
        ctx.arc(node.x + 18, node.y - 18, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

  }, [nodes, edges, hoveredNode, hoveredEdge, selectedNode, articulationPoints, flashingNodes, traversalNodes, mode, edgeStart, draggedNode]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a node to drag
    for (const node of nodes) {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (distance < 25) {
        setDraggedNode(node.id);
        setDragOffset({ x: x - node.x, y: y - node.y });
        return;
      }
    }
  };

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
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) continue;

      const distance = distanceToLineSegment(x, y, fromNode.x, fromNode.y, toNode.x, toNode.y);
      if (distance < 8) {
        foundEdge = edge.id;
        break;
      }
    }
    setHoveredEdge(foundEdge);
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

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
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) continue;

      const distance = distanceToLineSegment(x, y, fromNode.x, fromNode.y, toNode.x, toNode.y);
      if (distance < 8) {
        onEdgeClick(edge.id);
        return;
      }
    }

    // Add node on empty space
    if (mode === 'addNode') {
      onAddNode(x, y);
    }
  };

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

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full bg-gray-50 ${draggedNode ? 'cursor-grabbing' : hoveredNode ? 'cursor-grab' : 'cursor-crosshair'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    />
  );
};

export default GraphCanvas;
