test('common matcher', () => {
  expect(2 + 2).toBe(4)
  expect(2 + 2).not.toBe(5)
})

test('to be true or false', () => {
  expect(true).toBeTruthy()
  expect(0).toBeFalsy()
})

test('num', () => {
  expect(4).toBeGreaterThan(3)
  expect(2).toBeLessThan(3)
})

test('object', () => {
  // expect({name: 'sss'}).toBe({name: 'sss'})
  expect({name: 'sss'}).toEqual({name: 'sss'})
})