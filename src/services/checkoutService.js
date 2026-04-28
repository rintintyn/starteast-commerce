const productModel = require('../models/productModel');

const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
};

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const normalizePaymentMethod = (paymentMethod) =>
  String(paymentMethod || '').toLowerCase().trim().replace(/[\s-]+/g, '_');

const processCheckout = ({ user, items, paymentMethod }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw createError('At least one item is required.', 400);
  }

  const normalizedPayment = normalizePaymentMethod(paymentMethod);

  if (![PAYMENT_METHODS.CASH, PAYMENT_METHODS.CREDIT_CARD].includes(normalizedPayment)) {
    throw createError('Payment method must be cash or credit_card.', 400);
  }

  const lineItems = items.map((item) => {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity ?? 1);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw createError('Item quantity must be a positive number.', 400);
    }

    const product = productModel.findById(productId);
    if (!product) {
      throw createError(`Product ${productId} not found.`, 404);
    }

    const lineTotal = Number((product.price * quantity).toFixed(2));

    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      lineTotal,
    };
  });

  const subtotal = Number(
    lineItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
  );
  const discountRate = normalizedPayment === PAYMENT_METHODS.CASH ? 0.1 : 0;
  const discount = Number((subtotal * discountRate).toFixed(2));
  const total = Number((subtotal - discount).toFixed(2));

  return {
    userId: user.id,
    paymentMethod: normalizedPayment,
    subtotal,
    discount,
    total,
    items: lineItems,
  };
};

module.exports = {
  PAYMENT_METHODS,
  processCheckout,
};
