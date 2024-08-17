import supertest from "supertest";
import {app} from "../src/index.js"
import { logger } from "../src/lib/logger.js";
import bcrypt from "bcryptjs"
import { createTestUser, removeTestUser } from "./test_util.js";

describe('POST /api/users/register', function(){
    // beforeEach()
    afterEach(async ()=>{
        await removeTestUser()
    })

    it("should can register user", async()=>{
        const result = await supertest(app)
                    .post('/api/users/register')
                    .send({
                        email :'test@gmail.com',
                        name : "test",
                        password : "password",
                    })
        expect(result.status).toBe(200)
        expect(result.body.data.email).toBe("test@gmail.com")
        expect(result.body.data.name).toBe("test")
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.status).toBe("success")
    })

    it("should reject if request is invalid", async()=>{
        const result = await supertest(app)
            .post('/api/users/register')
            .send({
                email: '',
                password: '',
                name: ''
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.details).toBeDefined();
        expect(result.body.details).toBeDefined();
        expect(result.body.status).toBe('error');
    })

    it("Should reject if email is already exist",async()=>{
        let result = await supertest(app)
            .post('/api/users/register')
            .send({
                email: 'test@gmail.com',
                password: 'rahasia',
                name: 'test'
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe("test@gmail.com");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(app)
            .post('/api/users/register')
            .send({
                email: 'test@gmail.com',
                password: 'rahasia',
                name: 'test'
            });

        logger.info(result.body);

        expect(result.status).toBe(409);
        expect(result.body.message).toBeDefined();
        expect(result.body.status).toBe('error')
    })
}) 

describe("POST api/users/login", function(){
    beforeEach(async()=>{
        await createTestUser()
    })

    afterEach(async()=>{
        await removeTestUser()
    })
    it("should can login", async()=>{
        const result = await supertest(app)
                        .post('/api/users/login')
                        .send({
                            'email' : "test@gmail.com",
                            'password' : "password",

                        })
        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.status).toBe("success")
        expect(result.body.token).toBeDefined
    })

    it('should reject if login request is invalid' ,async()=>{
        const result = await supertest(app)
                        .post('/api/users/login')
                        .send({
                            email:"",
                            password:""
                        })
        expect(result.status).toBe(400)
        expect(result.body.status).toBe('error')
        expect(result.body.details).toBeDefined()
        expect(result.body.message).toBeDefined()
    })

    it('should reject if password is wrong', async()=>{
        const result = await supertest(app)
                        .post('/api/users/login')
                        .send({
                            email:"test@gmail.com",
                            password:"wrongggg"
                        })
        expect(result.status).toBe(401)
        expect(result.body.status).toBe('error')
        expect(result.body.message).toBeDefined()
    })
    it('should reject if email is wrong', async()=>{
        const result = await supertest(app)
                        .post('/api/users/login')
                        .send({
                            email:"wrong@gmail.com",
                            password:"wrongggg"
                        })
        expect(result.status).toBe(401)
        expect(result.body.status).toBe('error')
        expect(result.body.message).toBeDefined()
    })

})

describe('GET /api/users/me', function() {
    let authCookie;
    beforeEach(async () => {
        await createTestUser();

        const result = await supertest(app)
        .post('/api/users/login')
        .send({
            email: 'test@gmail.com',
            password: 'password',
        });
    
    expect(result.status).toBe(200); 

    authCookie = result.headers['set-cookie'];
    console.log(authCookie)
    });

    afterEach(async () => {
        await removeTestUser();
    });


    it('should can get current user', async () => {
        const result = await supertest(app)
            .get('/api/users/me')
            .set('Cookie', authCookie);

        console.log(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe('test@gmail.com');
        expect(result.body.data.name).toBe('test');
        expect(result.body.status).toBe('success');
    });

    it("should reject if don't have token", async () => {
        const result = await supertest(app)
            .get('/api/users/me');
        
        expect(result.status).toBe(401);
        expect(result.body.status).toBe('error');
    });
});

describe('PUT /api/users', function(){
    let authCookie;
    beforeEach(async () => {
        await createTestUser();

        const result = await supertest(app)
        .post('/api/users/login')
        .send({
            email: 'test@gmail.com',
            password: 'password',
        });
    
    expect(result.status).toBe(200); 

    authCookie = result.headers['set-cookie'];
    console.log(authCookie)
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("should can update user", async()=>{
        const result = await supertest(app)
                        .put("/api/users")
                        .set('Cookie', authCookie)
                        .send({
                            'email' : 'testupdate@gmail.com',
                            'name' : "test update"
                        })
        expect(result.status).toBe(200)
        expect(result.body.status).toBe('success')
        expect(result.body.data.email).toBe('testupdate@gmail.com')
        expect(result.body.data.name).toBe('test update')
    })
    it("should reject if don't have token", async()=>{
        const result = await supertest(app)
                        .put("/api/users")
                        .send({
                            'email' : 'testupdate@gmail.com',
                            'name' : "test update"
                        })
        expect(result.status).toBe(401)
        expect(result.body.status).toBe('error')
    })
})
describe('DELETE /api/users', function(){
    let authCookie;
    beforeEach(async () => {
        await createTestUser();

        const result = await supertest(app)
        .post('/api/users/login')
        .send({
            email: 'test@gmail.com',
            password: 'password',
        });
    
    expect(result.status).toBe(200); 

    authCookie = result.headers['set-cookie'];
    console.log(authCookie)
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("should can delete user", async()=>{
        const result = await supertest(app)
                        .put("/api/users")
                        .set('Cookie', authCookie)
                        
        expect(result.status).toBe(200)
        expect(result.body.status).toBe('success')
    })
    it("should reject if don't have token", async()=>{
        const result = await supertest(app)
                        .put("/api/users")
                        .send({
                            'email' : 'testupdate@gmail.com',
                            'name' : "test update"
                        })
        expect(result.status).toBe(401)
        expect(result.body.status).toBe('error')
    })
    
})
