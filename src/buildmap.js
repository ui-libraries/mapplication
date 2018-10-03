import * as L from 'leaflet'
import * as esri from 'esri-leaflet'
import * as sliderControl from './slider'
import * as fuseSearch from './fuse.js'

export function buildMap(geoJson, tilelist, markercolor, timeMarkers, mainlayerName, timeline) {
  console.log(fuseSearch)
  const mainlayerJson = JSON.parse(geoJson)  

  const mbAttr = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, 
              <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
              Imagery © <a href="http://mapbox.com">Mapbox</a>`

  const tileList = {
    grayscale: L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicmNzaGVwYXJkIiwiYSI6IjYwYjI0NzdmNDQwM2YzNTc1ODI2NWZhNTU1ZTVmNjY4In0.ct_UnOxwtV_WIGwzyG0Rxw', {id: 'mapbox.light', attribution: mbAttr}),
    dark: L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicmNzaGVwYXJkIiwiYSI6IjYwYjI0NzdmNDQwM2YzNTc1ODI2NWZhNTU1ZTVmNjY4In0.ct_UnOxwtV_WIGwzyG0Rxw', {id: 'mapbox.dark', attribution: mbAttr}),
    opengeo: L.tileLayer.wms('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}),
    stamenbackground: L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 18,
      ext: 'png'
    }),
    stamenmap: L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 18,
      ext: 'png'
    }),
    surfer_roads: L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    })
  }

  const basemap = tileList[tilelist]

  const CircleMarkers = {
    radius: 7,
    fillColor: "#000000",
    color: "#000000",
    weight: 1,
    opacity: 0,
    fillOpacity: 0
  }

  let mapFeatures = []
  mainlayerJson.features.forEach(function(val) {
    mapFeatures.push(Object.keys(val.properties))
  })

  let map = L.map('mapid', {
    zoom: 2,
    layers: [basemap]
  })

  function onEachFeature(feature, layer) {
    if (feature.properties) {
      let props = feature.properties
      let popup = ''
      let featureNames = Object.keys(props)
      for (let i = 0, len = featureNames.length; i < len; i++) {
        if (i === 0) {
          popup += `<h2>${props[featureNames[i]]}</h2>`
        } else {
          popup += `${props[featureNames[i]]}`
          popup += `<br>`
        }      
      }

      feature.layer = layer
      layer.bindPopup(popup, {
        maxWidth: 'auto'
      })
    }
  }

  let mainlayer = new L.geoJson(mainlayerJson, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, markercolor)
    }
  }).addTo(map)

  let timelineLayer = L.geoJson(mainlayerJson, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, timeMarkers)
    }
  })

  let searchLayer = L.geoJson(mainlayerJson, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, CircleMarkers)
    }
  })

  let sliderControl = L.control.sliderControl({
    position: 'topright',
    layer: timelineLayer,
    range: true,
    alwaysShowDate: true
  })

  let searchOptions = {
    position: 'topleft',
    title: 'Search',
    placeholder: 'Type here',
    maxResultLength: 10,
    caseSensitive: false,
    showInvisibleFeatures: true,
    layerToToggle: searchLayer,
    threshold: 0.5, // default is .5, will match imperfect results
    showResultFct: function(feature, container) {
      props = feature.properties    
      let name = L.DomUtil.create('b', null, container)
      name.innerHTML = mapFeatures[0][0]
      container.appendChild(L.DomUtil.create('br', null, container))
      let cat = props[mapFeatures[0][0]]
      container.appendChild(document.createTextNode(cat))
    }
  }

  function displayFeatures(features, layer) {
    let popup = L.DomUtil.create('div', 'tiny-popup', map.getContainer())
    for (let id in features) {
      let feat = features[id]
      let cat = feat.properties.NAME
      let site = L.geoJson(feat, {
        pointToLayer: function(feature, latlng) {
          let marker = L.marker(latLng, {
            keyboard: false,
            riseOnHover: true
          })
          if (!L.touch) {
            marker.on('mouseover', function(position) {

            }).on('mouseout', function(position) {
              L.DomUtil.removeClass(popup, 'visible')
            })
          }
          return marker
        },
        onEachFeature: onEachFeature
      })
      if (layer !== undefined) {
        layer.addLayer(site)
      }
    }
    return layer
  }

  let bounds = L.latLngBounds(mainlayer)

  map.fitBounds(mainlayer.getBounds())

  let overlays = {}
  overlays[mainlayerName] = mainlayer

  let baseMaps = {
    '<strong>Layer List</strong>': basemap
  }

  L.LegendControl = L.Control.extend({ 
    onAdd: function (map) {

    let div = L.DomUtil.create('div', 'info legend')
    let labels = []

    labels.push(
      `<i style="background: ${markercolor.fillColor}"></i> inactive`,
      `<i style="background: ${timeMarkers.fillColor}"></i> active`
      )

      div.innerHTML = labels.join('<br>')
      return div
    }
  });

  L.legendControl = function(options) {
      return new L.LegendControl(options);
  }



  L.control.layers(baseMaps, overlays, {
    collapsed: false
  }).addTo(map)

  let searchControl = L.control.fuseSearch(searchOptions)
  map.addControl(searchControl)
  map.addControl(sliderControl)

  if (timeline === true) {
    L.legendControl({position: 'bottomright'}).addTo(map)
    sliderControl.startSlider()
  }

  searchControl.indexFeatures(mainlayerJson.features, mapFeatures[0])

  const circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
  }).addTo(mymap)
}