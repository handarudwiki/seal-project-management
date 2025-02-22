import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'Project Management',
        },
        servers: [
            {
                url: 'http://localhost:8000', 
            },
        ],
    },
    apis: ['./src/route/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};

export default setupSwaggerDocs
