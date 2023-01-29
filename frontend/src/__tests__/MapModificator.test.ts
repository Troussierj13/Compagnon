import {MapModificator} from '../utils/MapModificator'

describe('MapModificator', () => {
    test('Test modifiedValues', () => {
        const modificators = new MapModificator(5)
        modificators.addModificator({mod: 1, op: '+'})
        modificators.addModificator({mod: 1, op: '+'})
        modificators.addModificator({mod: 2, op: '*'})
        modificators.addModificator({mod: (1 / 2), op: '*'})
        expect(modificators.modifiedValue).toBe((5 + 1 + 1) * 2 / 2)
    })
})
