const character = {
    player: {
        race: "hobbit",
        attributes: {
            strength: 2,
            heart: 7,
            wits: 5,
        },
        skills: {
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
            },
            enhearten: {
                name: "Inspiration",
                favored: true,
                rank: 2,
            },
            travel: {
                name: "Voyage",
                favored: false,
                rank: 0,
            },
            insight: {
                name: "Intuition",
                favored: false,
                rank: 2,
            },
            healing: {
                name: "Soins",
                favored: false,
                rank: 1,
            },
            courtesy: {
                name: "Courtoisie",
                favored: true,
                rank: 2,
            },
            battle: {
                name: "Art de la guerre",
                favored: false,
                rank: 0,
            },
            persuade: {
                name: "Persuasion",
                favored: true,
                rank: 2,
            },
            stealth: {
                name: "Discrétion",
                favored: false,
                rank: 3,
            },
            scan: {
                name: "Inspection",
                favored: false,
                rank: 0,
            },
            explore: {
                name: "Exploration",
                favored: false,
                rank: 0,
            },
            riddle: {
                name: "Enigmes",
                favored: false,
                rank: 3,
            },
            lore: {
                name: "Connaissances",
                favored: false,
                rank: 0,
            },
        },
        combats: {
            axes: {
                name: "Haches",
                rank: 0,
            },
            bows: {
                name: "Arcs",
                rank: 2,
            },
            spears: {
                name: "Lances",
                rank: 0,
            },
            swords: {
                name: "Epées",
                rank: 3,
            },
        },
        weapon: {
            name: "Epée longue",
            dmg: 5,
            injury: "16 / 18",
            weight: 3,
            note: "Peut se manier à une ou deux mains",
        },
        armor: {
            name: "Chemise de cuir",
            protection: "1d",
            parade: 0,
            weight: 3,
        },
        helm: {
            name: "Heaume",
            protection: "+1d",
            parade: 0,
            weight: 4,
        },
        shield: {
            name: "Rondache",
            protection: 0,
            parade: "+1",
            weight: 2,
        },
    },
}

export default character
