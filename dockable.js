// ( function ( w, d ) {
//     w.onload = function ( ) {

//         var model = {
//             dragging: null,
//             token: ( function ( ) {
//                 var token = d.createElement( 'div' );
//                 token.className = 'dockable-token';
//                 d.body.appendChild( token );
//                 return token;
//             } )( ),
//             dockZones: ( function ( ) {
//                 return [ 'top', 'right', 'bottom', 'left' ].map( function ( zone ) {
//                     var elem = d.createElement( 'div' );
//                     elem.className = [ 'dockable-dropzone dockable-transitioned', zone ].join( ' ' );
//                     d.body.insertBefore( elem, d.body.firstChild );
//                     return elem;
//                 } );
//             } )( ),
//             dockables: d.querySelectorAll( '[dockable]' )
//         };

//         var throttle = function ( fn, delay ) {
//             var lock = false;

//             return function ( ) {
//                 var args = arguments;

//                 if ( !lock ) {
//                     lock = true;
//                     fn.apply( fn, args );

//                     setTimeout( function () {
//                         lock = false;
//                     }, delay );
//                 }
//             }
//         };

//         var moveElement = function ( element, x, y ) {
//             transformElement( model.token, 'translate3d(' + x + 'px,' + y + 'px,' + 0 + ')' );
//         };

//         var moveToMouseEvent = function ( element, mouseEvent ) {
//             var x = mouseEvent.clientX + d.body.scrollLeft,
//                 y = mouseEvent.clientY + d.body.scrollTop;
//             return moveElement( element, x, y );
//         };

//         var transformElement = function ( element, value ) {
//             element.style.webkitTransform =
//             element.style.MozTransform =
//             element.style.transform = value;
//         };

//         var dragOnce = function ( e ) {
//             moveToMouseEvent( model.token, e );
//         };

//         var dragElement = dragOnce; //throttle( dragOnce, 250 );

//         var dragStart = function ( event ) {
//             model.dragging = event.target;
//             model.token.classList.add( 'dragging' );

//             model.dockZones.forEach( function ( zone ) {
//                 zone.classList.add( 'visible' );
//             } );

//             dragOnce( event );

//             w.addEventListener( 'mousemove', dragElement );
//         };

//         var dragEnd = function ( event ) {
//             if ( model.dragging ) {
//                 w.removeEventListener( 'mousemove', dragElement );

//                 dragOnce( event );

//                 model.dockZones.forEach( function ( zone ) {
//                     zone.classList.remove( 'visible' );
//                 } );

//                 model.token.classList.remove( 'dragging' );
//                 model.dragging = null;
//                 moveElement( model.token, 0, 0 );
//             }
//         };

//         var dockDragged = function ( event ) {
//             if ( model.dragging ) {
//                 model.dragging.classList.add( 'docked' );
//                 event.target.appendChild( model.dragging );
//             }
//         };
        
        
//         // hook-up

//         [].forEach.call( model.dockZones, function ( zone ) {
//             zone.addEventListener( 'mouseup', dockDragged );
//         } );

//         [].forEach.call( model.dockables, function ( elem ) {
//             elem.addEventListener( 'mousedown', dragStart );
//         } ) ;

//         w.addEventListener( 'mouseup', dragEnd );
//     };

// } )( window, document );

( function ( w, d ) {

    w.onload = function ( ) {

        var model = {
            dragging: null
        };

        var is = function ( element, className ) {
            return new RegExp( className ).test( element.className );
        };

        var moveElement = function ( element, x, y ) {
            element.style.left = x + 'px';
            element.style.top  = y + 'px';
        };

        var moveToMouseEvent = function ( element, mouseEvent ) {
            var x = mouseEvent.pageX - model.dragging.offsetX,
                y = mouseEvent.pageY - model.dragging.offsetY;
            return moveElement( element, x, y );
        };

        var noop = function ( ) {
            return false;
        };

        d.body.ondragstart = noop;
        d.body.ondrop      = noop;

        w.addEventListener( 'mousedown', function ( event ) {
            var target = event.target;

            if ( is( target, 'dockable' ) ) {
                model.dragging = {
                    target:  target,
                    offsetX: target.offsetLeft,
                    offsetY: target.offsetTop
                };

                model.dragging.target.className = model.dragging.target.className.replace( ' dragging', '' );
                model.dragging.target.className += ' dragging';
                moveToMouseEvent( model.dragging.target, event );
            };

        } );

        w.addEventListener( 'mousemove', function ( event ) {
            if ( model.dragging ) {
                moveToMouseEvent( model.dragging.target, event );
            }
        } );

        w.addEventListener( 'mouseup', function ( event ) {
            var target = event.target;

            if ( model.dragging ) {
                if ( is( target, 'dropzone' ) ) {
                    target.appendChild( model.dragging.target );
                }
                moveElement( model.dragging.target, 0, 0 );
                model.dragging.target.className = model.dragging.target.className.replace( ' dragging', '' );
                model.dragging = null;
            };
        } );

    };

} )( window, document );

