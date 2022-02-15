import request from '../request'

export const gettoken = (path) => request('default/shared/uploadtoken', 'get', { path })
