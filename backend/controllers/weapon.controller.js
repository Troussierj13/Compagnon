import Weapon from "../models/Weapon.model.js";
// import { character as brutCharacter } from "../character.js";

export const createWeapon = async (req, res) => {
  try {
    const newWeapon = new Weapon(req.body);
    await newWeapon.save();
    res.status(201).json(newWeapon);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getOneWeapon = async (req, res) => {
  try {
    const weapon = await Weapon.findById(req.params.weaponId);
    res.status(200).json(weapon);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllWeapons = async (req, res) => {
  try {
    const weapons = await Weapon.find();
    res.status(200).json(weapons);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateWeapon = async (req, res) => {
  try {
    const weapon = await Weapon.findByIdAndUpdate(
      req.params.weaponId,
      req.body,
      { new: true }
    );
    res.status(200).json(weapon);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteWeapon = async (req, res) => {
  try {
    await Weapon.findByIdAndDelete(req.params.weaponId);
    res.status(200).json({ message: "Weapon deleted successfully." });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
