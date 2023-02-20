import { armors as brutArmors } from "../armors.js";
import Armor from "../models/Armor.model.js";

export const populateDb = async (req, res) => {
  try {
    brutArmors.map(async (weap) => {
      const newArmor = new Armor(weap);
      await newArmor.save();
    });
    /*brutArmors.map(async (weap) => {
              console.log(weap._id);
              await Armor.findByIdAndDelete(weap._id);
            });*/
    res
      .status(201)
      .json({ message: "Armor DB is now populate with default armors" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createArmor = async (req, res) => {
  try {
    const newArmor = new Armor(req.body);
    await newArmor.save();
    res.status(201).json(newArmor);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getOneArmor = async (req, res) => {
  try {
    const armor = await Armor.findById(req.params.armorId);
    res.status(200).json(armor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllArmors = async (req, res) => {
  try {
    const armors = await Armor.find();
    res.status(200).json(armors);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateArmor = async (req, res) => {
  try {
    const armor = await Armor.findByIdAndUpdate(req.params.armorId, req.body, {
      new: true,
    });
    res.status(200).json(armor);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteArmor = async (req, res) => {
  try {
    await Armor.findByIdAndDelete(req.params.armorId);
    res.status(200).json({ message: "Armor deleted successfully." });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
