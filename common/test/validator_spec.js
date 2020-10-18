const {password} = require('../lib/utils/validators')

describe('Validators', function() {
  describe('password', function() {
    it('must be longer than 8 characters', function() {
      password('Af123@').should.be.eql(false)
    })
    it('must contain a lowercase letter', function() {
      password('RARGHJJH123@#').should.be.eql(false)
    })
    it('must contain a uppercase letter', function() {
      password('fgfgfgfh5344#@$^$@g').should.be.eql(false)
    })
    it('must contain a number or a special character', function() {
      password('fgfgASDDUUDFd').should.be.eql(false)
    })
    it('is valid', function() {
      password('fghjfgfghfh13$%@f').should.be.eql(false)
      password('Aabcgefg2').should.be.eql(true)
      password('fghjffghfh13$%@f').should.be.eql(false)
      password('Aabcgefg#^').should.be.eql(true)
    })
  })
})
