import Character from "../models/Character.model.js";
// import { character as brutCharacter } from "../character.js";

export const createCharacter = async (req, res) => {
	try {
		const newCharacter = new Character(req.body);
		await newCharacter.save();
		res.status(201).json(newCharacter);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const getOneCharacter = async (req, res) => {
	try {
		const character = await Character.findById(req.params.characterId);
		res.status(200).json(character);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getAllCharacters = async (req, res) => {
	try {
		const characters = await Character.find();
		res.status(200).json(characters);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const updateCharacter = async (req, res) => {
	try {
		const character = await Character.findByIdAndUpdate(req.params.characterId, req.body, { new: true });
		res.status(200).json(character);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const deleteCharacter = async (req, res) => {
	try {
		await Character.findByIdAndDelete(req.params.characterId);
		res.status(200).json({ message: "Character deleted successfully." });
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};
