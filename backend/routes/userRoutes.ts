import express from "express";
import { addUserIdInDB, getUserDetails, updateUserDetails } from "../controllers/userController";
import { updateProfileRateLimiter } from "../middlewares/rateLimiter";
import { verifyToken } from "../middlewares/authToken";
import { decryptRequest } from "../middlewares/dataInTransitEncryption";
import { encryptResponseForRoute } from "../middlewares/encryptResponseForRoute";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDetails:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         middleName:
 *           type: string
 *           description: The user's middle name (optional)
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: The user's date of birth
 *         phone:
 *           type: string
 *           description: The user's phone number
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the last update
 *       example:
 *         firstName: John
 *         middleName: A.
 *         lastName: Doe
 *         dateOfBirth: 1990-05-15
 *         phone: "+1234567890"
 *         updatedAt: "2024-03-27T12:34:56Z"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 *  /api/users/details:
 *   post:
 *     summary: Fetch user details by userId
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique user ID
 *             example:
 *               userId: "user123"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 userDetails:
 *                   $ref: '#/components/schemas/UserDetails'
 *       400:
 *         description: Missing userId in request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "userId is required"
 *       500:
 *         description: Server error while fetching user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 */
router.post('/details', verifyToken, decryptRequest, encryptResponseForRoute ,getUserDetails);

/**
 * @swagger
 *  /api/users/updateDetails:
 *   post:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - formDetails
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique identifier of the user
 *               formDetails:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     description: The updated first name
 *                   middleName:
 *                     type: string
 *                     description: The updated middle name
 *                   lastName:
 *                     type: string
 *                     description: The updated last name
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     description: The updated date of birth
 *                   phone:
 *                     type: string
 *                     description: The updated phone number
 *     responses:
 *       200:
 *         description: The user details were successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 userDetails:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     middleName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     phone:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Missing userId in request body
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/updateDetails', verifyToken, updateProfileRateLimiter, decryptRequest, encryptResponseForRoute, updateUserDetails);

/**
 * @swagger
 * /api/users/addUser:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing userId in request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Missing userId"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid or unauthorized token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/addUser', verifyToken, decryptRequest, encryptResponseForRoute, addUserIdInDB);



export default router;