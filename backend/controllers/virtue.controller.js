import Virtue from "../models/Virtue.model.js";

export const createVirtue = async (req, res) => {
    try {
        const newVirtue = new Virtue(req.body);
        await newVirtue.save();
        res.status(201).json(newVirtue);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const getAllVirtues = async (req, res) => {
    try {
        const virtues = await Virtue.find();
        res.status(200).json(virtues);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

export const updateVirtue = async (req, res) => {
    try {
        const virtue = await Virtue.findOneAndUpdate(
            {identifier: req.params.virtueIdentifier},
            req.body,
            {new: true}
        );
        res.status(200).json(virtue);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const deleteVirtue = async (req, res) => {
    try {
        await Virtue.findOneAndDelete({identifier: req.params.virtueIdentifier});
        res.status(200).json({message: "Virtue deleted successfully."});
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};
