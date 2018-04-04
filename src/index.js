const _ = require('lodash')
const csv2geojson = require('csv2geojson')
const leaflet = require('leaflet')

let button = document.querySelector("#csv-file + button")
let input = document.getElementById("csv-file")
let display = document.getElementById("DisplayText")
let text = null
input.addEventListener("change", addDoc)
button.addEventListener("click", handleText)

function addDoc(event) {
  let file = this.files[0]
  let reader = new FileReader()

  reader.onload = function(e) {
    text = reader.result
    button.removeAttribute("disabled")
  }

  reader.onerror = function(err) {
    console.log(err, err.loaded, err.loaded === 0, file)
    button.removeAttribute("disabled")
  }

  reader.readAsText(event.target.files[0])
}

function handleText() {
  csv2geojson.csv2geojson(text, function(err, data) {
    display.textContent = JSON.stringify(data, null, 4)
  })
  
  button.setAttribute("disabled", "disabled")
  // set `text` to `null` if not needed or referenced again
  text = null
}

