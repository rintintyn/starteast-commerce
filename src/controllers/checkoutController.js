const checkoutService = require('../services/checkoutService');

const checkout = (req, res) => {
  try {
    const result = checkoutService.processCheckout({
      user: req.user,
      items: req.body.items,
      paymentMethod: req.body.paymentMethod,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  checkout,
};
