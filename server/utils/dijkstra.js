function dijkstra(
  graph,
  start,
  end
) {
  const distances = {};

  const previous = {};

  const unvisited =
    new Set(
      Object.keys(graph)
    );

  Object.keys(graph)
    .forEach((node) => {

      distances[node] =
        Infinity;

      previous[node] =
        null;

    });

  distances[start] = 0;

  while (
    unvisited.size > 0
  ) {

    let current = null;

    unvisited.forEach(
      (node) => {

        if (
          current === null ||
          distances[node] <
          distances[current]
        ) {

          current = node;

        }

      }
    );

    if (
      current === end
    )
      break;

    unvisited.delete(
      current
    );

    for (const neighbor in graph[
      current
    ]) {

      const distance =
        distances[current] +
        graph[current][
          neighbor
        ];

      if (
        distance <
        distances[
          neighbor
        ]
      ) {

        distances[
          neighbor
        ] = distance;

        previous[
          neighbor
        ] = current;

      }

    }

  }

  const path = [];

  let currentNode =
    end;

  while (
    currentNode
  ) {

    path.unshift(
      currentNode
    );

    currentNode =
      previous[
        currentNode
      ];

  }

  return {
    path,
    distance:
      Number(
        distances[
          end
        ].toFixed(2)
      ),
  };
}

module.exports =
  dijkstra;