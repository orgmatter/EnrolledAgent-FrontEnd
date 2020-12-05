const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy
const config = require('../../config')
const Constants = require('../../utils/constants')
const { authenticateWithProvider } = require('./utils')

module.exports = class LinkedinLoginStrategy {


    static extractUser(user) {
        let firstName, lastName, email, imageUrl
    
        const { _json, emails, photos, name, displayName } = user
        email =  emails[0].value
    
        if (photos && photos.length > 0) imageUrl = photos[0].value
        firstName = name.givenName
        lastName = name.familyName
        if (!firstName || !lastName) {
          var n = String(displayName)
          firstName = n.split(' ')[0]
          lastName = n.split(' ')[1]
        }
        console.log(photos.length, photos[0].value, imageUrl)
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
        passport.use(new LinkedinStrategy({
            clientID: config.LINKEDIN_KEY,
            clientSecret: config.LINKEDIN_SECRET,
            callbackURL: `${config.APP_URL}/linkedin/callback`,
            scope: ['r_emailaddress', 'r_liteprofile'],
            state: true
        },
            function (accessToken, refreshToken, profile, cb) {
                // console.log(accessToken, refreshToken, profile)
                return authenticateWithProvider(LinkedinLoginStrategy.extractUser(profile), Constants.PROVIDERS.LINKEDIN, cb)
            }
        ));
    }
}

// const a =
// {
//     provider: 'linkedin',
//     id: 'IXzFPT-gw3',
//     name: { givenName: 'WISDOM', familyName: 'EKEH' },
//     displayName: 'WISDOM EKEH',
//     photos: [[Object], [Object], [Object], [Object]],
//     _raw: '{"firstName":{"localized":{"en_US":"WISDOM"},"preferredLocale":{"country":"US","language":"en"}},"lastName":{"localized":{"en_US":"EKEH"},"preferredLocale":{"country":"US","language":"en"}},"profilePicture":{"displayImage":"urn:li:digitalmediaAsset:C4E03AQFSWrL_gJEyLQ","displayImage~":{"paging":{"count":10,"start":0,"links":[]},"elements":[{"artifact":"urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:C4E03AQFSWrL_gJEyLQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_100_100)","authorizationMethod":"PUBLIC","data":{"com.linkedin.digitalmedia.mediaartifact.StillImage":{"mediaType":"image/jpeg","rawCodecSpec":{"name":"jpeg","type":"image"},"displaySize":{"width":100.0,"uom":"PX","height":100.0},"storageSize":{"width":100,"height":100},"storageAspectRatio":{"widthAspect":1.0,"heightAspect":1.0,"formatted":"1.00:1.00"},"displayAspectRatio":{"widthAspect":1.0,"heightAspect":1.0,"formatted":"1.00:1.00"}}},"identifiers":[{"identifier":"https://media-exp1.licdn.com/dms/image/C4E03AQFSWrL_gJEyLQ/profile-displayphoto-shrink_100_100/0?e=1611792000&v=beta&t=HLMnRX85KJaP1_yCfrf3XWEDIos1L-p7flW9apS5RjM","index":0,"mediaType":"image/jpeg","file":"urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:C4E03AQFSWrL_gJEyLQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_100_100,0)","identifierType":"EXTERNAL_URL","identifierExpiresInSeconds":1611792000}]},{"artifact":"urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:C4E03AQFSWrL_gJEyLQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_200_200)","authorizationMethod":"PUBLIC","data":{"com.linkedin.digitalmedia.mediaartifact.StillImage":{"mediaType":"image/jpeg","rawCodecSpec":{"name":"jpeg","type":"image"},"displaySize":{"width":200.0,"uom":"PX","height":200.0},"storageSize":{"width":200,"height":200},"storageAspectRatio":{"widthAspect":1.0,"heightAspect":1.0,"formatted":"1.00:1.00"},"displayAspectRatio":{"widthAspect":1.0,"heightAspect":1.0,"formatted":"1.00:1.00"}}},"identifiers":[{"identifier":"https://media-exp1.licdn.com/dms/image/C4E03AQFSWrL_gJEyLQ/profile-displayphoto-shrink_200_200/0?e=1611792000&v=beta&t=0awM1Hqj0IrioUKF4ypiXCVdCxkW5VkW1QnQ-9ZNoVA","index":0,"mediaType":"image/jpeg","file":"urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:C4E03AQFSWrL_gJEyLQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_200_200,0)","identifierType":"EXTERNAL_URL","identifierExpiresInSeconds":1611792000}]},{"artifact":"urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:C4E03AQFSWrL_gJEyLQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_400_400)","authorizationMethod":"PUBLIC","data":{"com.linkedin.digitalmedia.mediaartifact.StillImage":{"mediaType":"image/jpeg","rawCodecSpec":{"name":"jpeg","type":"image"},"displaySize":{"width":400.0,"uom":"PX","height":400.0},"storageSize":{"width":400,"height":400},"storageAspectRatio":{"widthAspect":1.0,"heightAspect":1.0,"formatted":"1.00:1.00"},"displayAspectRatio":{"widthAspect":1.0,"heightAspect":1.0,"formatted":"1.00:1.00"}}},"identifiers":[{"identifier":"https://media-exp1.licdn.com/dms/image/C4E03AQFSWrL_gJEyLQ/profile-displayphoto-shrink_400_400/0?e=1611792000&v=beta&t=plI_bwIbx_FYmACjI3cet2fV_SYk7m_2hYy8fdWAAyw","index":0,"mediaType":"image/jpeg","file":"urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:C4E03AQFSWrL_gJEyLQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_400_400,0)","identifierType":"EXTERNAL_URL","identifierExpiresInSeconds":1611792000}]},{"artifact":"urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:C4E03AQFSWrL_gJEyLQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_800_800)","authorizationMethod":"PUBLIC","data":{"com.linkedin.digitalmedia.mediaartifact.StillImage":{"mediaType":"image/jpeg","rawCodecSpec":{"name":"jpeg","type":"image"},"displaySize":{"width":800.0,"uom":"PX","height":800.0},"storageSize":{"width":800,"height":800},"storageAspectRatio":{"widthAspect":1.0,"heightAspect":1.0,"formatted":"1.00:1.00"},"displayAspectRatio":{"widthAspect":1.0,"heightAspect":1.0,"formatted":"1.00:1.00"}}},"identifiers":[{"identifier":"https://media-exp1.licdn.com/dms/image/C4E03AQFSWrL_gJEyLQ/profile-displayphoto-shrink_800_800/0?e=1611792000&v=beta&t=5PtnUBSSmCgWHn53k2hpllFEHDbuN8275MvJKJ56TSc","index":0,"mediaType":"image/jpeg","file":"urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:C4E03AQFSWrL_gJEyLQ,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_800_800,0)","identifierType":"EXTERNAL_URL","identifierExpiresInSeconds":1611792000}]}]}},"id":"IXzFPT-gw3"}',
//     _json: {
//         firstName: [Object],
//         lastName: [Object],
//         profilePicture: [Object],
//         id: 'IXzFPT-gw3'
//     },
//     emails: [[Object]],
//     _emailRaw: '{"elements":[{"handle~":{"emailAddress":"ekeh.wisdom@gmail.com"},"handle":"urn:li:emailAddress:5610334302"}]}',
//     _emailJson: { elements: [Array] }
// }

