import {WeaponType} from "@/utils/Types/WeaponType";
import {PlayerType} from "@/utils/Types/PlayerType";
import {ArmorType} from "@/utils/Types/ArmorType";

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
        update: async (idCharacter: string, player: Object) => {
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
    }
};
