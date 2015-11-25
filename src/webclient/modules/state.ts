import catchErrorState from './catch-errors/models';
import authState from './auth/model';

export default {
  auth: authState,
  ['catch-errors']: catchErrorState,
}
