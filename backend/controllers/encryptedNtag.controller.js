import EncryptedNtag from "../models/EncryptedNtag.model.js";

export const updateEncryptedNtag = async (req, res) => {
  try {
    const ntag = await EncryptedNtag.findOneAndUpdate(
        {},
        req.body,
        { new: true }
        );
    res.status(201).json(ntag);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getEncryptedNtag = async (req, res) => {
  try {
    const ntag = await EncryptedNtag.find();
    res.status(200).json(ntag);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
