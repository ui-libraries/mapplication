import * as csv2geojson from 'csv2geojson'
import JSZip from 'jszip'
import * as FileSaver from 'file-saver'
import $ from 'jquery'
window.$ = $

let configFile, indexJsFile, indexFile, styleFile, userFile

$.get( "http://s-lib024.lib.uiowa.edu/mapplication/template/config.js", function( data ) {
  configFile = data
});

$.get( "http://s-lib024.lib.uiowa.edu/mapplication/template/index.js", function( data ) {
  indexJsFile = data
});

$.get( "http://s-lib024.lib.uiowa.edu/mapplication/template/index.html", function( data ) {
  indexFile = data
});

$.get( "http://s-lib024.lib.uiowa.edu/mapplication/template/style.css", function( data ) {
  styleFile = data
});

let button = document.querySelector("#csv-file + button")
let download = document.getElementById("downloadButton")
let input = document.getElementById("csv-file")
let display = document.getElementById("DisplayText")
let text = null

input.addEventListener("change", addDoc)
download.addEventListener("click", downloadMap)

function downloadMap() {
  let zip = new JSZip()
  zip.file('config.js', configFile)
  zip.file('index.js', indexJsFile)
  zip.file('index.html', indexFile)
  zip.file('style.css', styleFile)
  zip.file('user.js', createUserFile())
  zip.generateAsync({type:"blob"})
  .then(function(content) {
      FileSaver.saveAs(content, "map.zip")
  })
}

function addDoc(event) {
  let file = this.files[0]
  let reader = new FileReader()

  reader.onload = function (e) {
    text = reader.result
    handleText()
  }

  reader.onerror = function (err) {
    console.log(err, err.loaded, err.loaded === 0, file)
  }

  reader.readAsText(event.target.files[0])
}

function handleText() {
  csv2geojson.csv2geojson(text, function (err, data) {
    display.textContent = JSON.stringify(data, null, 4)
    $('#downloadButton').css("visibility", "visible")
  })

  text = null
}

function createUserFile() {
  let geoJson = $('#DisplayText').val()
  return `const mainlayerJson = ${geoJson}
  const mainlayerName = 'Homes for Sale'
  const basemap = grayscale
  const markercolor = {
    radius: 7,
    fillColor: "#ED1C24",
    color: "#ED1C24",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
  }
  const searchlayer = mainlayerJson`
}





