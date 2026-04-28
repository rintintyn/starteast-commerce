const healthcheck = (req, res) => {
  res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
  });
};

module.exports = {
  healthcheck,
};
