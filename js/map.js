var overlayMap;
var overlayTer;

var terVisible = false;

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
            { visibility: "off" }
          ]
      }
    ];

    var styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map" });

    Map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        minZoom: 4,
        maxZoom: 8,
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
        strokeColor: 'darkblue',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    polyGon = new google.maps.Polygon({
        map: Map,
        path: [],
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        draggable: true
    });

    google.maps.event.addListener(polyGon, "drag", function (dragEvent) {
        var polyGonPoints = this.getPath().getArray();
        $.each(polyGonPoints, function (index, val) {
            var polyGonPoint = val;
            outlineMarkers[index].setPosition(polyGonPoint);
        });
    });

    google.maps.event.addListener(Map, "rightclick", function (event) {
        //event.preventDefault();

        var markerIndex = poly.getPath().length;
        poly.setMap(Map);
        var isFirstMarker = markerIndex === 0;
        var marker = new google.maps.Marker({
            map: Map,
            position: event.latLng,
            draggable: true
        });

        google.maps.event.addListener(marker, 'rightclick', function () {
            marker.setMap(null);
        });

        if (isFirstMarker) {
            google.maps.event.addListener(marker, 'click', function () {
                var path = poly.getPath();
                polyGon.setPath(path);
                polyGon.setMap(Map);
                
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

                google.maps.event.addListener(polyGon, 'rightclick', function () {
                    polyGon.setMap(null);
                });
            });
            marker.setIcon('img/firstIcon.png');
        } else {
            marker.setIcon('img/secondsIcons.png');
        }
        
        poly.getPath().push(event.latLng);

        outlineMarkers.push(marker);

        google.maps.event.addListener(marker, 'drag', function (dragEvent) {     
            poly.getPath().setAt(markerIndex, dragEvent.latLng);
            updateDistance(outlineMarkers);
        });

        updateDistance(outlineMarkers);
    });

    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-5.134475371454281, -79.50845859491564),
        new google.maps.LatLng(30.67883861843332, 6.762828376789505));

    overlayMap = new USGSOverlay(bounds, Map);

    document.getElementById('refresh').addEventListener('click', function () {
        outlineMarkers = new Array();
        initMap();
    });
    
    document.getElementById('territorios').addEventListener('click', function () {
        if(!terVisible) {
            $('#map-territorios').css('visibility', 'visible');
            terVisible = true;
        } else {
            $('#map-territorios').css('visibility', 'hidden');
            terVisible = false;
        }
    });

    Map.addListener('click', function(e) {
        //console.log('lat: ' + e.latLng.lat().toFixed(3) + ', lng: ' + e.latLng.lng().toFixed(3));
    });

    Map.addListener('mouseover', function () {
        Map.addListener('mousemove', function (e) {
            $('#coordenadas').val('Lat ' + e.latLng.lat().toFixed(3) + ' | Lng ' + e.latLng.lng().toFixed(3));
        });
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
            drawingModes: [
              google.maps.drawing.OverlayType.MARKER,
              google.maps.drawing.OverlayType.CIRCLE,
              google.maps.drawing.OverlayType.POLYGON,
              google.maps.drawing.OverlayType.POLYLINE,
              google.maps.drawing.OverlayType.RECTANGLE
            ]
        },
        markerOptions: { icon: 'img/firstIcon.png' },
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
        }
    });
    drawingManager.setMap(Map);
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
    imgTer.src = 'img/OsTerritóriosConhecidos.png';
    imgTer.style.width = '100%';
    imgTer.style.height = '100%';
    imgTer.style.position = 'absolute';
    imgTer.style.visibility = 'hidden';
    imgTer.id = 'map-territorios';
    div.appendChild(imgTer);

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
        switch(vel){
            case 4.17: $('#tempo').attr('title', 'descansando 1h e 30min a cada 50km'); break;
            case 7.14: $('#tempo').attr('title', 'descansando 2hs a cada 50km'); break;
            case 11.11: $('#tempo').attr('title', 'descansando 30min a cada 50km'); break;
            case 33.33: $('#tempo').attr('title', 'descansando 30min a cada 50km'); break;
        }
    }

    $('#tempo').val(result);
}

function subMap(){
    var name = $('#pesquisa').val();
    var submap = getSubMap(name);
    //console.log('name: ' + submap.name + ' | lat: ' + submap.lat + ' | lng: ' + submap.lng + ' | zoom: ' + submap.zoom);
    Map.panTo(new google.maps.LatLng(submap.lat, submap.lng));
    Map.setZoom(submap.zoom);
    
    
}