let { join } = require('path')
let { deepStrictEqual } = require('assert')
let sut = join(process.cwd(), 'src')
let { http } = require(sut)
let test = require('tape')

let { http: httpFixtures } = require('@architect/req-res-fixtures')
let requests = httpFixtures.req
let responses = httpFixtures.res
let legacyResponses = httpFixtures.legacy.res

let b64dec = i => new Buffer.from(i, 'base64').toString()
let str = i => JSON.stringify(i)
let match = (copy, item) => `${copy} matches: ${item}`

let responsesTested = []

let run = (response, request, callback) => {
  responsesTested.push(response)
  let handler = http((req, res) => res(response))
  handler(request, {}, callback)
}

test('Set up env', t => {
  t.plan(1)
  t.ok(http, 'Loaded HTTP')
  // Init env var to keep from stalling on db reads in CI
  process.env.SESSION_TABLE_NAME = 'jwe'
})

test('Architect v7 (HTTP)', t => {
  t.plan(63)
  let request = requests.arc7.getIndex
  run(responses.arc7.noReturn, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.body, '', 'Empty body passed')
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.emptyReturn, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.body, '', 'Empty body passed')
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.string, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(str(responses.arc7.string), res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.object, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(str(responses.arc7.object), res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.array, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(str(responses.arc7.array), res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.buffer, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(str(responses.arc7.buffer), res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.number, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(str(responses.arc7.number), res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.bodyOnly, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc7.bodyOnly.body, res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.bodyWithStatus, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc7.bodyWithStatus.body, res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.bodyWithStatusAndContentType, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc7.bodyWithStatusAndContentType.body, res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.encodedWithBinaryType, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc7.encodedWithBinaryType.body, res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/pdf/, 'Unspecified content type defaults to JSON')
    t.ok(res.isBase64Encoded, 'isBase64Encoded param passed through')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.cookies, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc7.cookies.body, res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(str(responses.arc7.cookies.cookies), str(res.cookies), match('res.cookies', res.cookies))
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.secureCookies, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc7.secureCookies.body, res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(str(responses.arc7.secureCookies.cookies), str(res.cookies), match('res.cookies', res.cookies))
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.secureCookieHeader, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc7.secureCookieHeader.body, res.body, match('res.body', res.body))
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(responses.arc7.secureCookieHeader.headers['set-cookie'], res.headers['set-cookie'], match(`res.headers['set-cookie']`, res.headers['set-cookie']))
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc7.invalid, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.body, '', 'Empty body passed')
    t.equal(responses.arc7.invalid.statusCode, res.statusCode, 'Responded with invalid status code')
  })
})

test('Architect v6 (REST): dependency-free responses', t => {
  t.plan(44)
  let request = requests.arc6.getIndex

  run(responses.arc6.body, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc6.body.body, res.body, match('res.body', res.body))
    t.notOk(res.isBase64Encoded, 'isBase64Encoded param not passed through')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc6.isBase64Encoded, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc6.isBase64Encoded.body, res.body, match('res.body', res.body))
    t.ok(res.isBase64Encoded, 'isBase64Encoded param passed through')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc6.buffer, request, (err, res) => {
    t.notOk(err, 'No error')
    t.ok(typeof res.body === 'string', 'Received string (and not buffer) back')
    t.equal(b64dec(res.body), 'hi there\n', 'Body properly auto-encoded')
    t.ok(res.isBase64Encoded, 'isBase64Encoded param set automatically')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc6.encodedWithBinaryTypeBad, request, (err, res) => {
    t.notOk(err, 'No error')
    t.ok(typeof res.body === 'string', 'Body is (likely) base 64 encoded')
    t.equal(b64dec(res.body), 'hi there\n', 'Body properly auto-encoded')
    t.ok(res.isBase64Encoded, 'isBase64Encoded param set automatically')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc6.encodedWithBinaryTypeGood, request, (err, res) => {
    t.notOk(err, 'No error')
    t.ok(typeof res.body === 'string', 'Body is (likely) base 64 encoded')
    t.equal(b64dec(res.body), 'hi there\n', 'Body properly auto-encoded')
    t.ok(res.isBase64Encoded, 'isBase64Encoded param passed through')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc6.secureCookieHeader, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc6.secureCookieHeader.body, res.body, match('res.body', res.body))
    t.notOk(res.isBase64Encoded, 'isBase64Encoded param not passed through')
    t.equal(responses.arc6.secureCookieHeader.headers['set-cookie'], res.headers['set-cookie'], match(`res.headers['set-cookie']`, res.headers['set-cookie']))
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc6.secureCookieMultiValueHeader, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(responses.arc6.secureCookieMultiValueHeader.body, res.body, match('res.body', res.body))
    t.notOk(res.isBase64Encoded, 'isBase64Encoded param not passed through')
    t.equal(str(responses.arc6.secureCookieMultiValueHeader.multiValueHeaders), str(res.multiValueHeaders), match(`res.multiValueHeaders`, str(res.multiValueHeaders)))
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc6.multiValueHeaders, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.body, '', 'Empty body passed')
    t.notOk(res.isBase64Encoded, 'isBase64Encoded param not passed through')
    // Headers object gets mutated, so let's just ensure a header we set is there
    t.equal(str(responses.arc6.multiValueHeaders.headers['set-cookie']), str(res.headers['set-cookie']), match(`res.headers['set-cookie']`, str(res.headers['set-cookie'])))
    t.equal(str(responses.arc6.multiValueHeaders.multiValueHeaders), str(res.multiValueHeaders), match(`res.multiValueHeaders`, str(res.multiValueHeaders)))
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(responses.arc6.invalidMultiValueHeaders, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.body, '', 'Empty body passed')
    t.notOk(res.isBase64Encoded, 'isBase64Encoded param not passed through')
    // Headers object gets mutated, so let's just ensure a header we set is there
    t.equal(str(responses.arc6.invalidMultiValueHeaders.invalidMultiValueHeaders), str(res.invalidMultiValueHeaders), match(`res.invalidMultiValueHeaders`, str(res.invalidMultiValueHeaders)))
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
})

test('Architect v5 (REST): dependency-free responses', t => {
  t.plan(29)
  let request = requests.arc7.getIndex

  run(legacyResponses.arc5.type, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc5.type.type, res.headers['content-type'], `type matches res.headers['content-type']: ${res.headers['content-type']}`)
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.cookie, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.headers['set-cookie'], legacyResponses.arc5.cookie.cookie, `Cookie set: ${legacyResponses.arc5.cookie.cookie}...`)
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.secureCookie, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.headers['set-cookie'], legacyResponses.arc5.secureCookie.cookie, `Cookie set: ${legacyResponses.arc5.secureCookie.cookie}...`)
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.secureCookieHeader, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc5.secureCookieHeader.headers['set-cookie'], res.headers['set-cookie'], match(`res.headers['set-cookie']`, res.headers['set-cookie']))
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.cors, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.headers['access-control-allow-origin'], '*', `CORS boolean set res.headers['access-control-allow-origin'] === '*'`)
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.isBase64Encoded, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc5.isBase64Encoded.body, res.body, match('res.body', res.body))
    t.ok(res.isBase64Encoded, 'isBase64Encoded param passed through')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.isBase64EncodedType, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc5.isBase64EncodedType.body, res.body, match('res.body', res.body))
    t.equal(legacyResponses.arc5.isBase64EncodedType.type, res.headers['content-type'], `type matches res.headers['content-type']: ${res.headers['content-type']}`)
    t.ok(res.isBase64Encoded, 'isBase64Encoded param passed through')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.isBase64EncodedUnknownCT, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc5.isBase64EncodedUnknownCT.body, res.body, match('res.body', res.body))
    t.equal(legacyResponses.arc5.isBase64EncodedUnknownCT.headers['content-type'], res.headers['content-type'], match(`res.headers['content-type']`, res.headers['content-type']))
    t.ok(res.isBase64Encoded, 'isBase64Encoded param passed through')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
})

test('Architect v5 (REST) + Functions', t => {
  t.plan(23)
  let request = requests.arc7.getIndex
  let antiCache = 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'

  run(legacyResponses.arc5.body, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(str(legacyResponses.arc5.body.body), str(res.body), match('res.body', res.body))
    t.equal(res.statusCode, 200, 'Responded with 200')
    t.notOk(res.type, 'Responded with res.type set') // This used to be t.ok, but we removed res.type in v4
  })
  run(legacyResponses.arc5.cacheControl, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc5.cacheControl.cacheControl, res.headers['cache-control'], match(`res.headers['cache-control']`, str(res.headers['cache-control'])))
    if (legacyResponses.arc5.cacheControl.headers['cache-control'] && !res.headers['Cache-Control'])
      t.pass(`Headers normalized and de-duped: ${str(res.headers)}`)
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.noCacheControlHTML, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.headers['cache-control'], antiCache, 'Default anti-caching headers set for HTML response')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.noCacheControlJSON, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.headers['cache-control'], antiCache, 'Default anti-caching headers set for JSON response')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.noCacheControlJSONapi, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.headers['cache-control'], antiCache, 'Default anti-caching headers set for JSON response')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.noCacheControlOther, request, (err, res) => {
    t.notOk(err, 'No error')
    let def = 'max-age=86400'
    t.equal(res.headers['cache-control'], def, 'Default caching headers set for non-HTML/JSON response')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
  run(legacyResponses.arc5.defaultsToJson, request, (err, res) => {
    t.notOk(err, 'No error')
    t.match(res.headers['content-type'], /application\/json/, 'Unspecified content type defaults to JSON')
    t.equal(res.statusCode, 200, 'Responded with 200')
  })
})

/**
 * Ensure the legacy res.type (Arc v5 VTL) param doesn't get set
 * Conditions were:
 * - `!process.env.ARC_CLOUDFORMATION && (!process.env.ARC_HTTP || process.env.ARC_HTTP === 'aws')`
 * - And also not a proxy request: `!req.resource || req.resource && req.resource !== '/{proxy+}'`
 */
test('Architect v5 (REST) + Functions do not send res.type', t => {
  t.plan(7)
  let request = requests.arc6.getIndex
  process.env.ARC_HTTP = 'aws'
  t.equal(process.env.ARC_HTTP, 'aws', 'Set: ARC_HTTP = aws')
  t.notOk(process.env.ARC_CLOUDFORMATION, 'ARC_CLOUDFORMATION not set')
  t.ok(request.resource, 'Request a Lambda proxy request')

  let run = (response, callback) => {
    let handler = http((req, res) => res(response))
    handler(request, {}, (err, res) => {
      callback(err, res)
    })
  }
  run(legacyResponses.arc5.body, (err, res) => {
    delete process.env.ARC_HTTP
    t.notOk(err, 'No error')
    t.equal(str(legacyResponses.arc5.body.body), str(res.body), match('res.body', res.body))
    t.equal(res.statusCode, 200, 'Responded with 200')
    t.notOk(res.type, 'Responded without res.type')
  })
})

test('Architect v4 + Functions statically-bound content type responses (HTTP)', t => {
  t.plan(24)
  let request = requests.arc7.getIndex
  let r = legacyResponses.arc4
  let run = (response, data, contentType) => {
    let handler = http((req, res) => res(response))
    responsesTested.push(response)
    handler(request, {}, (err, res) => {
      t.notOk(err, 'No error')
      // Don't double-encode JSON
      if (res.headers['content-type'].includes('json')) {
        t.equal(str(data), res.body, match('res.body', res.body))
      }
      else {
        t.equal(str(data), str(res.body), match('res.body', res.body))
      }
      t.match(res.headers['content-type'], new RegExp(contentType), `Correct content-type header sent: ${contentType}`)
      t.equal(res.statusCode, 200, 'Responded with 200')
    })
  }
  run(r.css, r.css.css, 'text/css')
  run(r.html, r.html.html, 'text/html')
  run(r.js, r.js.js, 'text/javascript')
  run(r.json, r.json.json, 'application/json')
  run(r.text, r.text.text, 'text/plain')
  run(r.xml, r.xml.xml, 'application/xml')
})

test('Architect v4 + Functions statically-bound content type responses (REST)', t => {
  t.plan(24)
  let request = requests.arc6.getIndex
  let r = legacyResponses.arc4
  let run = (response, data, contentType) => {
    let handler = http((req, res) => res(response))
    responsesTested.push(response)
    handler(request, {}, (err, res) => {
      t.notOk(err, 'No error')
      // Don't double-encode JSON
      if (res.headers['content-type'].includes('json')) {
        t.equal(str(data), res.body, match('res.body', res.body))
      }
      else {
        t.equal(str(data), str(res.body), match('res.body', res.body))
      }
      t.match(res.headers['content-type'], new RegExp(contentType), `Correct content-type header sent: ${contentType}`)
      t.equal(res.statusCode, 200, 'Responded with 200')
    })
  }
  run(r.css, r.css.css, 'text/css')
  run(r.html, r.html.html, 'text/html')
  run(r.js, r.js.js, 'text/javascript')
  run(r.json, r.json.json, 'application/json')
  run(r.text, r.text.text, 'text/plain')
  run(r.xml, r.xml.xml, 'application/xml')
})

test('Architect <6 + Functions old school response params (HTTP)', t => {
  t.plan(11)
  let request = requests.arc7.getIndex

  run(legacyResponses.arc.location, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.statusCode, 302, match('res.statusCode', res.statusCode))
    t.equal(legacyResponses.arc.location.location, res.headers.Location, match('res.headers.Location', res.headers.Location))
  })
  run(legacyResponses.arc.status, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc.status.status, res.statusCode, match('code', res.statusCode))
  })
  run(legacyResponses.arc.code, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc.code.code, res.statusCode, match('status', res.statusCode))
  })
  run(legacyResponses.arc.statusCode, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc.statusCode.statusCode, res.statusCode, match('statusCode', res.statusCode))
  })
  run(legacyResponses.arc.session, request, (err, res) => {
    t.notOk(err, 'No error')
    t.match(res.headers['set-cookie'], /_idx=/, `Cookie set: ${res.headers['set-cookie'].substr(0, 75)}...`)
  })
})

test('Architect <6 + Functions old school response params (REST)', t => {
  t.plan(11)
  let request = requests.arc6.getIndex

  run(legacyResponses.arc.location, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.statusCode, 302, match('res.statusCode', res.statusCode))
    t.equal(legacyResponses.arc.location.location, res.headers.Location, match('res.headers.Location', res.headers.Location))
  })
  run(legacyResponses.arc.status, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc.status.status, res.statusCode, match('code', res.statusCode))
  })
  run(legacyResponses.arc.code, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc.code.code, res.statusCode, match('status', res.statusCode))
  })
  run(legacyResponses.arc.statusCode, request, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(legacyResponses.arc.statusCode.statusCode, res.statusCode, match('statusCode', res.statusCode))
  })
  run(legacyResponses.arc.session, request, (err, res) => {
    t.notOk(err, 'No error')
    t.match(res.headers['set-cookie'], /_idx=/, `Cookie set: ${res.headers['set-cookie'].substr(0, 75)}...`)
  })
})

test('Return an error (HTTP)', t => {
  t.plan(3)
  let request = requests.arc7.getIndex
  let error = Error('something bad happened')
  let handler = http((req, res) => res(error))
  handler(request, {}, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.statusCode, 500, 'Error response, 500 returned')
    t.match(res.body, new RegExp(error.message), `Error response included error message: ${error.message}`)
  })
})

test('Return an error (REST)', t => {
  t.plan(3)
  let request = requests.arc6.getIndex
  let error = Error('something bad happened')
  let handler = http((req, res) => res(error))
  handler(request, {}, (err, res) => {
    t.notOk(err, 'No error')
    t.equal(res.statusCode, 500, 'Error response, 500 returned')
    t.match(res.body, new RegExp(error.message), `Error response included error message: ${error.message}`)
  })
})

test('Verify all Arc v7 (HTTP) + Arc v6 (REST) + legacy response fixtures were tested', t => {
  let totalReqs = Object.keys(responses.arc7).length +
                  Object.keys(responses.arc6).length +
                  Object.keys(legacyResponses.arc5).length +
                  Object.keys(legacyResponses.arc4).length +
                  Object.keys(legacyResponses.arc).length
  t.plan(totalReqs)
  let tester = ([ name, req ]) => {
    t.ok(responsesTested.some(tested => {
      try {
        deepStrictEqual(req, tested)
        return true
      }
      catch (err) { /* noop */ }
    }), `Tested req: ${name}`)
  }
  console.log(`Arc 7 responses`)
  Object.entries(responses.arc7).forEach(tester)
  console.log(`Arc 6 responses`)
  Object.entries(responses.arc6).forEach(tester)
  console.log(`Legacy Arc 5 responses`)
  Object.entries(legacyResponses.arc5).forEach(tester)
  console.log(`Legacy Arc 4 responses`)
  Object.entries(legacyResponses.arc4).forEach(tester)
  console.log(`Legacy Arc responses`)
  Object.entries(legacyResponses.arc).forEach(tester)
})

test('Teardown', t => {
  t.plan(1)
  // Unset env var for future testing (ostensibly)
  delete process.env.SESSION_TABLE_NAME
  t.pass('Done')
})
