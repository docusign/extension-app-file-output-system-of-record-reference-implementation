import { Router } from 'express';

import Paths from '../constants/paths';
import { writeFile } from '../services/writefile.service';
import { expressjwt as jwt } from 'express-jwt';
import { checkSchema } from 'express-validator';
import { writeFileBody, listDrivesBody, listDirectoryContentsBody, searchBody } from '../validationSchemas/writefile';
import checkValidationErrors from '../middleware/checkValidationErrors';
import env from '../env';

const writeFileRouter = Router();

writeFileRouter.post(
  Paths.Write.File.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(writeFileBody, ['body']),
  checkValidationErrors,
  writeFile,
);

export default writeFileRouter;
