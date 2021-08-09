import express from 'express';
import routes from './routes/index';

const app = express();
const port = 3000;

//connecting routes with their endpoints to our server file
app.use('/api', routes);

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
