const title = 'Amazing Title'
const mainlayerJson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "description": "me",
                "popupContent": "what"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -91.5533784,
                    41.6694734
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "description": "you",
                "popupContent": "foo"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -91.4961639,
                    41.6458102
                ]
            }
        }
    ]
}
const mainlayerName = 'Homes for Sale'
const basemap = grayscale
const markercolor = redCircleMarkers
const searchlayer = mainlayerJson
