const FacebookStrategy = require('passport-facebook').Strategy
const config = require('../../config')
const Constants = require('../../utils/constants')
const { authenticateWithProvider } = require('./utils')


module.exports = class FacebookLoginStrategy {

  static extractUser(user) {
    let firstName, lastName, email, imageUrl

    const { _json, emails, photos, name, displayName } = user
    email = _json['email'] || emails[0].value

    if (photos.length > 0) imageUrl = photos[0].value
    firstName = name.givenName
    lastName = name.familyName
    if (!firstName || !lastName) {
      var n = String(displayName)
      firstName = n.split(' ')[0]
      lastName = n.split(' ')[1]
    }
    return {
      firstName,
      lastName,
      email,
      imageUrl
    }
  }

  /**
   * @param  {import('passport').PassportStatic} passport
   */
  static register(passport) {
    passport.use(new FacebookStrategy({
      clientID: config.FACEBOOK_APP_ID,
      clientSecret: config.FACEBOOK_APP_SECRET,
      callbackURL: `${config.APP_URL}/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
      function (accessToken, refreshToken, profile, cb) {
        // console.log(accessToken, refreshToken, profile)
        return authenticateWithProvider(FacebookLoginStrategy.extractUser(profile), Constants.PROVIDERS.FACEBOOK, cb)

      }
    ))
  }

}

// authResponse: {accessToken: "EAAwdVLeghwQBAOWH5WSHuMK3fBGel0pVVlWdseCOsUkz4YW3HfKld6l0zYBNeDhJ00cpTvIfGikjHgZB7AYwtM6uZBakLpQxIiwWjaQyOztkYTdSDxpS2jyX8VPrFvwkZAtEnw2cMy91ml7D9M94capwXkGrZAPQjbVwLFumthorJXDz1hT5UXD57Kzd168ZD"
// data_access_expiration_time: 1613954837
// expiresIn: 5183898
// graphDomain: "facebook"
// signedRequest: "RZi5hSbOidaF6topS_oy5z739JkhtvVopI9E9nft-JI.eyJ1c2VyX2lkIjoiNDg0OTMwMjc3NTExMjI2NSIsImNvZGUiOiJBUUJLMHdZT0c2SGdNcjEwN0ZLVG9kWTJUU19saTE5ZUI0WElRN1JvNzNFQkJyOEFXUnVDYVJVVkVFNjBxbUFuMDRXeWtCbWxQbjRtLUFzSkpEci1oOE1IMFBlSzktb0piRURZNjRpVnhQMGY2ODlaWmxZdlI4dlBUaEZNTWd6UW5oeDB3d0tyaUNMLTYxRXhmSFNNOUVPT0gxSC1vRmxtc1lSd05TNWFENjlCTW02dW9aY2JOLUFBSUVLbFdRZm9Kc1J3X0xBSnYyX1RFSnQyc0pGVDFlMzZHbTltS0ttNDlINWt6RGdWT0h5M0NPdm9Xd2NudUZBWXhaQkM5c1RmSDFjU2tNOTJEaktLbG9CXzBneWdRSEZDNTZJcnJ6R0JuR3VYbU5OU2tLR0xnNHRRN1R0VW9rRnZHSGhKc2xwdy1ITHRwSjRmQnp2blYzNFg5aUFHVnJPYSIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjA2MTc4ODM3fQ"
// userID: "4849302775112265"}


// EAAwdVLeghwQBAJ0kOORaNCZAkpYZB1hVo3yZBLS75bCKQnL9RoJAWDekhflvxND34i7iU7uNZAzlQY1DDSNPALUi2mY0UG6ZBYwFPl8JtzlhsD0mpFlTa9nZCdLGhNQNZAgTHGHElId8fygFCuUMah5G9Bl2uiAH6pyya7xi5ZCIfZCpmNZCuuyRK56aqzZBl1y95gZD undefined {
//   [1]   id: '4849302775112265',
//   [1]   username: undefined,
//   [1]   displayName: 'Wisdom Ekeh',
//   [1]   name: {
//   [1]     familyName: undefined,
//   [1]     givenName: undefined,
//   [1]     middleName: undefined
//   [1]   },
//   [1]   gender: undefined,
//   [1]   profileUrl: undefined,
//   [1]   emails: [ { value: 'ekeh.wisdom@gmail.com' } ],
//   [1]   photos: [
//   [1]     {
//   [1]       value: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=4849302775112265&height=50&width=50&ext=1608771674&hash=AeQ2t5TEf_MNPuRR6SQ'
//   [1]     }
//   [1]   ],
//   [1]   provider: 'facebook',
//   [1]   _raw: '{"id":"4849302775112265","name":"Wisdom Ekeh","picture":{"data":{"height":50,"is_silhouette":false,"url":"https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/?asid=4849302775112265&height=50&width=50&ext=1608771674&hash=AeQ2t5TEf_MNPuRR6SQ","width":50}},"email":"ekeh.wisdom\\u0040gmail.com"}',
//   [1]   _json: {
//   [1]     id: '4849302775112265',
//   [1]     name: 'Wisdom Ekeh',
//   [1]     picture: { data: [Object] },
//   [1]     email: 'ekeh.wisdom@gmail.com'
//   [1]   }
//   [1] }