import { Router } from 'express';
import Paths from '../constants/paths';
import authRouter from './auth.controller';
import dataIORouter from './dataio.controller';
import writeFileRouter from './writefile.controller';

const apiRouter = Router();

apiRouter.use(Paths.Write.Base, writeFileRouter);

apiRouter.use(Paths.DataIO.Base, dataIORouter);

apiRouter.use(Paths.Auth.Base, authRouter);

export default apiRouter;
