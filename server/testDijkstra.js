const buildGraph =
require("./utils/graphBuilder");

const dijkstra =
require("./utils/dijkstra");

const graph =
buildGraph();

const result =
dijkstra(
 graph,
 "sector18",
 "parichowk"
);

console.log(result);