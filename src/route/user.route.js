import express from "express";
import {
  deleteUserController,
  getuserByIdController,
  loginController,
  logout,
  registerController,
  updateUserController,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Handaru
 *               email:
 *                 type: string
 *                 example: handaru@mail.com
 *               password:
 *                 type: string
 *                 example: password
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already exists
 */

router.post("/register", registerController);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: handaru@gmail.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Username or password is wrong
 */

router.post("/login", loginController);

/**
 * @swagger
 * /api/users/logout:
 *   get:
 *     summary: Logout user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized access
 */
router.get("/logout", authMiddleware, logout);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get Curent User
 *     tags : [User] 
 *     responses:
 *       200:
 *         description: Successfully fetched all users.
 */
router.get("/me", authMiddleware, getuserByIdController);


/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 */
router.delete("/", authMiddleware, deleteUserController);
/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 */
router.put("/", authMiddleware, updateUserController);

export default router;
