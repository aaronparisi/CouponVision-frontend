import { axiosIns } from "../index"

export const getCurrentUser = () => {
  return axiosIns({
    method: 'get',
    url: '/api/users/current-user',
  })
}

// create a new user
export const postUser = user => {
  return axiosIns({
    method: 'post',
    url: '/api/users',
    data: { user },
  })
}

export const deleteUser = userId => {
  return axiosIns({
    method: 'delete',
    url: `/api/users/${userId}`
  })
}

// log a user in (create a session)
export const postSession = user => {
  return axiosIns({
    method: 'post',
    url: '/api/session',
    data: { user },
  })
}

// log out a user (delete a session)
export const deleteSession = () => {
  return axiosIns({
    method: 'delete',
    url: '/api/session'
  })
}