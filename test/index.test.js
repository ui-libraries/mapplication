import { expect } from 'chai'
import { hasTime } from '../src/lib'

const timeJson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "Description": "Wayne Gard",
                "time": "10/6/1928"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -91.665623,
                    41.97788
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "Description": "Jay G. Sigmund",
                "time": "10/16/1928"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -91.665623,
                    41.97788
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "Description": "Wayne Gard",
                "time": "10/19/1928"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -91.665623,
                    41.97788
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "Description": "John T. Frederick",
                "time": "11/9/1928"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -91.530168,
                    41.661128
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "Description": "Victor Shulth",
                "time": "11/28/1928"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -93.609106,
                    41.600545
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "Description": "John T. Frederick",
                "time": "2/7/1929"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -91.665623,
                    41.97788
                ]
            }
        }
    ]
}

const noTimeJson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "Address": "1313 Elmhurst Dr.",
                "House Description": "Charming 3-bedroom bungalow close to schools. Visit www.google.com",
                "image": "<img src=\"http://i.imgur.com/5Y16EUq.jpg\">"
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
                "Address": "42 Stanford St.",
                "House Description": "Affordable efficiency in a quiet neighborhood",
                "image": "<img src=\"http://i.imgur.com/3rjEhyT.jpg\">"
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

describe('hasTime', () => {
    it('should return true for timeJson', () => {
        expect(hasTime(timeJson)).to.equal(true)        
    })

    it('should return false for noTimeJson', () => {
        expect(hasTime(noTimeJson)).to.equal(false)        
    })
})