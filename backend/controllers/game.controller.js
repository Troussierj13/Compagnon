import { io } from "../bin/www.js";
import Character from "../models/Character.model.js";
import Game from "../models/Game.model.js";

export const createGame = async (req, res) => {
	// Create a new io with req.params.id as the room name
	console.log("Creating game " + req.params.id);
	const game = new Game(res.body);
	game.isRunning = true;
	await game.save();
	io.on("connection", (socket) => {
		socket.join(req.params.id);
		console.log("Socket connected to room " + req.params.id);
	});

	res.status(200).json({ message: "Game created" });
};

export const getAllGames = async (req, res) => {
	try {
		const games = await Game.find();
		res.status(200).json(games);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const addCharacterToGame = async (req, res) => {
	try {
		const characterId = req.params.characterId;
		const gameId = req.params.gameId;

		const character = await Character.findById(characterId);
		let game = await Game.findById(gameId);

		if(game.players.filter(p => p._id.toString() === characterId).length <= 0) {
			game.players.push(character);

			await game.save();
			res.status(200).json(game);
		}
		else {
			res.status(409).json({ message: "Player already added in this game" });
		}
		
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const removeCharacterToGame = async (req, res) => {
	try {
		const characterId = req.params.characterId;
		const gameId = req.params.gameId;

		const character = await Character.findById(characterId);
		let game = await Game.findById(gameId);

		const playersFiltered = game.players.filter(p => p._id.toString() !== characterId);

		if(game.players.length > 0 && playersFiltered.length <= game.players.length) {
			game.players = playersFiltered;

			await game.save();
			res.status(200).json(game);
		}
		else {
			res.status(409).json({ message: "Player doesn't exist in this game" });
		}
		
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const deleteGame = async (req, res) => {
	try {
		await Game.findByIdAndDelete(req.params.gameId);
		res.status(200).json({ message: "Game deleted successfully." });
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};