/*******
    Selecting different parts of the HTML for use in scrollytelling
*****/
var main = document.getElementById("main");
var scrolly = document.getElementById("scrolly");
var figure = document.getElementById("mapfigure");
var article = document.getElementById("articlecontainer");
var steps = document.querySelectorAll(".step");


/*******
    Simple functions to show and hide legend divs
*****/
function showLegend(legendId) {
  document.getElementById(legendId).classList.remove('invisible');
};

function hideLegend(legendId) {
  document.getElementById(legendId).classList.add('invisible');
};

/*******
    OPENLAYERS definitions and functions start here
*****/
/*
    -basestyle- styles the historic land classification vector data
    which will be rendered as a WebGLLayer (see below)
*/
const basestyle = {
    'stroke-color': ['*', ['get', 'COLOR'], [220, 220, 220]],
    'stroke-width': 3,
    'stroke-offset': -1,
    'fill-color': ['*', ['get', 'COLOR'], [255, 255, 255, 0.6]],
};


const oceansLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/oceans.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: {
        'fill-color': 'rgba(0,6,7,0.6)',
    },
});


/*
    Latitude and Longitude locations for use in scrollytelling
    when animating the map view
*/
const intialView = ol.proj.fromLonLat([-80.909245, 26.275135]);
const centerLakeOkeechobee = ol.proj.fromLonLat([-81.104702, 26.881064]);
const southofLakeOkeechobee = ol.proj.fromLonLat([-80.798088, 26.541511]);
const treeIslands = ol.proj.fromLonLat([-80.60776, 25.71456]);
const stormwaterTreatment = ol.proj.fromLonLat([-80.41587, 26.6466825]);
const southView = ol.proj.fromLonLat([-80.6855, 25.7184]);

/* initializing the OpenLayers map view */
const view = new ol.View({
    center: intialView,
    zoom: 9,
});

/* inializing the map variable so all functions have access */
var map;

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

const oldEvergladesOutline = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/everglades-boundary-before.geojson',
    format: new ol.format.GeoJSON(),
  }),
  style: {
    'stroke-color': ['string', '#eee'],
    'stroke-width': 2
  },
});

const newEvergladesOutline = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/everglades-boundary-after.geojson',
    format: new ol.format.GeoJSON(),
  }),
  style: {
    'stroke-color': ['string', '#eee'],
    'stroke-width': 2
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

const pointsLayer = new ol.layer.Vector({
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

/* a function to fade in a layer, courtesy of https://codepen.io/maptastik/pen/qLrdyG */
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

/* a function to fade out the layer, based on the previous function above */
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
                oceansLayer, floridaHistoryLayer, urbanizedLayer
            ],
            view: view,
        });

    });

var treeislandLayer;

function addTreeIslandLayer() {
    fetch('./data/treeislands.tif')
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

const swipe = document.getElementById('swipe');

/* Adding in the "before" lake to make it slideable */
function addSlideableLayer() {
    map.addLayer(historyOkeechobee);
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

function zoomInToLakeOkeechobee() {
    view.animate({
        center: centerLakeOkeechobee,
        zoom: 10,
        duration: 2000,
    });
    addSlideableLayer();
}

function zoomSouthOfLake() {
    view.animate({
        center: southofLakeOkeechobee,
        zoom: 9.5,
        duration: 2000,
    });
}

function zoomSouthOfLake() {
    view.animate({
        center: southofLakeOkeechobee,
        zoom: 9.5,
        duration: 2000,
    });
}

function zoomOnTreeIslands() {
    view.animate({
        center: treeIslands,
        zoom: 11,
        duration: 2000,
    });
}

function zoomOnStormwaterTreatment() {
    view.animate({
        center: stormwaterTreatment,
        zoom: 13,
        duration: 2000,
    });
}

function zoomToSouthView() {
  view.animate({
    center: southView,
    zoom: 10,
    duration: 1800,
  });
}

/*
  zoom back to starting zoom and center
*/
function zoomBackToOverallView() {
  view.animate({
      center: intialView,
      zoom: 9,
      duration: 2000,
  });
}

/*
    reset the map to the first stop: the historic view of the Everglades
    The land classification WebGL layer should fade back in if not there
*/
function resetMapToHistoricView() {
    map.addLayer(oldEvergladesOutline);
    fadeInLayer(floridaHistoryLayer, floridaHistoryLayer.getOpacity(), 0.9, 0.02, 2);
}

/*
    Remove the everglade outline layer, but fade out the Florida Historic landuse layer
*/
function fadeOutHistoryLayer() {
    map.removeLayer(oldEvergladesOutline);
    fadeOutLayer(floridaHistoryLayer, floridaHistoryLayer.getOpacity(), 0, 0.02, 2);
}

/*
  Remove history-related layers
*/
function removeHistoryLayer() {
    map.removeLayer(oldEvergladesOutline);
    fadeOutLayer(floridaHistoryLayer, floridaHistoryLayer.getOpacity(), 0, 0.02, 2);
}

/*
    add the new vector layers, but fade in the urbanized layer
*/
function fadeInUrbanizedLayer() {
    fadeInLayer(urbanizedLayer, urbanizedLayer.getOpacity(), 0.9, 0.02, 2);
    map.addLayer(canalsLayer);
    map.addLayer(newEvergladesOutline);
}

/*
    add the new vector layers and urbanized layer
*/
function addUrbanizedLayer() {
    map.addLayer(urbanizedLayer);
    map.addLayer(canalsLayer);
    map.addLayer(newEvergladesOutline);
}

function addCurrentLake() {
    map.addLayer(currentOkeechobee);
}

/*
    fade out the urbanized layer first, then remove related layers
*/
function removeUrbanizedLayer() {
    fadeOutLayer(urbanizedLayer, urbanizedLayer.getOpacity(), 0, 0.02, 2);

    map.removeLayer(newEvergladesOutline);
    map.removeLayer(canalsLayer);
    map.removeLayer(currentOkeechobee);
}

/*
    fade out urbanized layer
    remove all layers from map except the modern outline of Lake Okeechobee
*/
function removeExceptCurrentLake() {
    map.removeLayer(newEvergladesOutline);
    map.removeLayer(canalsLayer);
}

/*
    add Tamiami Trail (us-41), shark river, and taylor slough geojson layers
*/
function addTamiamiTrailLocations() {
    map.addLayer(sharksloughLayer);
    map.addLayer(taylorsloughLayer);
    map.addLayer(tamiamitrailLayer);
    map.addLayer(pointsLayer);
}

/*
    remove Tamiami Trail (us-41), shark river, and taylor slough geojson layers
*/
function removeTamiamiTrailLocations() {
    map.removeLayer(tamiamitrailLayer);
    map.removeLayer(sharksloughLayer);
    map.removeLayer(taylorsloughLayer);
    map.removeLayer(pointsLayer);
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
     */
    switch (currentIndex) {
        case 0:
            if (currentDirection === 'up') {
              removeUrbanizedLayer();
              hideLegend('urbanizationLegend');
            }
            resetMapToHistoricView();

            showLegend('historyLegend');
            showLegend('historySource');
            break;
        case 1:
            if(currentDirection === 'down') {
               fadeOutHistoryLayer();
               addCurrentLake();
               fadeInUrbanizedLayer();

               hideLegend('historyLegend');
               hideLegend('historySource');
            } else {
              zoomBackToOverallView();
              map.removeLayer(historyOkeechobee);
              map.removeLayer(caloosahatcheeLayer);
              addUrbanizedLayer();

              hideLegend('riverLegend');
              hideLegend('riverSource');
            }

            showLegend('urbanizationLegend');
            showLegend('urbanizationSource');
            break;
        case 2:
            if (currentDirection === 'up') {
                map.removeLayer(staLayer);
                map.removeLayer(sugarcaneLayer);

                hideLegend('sugarcaneLegend');
                hideLegend('sugarcaneSource');
            } else {
              map.removeLayer(urbanizedLayer);

              hideLegend('urbanizationLegend');
              hideLegend('urbanizationSource');
            }

            removeExceptCurrentLake();
            zoomInToLakeOkeechobee();
            map.addLayer(caloosahatcheeLayer);

            showLegend('riverLegend');
            showLegend('riverSource');
            break;
        case 3:
            if (currentDirection === 'down') {
                map.removeLayer(historyOkeechobee);
                map.removeLayer(caloosahatcheeLayer);

                hideLegend('riverLegend');
                hideLegend('riverSource');
            }
            else {
               map.removeLayer(staLayer);
               hideLegend('staLegend');
            }

            map.addLayer(sugarcaneLayer);
            showLegend('sugarcaneLegend');
            showLegend('sugarcaneSource');
            zoomSouthOfLake();
            break;
        case 4:
            if (currentDirection === 'down') {
                map.removeLayer(sugarcaneLayer);

                hideLegend('sugarcaneLegend');
                hideLegend('sugarcaneSource');
            } else {
              zoomSouthOfLake();
              map.removeLayer(treeislandLayer);
            }

            map.addLayer(staLayer);
            showLegend('staLegend');
            showLegend('riverSource'); // this stop has the same source as the previous river one

            break;
        case 5:
            if (currentDirection === 'down') {
              map.removeLayer(staLayer);
              hideLegend('staLegend');
              hideLegend('riverSource');
            } else {
              removeTamiamiTrailLocations();
            }
            addTreeIslandLayer();
            zoomOnTreeIslands();

            showLegend('treeislandSource');
            break;
         case 6:
            map.removeLayer(treeislandLayer);
            hideLegend('treeislandSource');

            zoomToSouthView();
            addTamiamiTrailLocations();
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
            offset: 0.5,
            debug: false
        })
        .onStepEnter(handleStepEnter);
}

// kick things off
init();
