import {io} from "../bin/www.js";

export const emitEnnemyAppears = async (req, res) => {
    try {
        io.emit("ennemyAppear", req.body);
        console.log('Emit ' + JSON.stringify(req.body))

        res.status(200).json(req.body);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const emitVisibilityChange = async (req, res) => {
    try {
        io.emit("visibilityChange", req.body);
        console.log('Emit visibilityChange:' + JSON.stringify(req.body))

        res.status(200).json(req.body);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const emitCharacterSheet = async (req, res) => {
    try {
        io.emit("characterSheet", req.body);
        console.log('Emit characterSheet:' + JSON.stringify(req.body))

        res.status(200).json(req.body);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const emitShowState = async (req, res) => {
    try {
        io.emit("showState", req.body);
        console.log('Emit showState:' + JSON.stringify(req.body))

        res.status(200).json(req.body);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const sendMessage = async (req, res) => {
    try {
        io.emit("sendMessage", req.body);
        console.log('Emit sendMessage:' + JSON.stringify(req.body))

        res.status(200).json(req.body);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};