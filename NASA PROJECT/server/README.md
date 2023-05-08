# NASA Mission Control Project

This is a Node.js API project that demonstrates how to perform CRUD (Create, Read, Update, Delete) operations on a database and utilize JSON Web Tokens (JWT) for user authentication. It includes endpoints for creating, reading, updating, and deleting users, as well as for retrieving all users and filtering by gender. The project uses the popular Express.js framework and MongoDB for the database.

## Prerequisites

To run this project, you will need to have the following installed on your system:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Mongo Atlas](https://www.mongodb.com/atlas/database)

## Installation

1. Clone this repository to your local machine.
2. Install the required packages by running `npm install` in the root directory of the project.
3. Start the API server by running `npm start`.
4. Test the API by running `npm test`.

## Usage

Once the API server is running, you can use [Postman](https://www.postman.com/) or any other HTTP client to test the endpoints.

### Endpoints

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| POST   | /v1/launches       | Register a new launch         |
| GET    | /v1/launches       | Retrieve all launches         |
| GET    | /v1/planets        | Retrieve all planets          |
| DELETE | /v1/launches/:id   | Delete a launch by ID         |

### Environment Variables

The project uses environment variables to store sensitive information, such as the MongoDB connection string and JWT secret key. These variables are defined in a `.env` file in the root directory of the project. A `.env.example` file is included as a template.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit/) file for details.