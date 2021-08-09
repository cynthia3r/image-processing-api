import express from 'express';

//logger middleware
const logger = (
  req: express.Request,
  res: express.Response,
  next: Function
): void => {
  let url = req.url;
  console.log(`${url} was visited`);
  next();
};

export default logger;
