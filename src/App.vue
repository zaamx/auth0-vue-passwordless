<template>
  <div>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Auth0 - Vue</a>

          <router-link :to="'/'"
            class="btn btn-primary btn-margin">
              Home
          </router-link>

          <button
            class="btn btn-primary btn-margin"
            v-if="!authenticated"
            @click="login()">
              Log In
          </button>

          <button
            class="btn btn-primary btn-margin"
            v-if="authenticated"
            @click="logout()">
              Log Out
          </button>


          <button
            class="btn btn-primary btn-danger"
            @click="logInSMS()">
              LOGIN SMS
          </button>

        </div>
      </div>
    </nav>

    <div class="container">
      <router-view 
        :auth="auth" 
        :authenticated="authenticated">
      </router-view>
    </div>
  </div>
</template>

<script>

import AuthService from './auth/AuthService'
import Auth0LockPasswordless from 'auth0-lock-passwordless'
const auth = new AuthService()
const { login, logout, authenticated, authNotifier } = auth

export default {
  name: 'app',
  data () {
    authNotifier.on('authChange', authState => {
      this.authenticated = authState.authenticated
    })
    return {
      auth,
      authenticated
    }
  },
  methods: {
    login,
    logout,
    logInSMS () {
      var self = this
      var clientID = '81K1H3XaFCwBl8vY6dTpFmot7IAVtqEY'
      var domain = 'hispanoclub.auth0.com'
//       var lock = new Auth0LockPasswordless(clientID, domain)
      // lock.sms(function (error, profile, id_token) {
      //   console.log('le error', error)
      //   console.log('le error', id_token)
      //   // This will be invoked when the user enters the one-time password he or she
      //   // received via text message. Here we just welcome the user, but usually you
      //   // want save the profile and id_token, and handle errors.
      //   if (!error) {
      //     alert('Hi' + profile.name)
      //   }
      // })

      var options = {
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

      var lock = new Auth0LockPasswordless(clientID, domain)

      lock.socialOrSms(options, function (error, profile, id_token) {
        /* callbacks vary depending on how you use the lock
         * you can find more information on the lock's README
         * https://github.com/auth0/lock-passwordless#api
         */
        console.log('le error', error)
        console.log('le error', id_token)
      //   // This will be invoked when the user enters the one-time password he or she
      //   // received via text message. Here we just welcome the user, but usually you
      //   // want save the profile and id_token, and handle errors.
        if (!error) {
          alert('Hi' + profile.name)
        }
      })
    }
  }
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.css';

.btn-margin {
  margin-top: 7px
}
</style>
