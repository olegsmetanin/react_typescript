export interface IUser {
  id          : string;
  slug        : string;
  first_name  : string;
  last_name   : string;
  provider    : string;
  picurl      : string;
}

export interface IUserState {
  me: IUser;
  ui: {
    loading: boolean;
    error? : Error;
    popup: {
      open: boolean;
      auth: boolean;
      reconnect: boolean;
    }
  }
}

export default {
  me: undefined,
  ui: {
    loading: false,
  }
}
