const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config()

const PORT = process.env.PORT || 5000;
const app = require('./app');
const { mongooseConnect } = require('./utils/mongo');

const baseDir = path.resolve();
let options = {
    key: fs.readFileSync(baseDir + '/src/utils/certificate/key.pem'),
    cert: fs.readFileSync(baseDir + '/src/utils/certificate/cert.pem'),
};

const server = https.createServer({
    key: options.key,
    cert: options.cert,
}, app);

const startServer = async () => {
    try {
        await mongooseConnect();
        server.listen(PORT, () => console.log(`Server listening on port https://localhost:${PORT}`));
    } catch (error) {
        console.error(error.message);
    }
}

startServer();