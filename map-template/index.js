let mapFeatures = []
mainlayerJson.features.forEach(function(val) {
  mapFeatures.push(Object.keys(val.properties))
})

let myIcon = L.icon({
  iconUrl: 'my-icon.png',
  iconRetinaUrl: 'my-icon@2x.png',
  iconSize: [1, 1],
  iconAnchor: [1, 1],
  popupAnchor: [-1, -1]
})

let map = L.map('map', {
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
    return L.circleMarker(latlng, markercolor)
  }
})

let searchLayer = L.geoJson(mainlayerJson, {
  onEachFeature: onEachFeature,
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, CircleMarkers)
  }
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
          icon: myIcon,
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

L.control.layers(baseMaps, overlays, {
  collapsed: false
}).addTo(map)

let searchControl = L.control.fuseSearch(searchOptions)
map.addControl(searchControl)
searchControl.indexFeatures(mainlayerJson.features, mapFeatures[0])