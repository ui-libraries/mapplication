import * as _ from 'lodash'
import * as url from 'url'
import * as http from 'http'
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
  zip.file("config.js", configFile)
  zip.file("index.js", indexJsFile)
  zip.file("index.html", indexFile)
  zip.file("style.css", styleFile)
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
    handleText()
    button.removeAttribute("disabled")
  }

  reader.onerror = function (err) {
    console.log(err, err.loaded, err.loaded === 0, file)
    button.removeAttribute("disabled")
  }

  reader.readAsText(event.target.files[0])
}

function handleText() {
  csv2geojson.csv2geojson(text, function (err, data) {
    display.textContent = JSON.stringify(data, null, 4)
  })

  text = null
}





