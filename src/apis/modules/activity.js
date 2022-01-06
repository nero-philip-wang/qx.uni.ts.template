import request from '../request'

export const search = (para) => request('mall/activities', 'get', para, { autoLogin: false })

export const myInvite = () => request('mall/activities/myInvite', 'get', null, { autoLogin: true })
