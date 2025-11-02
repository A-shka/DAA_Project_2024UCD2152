import React from 'react';
import { X, BookOpen } from 'lucide-react';

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Graph Theory & Algorithms</h2>
              <p className="text-blue-100 text-sm">Educational Reference Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Graphs */}
          <section className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-600 rounded"></span>
              What is a Graph?
            </h3>
            <p className="text-gray-700 mb-2">
              A <strong>graph</strong> is a non-linear data structure consisting of vertices (nodes) and edges that connect pairs of vertices. 
              Graphs are used to represent networks, relationships, and connections in various real-world scenarios.
            </p>
            <p className="text-gray-600 text-sm italic">
              Examples: Social networks, road maps, computer networks, website links, etc.
            </p>
          </section>

          {/* Nodes */}
          <section className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-8 bg-green-600 rounded"></span>
              Nodes (Vertices)
            </h3>
            <p className="text-gray-700 mb-2">
              <strong>Nodes</strong> (also called vertices) are the fundamental units of a graph. Each node can represent an entity, 
              such as a person, city, computer, or any object. Nodes are typically depicted as circles or points.
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 text-sm text-gray-700">
              💡 <strong>In this visualizer:</strong> Click on the canvas in "Add Node" mode to create nodes. Each node has a unique ID.
            </div>
          </section>

          {/* Edges */}
          <section className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-8 bg-purple-600 rounded"></span>
              Edges
            </h3>
            <p className="text-gray-700 mb-2">
              <strong>Edges</strong> are the connections between nodes. They represent relationships or paths between vertices. 
              Edges can be directed (one-way) or undirected (two-way). In this visualizer, all edges are undirected.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 text-sm text-gray-700">
              💡 <strong>In this visualizer:</strong> Switch to "Add Edge" mode and click two nodes to connect them with an edge.
            </div>
          </section>

          {/* Connected Components */}
          <section className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-8 bg-yellow-600 rounded"></span>
              Connected Components
            </h3>
            <p className="text-gray-700 mb-2">
              A <strong>connected component</strong> is a maximal set of vertices in a graph where there exists a path between any two vertices. 
              In other words, all nodes in a connected component can reach each other through edges.
            </p>
            <p className="text-gray-700 mb-2">
              If a graph has multiple separate groups of nodes with no paths between them, each group forms a separate connected component.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 text-sm text-gray-700">
              💡 <strong>In this visualizer:</strong> Each connected component is automatically colored differently. Check the control panel for the count!
            </div>
          </section>

          {/* Disconnected Graphs */}
          <section className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-600 rounded"></span>
              Disconnected Graphs
            </h3>
            <p className="text-gray-700 mb-2">
              A graph is <strong>disconnected</strong> if it has two or more connected components with no path between them. 
              This means some nodes are isolated from others and cannot be reached through any sequence of edges.
            </p>
            <p className="text-gray-600 text-sm italic">
              Example: If you have nodes 1-2-3 connected together and nodes 4-5 connected separately, this forms a disconnected graph with 2 components.
            </p>
          </section>

          {/* Graph Traversal */}
          <section className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-600 rounded"></span>
              Graph Traversal
            </h3>
            <p className="text-gray-700 mb-2">
              <strong>Graph traversal</strong> is the process of visiting all vertices in a graph systematically. 
              It's used for searching, pathfinding, and analyzing graph properties. The two main algorithms are BFS and DFS.
            </p>
          </section>

          {/* BFS */}
          <section className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-3">
              🌊 BFS (Breadth-First Search)
            </h3>
            <p className="text-gray-700 mb-2">
              BFS explores the graph <strong>level by level</strong>. It visits all neighbors of a node before moving to their neighbors.
            </p>
            <div className="mb-3">
              <p className="font-semibold text-gray-800 mb-1">Algorithm:</p>
              <ol className="list-decimal list-inside text-gray-700 text-sm space-y-1 ml-2">
                <li>Start at a source node and mark it as visited</li>
                <li>Add the source node to a queue</li>
                <li>While the queue is not empty:
                  <ul className="list-disc list-inside ml-4 text-xs mt-1">
                    <li>Remove the front node from the queue</li>
                    <li>Visit all unvisited neighbors</li>
                    <li>Mark them as visited and add them to the queue</li>
                  </ul>
                </li>
                <li>Continue until all reachable nodes are visited</li>
                <li>If disconnected components exist, repeat for unvisited nodes</li>
              </ol>
            </div>
            <div className="bg-green-100 p-2 rounded text-sm">
              <p className="font-semibold text-green-900">Use Cases:</p>
              <p className="text-gray-700">Shortest path in unweighted graphs, web crawlers, social network analysis, GPS navigation</p>
            </div>
          </section>

          {/* DFS */}
          <section className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              🏔️ DFS (Depth-First Search)
            </h3>
            <p className="text-gray-700 mb-2">
              DFS explores the graph by going as <strong>deep as possible</strong> along each branch before backtracking.
            </p>
            <div className="mb-3">
              <p className="font-semibold text-gray-800 mb-1">Algorithm:</p>
              <ol className="list-decimal list-inside text-gray-700 text-sm space-y-1 ml-2">
                <li>Start at a source node and mark it as visited</li>
                <li>Recursively visit an unvisited neighbor</li>
                <li>Continue going deeper until no unvisited neighbors exist</li>
                <li>Backtrack to the previous node and try other neighbors</li>
                <li>Continue until all reachable nodes are visited</li>
                <li>If disconnected components exist, repeat for unvisited nodes</li>
              </ol>
            </div>
            <div className="bg-blue-100 p-2 rounded text-sm">
              <p className="font-semibold text-blue-900">Use Cases:</p>
              <p className="text-gray-700">Topological sorting, cycle detection, maze solving, puzzle solving, finding connected components</p>
            </div>
          </section>

          {/* Articulation Points */}
          <section className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-3">
              ⚡ Articulation Points (Cut Vertices)
            </h3>
            <p className="text-gray-700 mb-2">
              An <strong>articulation point</strong> is a vertex whose removal increases the number of connected components in the graph. 
              These are critical nodes that, if deleted, would disconnect parts of the graph.
            </p>
            <div className="mb-3">
              <p className="font-semibold text-gray-800 mb-1">Properties:</p>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                <li>Removing an articulation point breaks the graph into separate components</li>
                <li>They represent critical points in network infrastructure</li>
                <li>Found using DFS with discovery and low-link values</li>
                <li>Important for network reliability analysis</li>
              </ul>
            </div>
            <div className="bg-orange-100 p-2 rounded text-sm">
              <p className="font-semibold text-orange-900">Real-World Applications:</p>
              <p className="text-gray-700">Network vulnerability analysis, bridge identification in road networks, critical servers in networks</p>
            </div>
            <div className="bg-red-100 border-l-4 border-red-500 p-3 text-sm text-gray-700 mt-3">
              💡 <strong>In this visualizer:</strong> Articulation points are marked with a red dot. Try deleting one to see the graph split into separate components!
            </div>
          </section>

          {/* Complexity */}
          <section className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">⏱️ Time Complexity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">BFS & DFS</p>
                <p className="text-gray-700 text-sm">
                  <strong>Time:</strong> O(V + E)<br />
                  <strong>Space:</strong> O(V)<br />
                  <span className="text-xs text-gray-600">V = vertices, E = edges</span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">Articulation Points</p>
                <p className="text-gray-700 text-sm">
                  <strong>Time:</strong> O(V + E)<br />
                  <strong>Space:</strong> O(V)<br />
                  <span className="text-xs text-gray-600">Using DFS-based algorithm</span>
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 text-center border-t">
          <p className="text-sm text-gray-600">
            📚 Created for Design and Analysis of Algorithms Course Lab
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
