import express from "express";
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.status(200).json({
		message: "Hello World!",
	});
});

export { router as indexRouter };
