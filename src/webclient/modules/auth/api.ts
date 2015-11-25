import ApiCaller from '../../../framework/client/invoke/api';

export default class AuthApi extends ApiCaller {

  me() {
    return this._post('/api/me', null);
  }

  login() {
    return this._post('/api/login', null);
  }

  logout() {
    return this._post('/api/logout', null);
  }

}
