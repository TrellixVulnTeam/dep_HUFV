const path = require('path')
const request = require('request')
const tar = require('tar-stream')
const gunzip = require('gunzip-maybe')
const npmrc = require('../../../utils/npmrc')

module.exports = (name, spec, result) => {
  const options = {
    url: spec,
    headers: {
      'User-Agent': npmrc.userAgent
    }
  }
  return new Promise((resolve, reject) => {
    const extract = tar.extract()
    let data = ''
    extract.on('entry', function(header, stream, cb) {
      const file = header.name.split(path.sep).pop()
      stream.on('data', function(chunk) {
        if (file === 'package.json') data += chunk
      })
      stream.on('end', function() {
        if (data) {
          try {
            const pkgJSON = JSON.parse(data)
            resolve({
              type: 'remote',
              version: pkgJSON.version,
              dependencies: pkgJSON.dependencies,
              url: spec
            })
          } catch (e) { reject(e) }
        } else {
          cb()
        }
      })
      stream.resume()
    })
    request.get(options)
      .pipe(gunzip())
      .pipe(extract)
      .on('error', reject)
  })
}