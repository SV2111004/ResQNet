const demoLocations = require("../data/demoLocations");
const haversineDistance = require("./haversine");

const getNearestLocation = (lat, lng) => {
  let nearest = null;
  let minDistance = Infinity;

  demoLocations.forEach((location) => {
    const distance = haversineDistance(
      lat,
      lng,
      location.lat,
      location.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = location;
    }
  });

  return nearest;
};

module.exports = getNearestLocation;