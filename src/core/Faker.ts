import * as faker from 'faker'

export interface Faker {
  Card: {
    name: string
    username: string
    email: string
    address: Faker.FullAddress
    phone: string
    website: string
    company: Faker.Company
    posts: Faker.Post[]
    accountHistory: string[]
  }

  FullAddress: {
    streetA: string
    streetB: string
    streetC: string
    streetD: string
    city: string
    state: string
    county: string
    zipcode: string
    geo: Faker.Geo
  }

  Geo: {
    lat: string
    lng: string
  }

  Company: {
    name: string
    catchPhrase: string
    bs: string
  }

  Post: {
    words: string
    sentence: string
    sentences: string
    paragraph: string
  }

  ContextualCard: {
    name: string
    username: string
    avatar: string
    email: string
    dob: Date
    phone: string
    address: Faker.Address
    website: string
    company: Faker.Company
  }

  Address: {
    street: string
    suite: string
    city: string
    state: string
    zipcode: string
    geo: Faker.Geo
  }

  UserCard: {
    name: string
    username: string
    email: string
    address: Faker.Address
    phone: string
    website: string
    company: Faker.Company
  }

  Transaction: {
    amount: string
    date: Date
    business: string
    name: string
    type: string
    account: string
  }
}

export const {
  address,
  commerce,
  company,
  database,
  date,
  fake,
  finance,
  git,
  hacker,
  helpers,
  image,
  internet,
  lorem,
  music,
  name,
  phone,
  random,
  system,
  time,
  vehicle,
  seed,
  seedValue,
} = faker

export const setLocale = (locale: string): void => {
  faker.setLocale(locale)
}
