import faker from 'faker'

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
  faker.locale = locale
}
