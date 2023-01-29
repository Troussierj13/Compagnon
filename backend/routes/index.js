import express from "express";
import character from "../character.js";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.status(200).json({ character });
});

export { router as indexRouter };
