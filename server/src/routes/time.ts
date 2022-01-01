import { Request, Response, Router } from 'express';

const timeRoutes = Router();

timeRoutes.route('/time').get((req: Request, res: Response) => {
  const now = new Date();
  res.json({
    utc: now.toUTCString(),
    iso: now.toISOString(),
    timestamp: now.getTime(),
  });
});

export default timeRoutes;
