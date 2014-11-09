( function ( w, d ) {

    w.onload = function ( ) {

        var model = {
            dragging: null,
            dockHandles: ( function ( ) {
                return [
                    'top-left',
                    'top',
                    'top-right',
                    'right',
                    'bottom-right',
                    'bottom',
                    'bottom-left',
                    'left',
                    'center'
                ].map( function ( handle ) {
                    var elem = d.createElement( 'div' );
                    elem.className = [ 'dockhandle', handle ].join( ' ' );
                    elem.dockableClassName = handle;
                    d.body.appendChild( elem );
                    return elem;
                } );
            } )( )
        };

        var addElementClass = function ( element, className ) {
            if ( !is( element, className ) ) {
                element.className += ' ' + className;
            }
        };

        var getOffset = function ( element, offsetKind ) {
            var offset = 0;
            while ( element.offsetParent ) {
                offset += element[ offsetKind ]
                element = element.offsetParent;
            }

            return offset;
        };

        var is = function ( element, className ) {
            return element.className && new RegExp( className ).test( element.className );
        };

        var moveElement = function ( element, x, y ) {
            element.style.left = x + 'px';
            element.style.top  = y + 'px';
        };

        var moveHandlesToElement = function ( element, hide ) {
            for ( var i = 0; i < model.dockHandles.length; i ++ ) {
                var handle = model.dockHandles[ i ];
                if ( hide ) {
                    removeElementClass( handle, 'visible' );
                } else {
                    addElementClass( handle, 'visible' );
                    element.appendChild( handle );
                }
            }
        };

        var moveToMouseEvent = function ( element, mouseEvent ) {
            var x = mouseEvent.pageX - model.dragging.offsetX,
                y = mouseEvent.pageY - model.dragging.offsetY;
            return moveElement( element, x, y );
        };

        var preventDefault = function ( ) {
            return false;
        };

        var removeElementClass = function ( element, className ) {
            element.className = element.className.replace( ' ' + className, '' );
        };

        d.body.ondragstart = preventDefault;
        d.body.ondrop      = preventDefault;

        w.addEventListener( 'mousedown', function ( event ) {
            var target = event.target;

            if ( is( target, 'dockable' ) ) {
                if ( is( target, 'docked' ) ) {
                    removeElementClass( target, 'docked' );
                    removeElementClass( target, target.dockedClassName );
                }

                model.dragging = {
                    target:  target,
                    offsetX: getOffset( target, 'offsetLeft' ),
                    offsetY: getOffset( target, 'offsetTop' ),
                    over: null
                };

                addElementClass( model.dragging.target, 'transitioned' );
                addElementClass( model.dragging.target, 'dragging' );
                moveToMouseEvent( model.dragging.target, event );
            };

        } );

        w.addEventListener( 'mousemove', function ( event ) {
            if ( model.dragging ) {
                var target = event.target;
                moveToMouseEvent( model.dragging.target, event );

                if ( target !== model.dragging.over && !is( target, 'dockhandle' ) ) {
                    moveHandlesToElement( target, !is( target, 'dropzone' ) );
                    model.dragging.over = target;
                }
            }
        } );

        w.addEventListener( 'mouseup', function ( event ) {
            var target = event.target;

            if ( model.dragging ) {
                if ( is( target, 'dockhandle' ) ) {
                    target.parentNode.appendChild( model.dragging.target );
                    addElementClass( model.dragging.target, 'docked' );
                    addElementClass( model.dragging.target, target.dockableClassName );
                    model.dragging.target.dockedClassName = target.dockableClassName;
                }
                moveHandlesToElement( null, true );
                moveElement( model.dragging.target, 0, 0 );
                removeElementClass( model.dragging.target, 'transitioned' );
                removeElementClass( model.dragging.target, 'dragging' );
                model.dragging = null;
            };
        } );

    };

} )( window, document );

