
    const EDIT_MODE_SELECTOR = document.querySelector("input[name='edit-mode']");
    const MARKER_TYPE_SELECTOR = document.querySelector("input[name='marker-type']");

    const initialStateOptions = {
        'editMode': false,
        'drawMode': false,
        'activeType': '',
    };


    function updateEditMode(){

    }

    $('#datepicker-main').datetimepicker();
    $('#datepicker-event-begin').datetimepicker();
    $('#datepicker-event-total').datetimepicker();
    $('#datepicker-event-preview').datetimepicker();


    $( ".checkbox-ui" ).checkboxradio();


   /* $('#colorSelector').ColorPicker({
        color: '#0000ff',
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
        }
    });*/


    $( "#slider-years-old-from" ).slider({
        range: "min",
        value: 18,
        min: 1,
        max: 100,
        slide: function( event, ui ) {

            var sizeVal = ui.value/1000;
            $( "#years-old-from" ).val( ui.value   );
        }
    });
    $( "#years-old-from" ).val( $( "#slider-years-old-from" ).slider( "value" )  );

    $( "#slider-years-old-to" ).slider({
        range: "min",
        value: 18,
        min: 1,
        max: 100,
        slide: function( event, ui ) {

            var sizeVal = ui.value/1000;
            $( "#years-old-to" ).val( ui.value   );
        }
    });
    $( "#years-old-to" ).val( $( "#slider-years-old-to" ).slider( "value" )  );








    /*  let editModeSelector = $("input[name='edit-mode']");
      let markerTypeSelector = $("input[name='marker-type']");
  *//*
    function getEditMode() {
        var editMode = $("input[name='edit-mode']:checked").val();
        if (editMode == 'false') {
            $('.map-marker-edit-block').hide('fast');
            return false;
        } else {
            $('.map-marker-edit-block').show('fast');
            return true;
        }
    }

    function getDrawMode() {
        var DrawMode = $("input[name='draw-mode']:checked").val();
        if (DrawMode == 'false') {
            return false;
        } else {
            return true;
        }
    }

    function setDrawMode($status) {

        $("input[name='draw-mode']").each(function () {
            if ($status === $(this).val()) {
                console.log('TRUE TO CHECK');
                $(this).prop('checked', true);
                $("input[name='draw-mode']").checkboxradio("refresh");
                return true;
            }
        })
        return false;
    }

    function getActiveMarker() {
        var markerType = $("input[name='marker-type']:checked").val();
        if (markerType) {
            $('.map-marker-type-item').hide('fast');
            $('.map-marker-type-item[data-type="' + markerType + '"]').show('fast');
            return markerType;
        } else {
            $('.map-marker-type-item').hide('fast');
            return false;
        }
    }

    function getMarkerType() {
        return markerType = $("input[name='marker-type']:checked").val();
    }

    getEditMode();
    setDrawMode('false');
    getActiveMarker();


    markerTypeSelector.on('change', function () {
        var yy = getActiveMarker();
        console.log(yy);
    })
    editModeSelector.on('change', function () {
        var ii = getEditMode();
        console.log(ii);
    })

*/
   /* $("input.radio-btn").checkboxradio();

    $("input[name='draw-mode']").on('change', function () {
        if (getDrawMode()) {
            draw.changeMode('draw_polygon');
        } else {
            draw.changeMode('simple_select');
        }
    });*/





/*function cube(x) {
    return x * x * x;
}*/
//const foo = Math.PI + Math.SQRT2;
//export { cube, foo };