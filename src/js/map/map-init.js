import markers from './../json/markers';
import MarkerClass from './actions.js';






    const GEOCODER_SELECTOR = document.querySelector('#geocoder');

    //const ACCESS_TOKEN  =  'pk.eyJ1IjoiYXJtaXN0YXIiLCJhIjoiY2plNWlkZXU0NGsyaTJxcGRna2dhd3N1ZSJ9.QRiyfxVwjx4NNJ39l-WHfA';
    //const MAP_STYLE     =   'mapbox://styles/armistar/cje5rli5e9wk82stbee6e2lpl';
    const ACCESS_TOKEN  =  'pk.eyJ1IjoiZ2V0aGVyb25lIiwiYSI6ImNqaDZlYjR3MzFtMGoycWxua3p0cjFhdzMifQ.me2KR-YMWtpyLOX840116A';
    const MAP_STYLE     =   'mapbox://styles/getherone/cjhgn3prm3psf2sryr59nt8zz';
    const MAP_CONTAINER = 'map';
    const INIT_MAP_CENTER = [ -77.04, 38.907 ];
    const DEFAULT_MAP_ZOOM = 14;
    const DEFAULT_MAP_MIN_ZOOM = 1;
    const DEFAULT_MAP_MAX_ZOOM = 20;

if( document.getElementById( MAP_CONTAINER ) ) {




    mapboxgl.accessToken = ACCESS_TOKEN;
    var map = new mapboxgl.Map({
        container: MAP_CONTAINER,
        style: MAP_STYLE,
        center: INIT_MAP_CENTER,
        zoom: DEFAULT_MAP_ZOOM,
        minZoom:DEFAULT_MAP_MIN_ZOOM,
        maxZoom:DEFAULT_MAP_MAX_ZOOM,
    });

    if( GEOCODER_SELECTOR ){
        var geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            placeholder: "Search...",
            zoom: DEFAULT_MAP_ZOOM,
            /*reverseMode: 'score',
            types: 'address'*/
        });
        GEOCODER_SELECTOR.appendChild(
            geocoder.onAdd(map)
        );
    }




    map.on('load', function() {

        var initMarker = new MarkerClass(map, '', markers);



        map.on('click', function (e) {

            initMarker.updateMarker();
            let currentCoordinates = initMarker.addMarker(e);

            initMarker.getAddressByCoordinates(currentCoordinates.coordinates.lat, currentCoordinates.coordinates.lng);


        });


        for ( var [key, value] of Object.entries(initMarker.markerProps)) {


            map.on('mouseenter', value.key , function(event) {

                initMarker.canvas.style.cursor = 'move';
                initMarker.isCursorOverPoint = true;
                map.dragPan.disable();

            });

            map.on('mouseleave', value.key, function() {

                initMarker.canvas.style.cursor = '';
                initMarker.isCursorOverPoint = false;
                map.dragPan.enable();

            });


        }

        map.on('mousedown', function (e) {

            if (!initMarker.isCursorOverPoint) return;

            initMarker.isDragging = true;
            initMarker.canvas.style.cursor = 'grab';

            map.on('mousemove', function (event) {
                initMarker.moveMarker(event,initMarker.isDragging );
            } );
            map.once('mouseup', function (event) {
                initMarker.onMarkerUp(event,initMarker.isDragging );
            } );


        } );


        document.querySelectorAll('#marker-view-type input').forEach( function (e) {

            e.addEventListener('change', function(e) {
                let newType = document.querySelector('#marker-view-type input:checked').value;
                initMarker.deleteMarker();
                initMarker.markerType = newType;

            });
        })

        /*$('#colorSelector').ColorPicker({
            color: '#222',
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                $('#colorSelector div').css('backgroundColor', '#' + hex);
                initMarker.changeProp('color', '#' + hex);
                initMarker.updateMarker();

            }
        });*/

        $( "#slider-range-min" ).slider({
            range: "min",
            value: initMarker.getProp('size') * 1000,
            min: 1,
            max: 999,
            slide: function( event, ui ) {

                var sizeVal = ui.value/1000;
                initMarker.changeProp('size', sizeVal);
                initMarker.updateMarker();

                $( ".ui-slider-handle" ).attr('data-value',  ui.value + ' m');
            }
        });
        $( ".ui-slider-handle" ).attr('data-value',  $( "#slider-range-min" ).slider( "value" ) + ' m');



        $( "#main-slider-range-min" ).slider({
            range: "min",
            value: 30,
            min: 1,
            max: 999,
            slide: function( event, ui ) {

                var sizeVal = ui.value/1000;
                //sizeVal = initMarker.checkMarkerSizeRadius(sizeVal);
                initMarker.markerRadiusProps.size = sizeVal;
                initMarker.updateMarkerRadius();

                $( "#main-amount" ).val( ui.value  + "м"  );
            }
        });
        $( "#main-amount" ).val( $( "#main-slider-range-min" ).slider( "value" ) + "м" );




        /*SEARCH*/
        var classItemResult = 'search-item-result';
        //let seeachResultItem = document.querySelector('.search-item-result');
        //if( seeachResultItem ){
        document.addEventListener( "click", seeachResultListener );

        function seeachResultListener(event){
            var element = event.target;
            if(element.className == classItemResult ){
                let resultAddress = element.innerHTML;
                let resultLon = element.getAttribute('data-lon');
                let resultLat = element.getAttribute('data-lat');
                document.querySelector('.search-input').value = resultAddress;
                map.flyTo( {center: [resultLon, resultLat ], zoom: 14} );
                //initMarker.updateMarker();
                initMarker.addMarker( false, resultLat,resultLon);

            }
        }


        document.querySelector('.openstreetmap-search-block').addEventListener('submit',function (event) {
            event.preventDefault();
            let searchVal = document.querySelector('.search-input').value;
            let resultSearchHtml = '';
            let apiGeocoder = 'https://nominatim.openstreetmap.org/search.php?format=json&q='+searchVal;
            console.log(apiGeocoder);
            fetch(apiGeocoder)
                .then(
                    function(response) {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' +
                                response.status);
                            return;
                        }

                        // Examine the text in the response
                        response.json().then(function(data) {

                            console.log(data);
                            if(data.length > 0){
                                for( var dataItem of data ){
                                    resultSearchHtml += '<div class="'+ classItemResult +'" data-lat="'+ dataItem.lat +'" data-lon="'+ dataItem.lon +'" data->'+ dataItem.display_name +'</div>';
                                }
                            }else{
                                resultSearchHtml = 'NO result'
                            }


                            document.querySelector('.openstreetmap-search-result').innerHTML = resultSearchHtml;

                        });
                    }
                )
                .catch(function(err) {
                    console.log('Fetch Error :-S', err);
                    return false;
                });
        })


    });

}

export { map, geocoder };