<template>
  <div>
    <h4 v-if="authenticated">
        You are logged in!
    </h4>
    <h4 v-if="!authenticated">
      You are not logged in! Please <a @click="auth.login()">Log In</a> to continue.
    </h4>
    <button class="btn btn-success" @click="updateUser()">
      actualiza bitch
    </button>
    <div class="lemoiactualizado" v-if="lemoiupdate">
      {{lemoiupdate}}
    </div>
    <div v-for="item in users" v-if="users">
      <code>{{item}}</code>
      <hr>
    </div>

    
  </div>
</template>

<script>
import { management } from '../auth/Auth0API'
export default {
  name: 'home',
  props: ['auth', 'authenticated'],
  data () {
    return {
      users: [],
      lemoiupdate: null,
      lemoitoupdate: {
        'email_verified': false, // new data
        'email': '525539902887@hispano.email', // new data
        'verify_email': false, // new data
        'connection': 'Initial-Connection',
        'username': 'johndoe',
        'client_id': '81K1H3XaFCwBl8vY6dTpFmot7IAVtqEY'
      },
      lemoi: {
        'phone_number': '+525539902887',
        'phone_verified': true,
        'name': '+525539902887',
        'updated_at': '2017-06-12T18:06:44.750Z',
        'picture': 'https://cdn.auth0.com/avatars/5.png',
        'user_id': 'sms|591f7a53961bda2fafcd1687',
        'nickname': '+525539902887',
        'identities': [{
          'user_id': '591f7a53961bda2fafcd1687',
          'provider': 'sms',
          'connection': 'sms',
          'isSocial': false
        }],
        'created_at': '2017-05-22T08:14:12.816Z',
        'last_ip': '201.149.36.195',
        'last_login': '2017-06-12T18:06:44.750Z',
        'logins_count': 10,
        'user_metadata': {
          'geoip': {
            'country_code': 'MX',
            'country_code3': 'MEX',
            'country_name': 'Mexico',
            'city_name': 'Cuauhtemoc',
            'latitude': 28.4167,
            'longitude': -106.8667,
            'time_zone': 'America/Chihuahua',
            'continent_code': 'NA'
          }
        }
      }
    }
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      var self = this
      // management.users.getUsers().then(function (users) {
      management.getUsers().then(function (users) {
        console.log('le users from auth0 ', users)
        self.users = users
      }).catch(function (err) {
        if (err) {
          console.log('le error de api auth0 ', err)
        }
      })
    },
    updateUser () {
      var self = this
      var userID = 'sms|591f7a53961bda2fafcd1687'
      var data = self.lemoitoupdate
      console.log('le data', data)
      management.updateUser({'id': userID}, data).then(function (user) {
        console.log('le users from auth0 ', user)
        self.lemoiupdate = user
      }).catch(function (err) {
        if (err) {
          console.log('le error de user ', err)
        }
      })
    }
  }
}

</script>

<style>
  a {
    cursor: pointer;
  }
</style>

