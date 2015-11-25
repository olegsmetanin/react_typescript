import IHTTPClient from '../../common/http/IHTTPClient';
import deduplicate from './deduplicate';

export default class ApiCaller {

  httpClient: IHTTPClient;

  constructor(options: {httpClient: IHTTPClient}) {
    this.httpClient = options.httpClient;
  }

  @deduplicate
  _post(url, data) {
    return this.httpClient.send({
      method: 'post',
      url,
      data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

}
