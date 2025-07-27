// Cemetery boundaries (based on your coordinate data)
var cemeteryBounds = {
    north: 10.249302749341647,
    south: 10.247883800064669,
    east: 123.7988598710129,
    west: 123.79691285546676
};

/**
 * Custom pathfinding system for cemetery internal navigation
 * Uses the actual cemetery paths from json_path_1 data
 */
var CemeteryPathfinder = {
    // Convert cemetery paths to a graph structure for pathfinding
    pathGraph: null,
    nodes: [],
    edges: [],

    /**
     * Initialize the pathfinder by converting path data to a graph
     */
    initialize: function () {
        console.log('🗺️ Initializing cemetery pathfinder...');
        this.buildGraphFromPaths();
    },

    /**
     * Check if a coordinate is within cemetery boundaries
     */
    isWithinCemetery: function (lat, lng) {
        return lat >= cemeteryBounds.south &&
            lat <= cemeteryBounds.north &&
            lng >= cemeteryBounds.west &&
            lng <= cemeteryBounds.east;
    },

    /**
     * Build a graph structure from the cemetery path data
     */
    buildGraphFromPaths: function () {
        console.log('🔗 Building path graph from cemetery data...');
        this.nodes = [];
        this.edges = [];
        const tolerance = 5; // 5 meters tolerance for merging nearby nodes
        const nodeMap = new Map(); // Track node locations to merge duplicates

        // Extract all coordinates from path segments and merge nearby nodes
        json_path_1.features.forEach((feature, featureIndex) => {
            if (feature.geometry.type === 'MultiLineString') {
                feature.geometry.coordinates.forEach((lineString, lineIndex) => {
                    const pathNodes = []; // Store nodes for this path segment

                    for (let i = 0; i < lineString.length; i++) {
                        const coord = lineString[i];
                        const lat = coord[1];
                        const lng = coord[0];

                        // Check if a node already exists nearby
                        let nodeId = null;
                        let existingNode = null;

                        for (const [id, node] of nodeMap) {
                            if (this.calculateDistance(lat, lng, node.lat, node.lng) <
                                tolerance) {
                                nodeId = id;
                                existingNode = node;
                                break;
                            }
                        }

                        // Create new node if none exists nearby
                        if (!existingNode) {
                            nodeId = `${featureIndex}_${lineIndex}_${i}`;
                            const newNode = {
                                id: nodeId,
                                lat: lat,
                                lng: lng,
                                connections: []
                            };
                            this.nodes.push(newNode);
                            nodeMap.set(nodeId, newNode);
                        }

                        pathNodes.push(nodeId);
                    }

                    // Create edges for this path segment
                    for (let i = 0; i < pathNodes.length - 1; i++) {
                        const fromNodeId = pathNodes[i];
                        const toNodeId = pathNodes[i + 1];
                        const fromNode = nodeMap.get(fromNodeId);
                        const toNode = nodeMap.get(toNodeId);

                        // Check if this edge would cross any boundary
                        if (!this.doesLineCrossBoundary(fromNode.lat, fromNode.lng, toNode.lat,
                            toNode.lng)) {
                            const distance = this.calculateDistance(
                                fromNode.lat, fromNode.lng,
                                toNode.lat, toNode.lng
                            );

                            // Create bidirectional edges
                            this.edges.push({
                                from: fromNodeId,
                                to: toNodeId,
                                distance: distance
                            });
                            this.edges.push({
                                from: toNodeId,
                                to: fromNodeId,
                                distance: distance
                            });

                            // Track connections
                            if (!fromNode.connections.includes(toNodeId)) {
                                fromNode.connections.push(toNodeId);
                            }
                            if (!toNode.connections.includes(fromNodeId)) {
                                toNode.connections.push(fromNodeId);
                            }
                        } else {
                            console.log(
                                `🚫 Blocked edge ${fromNodeId} -> ${toNodeId} (crosses boundary)`
                            );
                        }
                    }
                });
            }
        });

        // Additional connections for nodes that are very close but from different paths
        this.connectNearbyPaths(15); // 15 meters for cross-path connections

        // Count edges that were created vs blocked
        const totalEdges = this.edges.length;
        console.log(`✅ Graph built: ${this.nodes.length} nodes, ${totalEdges} edges`);
        console.log(`🛡️ Boundary checking: Navigation will only use valid walkable paths`);
    },

    /**
     * Find a node near the given coordinates
     */
    findNearbyNode: function (lat, lng, tolerance) {
        return this.nodes.find(node =>
            Math.abs(node.lat - lat) < tolerance &&
            Math.abs(node.lng - lng) < tolerance
        );
    },

    /**
     * Connect nodes that are close to each other but from different path segments
     * Only creates connections that don't cross cemetery boundaries
     */
    connectNearbyPaths: function (connectionTolerance) {
        let connectionsAdded = 0;
        let connectionsBlocked = 0;

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node1 = this.nodes[i];
                const node2 = this.nodes[j];

                // Skip if nodes are already connected
                if (node1.connections.includes(node2.id)) continue;

                const distance = this.calculateDistance(node1.lat, node1.lng, node2.lat, node2.lng);

                if (distance < connectionTolerance) {
                    // Check if this connection would cross any boundary
                    if (!this.doesLineCrossBoundary(node1.lat, node1.lng, node2.lat, node2.lng)) {
                        // Create bidirectional connection
                        this.edges.push({
                            from: node1.id,
                            to: node2.id,
                            distance: distance
                        });
                        this.edges.push({
                            from: node2.id,
                            to: node1.id,
                            distance: distance
                        });

                        node1.connections.push(node2.id);
                        node2.connections.push(node1.id);
                        connectionsAdded++;
                    } else {
                        connectionsBlocked++;
                    }
                }
            }
        }

        console.log(`🔗 Added ${connectionsAdded} cross-path connections`);
        console.log(`🚫 Blocked ${connectionsBlocked} connections that would cross boundaries`);
    },

    /**
     * Check if a line segment intersects with any cemetery boundary
     */
    doesLineCrossBoundary: function (lat1, lng1, lat2, lng2) {
        if (typeof json_boundary_0 === 'undefined') {
            return false; // No boundary data available, allow connection
        }

        // Check against all boundary features
        for (const feature of json_boundary_0.features) {
            if (feature.geometry.type === 'MultiLineString') {
                for (const lineString of feature.geometry.coordinates) {
                    // Check each segment of the boundary
                    for (let i = 0; i < lineString.length - 1; i++) {
                        const boundaryLat1 = lineString[i][1];
                        const boundaryLng1 = lineString[i][0];
                        const boundaryLat2 = lineString[i + 1][1];
                        const boundaryLng2 = lineString[i + 1][0];

                        if (this.linesIntersect(
                            lat1, lng1, lat2, lng2,
                            boundaryLat1, boundaryLng1, boundaryLat2, boundaryLng2
                        )) {
                            return true; // Lines intersect, connection blocked
                        }
                    }
                }
            }
        }
        return false; // No intersection found
    },

    /**
     * Check if two line segments intersect
     * Uses the orientation method to determine if lines intersect
     */
    linesIntersect: function (lat1, lng1, lat2, lng2, lat3, lng3, lat4, lng4) {
        // Calculate orientations
        const o1 = this.orientation(lat1, lng1, lat2, lng2, lat3, lng3);
        const o2 = this.orientation(lat1, lng1, lat2, lng2, lat4, lng4);
        const o3 = this.orientation(lat3, lng3, lat4, lng4, lat1, lng1);
        const o4 = this.orientation(lat3, lng3, lat4, lng4, lat2, lng2);

        // General case: lines intersect if orientations are different
        if (o1 !== o2 && o3 !== o4) {
            return true;
        }

        // Special cases: check if points are collinear and on the segment
        if (o1 === 0 && this.onSegment(lat1, lng1, lat3, lng3, lat2, lng2)) return true;
        if (o2 === 0 && this.onSegment(lat1, lng1, lat4, lng4, lat2, lng2)) return true;
        if (o3 === 0 && this.onSegment(lat3, lng3, lat1, lng1, lat4, lng4)) return true;
        if (o4 === 0 && this.onSegment(lat3, lng3, lat2, lng2, lat4, lng4)) return true;

        return false;
    },

    /**
     * Calculate orientation of ordered triplet of points
     * Returns 0 if collinear, 1 if clockwise, 2 if counterclockwise
     */
    orientation: function (lat1, lng1, lat2, lng2, lat3, lng3) {
        const val = (lng2 - lng1) * (lat3 - lat2) - (lat2 - lat1) * (lng3 - lng2);
        if (Math.abs(val) < 1e-10) return 0; // Collinear (with small tolerance)
        return (val > 0) ? 1 : 2; // Clockwise or counterclockwise
    },

    /**
     * Check if point (lat2, lng2) lies on line segment from (lat1, lng1) to (lat3, lng3)
     */
    onSegment: function (lat1, lng1, lat2, lng2, lat3, lng3) {
        return lat2 <= Math.max(lat1, lat3) && lat2 >= Math.min(lat1, lat3) &&
            lng2 <= Math.max(lng1, lng3) && lng2 >= Math.min(lng1, lng3);
    },

    /**
     * Calculate distance between two coordinates using Haversine formula (in meters)
     */
    calculateDistance: function (lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    },

    /**
     * Find the nearest path node to a given coordinate
     */
    findNearestNode: function (lat, lng) {
        let nearestNode = null;
        let minDistance = Infinity;

        this.nodes.forEach(node => {
            const distance = this.calculateDistance(lat, lng, node.lat, node.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestNode = node;
            }
        });

        if (nearestNode) {
            console.log(
                `📍 Nearest node to [${lat.toFixed(6)}, ${lng.toFixed(6)}] is ${nearestNode.id} at ${minDistance.toFixed(1)}m`
            );
        } else {
            console.log(`❌ No nearest node found for [${lat.toFixed(6)}, ${lng.toFixed(6)}]`);
        }

        return nearestNode;
    },

    /**
     * Find path between two points using Dijkstra's algorithm
     */
    findPath: function (startLat, startLng, endLat, endLng) {
        console.log('🔍 Finding cemetery path from', [startLat, startLng], 'to', [endLat, endLng]);

        // Find nearest nodes to start and end points
        const startNode = this.findNearestNode(startLat, startLng);
        const endNode = this.findNearestNode(endLat, endLng);

        if (!startNode || !endNode) {
            console.log('❌ Could not find path nodes');
            return null;
        }

        console.log('📍 Using nodes:', startNode.id, '->', endNode.id);
        console.log('📊 Start node connections:', startNode.connections.length);
        console.log('📊 End node connections:', endNode.connections.length);

        // If start and end are the same node, return direct path
        if (startNode.id === endNode.id) {
            console.log('✅ Start and end are same node, returning direct path');
            return [
                [startLat, startLng],
                [endLat, endLng]
            ];
        }

        // Dijkstra's algorithm implementation
        const distances = {};
        const previous = {};
        const unvisited = new Set();

        // Initialize distances
        this.nodes.forEach(node => {
            distances[node.id] = Infinity;
            previous[node.id] = null;
            unvisited.add(node.id);
        });

        distances[startNode.id] = 0;

        while (unvisited.size > 0) {
            // Find unvisited node with minimum distance
            let currentNode = null;
            let minDistance = Infinity;

            unvisited.forEach(nodeId => {
                if (distances[nodeId] < minDistance) {
                    minDistance = distances[nodeId];
                    currentNode = nodeId;
                }
            });

            if (currentNode === null || minDistance === Infinity) {
                console.log('⚠️ No more reachable nodes, breaking from pathfinding');
                break;
            }

            unvisited.delete(currentNode);

            // If we reached the destination
            if (currentNode === endNode.id) {
                console.log('🎯 Reached destination node');
                break;
            }

            // Check all neighbors
            this.edges.forEach(edge => {
                if (edge.from === currentNode && unvisited.has(edge.to)) {
                    const newDistance = distances[currentNode] + edge.distance;
                    if (newDistance < distances[edge.to]) {
                        distances[edge.to] = newDistance;
                        previous[edge.to] = currentNode;
                    }
                }
            });
        }

        // Check if we found a path to the destination
        if (distances[endNode.id] === Infinity) {
            console.log('❌ No path found - destination unreachable');
            return null;
        }

        // Reconstruct path
        const path = [];
        let currentNode = endNode.id;

        while (currentNode !== null) {
            const node = this.nodes.find(n => n.id === currentNode);
            if (node) {
                path.unshift([node.lat, node.lng]);
            }
            currentNode = previous[currentNode];
        }

        if (path.length === 0) {
            console.log('❌ Failed to reconstruct path');
            return null;
        }

        // Add start and end coordinates if they're different from path endpoints
        if (path.length > 0) {
            const firstPoint = path[0];
            const lastPoint = path[path.length - 1];

            // Add actual start location if different
            if (this.calculateDistance(startLat, startLng, firstPoint[0], firstPoint[1]) > 2) {
                path.unshift([startLat, startLng]);
            }

            // Add actual end location if different
            if (this.calculateDistance(endLat, endLng, lastPoint[0], lastPoint[1]) > 2) {
                path.push([endLat, endLng]);
            }
        }

        console.log('✅ Cemetery path found with', path.length, 'waypoints');
        return path;
    }
};

// Initialize the cemetery pathfinder when the map is ready
map.whenReady(function () {
    // Wait for json_path_1 and json_boundary_0 to be loaded
    setTimeout(function () {
        if (typeof json_path_1 !== 'undefined') {
            if (typeof json_boundary_0 !== 'undefined') {
                const boundaryCount = json_boundary_0.features.length;
                let segmentCount = 0;
                json_boundary_0.features.forEach(feature => {
                    if (feature.geometry.type === 'MultiLineString') {
                        feature.geometry.coordinates.forEach(lineString => {
                            segmentCount += lineString.length - 1;
                        });
                    }
                });
                console.log(
                    `🛡️ Boundary data loaded: ${boundaryCount} features, ${segmentCount} boundary segments`
                );
                console.log(
                    '✅ Navigation will respect cemetery boundaries and avoid crossing walls/fences');
            } else {
                console.warn(
                    '⚠️ Boundary data (json_boundary_0) not found. Navigation may cross barriers.');
            }
            CemeteryPathfinder.initialize();
            console.log('🏛️ Cemetery pathfinding system initialized');
        } else {
            console.warn('⚠️ Cemetery path data (json_path_1) not found. Custom routing unavailable.');
        }
    }, 1000);
});
