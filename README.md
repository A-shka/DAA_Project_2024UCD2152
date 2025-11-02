# Graph Visualizer - Connected Components

A beautiful and interactive graph visualization tool for educational purposes, specifically designed for Design and Analysis of Algorithms course.

## Features

### 🎨 Visual Features
- **Connected Components**: Automatically colors different connected components with distinct colors
- **Articulation Points**: Identifies and highlights articulation points (cut vertices) with flashing animation
- **Real-time Updates**: Automatically recolors components when nodes/edges are deleted
- **Beautiful UI**: Modern, professional interface with smooth animations

### 🔍 Algorithms
- **BFS (Breadth-First Search)**: Visualizes breadth-first traversal with animation
- **DFS (Depth-First Search)**: Visualizes depth-first traversal with animation
- **Articulation Points Detection**: Uses advanced graph algorithm to find cut vertices
- **Connected Components**: Automatically identifies all connected components

### ⚙️ Interactive Features
- **Add Nodes**: Click anywhere on the canvas to add nodes
- **Add Edges**: Select two nodes to create edges between them
- **Delete Nodes/Edges**: Remove nodes and edges with a single click
- **Sample Graph**: Generate a pre-built sample graph to test features
- **Clear Graph**: Reset the entire canvas

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd C:\Users\Aashka Bhavsar\CascadeProjects\graph-visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Usage

### Control Panel (Left Side - 1/3 of screen)

#### Mode Selection
- **Add Node**: Click on the canvas to add new nodes
- **Add Edge**: Click two nodes to create an edge between them
- **Delete**: Click nodes or edges to remove them

#### Traversal Algorithms
- **Run BFS**: Performs breadth-first search starting from selected node (or first node)
- **Run DFS**: Performs depth-first search starting from selected node (or first node)

#### Special Features
- **Find Articulation Points**: Identifies and flashes all articulation points in the graph

#### Graph Actions
- **Generate Sample Graph**: Creates a pre-built graph with multiple connected components
- **Clear Graph**: Removes all nodes and edges

### Canvas (Right Side - 2/3 of screen)

The canvas is where you interact with your graph:
- Click to add nodes (in Add Node mode)
- Click nodes to create edges (in Add Edge mode)
- Click to delete nodes/edges (in Delete mode)
- Hover over nodes and edges to highlight them

### Visual Indicators

- **Node Colors**: Each connected component has a unique color
- **Red Dot Badge**: Indicates an articulation point
- **Yellow Flash**: Articulation points flash when identified
- **Green Highlight**: Shows nodes being traversed during BFS/DFS
- **Purple Border**: Selected node

## Understanding the Algorithms

### Connected Components
A connected component is a maximal set of vertices such that there is a path between every pair of vertices. The visualizer automatically identifies and colors each component differently.

### Articulation Points (Cut Vertices)
An articulation point is a vertex whose removal increases the number of connected components in the graph. These are critical nodes that, if removed, would disconnect parts of the graph.

### BFS (Breadth-First Search)
Explores the graph level by level, visiting all neighbors of a node before moving to the next level.

### DFS (Depth-First Search)
Explores the graph by going as deep as possible along each branch before backtracking.

## Educational Use

This tool is perfect for:
- Understanding graph connectivity
- Visualizing graph traversal algorithms
- Learning about articulation points and graph stability
- Interactive demonstrations in algorithm classes
- Self-study and experimentation

## Tips

1. **Start with the sample graph** to see all features in action
2. **Find articulation points** before deleting nodes to understand graph structure
3. **Watch the traversal animations** to understand BFS vs DFS behavior
4. **Create disconnected components** to see automatic recoloring
5. **Delete articulation points** to see how the graph splits into components

## Technologies Used

- **React**: Frontend framework
- **Vite**: Build tool and dev server
- **TailwindCSS**: Styling
- **Lucide React**: Icons
- **Canvas API**: Graph rendering

## Project Structure

```
graph-visualizer/
├── src/
│   ├── App.jsx              # Main application component
│   ├── GraphCanvas.jsx      # Canvas rendering and interaction
│   ├── ControlPanel.jsx     # UI controls and buttons
│   ├── algorithms.js        # Graph algorithms (BFS, DFS, etc.)
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
└── README.md              # This file
```

## License

This project is created for educational purposes.

---

**Created for**: Design and Analysis of Algorithms Course Lab  
**Topic**: Connected Components Visualization with Articulation Points Detection
