import { validationResult } from 'express-validator';
import { IReq, IRes } from '../utils/types';
import { NextFunction } from 'express';
import HttpStatusCodes from '../constants/http';
import fs from 'fs';

export default (req: IReq<unknown>, res: IRes, next: NextFunction) => {

  var jsonData = JSON.stringify(req.body);
  if (jsonData !== "{}") {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
    fs.writeFile("./logs/RequestBody" +  timestamp + ".json", jsonData, function(err) {
      if (err) {
          console.log(err);
      }
    });}

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  return next();
};
