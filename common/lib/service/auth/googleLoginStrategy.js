const GoogleStrategy = require('passport-google-oauth20').Strategy
const config = require('../../config')
const Constants = require('../../utils/constants')
const { authenticateWithProvider } = require('./utils')

module.exports = class GoogleLoginStrategy {

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

    if(!imageUrl) imageUrl = _json.picture

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
    passport.use(new GoogleStrategy({
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.APP_URL}/google/callback`,
    },
      function (accessToken, refreshToken, profile, cb) {
        // console.log(accessToken, refreshToken, profile)
        return authenticateWithProvider(GoogleLoginStrategy.extractUser(profile), Constants.PROVIDERS.GOOGLE, cb)
      }
    ))
  }
}

// {
  // [1]     id: '103053834481483688301',
  // [1]     displayName: 'WISDOM EKEH',
  // [1]     name: { familyName: 'EKEH', givenName: 'WISDOM' },
  // [1]     emails: [ [Object] ],
  // [1]     photos: [ [Object] ],
  // [1]     provider: 'google',
  // [1]     _raw: '{\n' +
  // [1]       '  "sub": "103053834481483688301",\n' +
  // [1]       '  "name": "WISDOM EKEH",\n' +
  // [1]       '  "given_name": "WISDOM",\n' +
  // [1]       '  "family_name": "EKEH",\n' +
  // [1]       '  "picture": "https://lh3.googleusercontent.com/a-/AOh14GjuzuNGlFI7_AjLzGQUg639UIGU_h55snd2HbDI0A\\u003ds96-c",\n' +
  // [1]       '  "email": "ekeh.wisdom@gmail.com",\n' +
  // [1]       '  "email_verified": true,\n' +
  // [1]       '  "locale": "en"\n' +
  // [1]       '}',
  // [1]     _json: {
  // [1]       sub: '103053834481483688301',
  // [1]       name: 'WISDOM EKEH',
  // [1]       given_name: 'WISDOM',
  // [1]       family_name: 'EKEH',
  // [1]       picture: 'https://lh3.googleusercontent.com/a-/AOh14GjuzuNGlFI7_AjLzGQUg639UIGU_h55snd2HbDI0A=s96-c',
  // [1]       email: 'ekeh.wisdom@gmail.com',
  // [1]       email_verified: true,
  // [1]       locale: 'en'
  // [1]     }
  // [1]   }
  // [1] }

// BT: "103053834481483688301"
// SJ: "https://lh3.googleusercontent.com/a-/AOh14GjuzuNGlFI7_AjLzGQUg639UIGU_h55snd2HbDI0A=s96-c"
// cu: "ekeh.wisdom@gmail.com"
// fV: "WISDOM"
// iT: "EKEH"

// {
  // [1]     id: '103053834481483688301',
  // [1]     displayName: 'WISDOM EKEH',
  // [1]     name: { familyName: 'EKEH', givenName: 'WISDOM' },
  // [1]     photos: [ [Object] ],
  // [1]     provider: 'google',
  // [1]     _raw: '{\n' +
  // [1]       '  "sub": "103053834481483688301",\n' +
  // [1]       '  "name": "WISDOM EKEH",\n' +
  // [1]       '  "given_name": "WISDOM",\n' +
  // [1]       '  "family_name": "EKEH",\n' +
  // [1]       '  "picture": "https://lh3.googleusercontent.com/a-/AOh14GjuzuNGlFI7_AjLzGQUg639UIGU_h55snd2HbDI0A\\u003ds96-c",\n' +
  // [1]       '  "locale": "en"\n' +
  // [1]       '}',
  // [1]     _json: {
  // [1]       sub: '103053834481483688301',
  // [1]       name: 'WISDOM EKEH',
  // [1]       given_name: 'WISDOM',
  // [1]       family_name: 'EKEH',
  // [1]       picture: 'https://lh3.googleusercontent.com/a-/AOh14GjuzuNGlFI7_AjLzGQUg639UIGU_h55snd2HbDI0A=s96-c',
  // [1]       locale: 'en'
  // [1]     }