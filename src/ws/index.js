let http = require('http')
let { ApiGatewayManagementApi } = require('aws-sdk')
let { sandboxVersionAtLeast } = require('../sandbox')

let { ARC_ENV, ARC_WSS_URL = '' } = process.env
let port = process.env.ARC_INTERNAL || '3332'
let local = ARC_ENV === 'testing' || process.env.ARC_LOCAL

let _api
if (local && ARC_WSS_URL) {
  _api = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: `http://localhost:${port}/_arc/ws`,
    region: process.env.AWS_REGION || 'us-west-2',
  })
}
else if (ARC_WSS_URL) {
  _api = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: `${ARC_WSS_URL.replace(/^ws/, 'http')}`,
  })
}

/**
 * arc.ws.legacySendSandbox
 * Sends websocket data to older sandbox environments
 * @param {Object} params
 * @param {String} params.id - the ws connection id (required)
 * @param {Object} params.payload - an event payload (required)
 * @param {Function} callback - a node style errback (optional)
 * @returns {Promise} - returned if no callback is supplied
 */
function legacySendSandbox ({ id, payload }, callback) {
  // create a promise if no callback is defined
  let promise
  if (!callback) {
    promise = new Promise(function (res, rej) {
      callback = function (err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  let port = process.env.PORT || 3333
  let body = JSON.stringify({ id, payload })
  let req = http.request({
    method: 'POST',
    port,
    path: '/__arc',
    headers: {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body)
    }
  })
  req.on('error', callback)
  req.on('close', () => callback())
  req.write(body)
  req.end()

  return promise
}

/**
 * arc.ws.send
 *
 * publish web socket events
 *
 * @param {Object} params
 * @param {String} params.id - the ws connection id (required)
 * @param {Object} params.payload - an event payload (required)
 * @param {Function} callback - a node style errback (optional)
 * @returns {Promise} - returned if no callback is supplied
 */
function send ({ id, payload }, callback) {
  if (local && !sandboxVersionAtLeast('4.3.0')) {
    return legacySendSandbox({ id, payload }, callback)
  }

  let params = {
    ConnectionId: id,
    Data: JSON.stringify(payload)
  }

  if (callback) {
    _api.postToConnection(params, callback)
    return
  }
  return _api.postToConnection(params).promise()
}

/**
 * arc.ws.close
 *
 * publish web socket events
 *
 * @param {Object} params
 * @param {String} params.id - the ws connection id (required)
 * @param {Function} callback - a node style errback (optional)
 * @returns {Promise} - returned if no callback is supplied
 */
function close ({ id }, callback) {
  let params = { ConnectionId: id }
  if (callback) {
    _api.deleteConnection(params, callback)
    return
  }
  return _api.deleteConnection(params).promise()
}

/**
 * arc.ws.info
 *
 * publish web socket events
 *
 * @param {Object} params
 * @param {String} params.id - the ws connection id (required)
 * @param {Function} callback - a node style errback (optional)
 * @returns {Promise} - returned if no callback is supplied
 */
function info ({ id }, callback) {
  let params = { ConnectionId: id }
  if (callback) {
    _api.getConnection(params, callback)
    return
  }
  return _api.getConnection(params).promise()
}

module.exports = {
  _api,
  send,
  close,
  info,
}
