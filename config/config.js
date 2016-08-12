var config = {
  baseURL: 'http://172.29.92.145:3000',
  naver: {
    clientID: 'X2Hu1QvCPx7ayMGJFu4C',
    clientSecret: 'EmMNI6IgZj',
    callbackURL: 'http://172.29.92.145:3000/auth/naver/callback'
  },

  kakao: {
    clientID: 'f679a86be06f77f5c99969828dba34d6',
    callbackURL: 'http://172.29.92.145:3000/auth/kakao/callback'
  },

  routerIPC : 'ipc:///tmp/doodle-router.ipc',
  dealerIPC : 'ipc:///tmp/doodle-dealer.ipc'
};

module.exports = config;
