
$(function () {


    /**
     * Front page
     */


    $( "input.radio-btn" ).checkboxradio();


    var editModeSelector = $( "input[name='edit-mode']" );
    var markerTypeSelector = $( "input[name='marker-type']" );

    function getEditMode(){
        var editMode = $( "input[name='edit-mode']:checked" ).val();
        if( editMode == 'false' ){
            $('.map-marker-edit-block').hide('fast');
            return false;
        }else{
            $('.map-marker-edit-block').show('fast');
            return true;
        }
    }
    getEditMode();

    function getDrawMode(){
        var DrawMode = $( "input[name='draw-mode']:checked" ).val();
        if( DrawMode == 'false' ){
            return false;
        }else{
            return true;
        }
    }
    function setDrawMode( $status ){

        $( "input[name='draw-mode']").each(function () {
            if( $status === $(this).val() ) {
                console.log('TRUE TO CHECK');
                $(this).prop( 'checked', true);
                $("input[name='draw-mode']" ).checkboxradio( "refresh" );
                return true;
            }
        })
        return false;
    }
    setDrawMode('false');

    $( "input[name='draw-mode']" ).on('change', function(){
        if( getDrawMode() ){
            draw.changeMode('draw_polygon');
        }else{
            draw.changeMode('simple_select');
        }
    });


    function getActiveMarker(){
        var markerType = $( "input[name='marker-type']:checked" ).val();
        if( markerType ){
            $('.map-marker-type-item').hide('fast');
            $('.map-marker-type-item[data-type="'+ markerType +'"]').show('fast');
            return markerType;
        }else{
            $('.map-marker-type-item').hide('fast');
            return false;
        }
    }
    getActiveMarker();


    markerTypeSelector.on('change', function () {
        var yy = getActiveMarker();
        console.log(yy);
    })
    editModeSelector.on('change', function () {
        var ii = getEditMode();
        console.log(ii);
    })


    function getMarkerType() {
        return markerType = $( "input[name='marker-type']:checked" ).val();
    }


    /* Main map init */

    var initMapCenter = [30.52268227028,50.4471396113985];
    var markerSourceName = 'markerpoly';
    var markerPointSourceName = 'markerpoint';
    var GeoJSONCircleDefSize = 0.03; // kilometrs
    var initMapZoom = 16
    var maxZoom = 20;
    var minZoom = 1;
    var drawControl = false;



    var isDragging;
    var isCursorOverPoint;


    /* Toolbar */
    var statusEdit = document.querySelectorAll('.edit-status input[type=radio][name="edit"]');

    function changeHandler(event) {

        if ( this.value === 'edit-true' ) {
            document.querySelector('.edit-board').style.display = "block";
        } else if ( this.value === 'edit-false' ) {
            document.querySelector('.edit-board').style.display = "none";
        }
    }

    Array.prototype.forEach.call(statusEdit, function(radio) {
        radio.addEventListener('change', changeHandler);
    });
    document.querySelector('.size input').addEventListener('change', function (event) {

        var sizeVal = this.value/1000;

    })

    $( "#slider-range-min" ).slider({
        range: "min",
        value: 37,
        min: 1,
        max: 999,
        slide: function( event, ui ) {

            //console.log('VAL:',ui.value);
            var sizeVal = ui.value/1000;

            var markerCoordinates = map.getSource(markerSourceName);
            if( markerCoordinates ) {

                let color;
                var polygon = turf.polygon(markerCoordinates._data.features[0].geometry.coordinates);
                var center = turf.centerOfMass(polygon);
                console.log('Center:', center.geometry.coordinates);
                GeoJSONCircleDefSize = sizeVal;
                var JSONCircle = createGeoJSONCircle(center.geometry.coordinates, GeoJSONCircleDefSize, 60);


                var checkInt = checkIntersection(JSONCircle.data.features[0]);
                if(checkInt){
                    color = 'red';
                }else{
                    color = 'blue';
                }
                map.setPaintProperty( markerSourceName, 'fill-color', color );

                markerCoordinates.setData(JSONCircle.data);



            }


            $( "#amount" ).val( ui.value  + "м"  );
        }
    });
    $( "#amount" ).val( $( "#slider-range-min" ).slider( "value" ) + "м" );




    /* END Toolbar */





    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJtaXN0YXIiLCJhIjoiY2plNWlkZXU0NGsyaTJxcGRna2dhd3N1ZSJ9.QRiyfxVwjx4NNJ39l-WHfA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/armistar/cje5rli5e9wk82stbee6e2lpl', // stylesheet location
        center: initMapCenter,
        zoom: initMapZoom
    });

    var draw = new MapboxDraw({
        styles: [
            // ACTIVE (being drawn)
            // polygon fill
            {
                "id": "gl-draw-polygon-fill",
                "type": "fill",
                "paint": {
                    "fill-color": "blue",
                    "fill-outline-color": "blue",
                    "fill-opacity": 0.8
                }
            },
            // polygon outline stroke
            // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
            {
                "id": "gl-draw-polygon-stroke-active",
                "type": "line",
                "layout": {
                    "line-cap": "round",
                    "line-join": "round"
                },
                "paint": {
                    "line-color": "blue",
                    "line-width": 3
                }
            },
            // vertex points
            {
                "id": "gl-draw-polygon-and-line-vertex-active",
                "type": "circle",
                "paint": {
                    "circle-radius": 5,
                    "circle-color": "black",
                }
            }
        ],
        displayControlsDefault: false,
        properties: {
            color: 'green'
        },
        /*style: [{
            'id': 'custom-polygon',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
            'paint': {
                'fill-color': '#f16852',
                'fill-opacity': 0.1
            },
            'interactive': true
        }],*/
        controls: {
            polygon: false,
            trash: false,
            point: false,
            line_string: false,
            combine_features: false
        }
    });


    //console.log('attributionControl:', map.attributionControl() );
    //console.log(map); // undefined

    map.addControl(draw);
    drawControl = true;

    //console.log(map); // returns map instance

    //map.addControl(customControl);

    //console.log(customControl._map); // returns map instance
    /*draw.actionable(
        {
            actions: {
                polygon: false,
                trash: false,
                point: false,
                line_string: false,
                combine_features: false
            }
        }
    );*/

    map.on('draw.update', function (e) {

        // if( e.action == 'move'){
        var featuresPolygon = e.features[0];

        var checkInt = checkIntersection( featuresPolygon );
        console.log('checkInt:',checkInt);
        if(checkInt){
            color = 'red';
        }else{
            color = 'blue';
        }
        map.setPaintProperty('gl-draw-polygon-fill.cold', 'fill-color', color);
        //}


        /* console.log('UPDATE:', e.features[0].id );
         console.log('ALL:', e );
         console.log( map.getStyle() );
         console.log( map.getLayer('gl-draw-polygon-fill.cold') );
         //draw.setFeatureProperty('gl-draw-polygon-fill.cold', 'fill-color', 'black');
         //draw.setFeatureProperty('gl-draw-polygon-fill.hot', 'fill-color', 'black');
         console.log('UPDATE:', e.features );*/
    });
    map.on('draw.create', function (e) {
        console.log('JUST CREATE!');
        //draw.changeMode('simple_select');
        setDrawMode('false');
    });
    map.on('draw.delete', function (e) {
        /*if( getDrawMode() ) {
            draw.changeMode('draw_polygon');
        }*/
    });



    map.setMinZoom(minZoom);
    map.setMaxZoom(maxZoom);

    var canvas = map.getCanvasContainer();

    function mouseDown() {

        if (!isCursorOverPoint) return;

        isDragging = true;

        // Set a cursor indicator
        canvas.style.cursor = 'grab';

        // Mouse events

        map.on('mousemove', onMove);
        map.once('mouseup', onUp);
    }

    function checkIntersection( JSONCircle ) {

        var returnIntersect = false;

        //var userPolygon = JSONCircle.data.features[0];
        var userPolygon = JSONCircle;



        var polygonBoundingBox = turf.bbox(userPolygon);
        var southWest = [polygonBoundingBox[0], polygonBoundingBox[1]];
        var northEast = [polygonBoundingBox[2], polygonBoundingBox[3]];
        var northEastPointPixel = map.project(northEast);
        var southWestPointPixel = map.project(southWest);

        var features = map.queryRenderedFeatures( [southWestPointPixel, northEastPointPixel],{
            layers: [
                'water',
                'polygon',
                'road-primary',
                'road-street',
                'road-service-link-track',
                'road-secondary-tertiary'
            ]
        });

        if( features ){

            $.each(features, function(index, value) {

                if( returnIntersect === false){

                    // Line
                    var intersectionLine = turf.lineIntersect( value, userPolygon);
                    if( intersectionLine.features[0] ) {
                        returnIntersect = true;
                        return;
                    }

                    // Polygon
                    var intersection = turf.intersect( value, userPolygon);
                    if( intersection ) {
                        returnIntersect = true;
                        return;
                    }

                    // Polygon MultiPolygon
                    // Inside polygon
                    if(  userPolygon.geometry.coordinates[0][0]  ){
                        if( value._geometry.type == 'Polygon' || value._geometry.type == 'MultiPolygon'){
                            var booleanPointInPolygon = turf.booleanPointInPolygon(  userPolygon.geometry.coordinates[0][0], value);
                            if( booleanPointInPolygon ) {
                                returnIntersect = true;
                                return;
                            }
                        }
                    }


                }

            });
        }

        return returnIntersect;

    }
    function onMove(e) {

        if (!isDragging) return;

        var coords = e.lngLat;


        var JSONCircle =  createGeoJSONCircle( [coords.lng, coords.lat], GeoJSONCircleDefSize, 60);
        var checkInt = checkIntersection(JSONCircle.data.features[0]);
        console.log('checkInt:',checkInt);
        if(checkInt){
            color = 'red';
        }else{
            color = 'blue';
        }
        map.setPaintProperty( markerSourceName, 'fill-color', color );

        //map.setPaintProperty( 'road-service-link-track', 'line-color', 'red');
        /*map.setPaintProperty( 'road-service-link-track', 'line-width',{
            "base": 1.5,
            "stops": [
                [
                    10,
                    1
                ],
                [
                    16,
                    2
                ]
            ]
        });
        */




        // Set a UI indicator for dragging.
        canvas.style.cursor = 'grabbing';


        // Update the Point feature in `geojson` coordinates
        // and call setData to the source layer `point` on it.
        map.getSource( markerSourceName ).setData( JSONCircle.data );

    }

    function onUp(e) {
        if (!isDragging) return;
        var coords = e.lngLat;

        canvas.style.cursor = '';
        isDragging = false;

        // Unbind mouse events
        map.off('mousemove', onMove);
    }



    function createGeoJSONCircle(center, radiusInKm, points) {
        if(!points) points = 64;

        var coords = {
            latitude: center[1],
            longitude: center[0]
        };

        var km = radiusInKm;

        var ret = [];
        var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
        var distanceY = km/110.574;

        var theta, x, y;
        for(var i=0; i<points; i++) {
            theta = (i/points)*(2*Math.PI);
            x = distanceX*Math.cos(theta);
            y = distanceY*Math.sin(theta);

            ret.push([coords.longitude+x, coords.latitude+y]);
        }
        ret.push(ret[0]);

        return {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }
                ]
            },

        };
    };



    map.on('zoom', zoomMarker);
    map.on('click', addMarker);

    function zoomMarker(event) {

    }




    function addMarker(event){


        let markerType = getMarkerType();
        let editMode = getEditMode();
        if( editMode == false){
            return false;
        }
        console.log('TYPE:',markerType);

        if( markerType == 'circle'  ){
            console.log('drawControl:',drawControl);
            if( drawControl == true){
                map.removeControl(draw);
                drawControl = false;
            }
            console.log('drawControl:',drawControl);

            var features = map.queryRenderedFeatures(event.point);
            //console.log('Add center:', event.lngLat.lng, event.lngLat.lat);
            // Get type of point
            if( features.length > 0 ){
                var markerName = features[0].layer.id;
                var layerType = features[0].layer.type;
                var layerSource = features[0].layer.source;

                console.log(
                    'ID:', markerName,
                    'Type:', layerType,
                    'Source:', layerSource,
                    'all layer',features[0].layer
                ) ;
            }else{
                console.log('Normal label');
            }


            var currentItem = map.getSource(markerSourceName);
            if( currentItem ){
                console.log('LAYER REMOVE');
                map.removeLayer(markerSourceName);
                map.removeSource(markerSourceName);
            }else{
                console.log('FALSE LAYER REMOVE');
            }



            var dataJsonCircle = createGeoJSONCircle( [event.lngLat.lng, event.lngLat.lat], GeoJSONCircleDefSize, 60);

            var color = 'blue';

            var checkInt = checkIntersection(dataJsonCircle.data.features[0]);
            if(checkInt){
                color = 'red';
            }else{
                color = 'blue';
            }

            map.addSource(markerSourceName, dataJsonCircle);

            map.addLayer({
                "id": markerSourceName,
                "type": "fill",
                "source": markerSourceName,
                "layout": {},
                "paint": {
                    "fill-color": color,
                    //"fill-opacity": 0.6
                }
            });
        }

        if( markerType == 'polygon' ){
            console.log('drawControl:',drawControl);
            if( drawControl == false){
                map.addControl(draw);
                drawControl = true;
            }
            console.log('drawControl:',drawControl);
            if( draw.getAll() ){
                if( draw.getAll().features.length > 1){
                    console.log('DEL');
                    draw.delete( draw.getAll().features[0].id );
                }
            }

            //map.addControl(draw);
        }

        if( markerType == 'point' ){
            console.log('drawControl:',drawControl);
            if( drawControl == true){
                map.removeControl(draw);
                drawControl = false;
            }


            var currentItem = map.getSource(markerSourceName);
            if( currentItem ){
                map.removeLayer(markerSourceName);
                map.removeSource(markerSourceName);
            }


            var dataJsonCircle = createGeoJSONCircle( [event.lngLat.lng, event.lngLat.lat], 0.010, 60  );

            var color = 'blue';

            var checkInt = checkIntersection(dataJsonCircle.data.features[0]);
            if(checkInt){
                color = 'red';
            }else{
                color = 'blue';
            }

            map.addSource(markerSourceName, dataJsonCircle);

            map.addLayer({
                "id": markerSourceName,
                "type": "fill",
                "source": markerSourceName,
                "layout": {},
                "paint": {
                    "fill-color": color,
                    //"fill-opacity": 0.6
                }
            });


        }



    }

    /* End Map init */



    /* geocoder init */

    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        placeholder: "Search...",
        zoom: 16,
    });

    document.getElementById('geocoder').appendChild(
        geocoder.onAdd(map)
    );

    /* End geocoder init */

    // After the map style has loaded on the page, add a source layer and default
    // styling for a single point.
    map.on('load', function() {

        //map.setPaintProperty('water', 'fill-color', 'red');


        map.addSource("polygon", createGeoJSONCircle( initMapCenter , GeoJSONCircleDefSize, 50));

        map.addLayer({
            "id": "polygon",
            "type": "fill",
            "source": "polygon",
            "layout": {},
            "paint": {
                "fill-color": "blue",
                "fill-opacity": 0.6
            }
        });


        /*  var popup = new mapboxgl.Popup({
              closeButton: true,
              closeOnClick: true
          });*/

        // When the cursor enters a feature in the point layer, prepare for dragging.
        map.on('mouseenter', markerSourceName, function(event) {
            //map.setPaintProperty(markerSourceName, 'fill-color', '#3bb2d0');
            canvas.style.cursor = 'move';
            isCursorOverPoint = true;
            map.dragPan.disable();

            /*  popup.setLngLat([event.lngLat.lng, event.lngLat.lat])
                  .setHTML('Hello world!')
                  .addTo(map)*/;


        });

        map.on('mouseleave', markerSourceName, function() {
            // map.setPaintProperty(markerSourceName, 'fill-color', '#3887be');
            canvas.style.cursor = '';
            isCursorOverPoint = false;
            map.dragPan.enable();

            //popup.remove();
        });

        map.on('mousedown', mouseDown);



        // Listen for the `geocoder.input` event that is triggered when a user
        // makes a selection and add a symbol that matches the result.
        geocoder.on('result', function(ev) {
            var searchResult = 'Type:'+ev.result.geometry.type+'<br> DATA:'+ ev.result.geometry.coordinates;
            $('.output-search-adress').html(searchResult);
            //map.getSource('earthquakes').setData(ev.result.geometry);
        });

    });





})


/*function cube(x) {
    return x * x * x;
}*/
//const foo = Math.PI + Math.SQRT2;
//export { cube, foo };