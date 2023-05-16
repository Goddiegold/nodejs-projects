const http = require('http');
require('dotenv').config()

const PORT = process.env.PORT || 5000;
const app = require('./app');
const { mongooseConnect } = require('./utils/mongo');

const server = https.createServer(app);

const startServer = async () => {
    try {
        await mongooseConnect();
        server.listen(PORT, () => console.log(`Server listening on port https://localhost:${PORT}`));
    } catch (error) {
        console.error(error.message);
    }
}

startServer();