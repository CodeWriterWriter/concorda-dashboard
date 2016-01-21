'use strict'

import Request from 'superagent/lib/client'
import { pushPath } from 'redux-simple-router'

import * as authActions from '../constants/auth'

export function login (user, pass) {
  return (dispatch) => {
    dispatch({type: authActions.LOGIN_REQUEST})

    Request
      .post('/auth/login')
      .type('form')
      .send({username: user, password: pass})
      .end((err, resp) => {
        if (err || !resp.body.ok) {
          dispatch({
            type: authActions.LOGIN_RESPONSE,
            niceError: 'Wrong username or password, try again',
            hasError: true,
            token: null
          })
        }
        else {
          const token = resp.body.login.id

          console.log(resp.body.login.id)

          dispatch({type: authActions.LOGIN_RESPONSE, hasError: false, token: token})
          dispatch(pushPath('/'))

          window.localStorage.setItem('token', token)
        }
      })
    }
  }

export function logout (token) {
  return (dispatch) => {
    dispatch({type: authActions.LOGOUT_REQUEST})

    Request
      .post('/auth/logout')
      .type('form')
      .send({token: token})
      .end(() => {
        dispatch({type: authActions.LOGOUT_RESPONSE, hasError: false, token: null})
        dispatch(pushPath('/'))

        window.localStorage.clear()
      })
  }
}
