import {io} from "../bin/www.js";
import Character from "../models/Character.model.js";
import Game from "../models/Game.model.js";
import EncryptedNtag from "../models/EncryptedNtag.model.js";

export const createGame = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate(
            {},
            req.body,
            {new: true}
        );
        res.status(201).json(game);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const getGame = async (req, res) => {
    try {
        const game = await Game.find();
        res.status(200).json(game[0]);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

export const addCharacterToGame = async (req, res) => {
    try {
        const characterId = req.params.characterId;
        const gameId = req.params.gameId;

        const character = await Character.findById(characterId);
        let game = await Game.findById(gameId);

        if(!character) {
            res.status(409).json({message: "Character not find"});
        }
        else if (game.players.filter(p => p._id.toString() === characterId).length <= 0) {
            game.players.push(character);

            await game.save();
            res.status(200).json(game);
        } else {
            res.status(409).json({message: "Character already added in this game"});
        }

    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const removeCharacterToGame = async (req, res) => {
    try {
        const characterId = req.params.characterId;
        const gameId = req.params.gameId;

        const character = await Character.findById(characterId);
        let game = await Game.findById(gameId);

        const playersFiltered = game.players.filter(p => p._id.toString() !== characterId);

        if (game.players.length > 0 && playersFiltered.length <= game.players.length) {
            game.players = playersFiltered;

            await game.save();
            res.status(200).json(game);
        } else {
            res.status(409).json({message: "Player doesn't exist in this game"});
        }

    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const deleteGame = async (req, res) => {
    try {
        await Game.findByIdAndDelete(req.params.gameId);
        res.status(200).json({message: "Game deleted successfully."});
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};