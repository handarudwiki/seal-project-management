import express from  "express";
import { authMiddleware } from "../middleware/auth_middleware.js";
import { createTaskController, deleteTaskController, finishTaskController, getAllTaskController, getTaskByIdController, updateTaskController } from "../controller/task.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Task"
 *               description:
 *                 type: string
 *                 example: "This is a description for the new task"
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               project_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, createTaskController);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of tasks
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getAllTaskController);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Successfully retrieved task details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.get("/:id", authMiddleware, getTaskByIdController);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Task Name"
 *               description:
 *                 type: string
 *                 example: "Updated task description"
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               project_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.put("/:id", authMiddleware, updateTaskController);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.delete("/:id", authMiddleware, deleteTaskController);

/**
 * @swagger
 * /api/tasks/{id}/finish:
 *   get:
 *     summary: Mark a task as finished
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task marked as finished successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.get("/:id/finish", authMiddleware, finishTaskController);



export default router;