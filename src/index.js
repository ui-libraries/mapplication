const _ = require('lodash')
const csv2geojson = require('csv2geojson')
const L = require('leaflet')
let JSZip = require('jszip')
let FileSaver = require('file-saver');
window.jQuery = window.$ = require('jquery')

let button = document.querySelector("#csv-file + button")
let download = document.getElementById("downloadButton")
let input = document.getElementById("csv-file")
let display = document.getElementById("DisplayText")
let text = null

input.addEventListener("change", addDoc)
button.addEventListener("click", handleText)
download.addEventListener("click", downloadMap)

function createDoc(title) {
  let returnString
  let contents = $("#mapContainer").contents()
  let doc = document.implementation.createHTMLDocument(title)
  let link = doc.createElement('link')  
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
  $(doc.head).append(link)
  $(doc.body).append(contents)
  returnString = new XMLSerializer().serializeToString(doc)
  return returnString
}

function downloadMap() {
  let html = createDoc("test doc")
  let zip = new JSZip()
  zip.file("index.html", html)
  zip.generateAsync({type:"blob"})
  .then(function(content) {
      // see FileSaver.js
      FileSaver.saveAs(content, "map.zip")
  })
}

function addDoc(event) {
  let file = this.files[0]
  let reader = new FileReader()

  reader.onload = function (e) {
    text = reader.result
    button.removeAttribute("disabled")
  }

  reader.onerror = function (err) {
    console.log(err, err.loaded, err.loaded === 0, file)
    button.removeAttribute("disabled")
  }

  reader.readAsText(event.target.files[0])
}

function buildMap(geojson) {
  let mapData = geojson

  let map = L.map('map').setView([41.6608501, -91.5305475], 13)

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light'
  }).addTo(map)

  function onEachFeature(feature, layer) {
    let popupContent

    if (feature.properties && feature.properties.popupContent) {
      popupContent = '<strong>' + feature.properties.description + '</strong><br>' + feature.properties.popupContent
    }

    layer.bindPopup(popupContent);
  }

  L.geoJSON(mapData, {
    filter: function (feature, layer) {
      if (feature.properties) {
        // If the property "underConstruction" exists and is true, return false (don't render features under construction)
        return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true
      }
      return false
    },
    onEachFeature: onEachFeature
  }).addTo(map)  
}

function handleText() {
  csv2geojson.csv2geojson(text, function (err, data) {
    display.textContent = JSON.stringify(data, null, 4)
    buildMap(data)
  })

  button.setAttribute("disabled", "disabled")
  text = null
}