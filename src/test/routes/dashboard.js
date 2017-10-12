'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app = require('../../app')

chai.use(chaiHttp)

/* eslint-disable no-unused-expressions */
/* eslint-disable handle-callback-err */
describe('desc', () => {
  beforeEach((done) => {
    done()
  })

  it('desc', (done) => {
    chai
      .request(app)
      // http://chaijs.com/plugins/chai-http/
      // .post('/user/me')
      // .set('X-API-Key', 'foobar')
      // .send({ password: '123', confirmPassword: '123' })
      // .field('password', '123')
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.be.html
        expect(res.text).to.include('Welcome to Index page')
        done()
      })
  })
})
/* eslint-enable handle-callback-err */
/* eslint-enable no-unused-expressions */
