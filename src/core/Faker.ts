import faker from 'faker'

const {
  createCard: _createCard,
  contextualCard: _contextualCard,
  userCard: _userCard,
  createTransaction: _createTransaction,
  ...helperFns
} = faker.helpers

export const helpers = helperFns

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
  faker.locale = locale
}
