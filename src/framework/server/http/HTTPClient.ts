import IHTTPClient, {IHTTPRequest} from '../../common/http/IHTTPClient';

var node_request = require('request');

var abspath = /^https?:\/\//i;

class HTTPClient implements IHTTPClient {

  siteroot: string;

  constructor(siteroot: string) {
    this.siteroot = siteroot;
  }

  send(request: IHTTPRequest) {

    return new Promise<any>((resolve, reject) => {
      node_request({
        url: abspath.test(request.url) ? request.url : this.siteroot + request.url,
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.data),
      }, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve(JSON.parse(body))
          } else if (response.statusCode == 404) {
            reject(body);
          } else {
            reject(error);
          }
        })
    })
  }

}

export default HTTPClient;
