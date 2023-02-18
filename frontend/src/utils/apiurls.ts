import {WeaponType} from "@/utils/Types/WeaponType";
import {PlayerType} from "@/utils/Types/PlayerType";

export const APISettings = {
    token: "",
    headers: new Headers({
        Accept: "application/json",
    }),
    baseURL: "localhost:8000/api/",
};

export const APIRequests = {
    getAllCharacters: async () => {
        const response = await fetch("http://localhost:8000/api/character", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();
        return (json as Array<Object>).map(player => {
            return new PlayerType(player);
        });
    },
    getAllWeapons: async () => {
        const response = await fetch("http://localhost:8000/api/weapon/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();
        return (json as Array<Object>).map(weapon => {
            return new WeaponType(weapon);
        });
    },
};
