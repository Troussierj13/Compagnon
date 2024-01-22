import express from "express";
import { getEncryptedNtag, updateEncryptedNtag} from "../controllers/encryptedNtag.controller.js";

const router = express.Router();

router.put("/", updateEncryptedNtag);
router.get("/", getEncryptedNtag);

export { router as encryptedNtagRouter };
