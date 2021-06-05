exports.addMockServer = () => config => {
  config.before = app => {
    app.get('/test/get', (req, res) => {
      res.json({ get: 'response get' });
    });
  };
  return config;
};

