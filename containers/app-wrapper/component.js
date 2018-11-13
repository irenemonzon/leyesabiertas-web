import React, { Component } from 'react'
import UserContext from '../../components/user-context/component'

const API_URL = process.env.API_URL
const NODE_ENV = process.env.NODE_ENV
const REALM = process.env.REALM
const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL
const SSL_REQUIRED = process.env.SSL_REQUIRED
const RESOURCE = process.env.RESOURCE
const PUBLIC_CLIENT = process.env.PUBLIC_CLIENT
const CONFIDENTIAL_PORT = process.env.CONFIDENTIAL_PORT

let Keycloak

export default class extends Component {
  state = {
    keycloak: null,
    authenticated: false,
    login: null,
    isAuthor: null,
    user: null
  }

  fetchMe = async (token) => {
    return (await fetch(`${API_URL}/api/v1/users/me`, {
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })).json()
  }

  // syncMe = async (updatedUser) => {
  //   // const updatedUser = await this.fetchMe()
  //   this.setState({
  //     user: updatedUser
  //   })
  // }

  updateMe = async (newProfile) => {
    const updatedUser = await (await fetch(`${API_URL}/api/v1/users`, {
      'method': 'PUT',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.keycloak.token
      },
      'body': JSON.stringify(newProfile)
    })).json()
    if (!updatedUser) {
      throw Error()
    }
    this.setState({
      user: updatedUser
    })
    return updatedUser
  }

  async componentDidMount () {
    const keycloakOptions = {
      'url': AUTH_SERVER_URL,
      'realm': REALM,
      'auth-server-url': AUTH_SERVER_URL,
      'ssl-required': SSL_REQUIRED,
      'resource': NODE_ENV === 'development' ? RESOURCE : RESOURCE,
      'public-client': PUBLIC_CLIENT,
      'confidential-port': CONFIDENTIAL_PORT,
      'clientId': NODE_ENV === 'development' ? RESOURCE : RESOURCE
    }
    Keycloak = require('keycloak-js')
    const keycloak = await Keycloak(keycloakOptions)
    try {
      const authenticated = await keycloak.init({ onLoad: 'check-sso' })
      const isAuthor = authenticated ? await keycloak.hasRealmRole('accountable') : false
      const profile = authenticated && await keycloak.loadUserInfo()
      const user = authenticated ? await this.fetchMe(keycloak.token) : null
      this.setState({
        keycloak: keycloak,
        authenticated: authenticated,
        isAuthor: isAuthor,
        profile: profile,
        user: user,
        login: keycloak.login,
        register: keycloak.register,
        logout: keycloak.logout
      })
    } catch (err) {
      console.error(err)
      this.setState({
        authenticated: false
      })
    }
  }

  render () {
    let value = this.state
    value.fetchMe = this.fetchMe
    value.updateMe = this.updateMe

    return (
      <UserContext.Provider value={value} >
        {this.props.children}
      </UserContext.Provider>
    )
  }
}
