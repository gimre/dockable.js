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

