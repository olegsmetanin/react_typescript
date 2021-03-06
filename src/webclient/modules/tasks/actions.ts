/// <reference path="../../webclient.d.ts"/>

import {Action, createAction} from 'redux-actions';
import {Dispatch} from 'redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {Task, TaskStatus, Executor} from './model';
import * as ActionTypes from './actionTypes';
import TasksApi from './api';

const tasksRequestBegin = createAction(ActionTypes.TASKS_REQUEST);

const tasksRequestSuccess = createAction<any>(
  ActionTypes.TASKS_REQUEST_SUCCESS,
  (data) => data
);

const tasksRequestFailure = (e: Error) => {
  const action = createAction(ActionTypes.TASKS_REQUEST_FAILURE, (e:Error) => e)(e);
  action.error = true;
  return action;
}

const requestTasks = (search: string, httpClient: IHTTPClient) => (dispatch: Dispatch) => {

  console.log(`${new Date().toISOString()} tasks request called with ${search}`);
  dispatch(tasksRequestBegin());
  const api = new TasksApi({httpClient});
  return api.find({search}).then(
    result => dispatch(tasksRequestSuccess(result)),
    error => dispatch(tasksRequestFailure(error))
  ).then(() => console.log(`${new Date().toISOString()} tasks request finished for ${search}`));
}



const taskExecutorsRequest = (id: number, stage: string, payload?: (Executor[] | Error)) => {
  let a: Action = {
    type: ActionTypes.TASKS_TASK_EXECUTORS_REQUEST,
    payload,
    meta: {id, stage}, //wait for https://github.com/acdlite/redux-actions/issues/2 for async support (but now works too)
  };
  //wait for https://github.com/acdlite/redux-actions/pull/16
  if (payload instanceof Error) {
    a.error = true;
  };
  return a;
}


const requestExecutors = (id: number, ids: number[], httpClient: IHTTPClient) => async (dispatch: Dispatch) => {

  dispatch(taskExecutorsRequest(id, 'begin'));

  try {
    const executors: Executor[] = await new TasksApi({httpClient}).executors({ids});
    dispatch(taskExecutorsRequest(id, 'success', executors));
  } catch(err) {
    dispatch(taskExecutorsRequest(id, 'failure', err));
  }

}

declare type ExecutorModeChange = {taskId: number, executorId: number};

const editExecutor = createAction<ExecutorModeChange>(ActionTypes.TASKS_EXECUTOR_EDIT_MODE,
  (taskId: number, executorId: number): ExecutorModeChange => ({taskId, executorId}));

const cancelExecutor = createAction<ExecutorModeChange>(ActionTypes.TASKS_EXECUTOR_VIEW_MODE,
  (taskId: number, executorId: number): ExecutorModeChange => ({taskId, executorId}));

const executorUpdateRequest = (taskId: number, executorId: number, stage: string, payload?: (string | Executor | Error)) => {
  let a: Action = {
    type: ActionTypes.TASKS_EXECUTOR_UPDATE_REQUEST,
    payload,
    meta: {taskId, executorId, stage}, //wait for https://github.com/acdlite/redux-actions/issues/2 for async support (but now works too)
  };
  //wait for https://github.com/acdlite/redux-actions/pull/16
  if (payload instanceof Error) {
    a.error = true;
  };
  return a;
}

const saveExecutor = (taskId: number, executorId: number, name: string, httpClient: IHTTPClient) => async (dispatch: Dispatch) => {
  dispatch(executorUpdateRequest(taskId, executorId, 'begin'));

  try {
    const executor: Executor = await new TasksApi({httpClient}).updateExecutor({id: executorId, name});
    dispatch(executorUpdateRequest(taskId, executorId, 'success', executor));
  } catch(err) {
    dispatch(executorUpdateRequest(taskId, executorId, 'failure', err));
  }
}

export {
  requestTasks,
  requestExecutors as requestTaskExecutors,
  editExecutor, cancelExecutor, saveExecutor,
}
