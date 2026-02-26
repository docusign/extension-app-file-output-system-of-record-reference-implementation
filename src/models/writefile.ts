type SpecifiedFile = {
  basename: string;
  contents: string;
  path: string;
  pathTemplateValues?: string;
  parentId: string;
};

type Container = [containerID: number,  containerName: string];
type Sort = [sortKey: string, sortOrder:string];

export interface WriteFileBody {
  files: SpecifiedFile[];
  order?: number;
  overwrite?: boolean;
  rootId: string;
  metadata?: Record<string, unknown>;
}

export interface WriteFileResponse {
  message: string;
}


export interface ListDrivesBody {
  
  containerType: string;
  parentId?: string;
  limit?: number;
  sort: Sort[];
}

export interface ListDrivesResponse {
  containers?: Container[];
  data: object[];
  containerType: string;
  parentId?: string;
}

export interface ListDirectoryContentsBody {
  
  parentId: string;
  filteroptions?: object[];
  limit?: number;
  sort: Sort[];
}

export interface ListDirectoryContentsResponse {
  parentId: string;
  data: object[];
  
}

export interface SearchBody {
  
  searchQuery: string;
  parentId?: string;
  filteroptions?: object[];
  limit?: number;
  sort: Sort[];
}

export interface SearchResponse {
  parentId?: string;
  results: object[];
  
}