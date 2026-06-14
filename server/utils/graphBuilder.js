const demoLocations =
require("../data/demoLocations");

const roadConnections =
require("../data/roadConnections");

const haversineDistance =
require("./haversine");

function buildGraph() {

  const graph = {};

  const locationMap = {};

  demoLocations.forEach(
    (location) => {

      locationMap[
        location.id
      ] = location;

    }
  );

  Object.keys(
    roadConnections
  ).forEach((node) => {

    graph[node] = {};

    roadConnections[
      node
    ].forEach(
      (neighbor) => {

        const source =
          locationMap[node];

        const target =
          locationMap[
            neighbor
          ];

        const distance =
          haversineDistance(
            source.lat,
            source.lng,
            target.lat,
            target.lng
          );

        graph[node][
          neighbor
        ] = distance;

      }
    );

  });

  return graph;
}

module.exports =
  buildGraph;