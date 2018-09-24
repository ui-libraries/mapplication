const title = 'Amazing Title'
const mainlayerJson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "description": "Spacious, 4-bedroom home on the Westside",
                "popupContent": "look at this amazing home!",
                "image": "<img src='https://i.imgur.com/KbwPb6Y.jpg'>"
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
                "description": "Cozy efficiency apartment",
                "popupContent": "For the student on a budget!",
                "image": "<img src='https://i.imgur.com/g0RGSwW.jpg'>"
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
