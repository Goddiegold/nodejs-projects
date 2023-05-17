const http = require('http');
require('dotenv').config()

const PORT = process.env.PORT || 3000;
const app = require('./app');
const { mongooseConnect } = require('./utils/mongoose');

const server = http.createServer(app);

const startServer = async () => {
    try {
        await mongooseConnect();
        server.listen(PORT, () => console.log(`Server listening on port https://localhost:${PORT}`));
    } catch (error) {
        console.error(error.message);
    }
}

startServer();