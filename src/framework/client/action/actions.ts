import IHTTPClient from '../../common/http/IHTTPClient';

export interface IAction<T> {
  state: T;
}

export interface IApiAction<T> extends IAction<T> {
  httpClient: IHTTPClient;
}
