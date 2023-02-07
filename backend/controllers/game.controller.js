import { io } from "../bin/www.js";

export const createGame = (req, res) => {
	// Create a new io with req.params.id as the room name
	console.log("Creating game " + req.params.id);
	io.on("connection", (socket) => {
		socket.join(req.params.id);
		console.log("Socket connected to room " + req.params.id);
	});

	res.status(200).json({ message: "Game created" });
};
