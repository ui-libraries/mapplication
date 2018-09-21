    //  user-defined variables are:
	// $title - the page title, for browser
	// $mainlayer - the primary map layer. for v0.1 Mapplication this will be the only layer the user loads
	// $basemap - selection of basemap. will be set as blanktile = ocean/blank land; grayscale = grayscale; stamenbackground - a topographic/terrain feature style; opengeo = open streetmap's base
	// $markercolor - predefined red, orange, yellow, green, blue, purple... followed by "CircleMarkers" in camelcase with no space 
	// 
	// $FIELD1 - field in CSV from which popup title will originate
	// $FIELD2 - field from CSV for other popup info
	// $FIELD3 - field from CSV for other popup info
	// $FIELD4 - field from CSV for other popup info

	// $searchlayer - set to $mainlayer for v0.1 mapplication
	// $searchfield - primary search field for Fuse.JS fuzzy search
	// $searchfield2 - secondary/indexing field for Fuse search

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
    const basemap = grayscale
    const markercolor = blueCircleMarkers
    const field1 = mainlayerJson.features[1].properties.popupContent
    const field2 = ''
    const field3 = ''
    const field4 = ''
    const searchlayer = mainlayerJson
    const searchfield = mainlayerJson.features[1].properties.description
    const searchfield2 = mainlayerJson.features[1].properties.description
