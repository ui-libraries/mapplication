import * as _ from 'lodash'

export function hasTime(geoJsonText) {
  let exists = false
  let features = _.find(geoJsonText, (data) => {
    _.forEach(data, (val) => {
      if (val.properties !== undefined) {
        if (val.properties.time !== undefined) {
          exists = true
        }
      }
    })
  })
  return exists
}