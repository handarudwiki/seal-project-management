import supertest from "supertest";
import { app } from "../src/index.js";
import {
  createTestProject,
  createTestTask,
  createTestUser,
  getTestProject,
  getTestTask,
  getTestUser,
  removeAllTestProjects,
  removeAllTestTask,
  removeTestUser,
} from "./test_util.js";

describe("POST /api/tasks", function () {
  let authCookie;

  beforeEach(async () => {
    await createTestUser();
    await createTestProject();

    const result = await supertest(app).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(200);

    authCookie = result.headers["set-cookie"];
    console.log(authCookie);
  });

  afterEach(async ()=>{
    await removeAllTestTask()
    await removeAllTestProjects()
    await removeTestUser()
})

  it("should can create tasks", async () => {
    const user = await getTestUser();
    const project = await getTestProject();
    const result = await supertest(app)
      .post("/api/tasks")
      .set("Cookie", authCookie)
      .send({
        name: "test",
        user_id: user.id,
        project_id: project.id,
      });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.user_id).toBe(user.id);
    expect(result.body.data.project_id).toBe(project.id);
  });

  it("should reject if don't have token", async () => {
    const user = await getTestUser();
    const project = await getTestProject();
    const result = await supertest(app).post("/api/tasks").send({
      name: "test",
      user_id: user.id,
      project_id: project.id,
    });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("error");
  });
  it("should reject request isn't valid", async () => {
    const result = await supertest(app)
      .post("/api/tasks")
      .set("Cookie", authCookie)
      .send({
        name: "",
        user_id: "",
        project_id: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("error");
    expect(result.body.details).toBeDefined();
    expect(result.body.message).toBeDefined();
  });
});

describe("GET /api/tasks/:id", function () {
    let authCookie;

    beforeEach(async () => {
      await createTestUser();
      await createTestProject();
      await createTestTask()
  
      const result = await supertest(app).post("/api/users/login").send({
        email: "test@gmail.com",
        password: "password",
      });
  
      expect(result.status).toBe(200);
  
      authCookie = result.headers["set-cookie"];
      console.log(authCookie);
    });
  
    afterEach(async ()=>{
      await removeAllTestTask()
      await removeAllTestProjects()
      await removeTestUser()
  })

  it("should can get single task", async () => {
    const task = await getTestTask();
    console.log(task);
    const result = await supertest(app)
            .get("/api/tasks/" + task.id)
            .set('Cookie', authCookie);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.data.name).toBe(task.name);
    expect(result.body.data.id).toBe(task.id);
    expect(result.body.data.description).toBe(task.description);
    
  });

  it("should reject if don't have token", async () => {
    const task = await getTestTask();
    const result = await supertest(app)
                .get(`/api/tasks/${task.id}`)

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("error");
  });
  it("should return 404 if task not found", async () => {
    const task = await getTestTask();
    const result = await supertest(app)
                .get(`/api/tasks/${task.id + 1}`)
                .set('Cookie', authCookie)

    expect(result.status).toBe(404);
    expect(result.body.status).toBe("error");
  });
});
describe("GET /api/tasks", function () {
  let authCookie;

  beforeEach(async () => {
    await createTestUser();
    await createTestProject();

    const result = await supertest(app).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(200);

    authCookie = result.headers["set-cookie"];
    console.log(authCookie);
  });

  afterEach(async ()=>{
    await removeAllTestTask()
    await removeAllTestProjects()
    await removeTestUser()
})

  it("should can get all project", async () => {
    const result = await supertest(app).get("/api/tasks").set('Cookie', authCookie);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
  });
  it("should reject if don't have token", async () => {
    const result = await supertest(app).get("/api/tasks");

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("error");
  });
});

describe("PUT /api/tasks/:id", function () {
  let authCookie;

  beforeEach(async () => {
    await createTestUser();
    await createTestProject();
    await createTestTask()

    const result = await supertest(app).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(200);

    authCookie = result.headers["set-cookie"];
    console.log(authCookie);
  });

  afterEach(async ()=>{
    await removeAllTestTask()
    await removeAllTestProjects()
    await removeTestUser()
})
  it("should can update tasks", async () => {
    const user = await getTestUser()
    const project = await getTestProject()
    const task = await getTestTask()
    const result = await supertest(app)
      .put("/api/tasks/" + task.id)
      .set("Cookie", authCookie)
      .send({
        name: "test updated",
        description : "some description",
        user_id : user.id,
        project_id:project.id
      });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.data.name).toBe("test updated");
    expect(result.body.data.id).toBe(task.id);
    expect(result.body.data.description).toBe("some description");
    expect(result.body.data.user_id).toBe(user.id);
    expect(result.body.data.project_id).toBe(project.id);
  });
  it("should reject if don't have token", async () => {
    const user = await getTestUser()
    const project = await getTestProject()
    const task = await getTestTask()
    const result = await supertest(app)
      .put("/api/tasks/" + task.id)
      .send({
        name: "slicing ui updated",
        description : "some description",
        user_id : user.id,
        project_id:project.id
      });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("error");
  });
  it("should return 404 if task not found", async () => {
    const user = await getTestUser()
    const project = await getTestProject()
    const task = await getTestTask()
    const result = await supertest(app)
      .put(`/api/tasks/${task.id+1}` )
      .set("Cookie", authCookie)
      .send({
        name: "slicing ui updated",
        description : "some description",
        user_id : user.id,
        project_id:project.id
      });

    expect(result.status).toBe(404);
    expect(result.body.status).toBe("error");
  });
  it("should return 400 if data invalid", async () => {
    const user = await getTestUser()
    const project = await getTestProject()
    const task = await getTestTask()
    const result = await supertest(app)
      .put(`/api/tasks/${task.id+1}` )
      .set("Cookie", authCookie)
      .send({
        name: "ui",
        description : "some description",
        user_id : user.id,
        project_id:project.id
      });

    expect(result.status).toBe(400);
  });
});
describe("DELETE /api/projects/:id", function () {
  let authCookie;

  beforeEach(async () => {
    await createTestUser();
    await createTestProject();
    await createTestTask()

    const result = await supertest(app).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(200);

    authCookie = result.headers["set-cookie"];
    console.log(authCookie);
  });

  afterEach(async ()=>{
    await removeAllTestTask()
    await removeAllTestProjects()
    await removeTestUser()
})
  it("should can delete tasks", async () => {
    const task = await getTestTask();
    const result = await supertest(app)
      .delete("/api/tasks/" + task.id)
      .set("Cookie", authCookie);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
  });
  it("should reject if don,t have token", async () => {
    const task = await getTestTask();
    const result = await supertest(app)
      .delete("/api/tasks/" + task.id)

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("error");
  });
  it("should return 404 if project not found", async () => {
    const task = await getTestTask();
    const result = await supertest(app)
      .delete(`/api/tasks/${task.id + 1}`)
      .set("Cookie", authCookie);

    expect(result.status).toBe(404);
    expect(result.body.status).toBe("error");
  });
});
