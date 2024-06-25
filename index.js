const GET_JWT_TOKEN = "getJwtToken";
const jwt = require('jsonwebtoken');
const fs = require('fs');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authData = require('./authData.json');
const app = express();
const privateKey = fs.readFileSync('./keys/key.pem');
const publicKey = fs.readFileSync('./keys/public.pem');
const API_ENDPOINT = 'api.frankfurter.app';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

const port = 3000;

app.post('/auth', async (req, res) => {
    const body = req.body;
    const key = body.key;
    let authDataFound = false;
    for (let i = 0; i < authData.data.length; i++) {
        const authDataData = authData.data[i];
        if (authDataData.apiKey === key) {
            if (authDataData.rights.includes(GET_JWT_TOKEN)) {
                authDataFound = true;
                const token = jwt.sign({ name: authDataData.name, right: "auth" }, privateKey, { algorithm: 'RS256' });
                res.status(201);
                res.json(token);
            }
            res.status(401);
            res.json({ message: 'No rights for token' });
            return;
        }
    }
    if (authDataFound === false) {
        res.status(401);
        res.json({ message: 'Authentication not successful' });
    }

});

app.get('/latest', async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('Unauthorized: No Token');
        return; 
    }
    try {
        jwt.verify(req.headers.authorization, publicKey);
        const url = `https://${API_ENDPOINT}/latest`;
        const response = await fetch(url);
        if (response.ok) {
            try {
                const data = await response.json();
                res.json(data);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        }
    } catch (err) {
        res.status(401).send('Unauthorized: Invalid Token.');
    }    
});

// Serve Swagger UI at /api-docs
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});