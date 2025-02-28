import type { HttpMethod } from './httpMethods.d.ts';

export type PathParamsType = Record<string, string>;
export type QueryParamsType = PathParamsType;

export type DependencyType = {
  url: {
    hostname: string;
    // port: number;
    protocol: string;
    pathname: string;
  };
  timeout: number;
  method: HttpMethod;
  pathParams: PathParamsType;
  queryParams: QueryParamsType;
  headers: Record<string, string>;
};

export type SecretDataType = {
  clientId: string;
  url: string;
  audience: string;
  retries: number;
};
