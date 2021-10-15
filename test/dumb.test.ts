import { DumbResource } from "../src/dumbResource"

describe(`dumb tests`, () => {
  it(`dumb test`, () => {
    const dumb = new DumbResource(1, 2)
    const result = dumb.execute()
    expect(result).toBeCloseTo(3)
  })
})
