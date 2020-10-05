import { getUserPath } from '@/lib/utils/getUserPath'

test('should be able to get user path', () => {
  // Should be path from project root when running tests
  expect(getUserPath('/')).toEqual('/')
  expect(getUserPath('/foo', 'bar')).toEqual('/foo/bar')
})
