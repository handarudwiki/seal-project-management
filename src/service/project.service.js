import ResponseError from "../error/response_error.js";
import prisma from "../lib/prisma.js";
import { createProjectValidation } from "../validation/project.validation.js";
import { validate } from "../validation/validation.js";

export const create = async (req) => {
  const project = validate(createProjectValidation, req);

  const newProject = await prisma.project.create({
    data: project,
  });

  return newProject;
};

export const getAll = async (name) => {
  const projects = await prisma.project.findMany({
    where:{
        ...(name && {
            name: { contains: name, mode: 'insensitive' },
          }),
    },
    include: {
      tasks: true,
    },
  });
  return projects;
};

export const getById = async (id) => {
  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
    include: {
      tasks: true,
    },
  });
  if (!project) {
    throw new ResponseError("Project not found", 404);
  }
  return project;
};

export const update = async (req, id) => {
  const project = validate(createProjectValidation, req);

  const projectCount = await prisma.project.count({
    where: { id },
  });

  if (projectCount !== 1) {
    throw new ResponseError("Project not found", 404);
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: id,
    },
    data: project,
  });
  return updatedProject;
};

export const destroy = async (id) => {
  const projectCount = await prisma.project.count({
    where: { id },
  });

  if (projectCount !== 1) {
    throw new ResponseError("Project not found", 404);
  }

  await prisma.project.delete({
    where: {
      id: id,
    },
  });
};
