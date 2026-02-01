import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SessionStory API",
      version: "1.0.0",
      description: "API documentation for SessionStory backend",
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Local development server",
      },
      {
        url: "https://api.sessionstory.co",
        description: "Production server",
      },
      // You can add production servers here
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app, port) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};
