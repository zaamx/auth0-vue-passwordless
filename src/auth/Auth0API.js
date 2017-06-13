import { AUTH_CONFIG } from './auth0-variables'

var ManagementClient = require('auth0').ManagementClient

export const management = new ManagementClient({
  token: AUTH_CONFIG.authApiToken,
  domain: AUTH_CONFIG.domain,
  telemetry: false
})

console.log('entro api', management.updateUser)

