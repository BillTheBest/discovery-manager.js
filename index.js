const request = require('superagent')
const definitions = require('./definitions')
const utils = require('./utils')

const projectId = process.env['PROJECT_ID'] || 'YOUR_PROJECT_ID'
const masterKey = process.env['MASTER_KEY'] || 'YOUR_MASTER_KEY'
const discoRef = utils.getDiscoRef(projectId)

// Run
createAll((err, res) => {
  console.log(err);
  console.log(res.body);
})

function createAll(done) {
  Object.keys(definitions).forEach((key) => {
    console.log(`Create ${utils.getDiscoRef(projectId, key)}`)
    utils.findOne(projectId, key, masterKey, (err, res) => {
      if (err && err.response && err.response.error.status === 404) {
        createOne(key, masterKey, done)
      }
      else {
        console.log(`${key} already exists`)
      }
    })
  })
}

function createOne(ref, api_key, done) {
  request
    .put(utils.getDiscoRef(projectId, ref))
    .send(definitions[ref])
    .set('Authorization', api_key)
    .set('Content-Type', 'application/json')
    .end(done)
}