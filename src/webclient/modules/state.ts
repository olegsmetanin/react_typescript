import catchErrorsState from './catch-errors/models';
import authState from './auth/models';

export default {
  auth: authState,
  ['catch-errors']: catchErrorsState,
}
