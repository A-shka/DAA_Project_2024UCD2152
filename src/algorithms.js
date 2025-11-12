// BFS Traversal - Traverses ALL connected components
export const bfs = (nodes = [], edges = [], startNodeId, isDirected = false) => {
  if (!nodes || nodes.length === 0) {
    console.warn('BFS: No nodes provided');
    return [];
  }

  // Validate startNodeId exists in nodes
  const nodeIds = new Set(nodes.map(node => node.id));
  if (!startNodeId || !nodeIds.has(startNodeId)) {
    console.warn(`BFS: Invalid start node ID: ${startNodeId}`);
    startNodeId = nodes[0]?.id;
    if (!startNodeId) return [];
  }

  const visited = new Set();
  const traversalOrder = [];
  const adjacencyList = buildAdjacencyList(nodes, edges, isDirected);

  const bfsSingleComponent = (start) => {
    if (visited.has(start)) return;
    
    const queue = [start];
    visited.add(start);

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === undefined) continue;
      
      traversalOrder.push(current);

      const neighbors = adjacencyList[current] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  };

  try {
    // Start with the specified node
    bfsSingleComponent(startNodeId);

    // Continue with remaining unvisited nodes (other connected components)
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        bfsSingleComponent(node.id);
      }
    });
  } catch (error) {
    console.error('Error in BFS:', error);
    return [];
  }

  return traversalOrder;
};

// DFS Traversal - Traverses ALL connected components
export const dfs = (nodes = [], edges = [], startNodeId, isDirected = false) => {
  if (!nodes || nodes.length === 0) {
    console.warn('DFS: No nodes provided');
    return [];
  }

  // Validate startNodeId exists in nodes
  const nodeIds = new Set(nodes.map(node => node.id));
  if (!startNodeId || !nodeIds.has(startNodeId)) {
    console.warn(`DFS: Invalid start node ID: ${startNodeId}`);
    startNodeId = nodes[0]?.id;
    if (!startNodeId) return [];
  }

  const visited = new Set();
  const traversalOrder = [];
  const adjacencyList = buildAdjacencyList(nodes, edges, isDirected);

  const dfsHelper = (nodeId) => {
    if (visited.has(nodeId)) return;
    
    visited.add(nodeId);
    traversalOrder.push(nodeId);

    const neighbors = adjacencyList[nodeId] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  };

  // Start with the specified node
  dfsHelper(startNodeId);

  // Continue with remaining unvisited nodes (other connected components)
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      dfsHelper(node.id);
    }
  });

  return traversalOrder;
};

// Build adjacency list from edges
const buildAdjacencyList = (nodes, edges, isDirected = false) => {
  const adjacencyList = {};
  
  nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });

  edges.forEach(edge => {
    if (!adjacencyList[edge.source]) adjacencyList[edge.source] = [];
    if (!adjacencyList[edge.target]) adjacencyList[edge.target] = [];
    
    // Always add edge from source to target
    adjacencyList[edge.source].push(edge.target);
    
    // Only add reverse edge for undirected graphs
    if (!isDirected) {
      adjacencyList[edge.target].push(edge.source);
    }
  });

  return adjacencyList;
};

// Find all connected components
export const findConnectedComponents = (nodes, edges) => {
  const visited = new Set();
  const components = [];
  const adjacencyList = buildAdjacencyList(nodes, edges);

  const bfsComponent = (startNodeId) => {
    const component = [];
    const queue = [startNodeId];
    visited.add(startNodeId);

    while (queue.length > 0) {
      const current = queue.shift();
      component.push(current);

      const neighbors = adjacencyList[current] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return component;
  };

  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      const component = bfsComponent(node.id);
      components.push(component);
    }
  });

  return components;
};

// Find articulation points (cut vertices)
export const findArticulationPoints = (nodes, edges) => {
  const adjacencyList = buildAdjacencyList(nodes, edges);
  const articulationPoints = new Set();
  const visited = new Set();
  const disc = {};
  const low = {};
  const parent = {};
  let time = 0;

  const dfsArticulation = (u) => {
    let children = 0;
    visited.add(u);
    disc[u] = low[u] = ++time;

    const neighbors = adjacencyList[u] || [];
    
    for (const v of neighbors) {
      if (!visited.has(v)) {
        children++;
        parent[v] = u;
        dfsArticulation(v);

        low[u] = Math.min(low[u], low[v]);

        // u is an articulation point in following cases:
        // (1) u is root of DFS tree and has two or more children
        if (parent[u] === undefined && children > 1) {
          articulationPoints.add(u);
        }

        // (2) If u is not root and low value of one of its children is more than discovery value of u
        if (parent[u] !== undefined && low[v] >= disc[u]) {
          articulationPoints.add(u);
        }
      } else if (v !== parent[u]) {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  };

  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      dfsArticulation(node.id);
    }
  });

  return Array.from(articulationPoints);
};

// Generate colors for connected components
export const generateComponentColors = (numComponents) => {
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Sky Blue
    '#F8B500', // Orange
    '#52B788', // Green
    '#FF7F50', // Coral
    '#87CEEB', // Sky Blue
    '#DDA15E', // Brown
    '#BC6C25', // Dark Brown
    '#B8336A', // Pink
  ];

  if (numComponents <= colors.length) {
    return colors.slice(0, numComponents);
  }

  // Generate random colors if we need more
  const generatedColors = [...colors];
  for (let i = colors.length; i < numComponents; i++) {
    const hue = (i * 137.5) % 360; // Golden angle for better distribution
    generatedColors.push(`hsl(${hue}, 70%, 60%)`);
  }

  return generatedColors;
};
