import path, { basename } from 'path';
import { WriteFileBody, WriteFileResponse } from '../models/writefile';
import fs from 'fs';
import { IReq, IRes } from '../utils/types';
import sanitize from 'sanitize-filename';
import { FileDB } from '../db/fileDB';
import { ModelManagerUtil } from '../utils/modelManagerUtil';
import { ResultRehydrator } from '../utils/resultRehydrator';
import moment from 'moment';
import { ConceptDeclaration, ModelManager } from '@accordproject/concerto-core';

enum ErrorCode {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
}

type ErrorResponse = {
  message: string;
  code: string;
}

const generateErrorResponse = (message: string, code: string): ErrorResponse => {
  return {
    message,
    code
  }
}

const MODEL_MANAGER: ModelManager = ModelManagerUtil.createModelManagerFromCTO(path.join(__dirname, "../dataModel/model.cto"));
const CONCEPTS: ConceptDeclaration[] = MODEL_MANAGER.getConceptDeclarations();


export const writeFile = (req: IReq<WriteFileBody>, res: IRes) => {
  const {
    body: {
      files: [file],
      rootId,
    },
  } = req;
  const fileBuffer = Buffer.from(file.contents, 'base64');

const generateFilePath = (typeName: string): string => `${typeName}.json`;
// For simplicity all concepts are identified by Id
const IDENTIFIER: string = 'Id';

/**
 * Formats the date properties of the given data object to 'YYYY-MM-DDTHH:mm:ss.SSSZ'.
 * 
 * Iterates over the properties of the data object and checks if the property
 * is a date-time property based on the typeName. If it is a date-time property,
 * it validates and formats the date to 'YYYY-MM-DDTHH:mm:ss.SSSZ' using moment.
 * 
 * @param data - The data object containing properties to be formatted.
 * @param typeName - The type name used to identify date-time properties.
 * @throws Error if a date property does not match valid ISO 8601 formats.
 */
const formatISO8061DateProperties = (data: object, typeName: string): void => {
  const concept: ConceptDeclaration = CONCEPTS.filter(c => c.getName() === typeName)[0];
  const dataRecord: Record<string, unknown> = data as Record<string, unknown>;

  // Define a regex for valid ISO 8601 date-time formats
  const validISO8601Regex = /^(\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?)$/;

  for (const key in dataRecord) {
    if (concept?.getProperty(key)?.getType() === 'DateTime') {
      const value = dataRecord[key] as string;

      // Validate against allowed ISO 8601 formats
      if (!validISO8601Regex.test(value)) {
        throw new Error(`Invalid date format for property "${key}": "${value}". Must match a valid ISO 8601 format.`);
      }

      // Format to ISO 8601 UTC with 'Z' suffix (e.g., 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      dataRecord[key] = moment.utc(value).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }
  }
};
/**
 * Converts date properties of the given data object to ISO 8601 format.
 * 
 * Iterates over the properties of the data object and checks if the property
 * is a date-time property based on the typeName. If it is a date-time property,
 * it converts the date to ISO 8601 format using moment.
 * 
 * @param data - The data object containing properties to be converted.
 * @param typeName - The type name used to identify date-time properties.
 */
const convertDateToISO8601 = (data: object, typeName: string): void => {
  const concept: ConceptDeclaration = CONCEPTS.filter(c => c.getName() === typeName)[0];
  const dataRecord: Record<string, unknown> = data as Record<string, unknown>;
  for (const key in dataRecord) {
    if (concept.getProperty(key)?.getType() === 'DateTime') {
      dataRecord[key] = moment.utc(dataRecord[key] as string).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    }
  }
}

  try {
    
        const regexp = new RegExp('{{(.*?)}}', 'g');
        let fpath = file.basename;
        if (file.pathTemplateValues) {
          const matchedValues = [...fpath.matchAll(regexp)];
          const replacementValues = file.pathTemplateValues;
          matchedValues.forEach((matched, index) => {
            const toBeReplaced = matched[0];
            fpath = fpath.replace(toBeReplaced, sanitize(replacementValues[index], { replacement: '_' }));
          });
        }

    
    if (!rootId || !file.parentId ) {
      return res.status(400).json(generateErrorResponse(ErrorCode.BAD_REQUEST, 'typeName or recordId missing in request')).send();
    }
    
    const dbFilePath = path.join(__dirname, '../db', `${rootId}.json`);
    if (!fs.existsSync(dbFilePath)) {
      const writeFileResult: WriteFileResponse = { message: `Failed to write file. rootId: ${rootId} is not a valid object name.` };
      return res.json(writeFileResult);
    }
    
    const db: FileDB = new FileDB(generateFilePath(rootId));

    db.updateRecordInFileNonIndex('signedEFTAuthorization', file.parentId, file.contents);


    const writeFileResult: WriteFileResponse = { message: 'Successfully wrote file' };
    return res.json(writeFileResult);
  } catch (err) {
    console.log(`Encountered an error writing file: ${err.message}`);
    const writeFileResult: WriteFileResponse = { message: 'Failed to write file. ' + err.message };
    return res.json(writeFileResult);
  }
};
