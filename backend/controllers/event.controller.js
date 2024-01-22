import { io } from "../bin/www.js";

export const emitEnnemyAppears = async (req, res) => {
	try {
		io.emit("ennemyAppear", req.body);
		console.log('Emit ' + JSON.stringify(req.body))
		
		res.status(200).json(req.body);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const emitVisibilityChange = async (req, res) => {
	try {
		io.emit("visibilityChange", req.body);
		console.log('Emit visibilityChange:' + JSON.stringify(req.body))

		res.status(200).json(req.body);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};