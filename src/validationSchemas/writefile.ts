import { Schema } from 'express-validator';

export const writeFileBody: Schema = {
  files: { isArray: { options: [{ min: 1 }] } },
  'files.*.basename': { trim: true, isString: true },
  'files.*.contents': { trim: true, isString: true },
  'files.*.path': { trim: true, isString: true },
  'files.*.parentId': { trim: true, isString: true },
  'files.*pathTemplateValues': { trim: true, isString: true, isArray: true, optional:true },
  rootId: { isString: true, optional: true },
  order: { isInt: true, optional: true },
  overwrite: { isBoolean: true, optional: true },
  parent: { isString: true, optional: true },
  metadata: { isObject: true, optional: true },
};

export const listDrivesBody: Schema = {
  containerType: {isString: true},
  sort: {isArray: { options: [{ min: 1 }] }, optional: true},
  'sort.*.sortKey': { trim: true, isString: true, optional: true },
  'sort.*.sortOrder': { trim: true, isString: true, optional: true },
  limit: { isInt: true, optional: true },
  parentId: { isString: true, optional: true },
  metadata: { isObject: true, optional: true },
};

export const listDirectoryContentsBody: Schema = {
  parentId: {isString: true},
  sort: {isArray: { options: [{ min: 1 }] }, optional: true},
  'sort.*.sortKey': { trim: true, isString: true, optional: true },
  'sort.*.sortOrder': { trim: true, isString: true, optional: true },
  limit: { isInt: true, optional: true },
  metadata: { isObject: true, optional: true },
};

export const searchBody: Schema = {
  searchQuery: {isString: true},
  parentId: {isString: true, optional: true},
  sort: {isArray: { options: [{ min: 1 }] }, optional: true},
  'sort.*.sortKey': { trim: true, isString: true , optional: true},
  'sort.*.sortOrder': { trim: true, isString: true , optional: true},
  limit: { isInt: true, optional: true },
  metadata: { isObject: true, optional: true },
};