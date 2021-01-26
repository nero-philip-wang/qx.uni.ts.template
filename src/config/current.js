import config from './tenant'
var tenantId = process.env.VUE_APP_T || 1000

module.exports = config[tenantId]
