export interface IUser {
  id          : string;
  slug        : string;
  first_name  : string;
  last_name   : string;
  provider    : string;
  picurl      : string;
}

export interface IPopupState {
  open      : boolean;
  auth      : boolean;
  reconnect : boolean;
  errors?   : any;
}

export interface IUserState {
  me: IUser;
  ui: {
    loading: boolean;
    error? : Error;
    popup  : IPopupState;
  }
}

export default {
  me: undefined,
  ui: {
    loading: false,
    popup: {
      open: false,
      auth: false,
      reconnect: false,
    }
  }
}
