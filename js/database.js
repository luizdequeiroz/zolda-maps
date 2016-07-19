var subs = [
    { name: 'cinzenta', lat: 1.626, lng: -68.159, zoom: 6 },
    { name: 'pedras', lat: 13.923, lng: -69.368, zoom: 6 },
    { name: 'maraba', lat: 25.780, lng: -67.412, zoom: 6 },
    { name: 'fieldon', lat: 13.966, lng: -45.396, zoom: 6 },
    { name: 'zionr', lat: 25.404, lng: -52.976, zoom: 6 },
    { name: 'matim', lat: 25.443, lng: -37.595, zoom: 6 },
    { name: 'confins', lat: 25.125, lng: -26.038, zoom: 6 },
    { name: 'sagmatim', lat: 24.607, lng: -17.336, zoom: 6 },
    { name: 'niogro', lat: 16.784, lng: -4.504, zoom: 6 },
    { name: 'mileni', lat: 5.157, lng: -0.066, zoom: 6 }
];

function getSubMap(name) {
    return subs.filter(function (obj) {
        return obj.name === name;
    })[0];
}