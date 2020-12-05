module.exports = {
  ACCOUNT_DEACTIVATED: 'You account has been deactivated, please contact the admin',
  EMAIL_NOT_VERIFIED: 'You are yet to verify your account, please click '+ 
  'the link sent to your mail to verify your account',
  UNKNOWN: 'an unexpeccted error has occured',
  INVALID_EMAIL: 'please use a valid email',
  INVALID_NAME: 'Business name must be more than 2 characters',
  REQUIRED_EMAIL: 'email is required',
  WRONG_PORTAL: 'You are not authorised to login to this portal',
  REQUIRED_EMAIL_PASSWORD: 'email and password are required',
  REQUIRED_PASSWORD: 'password is required',
  EMAIL_IN_USE: (email) =>
    `an account with email ${email} already exists, if you previously logged in using any public providers, you can try reseting your password instead`,
  INVALID_PASSWORD: 'password must be atleast 6 characters long, must ' +
    'contain a lowercase letter, an uppercase letter letter, and either '+
    'a number or a special character',
  INCORRECT_PASSWORD: 'invalid email or password',
  ACCOUNT_NOT_FOUND: 'account not found, please create an account',
  UPDATE_CUSTOMER: 'id or customer_code is required',
  NOT_FOUND:
    'Could not find what you are looking for please' +
    ' check our documentation for more details',
  INVALID_LINK: 'this link is either invalid or has expired',
  REQUIRED_TOKEN:
    'a valid token is required to perform this operation',
  EXPIRED_TOKEN: 'your token token has expired',
  EXPIRED_OR_INVALID_TOKEN:
    'your token is either invalid or has expired',
  UNAUTHORIZED_TOKEN:
    'we cannot verify the authenticity of your token',
  // ' has expired, please initiate the password reset process again',
  MALFORMED_TOKEN: 'your token is not properly formated',
  EMAIL_VERIFIED_ALREADY: 'your email has already been verified',
  UNAUTHORIZED: 'You are not authorised to access this resource',
  NO_PRIVILEGE:
    'You do not have required privilege to perform this operation',
  FILE_TOO_LARGE: 'File too large, please upload a smaller file',
  NOT_FOUND: 'The requested document was not found',
  REQUIRED_PIN: 'A valid store pin is required to continue',
}
