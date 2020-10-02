import { firestore } from 'firebase-admin'
import { Node } from './Node'

export interface GeoPointValue {
  lat: number
  lng: number
}

export class GeoPoint extends Node<GeoPointValue> {
  constructor(coords: GeoPointValue) {
    super('geopoint', coords)

    if (typeof coords !== 'object') {
      throw new Error('GeoPoint value must be an object with lat/lng property.')
    }

    if (typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
      throw new Error(
        'Invalid GeoPoint lat/lng value. The value for lat/lng property must be a number.'
      )
    }
  }

  toFirestore(): firestore.GeoPoint {
    const { lat, lng } = this.values
    return new firestore.GeoPoint(lat, lng)
  }
}
