const swaggerDocument = {
    openapi: "3.0.3",
    info: {
        title: "Hiring Fullstack Todo API",
        version: "1.0.0",
        description: "API documentation for authentication and todo backend routes.",
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "Local development server",
        },
    ],
    tags: [
        {
            name: "Auth",
            description: "User signup, login, and current user routes",
        },
        {
            name: "Todos",
            description: "TODO task management routes",
        },
    ],
    paths: {
        "/": {
            get: {
                summary: "Health check",
                tags: ["Health"],
                responses: {
                    200: {
                        description: "API is running",
                        content: {
                            "text/html": {
                                schema: {
                                    type: "string",
                                    example: "API is running...",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/signup": {
            post: {
                summary: "Create a new user account",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SignupRequest",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "User created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthResponse",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Missing or invalid input",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    409: {
                        description: "User already exists",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/login": {
            post: {
                summary: "Log in an existing user",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/LoginRequest",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthResponse",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Missing input",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Invalid email or password",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/me": {
            get: {
                summary: "Get the current logged-in user",
                tags: ["Auth"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    200: {
                        description: "Current user details",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/UserResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Missing or invalid token",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/todos": {
            get: {
                summary: "Get all TODO items",
                tags: ["Todos"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    200: {
                        description: "List of TODO items",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Todo",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: "Create a new TODO item",
                tags: ["Todos"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TodoRequest",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "TODO created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Todo",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Missing or invalid input",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/todos/{id}": {
            put: {
                summary: "Update a TODO title or description",
                tags: ["Todos"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TodoRequest",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "TODO updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Todo",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Invalid TODO id or input",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: "Delete a TODO item",
                tags: ["Todos"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "TODO deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/DeleteResponse",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Invalid TODO id",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/todos/{id}/done": {
            patch: {
                summary: "Toggle a TODO done status",
                tags: ["Todos"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "TODO done status toggled successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Todo",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Invalid TODO id",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            SignupRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: {
                        type: "string",
                        example: "Jane Doe",
                    },
                    email: {
                        type: "string",
                        format: "email",
                        example: "jane@example.com",
                    },
                    password: {
                        type: "string",
                        format: "password",
                        minLength: 6,
                        example: "Password123",
                    },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        example: "jane@example.com",
                    },
                    password: {
                        type: "string",
                        format: "password",
                        example: "Password123",
                    },
                },
            },
            User: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        example: "663f1a3b4d2f2f001e5a6b7c",
                    },
                    name: {
                        type: "string",
                        example: "Jane Doe",
                    },
                    email: {
                        type: "string",
                        format: "email",
                        example: "jane@example.com",
                    },
                },
            },
            TodoRequest: {
                type: "object",
                required: ["title"],
                properties: {
                    title: {
                        type: "string",
                        example: "Finish assessment",
                    },
                    description: {
                        type: "string",
                        example: "Complete the TODO CRUD app and README files",
                    },
                },
            },
            Todo: {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                        example: "663f1a3b4d2f2f001e5a6b7c",
                    },
                    title: {
                        type: "string",
                        example: "Finish assessment",
                    },
                    description: {
                        type: "string",
                        example: "Complete the TODO CRUD app and README files",
                    },
                    done: {
                        type: "boolean",
                        example: false,
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                    },
                },
            },
            AuthResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: true,
                    },
                    token: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                    user: {
                        $ref: "#/components/schemas/User",
                    },
                },
            },
            UserResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: true,
                    },
                    user: {
                        $ref: "#/components/schemas/User",
                    },
                },
            },
            DeleteResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Todo deleted",
                    },
                },
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: false,
                    },
                    message: {
                        type: "string",
                        example: "Invalid email or password",
                    },
                },
            },
        },
    },
};

const swaggerHtml = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hiring Fullstack Todo API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle({
                url: "/api-docs.json",
                dom_id: "#swagger-ui",
            });
        };
    </script>
</body>
</html>`;

module.exports = {
    swaggerDocument,
    swaggerHtml,
};
