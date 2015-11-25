import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import deduplicate from '../../../framework/client/invoke/deduplicate';
import ApiCaller from '../../../framework/client/invoke/api';

export default class AuthApi extends ApiCaller {

  throwed(options: {counter: number}) {
    return this._post('/api/throw', options);
  }

  secured() {
    return this._post('/api/authonly', null);
  }

}
