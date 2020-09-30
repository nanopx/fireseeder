import { firestore } from 'firebase-admin'
import { Node } from './Node'

export interface GeoPointValue {
  lat: number
  lng: number
}

export class GeoPoint extends Node<GeoPointValue> {
  constructor(coords: GeoPointValue) {
    super('geopoint', coords)
  }

  toFirestore(): firestore.GeoPoint {
    const { lat, lng } = this.values
    return new firestore.GeoPoint(lat, lng)
  }
}
