// import auth0 from 'auth0-js'
import Auth0LockPasswordless from 'auth0-lock-passwordless'
import { AUTH_CONFIG } from './auth0-variables'
import EventEmitter from 'EventEmitter'
import router from './../router'

export default class AuthServiceSMS {

  authenticated = this.isAuthenticated()
  authNotifier = new EventEmitter()

  constructor () {
    this.auth0SMS = new Auth0LockPasswordless(AUTH_CONFIG.clientId, AUTH_CONFIG.domain)
    this.login = this.login.bind(this)
    this.hash = this.auth0SMS.parseHash(window.location.hash)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  login () {
    var self = this
    var options = {
      'callbackURL': AUTH_CONFIG.callbackUrl,
      'responseType': 'token',
      'autoclose': true,
      'focusInput': false,
      'popup': false,
      'socialBigButtons': true,
      'connections': [
        'facebook',
        'twitter'
      ]
    }
    this.auth0SMS.socialOrSms(options, function (error, profile, id_token, access_token, state, refresh_token) {
      /* callbacks vary depending on how you use the lock
       * you can find more information on the lock's README
       * https://github.com/auth0/lock-passwordless#api
       */
      console.log('le error', error)
      console.log('le profile', profile)
      console.log('le id_token', id_token)
      console.log('le access_token', access_token)
      console.log('le state', state)
      console.log('le refresh_token', refresh_token)

      if (access_token && id_token) {
        // this.setSession(authResult)
        alert('Hi' + profile.name)
        // router.replace('home')
      } else if (error) {
        // router.replace('home')
        console.log('le error ', error)
      }
    })
  }

  handleAuthentication () {
    console.log('le hash', this.hash)
    if (this.hash && this.hash.error) {
      router.replace('home')
      console.log('le error', this.hash.error)
    } else if (this.hash && this.hash.id_token) {
      this.setSession(this.hash)
      router.replace('home')
    }
  }
  setSession (authResult) {
    let expire = window.location.hash.split('&')[1]
    let time = expire.split('=')[1]
    console.log('le time', time)
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
       time * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.access_token)
    localStorage.setItem('id_token', authResult.id_token)
    this.auth0SMS.getProfile(authResult.id_token, this.setProfile.bind(this))
    localStorage.setItem('expires_at', expiresAt)
    this.authNotifier.emit('authChange', { authenticated: true })
  }

  setProfile (err, profile) {
    if (err) {
      console.log('error de perfil')
    }
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.authNotifier.emit('profile_updated', profile)
  }

  logout () {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    // localStorage.removeItem('expires_at')
    this.userProfile = null
    this.authNotifier.emit('authChange', false)
    console.log('salio')
    // navigate to the home route
    router.replace('home')
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}
