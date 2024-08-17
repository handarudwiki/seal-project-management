import supertest from "supertest";
import { app } from "../src/index.js";
import { createManyTestProjects, createTestProject, createTestUser, getTestProject, removeAllTestProjects, removeTestUser } from "./test_util";

describe("POST /api/projects", function () {
  let authCookie;
  beforeEach(async () => {
    await createTestUser();

    const result = await supertest(app).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(200);

    authCookie = result.headers["set-cookie"];
    console.log(authCookie);
  });

  afterEach(async () => {
    await removeAllTestProjects();
    await removeTestUser()
  });
  it("should can create projects", async () => {
    const result = await supertest(app)
      .post("/api/projects")
      .set("Cookie", authCookie)
      .send({
        name: "3 funding",
        description: "some description",
        start_date: "2024-08-22",
        end_date: "2024-08-24",
      });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.data.name).toBe("3 funding");
    expect(result.body.data.description).toBe("some description");
  });
  it("should reject if don,t have token", async () => {
    const result = await supertest(app)
      .post("/api/projects")
      .send({
        name: "3 funding",
        description: "some description",
        start_date: "2024-08-22",
        end_date: "2024-08-24",
      });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("error");
  });
  it("should reject request isn't valid", async () => {
    const result = await supertest(app)
      .post("/api/projects")
      .set('Cookie', authCookie)
      .send({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("error");
    expect(result.body.details).toBeDefined()
    expect(result.body.message).toBeDefined()
  });
});


describe("GET /api/projects/:id", function () {
    beforeEach(async () => {
        await createTestProject()
    });

    afterEach(async () => {
        await removeAllTestProjects();
    });

    it("should can get single project", async () => {
        const project = await getTestProject(); 
        const result = await supertest(app)
            .get("/api/projects/" + project.id); 

        expect(result.status).toBe(200);
        expect(result.body.status).toBe("success");
        expect(result.body.data.name).toBe(project.name);
        expect(result.body.data.id).toBe(project.id);
        expect(result.body.data.description).toBe(project.description);
    });
    it("should return 404 if project is not found", async () => {
        const project = await getTestProject(); 
        const result = await supertest(app)
            .get(`/api/projects/${project.id+1}`); 

        expect(result.status).toBe(404);
        expect(result.body.status).toBe('error');
    });
});
describe("GET /api/projects", function () {
    beforeEach(async () => {
        await createTestProject()
        await createManyTestProjects()
    });

    afterEach(async () => {
        await removeAllTestProjects();
    });

    it("should can get all project", async () => {
        const result = await supertest(app)
            .get("/api/projects"); 

        expect(result.status).toBe(200);
        expect(result.body.status).toBe("success");
    });

});

describe("PUT /api/projects/:id", function () {
    let authCookie;
    beforeEach(async () => {
      await createTestUser();
      await createTestProject()
  
      const result = await supertest(app).post("/api/users/login").send({
        email: "test@gmail.com",
        password: "password",
      });
  
      expect(result.status).toBe(200);
  
      authCookie = result.headers["set-cookie"];
      console.log(authCookie);
    });
  
    afterEach(async () => {
      await removeAllTestProjects();
      await removeTestUser()
    });
    it("should can update projects", async () => {
        const project = await getTestProject()
      const result = await supertest(app)
        .put("/api/projects/"+project.id)
        .set("Cookie", authCookie)
        .send({
          name: "3 funding",
          description: "some description",
          start_date: "2024-08-22",
          end_date: "2024-08-24",
        });
  
      expect(result.status).toBe(200);
      expect(result.body.status).toBe("success");
      expect(result.body.data.name).toBe("3 funding");
      expect(result.body.data.id).toBe(project.id);
      expect(result.body.data.description).toBe("some description");
    });
    it("should reject if don,t have token", async () => {
        const project = await getTestProject()
      const result = await supertest(app)
        .put("/api/projects/"+project.id)
        .send({
          name: "3 funding",
          description: "some description",
          start_date: "2024-08-22",
          end_date: "2024-08-24",
        });
  
      expect(result.status).toBe(401);
      expect(result.body.status).toBe("error");
    });
    it("should return 404 if project not found", async () => {
        const project = await getTestProject()
      const result = await supertest(app)
        .put(`/api/projects/${project.id+1}`)
        .set('Cookie', authCookie)
        .send({
            name: "3 funding",
            description: "some description",
            start_date: "2024-08-22",
            end_date: "2024-08-24",
        });
  
      expect(result.status).toBe(404);
      expect(result.body.status).toBe('error');
    });
    it("should return 400 if data invalid", async () => {
        const project = await getTestProject()
      const result = await supertest(app)
        .put(`/api/projects/${project.id}`)
        .set('Cookie', authCookie)
        .send({
            name: "3 funding",
            description: "some description",
            start_date: "2024-08-22",
            end_date: "2024-08-14",
        });
  
      expect(result.status).toBe(400);
    });
  });
describe("DELETE /api/projects/:id", function () {
    let authCookie;
    beforeEach(async () => {
      await createTestUser();
      await createTestProject()
  
      const result = await supertest(app).post("/api/users/login").send({
        email: "test@gmail.com",
        password: "password",
      });
  
      expect(result.status).toBe(200);
  
      authCookie = result.headers["set-cookie"];
      console.log(authCookie);
    });
  
    afterEach(async () => {
      await removeAllTestProjects();
      await removeTestUser()
    });
    it("should can delete projects", async () => {
        const project = await getTestProject()
      const result = await supertest(app)
        .delete("/api/projects/"+project.id)
        .set("Cookie", authCookie)
  
      expect(result.status).toBe(200);
      expect(result.body.status).toBe("success");
    });
    it("should reject if don,t have token", async () => {
        const project = await getTestProject()
      const result = await supertest(app)
        .delete("/api/projects/"+project.id)
  
      expect(result.status).toBe(401);
      expect(result.body.status).toBe("error");
    });
    it("should return 404 if project not found", async () => {
        const project = await getTestProject()
      const result = await supertest(app)
        .delete(`/api/projects/${project.id+1}`)
        .set('Cookie', authCookie)
  
      expect(result.status).toBe(404);
      expect(result.body.status).toBe('error');
    });
  });
