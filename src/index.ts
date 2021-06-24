import express from 'express';
const app = express();
const port = 3000;

// define a route handler for the dafault home page
app.get('/api', (req, res) => {
    res.send('api server working');
});

// start the express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});