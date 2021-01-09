// const user = require("../models/user");

module.exports = {
  APP_URL: process.env.APP_URL,
  TRASACTION_TYPES: {
    Withdrawal: 'Withdrawal',
    payment: 'payment',
    fundWallet: 'fund_wallet'
  },
  TRASACTION_STATUS: {
    pending: 'pending',
    succeeded: 'succeeded',
    failed: 'failed'
  },
  PATMENT_PORPOSE: {
    verification: 'verification',
    accounUpgrade: 'accounUpgrade'
  },
  ORDER_STATUS: {
    pending: 'pending',
    inprogress: 'inprogress',
    completed: 'completed',
    cancelled: 'cancelled',
    abandoned: 'abandoned'
  },
  ACCOUNT_TYPE: {
    user: 'user',
    admin: 'ADMIN',
  },
  DOMAIN: {
    user: 'user',
    admin: 'admin'
  },
  EMAIL_PRIORITY: {
    high: '1',
    normal: '3',
    low: '5'
  },
  PROVIDERS: {
    GOOGLE: 'google',
    LINKEDIN: 'linkedin',
    FACEBOOK: 'facebook'
  }, 
  ARTICLE_STATUS: {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected'
  }, 
}
