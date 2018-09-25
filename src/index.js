import * as csv2geojson from 'csv2geojson'
import JSZip from 'jszip'
import * as FileSaver from 'file-saver'
import $ from 'jquery'
window.$ = $
window.jQuery = $
require('bootstrap')
import Pickr from 'pickr-widget'

let color = '#249BDD'
let opacity = 1
let tileset = 'grayscale'

$(".dropdown-menu li").click(function() {
  tileset = $(this).text()
})

const pickr = Pickr.create({
  el: '.color-picker',
  default: '#249BDD',
  components: {
      preview: true,
      opacity: true,
      hue: true,
      // Input / output Options
      interaction: {
          hex: true,
          rgba: false,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: true,
          clear: true,
          save: true
      }
  },
  onSave(hsva, instance) {
    color = hsva.toHEX().toString()
    opacity = hsva.a
}
})

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
    //$('#downloadButton').css("visibility", "visible")    
  })

  text = null
}

function createUserFile() {
  let geoJson = $('#DisplayText').val()
  let layerName = $('#layerName').val()
  return `const mainlayerJson = ${geoJson}
  const mainlayerName = '${layerName}'
  const basemap = tileList['${tileset}']
  const markercolor = {
    radius: 7,
    fillColor: '${color}',
    color: '${color}',
    weight: 1,
    opacity: '${opacity}',
    fillOpacity: '${opacity}'
  }
  const searchlayer = mainlayerJson`
}




