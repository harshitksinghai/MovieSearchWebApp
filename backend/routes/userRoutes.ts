import express from "express";
import { addUserIdInDB, getUserDetails, updateUserDetails } from "../controllers/userController";

const router = express.Router();

router.post('/details', getUserDetails);
router.post('/updateDetails', updateUserDetails);
router.post('/addUser', addUserIdInDB);



export default router;