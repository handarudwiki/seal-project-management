import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import {v4} from "uuid"

export const removeTestUser = async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith : "test"
      }
    },
  });
};

export const createTestUser = async () => {
  await prisma.user.create({
    data: {
      email: `test@gmail.com`,
      name: "test",
      password: await bcrypt.hash("password", 10),
      avatar: "https://test.com/images",
    },
  });
};

export const getTestUser = async () => {
  return await prisma.user.findUnique({
    where: {
      email: "test@gmail.com",
    },
  });
};

export const createTestProject = async () => {
  await prisma.project.create({
    data: {
      name: "test project",
      start_date: new Date(),
      end_date: new Date(),
      description: "test description",
    },
  });
};

export const createManyTestProjects = async () => {
  for (let i = 0; i < 10; i++) {
    await prisma.project.create({
      data: {
        name: `test project ${i}`,
        start_date: new Date(),
        end_date: new Date(),
        description: `test description ${i}`,
      },
    });
  }
};

export const getTestProject = async () => {
  return prisma.project.findFirst({
    where: {
      name: "test project",
    },
  });
};

export const removeAllTestProjects = async () => {
  await prisma.project.deleteMany({
    where: {
      name: {
        startsWith: "test project",
      },
    },
  });
};
export const createTestTask = async () => {
  const user = await getTestUser();
  const project = await getTestProject();
  await prisma.task.create({
    data: {
      name: "test",
      user_id: user.id,
      description: "test",
      is_completed: false,
      project_id: project.id,
    },
  });
};

export const getTestTask = async () => {
  return prisma.task.findFirst({
    where: {
      name: "test",
    },
  });
};

export const removeAllTestTask = async () => {
  await prisma.task.deleteMany({
    where: {
      name: {
        startsWith: "test",
      },
    },
  });
};

export const removeAllTest = async()=>{
  await prisma.task.deleteMany({
    where:{
      name:"test"
    }
  })

  await prisma.user.delete({
    where:{
      email:"test"
    }
  })

  await prisma.project.deleteMany({
    where: {
      name: {
        startsWith: "test project",
      },
    },
  });
}
