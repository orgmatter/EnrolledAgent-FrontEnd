const should = require('should')
const Customer = require('../lib/models/customer')
const Codes = require('../lib/utils/errorCodes')
const Message = require('../lib/utils/errorMessage')

describe('Customer Model', function() {
  describe('defaults', function() {
    let customer = {}

    it('email is  null', function() {
      should(customer.email).be.undefined
    })

    it('email is  required', function() {
      // should( () => new Customer({})).throw(Message.REQUIRED_EMAIL)
    })

    before(function() {
      customer = new Customer({email: 'a.b@c.com'})
    })

    it('email is not  null', function() {
      customer.email.should.be.defined
    })
    it('email equals a.b@c.com', function() {
      customer.email.should.equals('a.b@c.com')
    })
  })

})
