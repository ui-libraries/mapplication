  
	  var myIcon = L.icon({
    iconUrl: 'my-icon.png',
    iconRetinaUrl: 'my-icon@2x.png',
    iconSize: [1, 1],
    iconAnchor: [1, 1],
    popupAnchor: [-1, -1]
    });
	  
    var map = L.map('map', {
	  zoom: 2,
	  layers: [basemap] 
	  });

    var onEachFeature = function(feature, layer) {
      if (feature.properties) {
        var prop = feature.properties;
        let popup = ''
        let featureArr = Object.keys(prop)
        featureArr.forEach(function(element) {
          popup += `${prop[element]}<br>`
        });
        // make html popup with properties. This example allows up to 3 text fields (1 title), a URL field, and a Photo, if included in the
  
          // add known info about event to the description
        
        // you must create a layer property on each feature or else
        // the search results won't know where the item is on the map / layer
        feature.layer = layer;
        layer.bindPopup(popup, {maxWidth: "auto"});
      }
    }; // end onEachFeature

    var timelineLayer = L.geoJson(mainlayer, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, redCircleMarkers);
      }
    });

    var searchLayer = L.geoJson(mainlayer, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, CircleMarkers);
      }
    });
	  
    searchLayer.addTo(map);

    // Add fuse search control
    var searchOptions = {
      position: 'topleft',
      title: 'Search',
      placeholder: 'Type here',
      maxResultLength: 10,
      caseSensitive: false,
      showInvisibleFeatures: true,
      layerToToggle: searchLayer,
      threshold: 0.5, // default is .5, will match imperfect results
      showResultFct: function(feature, container) {
        props = feature.properties;
        var name = L.DomUtil.create('b', null, container);
        name.innerHTML = props.searchfield;

        container.appendChild(L.DomUtil.create('br', null, container));

        var cat = props.searchfield ? props.searchfield2 : props.searchfield,
            info = cat;
        container.appendChild(document.createTextNode(info));
      }
    };

 


    function displayFeatures(features, layer) {
      var popup = L.DomUtil.create('div', 'tiny-popup', map.getContainer());
      for (var id in features) {
        var feat = features[id];
        var cat = feat.properties.NAME;
        var site = L.geoJson(feat, {
          pointToLayer: function(feature, latLng) {
            var marker = L.marker(latLng, {
        icon: myIcon,
              keyboard: false,
              riseOnHover: true
            });
            if (! L.touch) {
              marker.on('mouseover', function(position) {
                // TODO can put text in here when hovering search
                // popup.innerHTML = 'Testing';
                // L.DomUtil.setPosition(popup, pos);
                // L.DomUtil.addClass(popup, 'visible');
              }).on('mouseout', function(position) {
                L.DomUtil.removeClass(popup, 'visible');
              });
            }
            return marker;
          },
          onEachFeature: onEachFeature
        });
        if (layer !== undefined) {
            layer.addLayer(site);
        }
      }
      return layer;
    };

    var mainlayer = new L.geoJson(mainlayerJson, {
      onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, markercolor);
      }}).addTo(map);

    var bounds = L.latLngBounds(mainlayer);
      map.fitBounds(mainlayer.getBounds());

    var overlays = {
        "mainlayer": mainlayer
    };
      
    var baseMaps = {
    "<strong>Layer List</strong>": basemap
  //			"Modern Map": grayscale,
  //			"opengeo": opengeo
    };
      
    L.control.layers(baseMaps, overlays, {collapsed:false}).addTo(map);
    
    var searchControl = L.control.fuseSearch(searchOptions);
    map.addControl(searchControl);
    console.log(mainlayer)
    searchControl.indexFeatures(mainlayerJson.features, ['description']);
