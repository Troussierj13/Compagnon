import {WeaponType} from "./Types/WeaponType";
import {PlayerType} from "./Types/PlayerType";
import {ArmorType} from "./Types/ArmorType";
import {IDictionary} from "./helpers";
import {Virtue} from "./VallianceWisdom/Virtues";
import {Reward} from "./VallianceWisdom/Rewards";
import {GameType} from "./Types/GameType";
import {ShowState} from "./Types/socketType";

export const APISettings = {
    token: "",
    headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json"
    }),
    baseURL: "http://192.168.1.24:8000/api/",
    socketURL: "http://192.168.1.24:8000",
};

export const APIRequests = {
    Games: {
        createGame: async (gameName: string) => {
            const response = await fetch(APISettings.baseURL + "game/", {
                method: "PUT",
                body: JSON.stringify({name: gameName}),
                headers: APISettings.headers,
            });

            return await response.json() as GameType;
        },
        getGame: async () => {
            const response = await fetch(APISettings.baseURL + "game/", {
                method: "GET",
                headers: APISettings.headers,
            });

            return await response.json() as GameType;
        },
        emitCharacterSheet: async(_id: string) => {
            const response = await fetch(APISettings.baseURL + "event/characterSheet/", {
                method: "POST",
                headers: APISettings.headers,
                body: JSON.stringify({id: _id})
            });
            return await response.json();
        },
        resetEventsGame: async () => {
            const response = await fetch(APISettings.baseURL + "game/resetEvents/", {
                method: "PUT",
                headers: APISettings.headers,
            });
            return await response.json();
        },
    },
    Character: {
        getAllCharacters: async () => {
            const response = await fetch(APISettings.baseURL + "character", {
                method: "GET",
                headers: APISettings.headers,
            });
            const json = await response.json();
            const virtues = await APIRequests.Virtues.getAllVirtues();
            const rewards = await APIRequests.Rewards.getAllRewards();

            const res:IDictionary<PlayerType> = {};
            const players = (json as Array<PlayerType>).map(player => {
                res[player._id] = new PlayerType(player, virtues, rewards);
            });

            return res;
        },
        getCharacter: async (characterId: string) => {
            const response = await fetch(APISettings.baseURL + "character/" + characterId, {
                method: "GET",
                headers: APISettings.headers,
            });
            const json = await response.json();
            const virtues = await APIRequests.Virtues.getAllVirtues();
            const rewards = await APIRequests.Rewards.getAllRewards();

            return new PlayerType(json as PlayerType, virtues, rewards)
        },
        update: async (idCharacter: string, player: PlayerType) => {
            const response = await fetch(APISettings.baseURL + "character/" + idCharacter, {
                method: "PUT",
                headers: APISettings.headers,
                body: JSON.stringify(player)
            });
            return await response.json();
        }
    },
    Weapons: {
        getAllWeapons: async () => {
            const response = await fetch(APISettings.baseURL + "weapon/", {
                method: "GET",
                headers: APISettings.headers,
            });
            const json = await response.json();
            const rewards = await APIRequests.Rewards.getAllRewards();
            return (json as Array<WeaponType>).map(weapon => {
                return new WeaponType(weapon, rewards);
            });
        }
    },
    Armors: {
        getAllArmors: async () => {
            const response = await fetch(APISettings.baseURL + "armor/", {
                method: "GET",
                headers: APISettings.headers,
            });
            const json = await response.json();
            return (json as Array<ArmorType>).map(armor => {
                return new ArmorType(armor);
            });
        }
    },
    Virtues: {
        getAllVirtues: async () => {
            const response = await fetch(APISettings.baseURL + "virtue/", {
                method: "GET",
                headers: APISettings.headers,
            });
            const virtues = await response.json() as Array<Partial<Virtue>>;
            const dictVirtues: IDictionary<Partial<Virtue>> = {
                empoweredVirtue: virtues.filter(el => el.identifier === 'empoweredVirtue')[0],
                livenessVirtue: virtues.filter(el => el.identifier === 'livenessVirtue')[0],
                resistanceVirtue: virtues.filter(el => el.identifier === 'resistanceVirtue')[0],
                masteryVirtue: virtues.filter(el => el.identifier === 'masteryVirtue')[0],
                steadyVirtue: virtues.filter(el => el.identifier === 'steadyVirtue')[0],
                assuranceVirtue: virtues.filter(el => el.identifier === 'assuranceVirtue')[0]
            };

            return dictVirtues;
        }
    },
    Rewards: {
        getAllRewards: async () => {
            const response = await fetch(APISettings.baseURL + "reward/", {
                method: "GET",
                headers: APISettings.headers,
            });
            const rewards = await response.json() as Array<Partial<Reward>>;
            const dictRewards: IDictionary<Partial<Reward>> = {
                sharpReward: rewards.filter(el => el.identifier === 'sharpReward')[0],
                adjustedReward: rewards.filter(el => el.identifier === 'adjustedReward')[0],
                cleverReward: rewards.filter(el => el.identifier === 'cleverReward')[0],
                devastatingReward: rewards.filter(el => el.identifier === 'devastatingReward')[0],
                ferociousReward: rewards.filter(el => el.identifier === 'ferociousReward')[0],
                reinforcedReward: rewards.filter(el => el.identifier === 'reinforcedReward')[0]
            };

            return dictRewards;
        }
    },
    Ntags: {
        update: async (hexNtag: string) => {
            const response = await fetch(APISettings.baseURL + "encryptedNtag/", {
                method: "PUT",
                headers: APISettings.headers,
                body: JSON.stringify({data: hexNtag})
            });
            return await response.json();
        }
    },
    Event: {
        sendTestEnnemy: async () => {
            const response = await fetch(APISettings.baseURL + "event/ennemyAppear/", {
                method: "POST",
                headers: APISettings.headers,
                body: JSON.stringify({data: "010100010001010d556b6d617273205672616767650e50696c6c6575722064752053756405527573c3a907566973696575780104010f010200010401010102010305486163686501030104011201010b506572666f726174696f6e0c4c616e636520636f7572746501020103010f01010b506572666f726174696f6e0c4c616e636520636f7572746501010102010201010c4c616e636520636f7572746501023946c3a9726f63653a2044c3a970656e73652031707420646520766f6c6f6e74c3a92c202d3164206c6f7273206427756e6520617474617175653946c3a9726f63653a2044c3a970656e73652031707420646520766f6c6f6e74c3a92c202d3164206c6f7273206427756e652061747461717565774c6f727320646573206c6f6e6773206869766572732c206c657320486f6d6d6573206475205375642073652072617373656d626c656e742065742070617274656e7420c3a0206c61207265636865726368652064652070726f707269c3a97461697265732069736f6cc3a97320c3a02070696c6c65722e"})
            });
            return await response.json();
        },
        sendShowState: async (s: ShowState) => {
            const responseShow = await fetch(APISettings.baseURL + "event/showState/", {
                method: "POST",
                headers: APISettings.headers,
                body: JSON.stringify(s)
            });
            return await responseShow.json();
        }
    }
};
