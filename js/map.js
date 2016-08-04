var overlayMap;
var overlayTer;

var contReinit = 0;

var terVisible = false;
var legVisible = false;
var rotVisible = false;
var remVisible = false;

var pogVisible = false;

var marker;
var Map;
var mapMarkers = new Array();

/* abaixo: para capturar coordenada para os territórios */
var latsMarkers = new Array();
var lngsMarkers = new Array();
/* acima: para capturar coordenada para os territórios */

var rectangle = new google.maps.Rectangle();
var polyGon = new google.maps.Polygon();
var poly = new google.maps.Polyline();
var outlineMarkers = new Array();

USGSOverlay.prototype = new google.maps.OverlayView();

var submap;

function initMap() {

    var styles = [
        {
            stylers: [
                { visibility: 'off' }
            ]
        }
    ];

    var styledMap = new google.maps.StyledMapType(styles, { name: 'Styled Map' });

    Map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        minZoom: 4,
        maxZoom: 9,
        center: new google.maps.LatLng(14, -35),
        mapTypeControl: false,
        streetViewControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });

    Map.mapTypes.set('map_style', styledMap);
    Map.setMapTypeId('map_style');

    poly = new google.maps.Polyline({
        map: Map,
        path: [],
        strokeColor: 'white',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    polyGon = new google.maps.Polygon({
        map: Map,
        path: [],
        strokeColor: 'whitesmoke',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'darkgrey',
        fillOpacity: 0.35,
        draggable: false
    });

    polyGon.addListener('drag', function (dragEvent) {
        var polyGonPoints = this.getPath().getArray();
        $.each(polyGonPoints, function (index, val) {
            var polyGonPoint = val;
            outlineMarkers[index].setPosition(polyGonPoint);
        });
    });

    initMapListeners();

    if (!terVisible) {
        $('#territorios').css('background-color', '#fff');
        $('#territorios').css('color', 'rgb(25, 25, 25)');
    }
    if (!legVisible) {
        $('#legendas').css('background-color', '#fff');
        $('#legendas').css('color', 'rgb(25, 25, 25)');
    }
    if (!rotVisible) {
        $('#rotas').css('background-color', '#fff');
        $('#rotas').css('color', 'rgb(25, 25, 25)');
    }
    if (!remVisible) {
        $('#remover').css('background-color', '#fff');
        $('#remover').css('color', 'rgb(25, 25, 25)');
    }

    if (contReinit == 0) initMenuListeners();

    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-5.134475371454281, -79.50845859491564),
        new google.maps.LatLng(30.67883861843332, 6.762828376789505));

    overlayMap = new USGSOverlay(bounds, Map);
}

function updateDistance(outlineMarkers) {
    var totalDistance = 0.0;
    var last = undefined;
    $.each(outlineMarkers, function (index, val) {
        if (last) {
            var dist = google.maps.geometry.spherical.computeDistanceBetween(last.position, val.position) / 1000;
            //console.log('Adicional: ' + parseFloat(dist.toFixed(3)));
            totalDistance += google.maps.geometry.spherical.computeDistanceBetween(last.position, val.position) / 1000;
        }
        last = val;
    });
    //console.log('Total: ' + parseFloat(totalDistance.toFixed(3)))
    $('#distancia').val(parseFloat(totalDistance.toFixed(3)) + ' Km');
}

function USGSOverlay(bounds, map) {

    this.bounds_ = bounds;
    this.map_ = map;

    this.div_ = null;

    this.setMap(map);
}

USGSOverlay.prototype.onAdd = function () {

    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';
    div.id = 'zoldamaps';

    var imgMap = document.createElement('img');
    imgMap.src = 'img/OMundoConhecido.png';
    imgMap.style.width = '100%';
    imgMap.style.height = '100%';
    imgMap.style.position = 'absolute';
    imgMap.id = 'map-conhecido';
    div.appendChild(imgMap);

    var imgTer = document.createElement('img');
    imgTer.src = 'img/OsTerritoriosConhecidos.png';
    imgTer.style.width = '100%';
    imgTer.style.height = '100%';
    imgTer.style.position = 'absolute';
    imgTer.style.visibility = 'hidden';
    imgTer.id = 'map-territorios';
    div.appendChild(imgTer);

    var imgLeg = document.createElement('img');
    imgLeg.src = 'img/AsLegendasConhecidas.png';
    imgLeg.style.width = '100%';
    imgLeg.style.height = '100%';
    imgLeg.style.position = 'absolute';
    imgLeg.style.visibility = 'hidden';
    imgLeg.id = 'map-legendas';
    div.appendChild(imgLeg);

    this.div_ = div;
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

USGSOverlay.prototype.draw = function () {

    var overlayProjection = this.getProjection();

    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};

USGSOverlay.prototype.onRemove = function () {

    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

google.maps.event.addDomListener(window, 'load', initMap);

function initMapListeners() {

    Map.addListener('click', function (e) {
        console.log('lat: ' + e.latLng.lat().toFixed(3) + ', lng: ' + e.latLng.lng().toFixed(3) + '\npinLat: ' + e.latLng.lat().toFixed(3) + ', pinLng: ' + e.latLng.lng().toFixed(3));
        if (rotVisible) rotas(e);
    });

    Map.addListener('mouseover', function () {
        Map.addListener('mousemove', function (e) {
            $('#coordenadas').val('Lat ' + e.latLng.lat().toFixed(3) + ' | Lng ' + e.latLng.lng().toFixed(3));
        });
    });
}

function rotas(event) {
    //event.preventDefault();

    var markerIndex = poly.getPath().length;
    poly.setMap(Map);
    var marker = new google.maps.Marker({
        map: Map,
        position: event.latLng,
        draggable: true
    });

    mapMarkers.push(marker);

    marker.addListener('rightclick', function () {
        marker.setMap(null);
        mapMarkers.pop();
        if (mapMarkers.length == 0) {
            outlineMarkers = new Array();
            if (!pogVisible)
                while (poly.getPath().length > 0) poly.getPath().pop();
        }
    });

    if (mapMarkers.length == 1) {
        marker.setIcon('img/firstIcon.png');
    } else {
        marker.setIcon('img/secondsIcons.png');
    }

    marker.addListener('click', function () {
        if (remVisible) {
            marker.setMap(null);
            mapMarkers.pop();
            if (mapMarkers.length == 0) {
                outlineMarkers = new Array();
                if (!pogVisible)
                    while (poly.getPath().length > 0) poly.getPath().pop();
            }
            return;
        }
        if (mapMarkers[0] == marker) {
            var path = poly.getPath();
            polyGon.setPath(path);
            polyGon.setMap(Map);
            pogVisible = true;            
                
            /* abaixo: exibir coordenadas do polígono */
            /* var paths = polyGon.getPath().getArray();
            ** var lats = '[ ';
            ** var lngs = '[ ';
            ** 
            ** for(var i = 0; i < paths.length; i++){
            **     lats += paths[i].lat().toFixed(3);
            **     lngs += paths[i].lng().toFixed(3);
            **     if(paths.length > i+1) { lats += ', '; lngs += ', '; }
            **     else { lats += ' ]'; lngs += ' ]'; }
            ** }
            **
            ** console.log(lats);
            ** console.log(lngs); */
            /* acima: exibir coordenadas do polígono */

            polyGon.addListener('rightclick', function () {
                polyGon.setMap(null);
                if (mapMarkers.length == 0)
                    while (poly.getPath().length > 0) poly.getPath().pop();
                pogVisible = false;
            });

            polyGon.addListener('click', function () {
                if (remVisible) {
                    polyGon.setMap(null);
                    if (mapMarkers.length == 0)
                        while (poly.getPath().length > 0) poly.getPath().pop();
                    pogVisible = false;
                }
            });
        }
    });

    poly.getPath().push(event.latLng);

    outlineMarkers.push(marker);

    marker.addListener('drag', function (dragEvent) {
        poly.getPath().setAt(markerIndex, dragEvent.latLng);
        updateDistance(outlineMarkers);
    });

    updateDistance(outlineMarkers);
}

function activeTer() {
    if (!terVisible) {
        $('#territorios').css('background-color', 'darkgrey');
        $('#territorios').css('color', '#fff');
        $('#map-territorios').css('visibility', 'visible');
        terVisible = true;
        console.log('Territórios Visível');
    } else {
        $('#territorios').css('background-color', '#fff');
        $('#territorios').css('color', 'rgb(25, 25, 25)');
        $('#map-territorios').css('visibility', 'hidden');
        terVisible = false;
        console.log('Territórios invisível');
    }
}

function activeLeg() {
    if (!legVisible) {
        $('#legendas').css('background-color', 'darkgrey');
        $('#legendas').css('color', '#fff');
        $('#map-legendas').css('visibility', 'visible');
        legVisible = true;
    } else {
        $('#legendas').css('background-color', '#fff');
        $('#legendas').css('color', 'rgb(25, 25, 25)');
        $('#map-legendas').css('visibility', 'hidden');
        legVisible = false;
    }
}

function activeRot() {
    if (!rotVisible) {
        $('#rotas').css('background-color', 'darkgrey');
        $('#rotas').css('color', '#fff');
        rotVisible = true;

        $('#remover').css('background-color', '#fff');
        $('#remover').css('color', 'rgb(25, 25, 25)');
        remVisible = false;
    } else {
        $('#rotas').css('background-color', '#fff');
        $('#rotas').css('color', 'rgb(25, 25, 25)');
        rotVisible = false;
    }
}

function activeRem() {
    if (!remVisible) {
        $('#remover').css('background-color', 'darkgrey');
        $('#remover').css('color', '#fff');
        remVisible = true;

        $('#rotas').css('background-color', '#fff');
        $('#rotas').css('color', 'rgb(25, 25, 25)');
        rotVisible = false;
    } else {
        $('#remover').css('background-color', '#fff');
        $('#remover').css('color', 'rgb(25, 25, 25)');
        remVisible = false;
    }
}

function reInit() {
    outlineMarkers = new Array();
    terVisible = false;
    legVisible = false;
    rotVisible = false;
    remVisible = false;
    console.log('Reiniciando Mapa');
    initMap();
}

function initMenuListeners() {

    document.getElementById('refresh').addEventListener('click', reInit);
    document.getElementById('rotas').addEventListener('click', activeRot);
    document.getElementById('remover').addEventListener('click', activeRem);
    document.getElementById('territorios').addEventListener('click', activeTer);
    document.getElementById('legendas').addEventListener('click', activeLeg);

    document.addEventListener('keydown', function () {
        var key = event.keyCode;
        var str = String.fromCharCode(key);

        if (str == 'R' || key == 27) reInit();
        if (str == '+' || key == 17) activeRot();
        if (str == '-' || key == 16) activeRem();
        if (str == 'T' || str == 'M') activeTer();
        if (str == 'A' || str == 'L') activeLeg();
    });

    contReinit++;
}

function calcTime() {

    var vel = parseFloat($('#modo').val());

    if (vel == 0) return;

    var dis = parseFloat($('#distancia').val());

    var tem = (dis / vel) + 0.02;
    var dia = 0;
    var hor = parseInt(tem);
    var min = parseInt((tem - hor) * 60);

    if (hor % 24 == 0) dia = hor / 24;
    else dia = parseInt(hor / 24);

    hor = hor - (24 * dia);

    var result = "";
    if (dia > 0)
        if (dia > 1) result += dia + ' dias ';
        else result += dia + ' dia ';
    if ((hor > 0 || min > 0) && dia > 0) result += 'e ';
    if (hor > 0)
        if (hor > 1) result += hor + 'hs ';
        else result += hor + 'h ';
    if (min > 1)
        if (min < 10) result += '0' + min + 'min';
        else result += min + 'min';

    if (vel % 2 != 0) {
        switch (vel) {
            case 4.17: $('#tempo').attr('title', 'descansando 1h e 30min a cada 50km'); break;
            case 7.14: $('#tempo').attr('title', 'descansando 2hs a cada 50km'); break;
            case 11.11: $('#tempo').attr('title', 'descansando 30min a cada 50km'); break;
            case 33.33: $('#tempo').attr('title', 'descansando 30min a cada 50km'); break;
        }
    } else $('#tempo').attr('title', '');

    $('#tempo').val(result);
}

function openModal(name) {
    var submap = getSubMap(name);

    $('.mothal').find('#informacoes').empty();

    $('.mothal').find('#descricao').text(submap.descricao);
    $('.mothal').find('#informacoes').load('info/' + name + '.html');
    if (document.getElementById('informacoes').innerHTML == '')
        $('.mothal').find('#informacoes').text("Ainda não catalogado!");

    $(".mothal").modal();
}

function setPin(lat, lng, name, descricao, resumo) {
    var pin = new google.maps.Marker({
        map: Map,
        position: new google.maps.LatLng(lat, lng),
        title: descricao
    });
    pin.setIcon('img/point.png');

    pin.addListener('rightclick', function () {
        pin.setMap(null);
    });

    var infowindow = new google.maps.InfoWindow({
        content: "<strong>" + descricao + "</strong><br />"
        + "<p>" + resumo + "</p><br />"
        + "<p style='float: right'><a style='cursor: pointer' id='" + name + "' onclick='openModal(this.id)'>Leia mais</a></p>"
    });

    pin.addListener('click', function () {
        infowindow.open(Map, pin);
    });

    infowindow.open(Map, pin);
}

function subMap() {

    var name = $('#pesquisa').val();
    var submap = getSubMap(name);
    //console.log('name: ' + submap.name + ' | lat: ' + submap.lat + ' | lng: ' + submap.lng + ' | zoom: ' + submap.zoom);
    if (submap.pinLat != 0 || submap.pinLng != 0) {
        terVisible = false;
        activeTer();
        setPin(submap.pinLat, submap.pinLng, submap.name, submap.descricao, submap.resumo);
    } else setPin(submap.lat, submap.lng, submap.name, submap.descricao, submap.resumo);
    Map.panTo(new google.maps.LatLng(submap.lat, submap.lng));
    Map.setZoom(submap.zoom);
}

function getValueOfParam(parameter) {

    var loc = location.search.substring(1, location.search.length);
    var param_value = false;
    var params = loc.split('&');
    for (var i = 0; i < params.length; i++) {
        var param_name = params[i].substring(0, params[i].indexOf('='));
        if (param_name == parameter) {
            param_value = params[i].substring(params[i].indexOf('=') + 1);
        }
    }
    if (param_value) return param_value;
    else return false;
}

$(document).ready(function () {

    var c = getValueOfParam('c');

    $('#coord').css('visibility', 'hidden');
    $('#cross').css('visibility', 'hidden');

    if (c == 1) $('#coord').css('visibility', 'visible')
    else if (c == 2) $('#cross').css('visibility', 'visible');
    else if (c == 3) {
        $('#coord').css('visibility', 'visible');
        $('#cross').css('visibility', 'visible');
    }
});