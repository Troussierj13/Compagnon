import {SkillType, StrengthSkillsType} from '@/utils/Types/PlayerType'

describe('Player tests', () => {
    test('Test SkillType.assign', () => {
        const skill = new SkillType("awe")
        skill.assign({
            name: "Présence",
            favored: false,
            rank: 2,
        })

        console.log(skill)
        expect(JSON.stringify(skill)).toBe(
            JSON.stringify({
                name: "Présence",
                favored: false,
                rank: 2,
            }))
    })

    test('Test StrengthSkillsType.assign', () => {
        const strengthSkills = new StrengthSkillsType()
        strengthSkills.assign({
            awe: {
                name: "Présence",
                favored: false,
                rank: 1,
            },
            athletics: {
                name: "Athélisme",
                favored: false,
                rank: 1,
            },
            awareness: {
                name: "Vigilance",
                favored: false,
                rank: 2,
            },
            hunting: {
                name: "Chasse",
                favored: false,
                rank: 0,
            },
            song: {
                name: "Chant",
                favored: false,
                rank: 2,
            },
            craft: {
                name: "Artisanat",
                favored: false,
                rank: 1,
            }
        })

        console.log(strengthSkills)
        expect(JSON.stringify(strengthSkills)).toBe(
            JSON.stringify({
                awe: {
                    name: "Présence",
                    favored: false,
                    rank: 1,
                },
                athletics: {
                    name: "Athélisme",
                    favored: false,
                    rank: 1,
                },
                awareness: {
                    name: "Vigilance",
                    favored: false,
                    rank: 2,
                },
                hunting: {
                    name: "Chasse",
                    favored: false,
                    rank: 0,
                },
                song: {
                    name: "Chant",
                    favored: false,
                    rank: 2,
                },
                craft: {
                    name: "Artisanat",
                    favored: false,
                    rank: 1,
                }
            }))
    })
})