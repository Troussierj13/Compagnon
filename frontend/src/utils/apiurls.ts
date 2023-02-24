import {WeaponType} from "@/utils/Types/WeaponType";
import {PlayerType} from "@/utils/Types/PlayerType";
import {ArmorType} from "@/utils/Types/ArmorType";
import {IDictionary} from "@/utils/helpers";
import {Virtue} from "@/utils/VallianceWisdom/Virtues";

export const APISettings = {
    token: "",
    headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json"
    }),
    baseURL: "http://localhost:8000/api/",
};

export const APIRequests = {
    Character: {
        getAllCharacters: async () => {
            const response = await fetch(APISettings.baseURL + "character", {
                method: "GET",
                headers: APISettings.headers,
            });
            const json = await response.json();
            return (json as Array<PlayerType>).map(player => {
                return new PlayerType(player);
            });
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
            return (json as Array<WeaponType>).map(weapon => {
                return new WeaponType(weapon);
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
    }
};
