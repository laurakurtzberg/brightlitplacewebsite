/*******
    Selecting different parts of the HTML for use in scrollytelling
*****/
var main = document.getElementById("main");
var scrolly = document.getElementById("scrolly");
var figure = document.getElementById("mapfigure");
var article = document.getElementById("articlecontainer");
var steps = document.querySelectorAll(".step");
var startingScreenWidth = window.screen.width;

/*******
    Simple functions to show and hide legend divs
*****/
function showLegend(legendId) {
    document.getElementById(legendId).classList.remove('invisible');
};

function hideLegend(legendId) {
    document.getElementById(legendId).classList.add('invisible');
};

/* these next two are just for the mobile version */
function revealLegend(legendId) {
    document.getElementById(legendId).style.transform = "translateX(0)";
}

function sidelineLegend(legendId) {
    document.getElementById(legendId).style.transform = "translateX(120%)";
}

/*******
    OPENLAYERS definitions and functions start here
*****/

/*
    Latitude and Longitude locations for use in scrollytelling
    when animating the map view
*/
const initialView = ol.proj.fromLonLat([-80.909245, 26.275135]);
const initialViewMobile = ol.proj.fromLonLat([-80.98998, 25.69]);
const centerLakeOkeechobee = ol.proj.fromLonLat([-81.104702, 26.881064]);
const southofLakeOkeechobee = ol.proj.fromLonLat([-80.798088, 26.541511]);
const southofLakeOMobile = ol.proj.fromLonLat([-80.799332, 26.268767]);
const staView = ol.proj.fromLonLat([-80.582250,26.583095]);
const staViewMobile = ol.proj.fromLonLat([-80.571425, 26.3]);
const treeIslands = ol.proj.fromLonLat([-80.6731, 25.7615]);
const treeIslandsMobile = ol.proj.fromLonLat([-80.6731, 25.45]);
const southView = ol.proj.fromLonLat([-80.6855, 25.7184]);

/* initializing the OpenLayers map view */
const view = new ol.View({
    center: initialView,
    zoom: 9,
});

const mobileView = new ol.View({
    center: initialViewMobile,
    zoom: 8,
});

/*
   the following 12 const variables are the vector map layers we need,
   (they don't include the two tif raster layers)
*/
const oceansLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/oceans.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: {
        'fill-color': 'rgba(0,6,7,0.6)',
    },
});

const floridaHistoryLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/florida-history-landcover.geojson',
        format: new ol.format.GeoJSON(),
    }),
    opacity: 0,
    style: {
        'fill-color': ['string', ['get', 'colorcode'], '#eee'],
    },
});

const urbanizedLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/agriculture-and-urban.geojson',
        format: new ol.format.GeoJSON(),
    }),
    opacity: 0,
    style: {
        'fill-color': ['string', ['get', 'colorcode'], '#eee'],
    },
});

const historyOkeechobee = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/lake-okeechobee-before.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: {
        'fill-color': ['string', '#03031a']
    },
});

const currentOkeechobee = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/lake-okeechobee-after.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: {
        'fill-color': ['string', '#03031a']
    },
});

const canalsLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/canals.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: {
        'stroke-color': ['string', ['get', 'colorcode'], '#eee'],
        'stroke-width': 2
    },
});

const staLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/fixed-sta-boundaries.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: {
        'fill-color': ['string', 'rgba(0,0,0,0.5)'],
        'stroke-color': ['string', '#f9e613'],
        'stroke-width': 2
    },
});

const sugarcaneLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/simplified-sugarcane.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: {
        'fill-color': ['string', 'rgba(234,223,185,0.5)']
    },
});

const caloosahatcheeLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/caloosahatchee.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: {
        'stroke-color': ['string', '#47efe7'],
        'stroke-width': 2
    },
});

const tamiamitrailLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/tamiamitrail.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: {
        'stroke-color': ['string', '#e77148'],
        'stroke-width': 2
    },
});

const sloughPolygonStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(29, 60, 69, 0.8)',
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1,
    }),
});

const sharksloughLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/shark-river-slough.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: sloughPolygonStyle
});

const taylorsloughLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/taylor-slough.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: sloughPolygonStyle
});

const labelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '16px sans-serif',
        fill: new ol.style.Fill({
            color: [255, 255, 255, 1],
        }),
        backgroundFill: new ol.style.Fill({
            color: [0, 0, 0, 0.6],
        }),
        padding: [2, 2, 2, 2],
    }),
});


const tamiamiTrailLocationsPointLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/tt-labels.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
        labelStyle
            .getText()
            .setText(feature.get('name'))
        return labelStyle;
    },
});

/* inializing the map variable so all functions have access */
var map;

/*
  fetching the basemap geotiff image, and adding as background
  to newly initialized ol.Map
*/
fetch('./data/basemap2.tif')
    .then((response) => response.blob())
    .then((blob) => {
        const tiffsource = new ol.source.GeoTIFF({
            sources: [
                {
                    blob: blob,
                },
              ],
        });

        map = new ol.Map({
            target: 'map',
            controls: [],
            interactions: [],
            layers: [
                new ol.layer.WebGLTile({
                    source: tiffsource,
                }),
                oceansLayer
            ],
            view: view,
        });

    });

var treeislandLayer;

function addTreeIslandLayer() {
    fetch('./data/treeislands2.tif')
        .then((response) => response.blob())
        .then((blob) => {
            const treeislandsource = new ol.source.GeoTIFF({
                sources: [
                    {
                        blob: blob,
                    },
                  ],
            });

            treeislandLayer = new ol.layer.WebGLTile({
                source: treeislandsource
            });

            map.addLayer(treeislandLayer);
        });
}

function isLayerOnMap(layerName) {
    if (map) {
        return map.getLayers().getArray().includes(layerName);
    }
}

/*
  list of all vector and raster layers that need to be reset
  when the map is scrolled (see resetMap function)...
  these do not include oceansLayer and the raster background, which stay
*/
const layerList = [
  floridaHistoryLayer,
  historyOkeechobee,
  urbanizedLayer,
  canalsLayer,
  staLayer,
  sugarcaneLayer,
  caloosahatcheeLayer,
  currentOkeechobee,
  tamiamitrailLayer,
  tamiamiTrailLocationsPointLayer,
  taylorsloughLayer,
  sharksloughLayer,
  treeislandLayer
];

const legendAndSourceList = [
  'historySource',
  'historyLegend',
  'urbanizationSource',
  'urbanizationLegend',
  'sugarcaneLegend',
  'sugarcaneSource',
  'staLegend',
  'riverSource',
  'riverLegend',
  'treeIslandSource',
  'ttSource'
];

/*
   on some moments in the scroll, the map didn't have enough time to remove things
   before the user moved on to the next scroll, so I made these funcitons
   to remove everything every time
*/
function removeLegendsAndSources() {
    for (const item of legendAndSourceList) {
        hideLegend(item);
    }
}

function resetMap() {
    for (const layer of layerList) {
        if (isLayerOnMap(layer)) {
            map.removeLayer(layer);
        }
    }

    // this one doesn't work in the loop for some reason, adding here
    map.removeLayer(treeislandLayer);

    removeLegendsAndSources();
}


/*
    a function to fade in a layer,
    courtesy of https://codepen.io/maptastik/pen/qLrdyG
*/
function fadeInLayer(lyr, startOpacity, finalOpacity, opacityStep, delay) {
    let opacity = startOpacity;
    let timer = setTimeout(function changeOpacity() {
        if (opacity < finalOpacity) {
            lyr.setProperties({
                opacity: opacity
            });
            opacity = opacity + opacityStep
        }

        timer = setTimeout(changeOpacity, delay);
    }, delay)
};

/*
    a function to fade out the layer,
    based on the fadeInLayer function above
*/
function fadeOutLayer(lyr, startOpacity, finalOpacity, opacityStep, delay) {
    let opacity = startOpacity;
    let timer = setTimeout(function changeOpacity() {
        if (opacity > finalOpacity) {
            lyr.setProperties({
                opacity: opacity
            });
            opacity = opacity - opacityStep
        }

        timer = setTimeout(changeOpacity, delay);
    }, delay)
};


/*
  swipe code is based on OpenLayers example found here:
  https://openlayers.org/en/latest/examples/layer-swipe.html
*/

/* swipe input element to connect to map layer */
const swipe = document.getElementById('swipe');

/*
  Adding in the "before" and "after" lake layers to make the slidey effect
  also, adding the Caloosahatchee River layer and corresponding legend & source
*/
function addLakeComparisonLayers() {
    map.addLayer(currentOkeechobee);
    map.addLayer(historyOkeechobee);
    map.addLayer(caloosahatcheeLayer);
    showLegend('riverLegend');
    showLegend('riverSource');
};

historyOkeechobee.on('prerender', function (event) {
    const ctx = event.context;
    const mapSize = map.getSize();
    const width = mapSize[0] * (swipe.value / 100);
    const tl = ol.render.getRenderPixel(event, [width, 0]);
    const tr = ol.render.getRenderPixel(event, [mapSize[0], 0]);
    const bl = ol.render.getRenderPixel(event, [width, mapSize[1]]);
    const br = ol.render.getRenderPixel(event, mapSize);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tl[0], tl[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.lineTo(tr[0], tr[1]);
    ctx.closePath();
    ctx.clip();
});

historyOkeechobee.on('postrender', function (event) {
    const ctx = event.context;
    ctx.restore();
});

swipe.addEventListener('input', function () {
    map.render();
});


/*
   functions to zoom in to certain locations on scroll
*/
function zoomInToLakeOkeechobee(currentScreenWidth) {
    if (currentScreenWidth < 1000) {
        view.animate({
            center: initialView,
            zoom: 9,
            duration: 1900,
        });
    } else {
        view.animate({
            center: centerLakeOkeechobee,
            zoom: 10,
            duration: 1900,
        });
    }
}

function zoomSouthOfLake(currentScreenWidth) {
    if (currentScreenWidth < 1000) {
        view.animate({
            center: southofLakeOMobile,
            zoom: 9.5,
            duration: 1900,
        });
    } else {
        view.animate({
            center: southofLakeOkeechobee,
            zoom: 9.5,
            duration: 1900,
        });
    }

}

function zoomOnTreeIslands(currentScreenWidth) {
    if (currentScreenWidth < 1000) {
        view.animate({
            center: treeIslandsMobile,
            zoom: 10,
            duration: 1900,
        });
    } else {
        view.animate({
            center: treeIslands,
            zoom: 11,
            duration: 1900,
        });
    }

}

function zoomOnStormwaterTreatment(currentScreenWidth) {
    if (currentScreenWidth < 1000) {
        view.animate({
            center: staViewMobile,
            zoom: 9,
            duration: 1900,
        });
    } else {
        view.animate({
            center: staView,
            zoom: 9,
            duration: 1900,
        });
    }
}

function zoomToSouthView(currentScreenWidth) {
    if (currentScreenWidth < 1000) {
        view.animate({
            center: southView,
            zoom: 9.5,
            duration: 1900,
        });
    } else {
        view.animate({
            center: southView,
            zoom: 10,
            duration: 1900,
        });
    }

}

/*
  zoom back to starting zoom and center
*/
function zoomBackToOverallView(currentScreenWidth) {
    if (currentScreenWidth < 1000) {
        view.animate({
            center: initialViewMobile,
            zoom: 8.5,
            duration: 1900,
        });
    } else {
        view.animate({
            center: initialView,
            zoom: 9,
            duration: 1900,
        });
    }
}


/*
    reset the map to the first stop: the historic view of the Everglades
    The land classification WebGL layer should fade back in
*/
function resetMapToHistoricView(currentScreenWidth) {
    map.addLayer(floridaHistoryLayer);
    fadeInLayer(floridaHistoryLayer, floridaHistoryLayer.getOpacity(), 0.9, 0.02, 2);
    showLegend('historyLegend');
    showLegend('historySource');
    zoomBackToOverallView(currentScreenWidth);
}

/*
    Remove the everglade outline layer, but fade out the Florida Historic landuse layer
*/
function fadeOutHistoryLayer() {
    fadeOutLayer(floridaHistoryLayer, floridaHistoryLayer.getOpacity(), 0, 0.02, 2);
}

/*
    Fade in the urbanized layer
*/
function fadeInUrbanizedLayer() {
    fadeInLayer(urbanizedLayer, urbanizedLayer.getOpacity(), 0.9, 0.02, 2);
}

/*
    add the new vector layers and urbanized layer
*/
function addUrbanizedLayers() {
    if (!isLayerOnMap(urbanizedLayer)) {
        map.addLayer(urbanizedLayer);
    }
    urbanizedLayer.setProperties({
        opacity: 0
    });
    fadeInUrbanizedLayer();
    map.addLayer(currentOkeechobee);
    map.addLayer(canalsLayer);

    showLegend('urbanizationLegend');
    showLegend('urbanizationSource');
}


/*
    add Tamiami Trail (us-41), shark river, and taylor slough geojson layers
*/
function addTamiamiTrailLocations() {
    map.addLayer(sharksloughLayer);
    map.addLayer(taylorsloughLayer);
    map.addLayer(tamiamitrailLayer);
    map.addLayer(tamiamiTrailLocationsPointLayer);
}

/*******
    SCROLLAMA definitions and functions start here
*******/
/* initialize the scrollama */
var scroller = scrollama();

function handleStepEnter(response) {
    // response = { element, direction, index }
    let currentIndex = response.index;
    let currentDirection = response.direction;

    let currentScreenWidth = window.screen.width;

    steps.forEach(function (step, i) {
        if (i !== currentIndex) {
            if (step.classList.contains("is-active")) {
                step.classList.remove("is-active");
            };
        } else {
            step.classList.add("is-active");
        }
    });

    /*
      This switch updates the map based on the scroll step.
      Note the fade in / fade out effect between step 1 (case 0) and step 2 (case 1)
      If the reader is on a smaller screen, the zoom functions change
     */
    switch (currentIndex) {
        case 0:
            resetMap();
            resetMapToHistoricView(currentScreenWidth);
            break;
        case 1:
            if (currentDirection === 'down') {
                fadeOutHistoryLayer();
                removeLegendsAndSources();
            } else {
                resetMap();
            }
            zoomBackToOverallView(currentScreenWidth);
            addUrbanizedLayers();
            break;
        case 2:
            resetMap();
            addLakeComparisonLayers();
            zoomInToLakeOkeechobee(currentScreenWidth);
            break;
        case 3:
            resetMap();
            map.addLayer(sugarcaneLayer);
            showLegend('sugarcaneLegend');
            showLegend('sugarcaneSource');
            zoomSouthOfLake(currentScreenWidth);
            break;
        case 4:
            resetMap();
            zoomOnStormwaterTreatment(currentScreenWidth);
            map.addLayer(staLayer);

            // this stop has the same source as the previous river one
            showLegend('riverSource');
            showLegend('staLegend');
            break;
        case 5:
            resetMap();
            addTreeIslandLayer();
            zoomOnTreeIslands(currentScreenWidth);
            showLegend('treeIslandSource');
            break;
        case 6:
            resetMap();
            zoomToSouthView(currentScreenWidth);
            addTamiamiTrailLocations();
            showLegend('ttSource');
            break;
        default:
            break;
    }

}

function init() {
    // 1. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 2. bind scrollama event handlers (this can be chained like below)
    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.9,
            debug: false
        })
        .onStepEnter(handleStepEnter);
    
    // go to mobile view on map
    if (startingScreenWidth < 1000) {
        view.animate({
            center: initialViewMobile,
            zoom: 8.5,
            duration: 30,
        });
    }
}

// kick things off
init();
