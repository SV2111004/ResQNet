const buildGraph = require("../utils/graphBuilder");

const dijkstra = require("../utils/dijkstra");

const demoLocations = require("../data/demoLocations");

const optimizeRoute = async (req, res) => {
  try {
    const { start, end } = req.body;

    const graph = buildGraph();

    const result = dijkstra(graph, start, end);

    const readablePath = result.path.map((nodeId) => {
      const location = demoLocations.find((loc) => loc.id === nodeId);

      return location ? location.name : nodeId;
    });

    const routeCoordinates = result.path.map((nodeId) => {
      const location = demoLocations.find((loc) => loc.id === nodeId);

      return [location.lat, location.lng];
    });

    const eta = Math.ceil((result.distance / 40) * 60);

    res.json({
      path: readablePath,

      distance: result.distance,

      eta,

      routeCoordinates,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  optimizeRoute,
};
