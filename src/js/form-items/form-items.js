const TOTAL_FORM_ITEMS = {
    'profile': [
        {
            'id': 'marker-main-type',
            'required': true
        },
        {
            'id': 'marker-media',
            'required': true
        },
        {
            'id': 'marker-name',
            'required': true
        },
        {
            'id': 'marker-description',
            'required': true
        },
        {
            'id': 'marker-position',
            'required': true
        },
        {
            'id': 'marker-view-type',
            'required': true
        },
        {
            'id': 'marker-radius-point',
            'required': true
        },
        {
            'id': 'marker-radius-layer',
            'required': true
        },
        {
            'id': 'marker-color',
            'required': true
        },
        {
            'id': 'marker-link',
            'required': true
        },
        {
            'id': 'marker-price-per-show',
            'required': true
        },
        {
            'id': 'marker-total-price',
            'required': true
        },
        {
            'id': 'marker-activation-date',
            'required': true
        },
        {
            'id': 'marker-target',
            'required': true
        },

    ],
    'event': [
        {
            'id': 'marker-main-type',
            'required': true
        },
        {
            'id': 'marker-media',
            'required': true
        },
        {
            'id': 'marker-name',
            'required': true
        },
        {
            'id': 'marker-description',
            'required': true
        },
        {
            'id': 'marker-position',
            'required': true
        },
        {
            'id': 'marker-view-type',
            'required': true
        },
        {
            'id': 'marker-radius-point',
            'required': true
        },
        {
            'id': 'marker-radius-layer',
            'required': true
        },
        {
            'id': 'marker-color',
            'required': true
        },
        {
            'id': 'marker-link',
            'required': true
        },
        {
            'id': 'marker-price-per-show',
            'required': true
        },
        {
            'id': 'marker-total-price',
            'required': true
        },
        {
            'id': 'marker-activation-date',
            'required': true
        },
        {
            'id': 'marker-target',
            'required': true
        },
        {
            'id': 'marker-date-event-begin',
            'required': true
        },
        {
            'id': 'marker-date-even-full',
            'required': true
        },
        {
            'id': 'marker-date-event-preview',
            'required': true
        },
    ],
}

var CURRENT_MARKER_TYPE = function () {
    return document.querySelector('#marker-main-type input:checked').value;
};
document.querySelectorAll('#marker-main-type input').forEach( input =>
    input.addEventListener('change', function (e) {
        resetVisibleItem(  CURRENT_MARKER_TYPE() );
    } )
);

function resetVisibleItem ( type ) {

    for( var initItem of document.querySelectorAll('.option-item-block') ){
        initItem.style.display = 'none';
    }
    for( var item of TOTAL_FORM_ITEMS[type] ){
        document.querySelector('#'+item.id).style.display = 'block';
    }

}

export  default function () {
    resetVisibleItem( CURRENT_MARKER_TYPE() );
};