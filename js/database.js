var subs = [
    { name: 'cinzenta', lat: 1.626, lng: -68.159, zoom: 6, descricao: '' },
    { name: 'saisepedras', lat: 13.923, lng: -69.368, zoom: 6, descricao: '' },
/*    */{ name: 'dosal', lat: 17.382, lng: -68.203, zoom: 7, descricao: '' },
/*    */{ name: 'dapedra', lat: 14.403, lng: -67.335, zoom: 7, descricao: '' },
/*    */{ name: 'detheus', lat: 10.445, lng: -66.270, zoom: 7, descricao: '' },
    { name: 'maraba', lat: 25.780, lng: -67.412, zoom: 6, descricao: '' },
/*    */{ name: 'dosvelhos', lat: 27.347, lng: -72.015, zoom: 8, descricao: '' },
/*    */{ name: 'dastrocas', lat: 26.392, lng: -70.214, zoom: 8, descricao: '' },
/*    */{ name: 'dopoder', lat: 28.188, lng: -67.972, zoom: 8, descricao: '' },
/*    */{ name: 'dasentenca', lat: 23.584, lng: -75.476, zoom: 7, descricao: '' },
/*    */{ name: 'dezerai', lat: 23.645, lng: -68.384, zoom: 8, descricao: '' },
    { name: 'fieldon', lat: 13.966, lng: -45.396, zoom: 6, descricao: '' },
    { name: 'zionr', lat: 25.404, lng: -52.976, zoom: 6, descricao: '' },
    { name: 'matim', lat: 25.443, lng: -37.595, zoom: 6, descricao: '' },
/*    */{ name: 'estreito', lat: 29.167, lng: -44.984, zoom: 8, descricao: '' },
/*    */{ name: 'dacruz', lat: 28.710, lng: -39.490, zoom: 8, descricao: '' },
/*    */{ name: 'zionarrs', lat: 27.868, lng: -33.195, zoom: 8, descricao: '' },
/*    */{ name: 'homens1', lat: 23.383, lng: -45.231, zoom: 7, descricao: '' },
/*    */{ name: 'monstros', lat: 23.614, lng: -36.815, zoom: 7, descricao: '' },
    { name: 'confins', lat: 25.125, lng: -26.038, zoom: 6, descricao: '' },
/*    */{ name: 'bruxos', lat: 28.493, lng: -30.207, zoom: 8, descricao: '' },
/*    */{ name: 'cerco', lat: 21.320, lng: -29.888, zoom: 8, descricao: '' },
/*    */{ name: 'docaos', lat: 27.010, lng: -24.170, zoom: 7, descricao: '' },
/*    */{ name: 'gaudur', lat: 21.923, lng: -24.456, zoom: 8, descricao: '' },
    { name: 'sagmatim', lat: 24.607, lng: -17.336, zoom: 6, descricao: '' },
/*    */{ name: 'daordem', lat: 26.912, lng: -18.556, zoom: 7, descricao: '' },
/*    */{ name: 'dalei', lat: 21.657, lng: -17.589, zoom: 7, descricao: '' },
/*    */{ name: 'dajustica', lat: 22.391, lng: -12.612, zoom: 7, descricao: '' },
/*    */{ name: 'ajaf', lat: 15.390, lng: -17.622, zoom: 7, descricao: '' },
    { name: 'niogro', lat: 16.784, lng: -4.504, zoom: 6, descricao: '' },
    { name: 'mileni', lat: 5.157, lng: -0.066, zoom: 6, descricao: '' },
/*    */{ name: 'dedaeldon', lat: 9.850, lng: -4.109, zoom: 7, descricao: '' },
/*    */{ name: 'acropole', lat: 7.297, lng: -3.274, zoom: 7, descricao: '' },
/*    */{ name: 'propicios', lat: 1.384, lng: -5.779, zoom: 7, descricao: '' },
/*    */{ name: 'barbados', lat: 1.549, lng: -0.483, zoom: 7, descricao: '' },
/*    */{ name: 'homens2', lat: 0.978, lng: 4.252, zoom: 7, descricao: '' }
];

function getSubMap(name) {
    return subs.filter(function (obj) {
        return obj.name === name;
    })[0];
}