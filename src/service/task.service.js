import ResponseError from "../error/response_error.js";
import prisma from "../lib/prisma.js";
import { createTaskValidation } from "../validation/task.validation.js";
import { validate } from "../validation/validation.js";

export const create = async (req) => {
  const task = validate(createTaskValidation, req);

  const isProjectExist = await prisma.project.findUnique({
    where:{id:task.project_id}
  })

  if(!isProjectExist){
    throw new ResponseError("Project not found", 404)
  }
  const isUserExist = await prisma.user.findUnique({
    where:{id:task.user_id}
  })

  if(!isUserExist){
    throw new ResponseError("User not found", 404)
  }
  const newTask = await prisma.task.create({
    data: task,
  });
  return newTask;
};

export const getAll = async (userId, name) => {
  const tasks = await prisma.task.findMany({
    where: {
      ...(name && {
        name: { contains: name, mode: "insensitive" },
      }),

      user_id: userId,
    },
    include: {
      project: true,
    },
  });
  return tasks;
};

export const getById = async (id, userId) => {
  const task = await prisma.task.findUnique({
    where: {
      id: id,
      user_id: userId,
    },
    include: {
      project: true,
    },
  });
  if (!task) {
    throw new ResponseError("Task not found", 404);
  }
  return task;
};

export const update = async (req, id) => {
  const task = validate(createTaskValidation, req);

  const taskCount = await prisma.task.count({
    where: { id },
  });

  if (taskCount !== 1) {
    throw new ResponseError("Task not found", 404);
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: id,
    },
    data: task,
  });
  return updatedTask;
};

export const destroy = async (id) => {
  const taskCount = await prisma.task.count({
    where: { id },
  });

  if (taskCount !== 1) {
    throw new ResponseError("Task not found", 404);
  }
  await prisma.task.delete({
    where: { id },
  });
};

export const finishTask = async (id) => {
  const taskCount = await prisma.task.count({
    where: { id },
  });

  if (taskCount !== 1) {
    throw new ResponseError("Task not found", 404);
  }
  const task = await prisma.task.update({
    where: { id: id },
    data: {
      is_completed: true,
    },
  });

  return task;
};
