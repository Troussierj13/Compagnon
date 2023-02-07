import {SkillType} from '@/utils/Types/PlayerType'

describe('Player tests', () => {
    test('Test SkillType.assign', () => {
        const skill = new SkillType("awe")
        expect(JSON.stringify(skill)).toBe(
            JSON.stringify({
                name: "Présence",
                favored: false,
                rank: 0,
            }))
    })
})