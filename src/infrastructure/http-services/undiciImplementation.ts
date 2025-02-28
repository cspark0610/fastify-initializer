/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from 'undici';
import { DependencyType, PathParamsType } from '../types/configValues';
import urlParser from 'url';
import { AbstractRestService } from '../common/abstractRestService';
import { RequestType } from '../types/httpTypes';
import { HttpMethod } from '../types/httpMethods';
import { ConfigurationFromLib } from '../common/config';

export class UndiciImplementation extends AbstractRestService {
  public config = ConfigurationFromLib.fromConfigLibrary();

  /**
   * Sends an HTTP request.
   * @template T - The type of the request payload.
   * @template R - The expected response type.
   * @param {T} request - The request payload.
   * @param {Record<string, string>} headers - The request headers.
   * @param {string} token - The authentication token.
   * @param {string} serviceName - The name of the service.
   * @param {number} limit max redirections quantity
   * @returns {Promise<R | undefined>} A promise that resolves to the response.
   */
  async request<T, R>(
    request: RequestType<T>,
    headers: Record<string, string>,
    token: string,
    serviceName: string,
    limit = 1
  ): Promise<R | undefined> {
    try {
      const { method, timeout } = this.config.get<DependencyType>(`services.${serviceName}`);
      const { body, pathParams, queryParams } = request;
      let url = this.getUri(serviceName, pathParams);
      url = queryParams !== undefined ? super.addQueryParams(url, queryParams) : url;

      const response = await this.makeRequest<R>(url, method, headers, token, body, timeout, limit);
      return response;
    } catch (error: any) {
      error.message = `${error.message} - ${serviceName}`;
      throw error;
    }
  }

  private async makeRequest<R>(
    url: string,
    method: HttpMethod,
    headers: Record<string, string>,
    token: string,
    body: RequestType<any>['body'] | undefined,
    timeout: number,
    _limit: number
  ): Promise<R> {
    const options = {
      method,
      headers: token ? { ...headers, Authorization: token } : { ...headers },
      ...(method !== 'GET' && { body: body ? JSON.stringify(body) : null }),
      bodyTimeout: timeout ?? null
      // maxRedirections: limit
    };

    const { statusCode, body: responseBody } = await request(url, options);

    if (statusCode >= 200 && statusCode < 300) {
      const responseData = await responseBody.json();
      return responseData as R;
    } else {
      const errorData = await responseBody.json();
      throw errorData;
    }
  }

  /**
   * Constructs the URL for the HTTP request.
   * @template T - The type of the request payload.
   * @param {string} serviceName - The name of the service.
   * @param {PathParamsType} pathParams - The path parameters for the URL.
   * @returns {string} The constructed URL.
   */
  protected getUri(serviceName: string, pathParams: PathParamsType | undefined): string {
    const { dependency: dependencyName } = this.config.get<any>(`services.${serviceName}`);
    const { url: urlDependency } = this.config.get<any>(`dependencies.${dependencyName}`);
    let urlParsed = urlParser.format(`${urlDependency.protocol}://${urlDependency.hostname}${urlDependency.pathname}`);
    if (pathParams !== undefined) {
      urlParsed = super.replacePathParams(urlParsed, pathParams);
    }
    return urlParsed;
  }
}
