import * as _ from 'lodash'
import * as csv2geojson from 'csv2geojson'
import JSZip from 'jszip'
import * as FileSaver from 'file-saver'
import $ from 'jquery'
window.$ = $
window.jQuery = $
import Pickr from 'pickr-widget'
import linkifyStr from 'linkifyjs/string'

$('.pcr-button').remove();

let defaultColor = '#777777'
let highlightColor = '#FF0089'
let defaultOpacity = 1
let highlightOpacity = 1
let tileset = 'grayscale'

const defaultPickr = Pickr.create({
  el: '#colorpicker-default',
  default: '#777777',
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
    defaultColor = hsva.toHEX().toString()
    opacity = hsva.a
  }
})

const hightlightPickr = Pickr.create({
  el: '#colorpicker-highlight',
  default: '#FF0089',
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
    highlightColor = hsva.toHEX().toString()
    highlightOpacity = hsva.a
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
let display = document.getElementById("display-text")
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
    //text = linkifyStr(text, {
      //defaultProtocol: 'https'
    //})
    handleText()
  }

  reader.onerror = function (err) {
    console.log(err, err.loaded, err.loaded === 0, file)
  }

  reader.readAsText(event.target.files[0])
}

function handleText() {
  csv2geojson.csv2geojson(text, (err, data) => {
    removeHighlightPicker(data)
    wrapImageLinks(data)
    display.textContent = JSON.stringify(data, null, 4)
    //$('#downloadButton').css("visibility", "visible")    
  })

  text = null
}

function wrapImageLinks(geoJsonText) {
  let wrapped
  let features = _.find(geoJsonText, (data) => {
    _.forEach(data, (val) => {
      if (val.properties !== undefined) {
        if (val.properties.image !== undefined) {
          val.properties.image = `<img src="${val.properties.image}">`
        }        
      }
    })
  })
  return geoJsonText
}

function removeHighlightPicker(geoJsonText) {
  if (hasTime(geoJsonText) === true) {
    console.log('display!!')
    $('#highlight-group').css("display", "inline")
  }
}

function hasTime(geoJsonText) {
  let exists = false
  let features = _.find(geoJsonText, (data) => {
    _.forEach(data, (val) => {
      if (val.properties !== undefined) {
        if (val.properties.time !== undefined) {
          console.log('here?')
          exists = true
        }
      }
    })
  })
  return exists
}

function createUserFile() {
  let geoJson = $('#display-text').val()
  let layerName = $('#layer-name').val()
  let tileset = $( "#tilesets option:selected" ).text()
  return `const mainlayerJson = ${geoJson}
  const mainlayerName = '${layerName}'
  const basemap = tileList['${tileset}']
  const markercolor = {
    radius: 7,
    fillColor: '${defaultColor}',
    defaultColor: '${defaultColor}',
    weight: 1,
    defaultOpacity: '${highlightColor}',
    fillOpacity: '${defaultOpacity}'
  }
  const timeMarkers = {
    radius: 7,
    fillColor: '${highlightColor}',
    color: '${highlightColor}',
    weight: 1,
    opacity: '${highlightOpacity}',
    fillOpacity: '${highlightOpacity}'
  }
  const searchlayer = mainlayerJson`
}




