const products = [
  {
    id: 1,
    name: 'STAREast Conference Pass',
    price: 399,
  },
  {
    id: 2,
    name: 'STAREast Hoodie',
    price: 55,
  },
  {
    id: 3,
    name: 'STAREast Mug',
    price: 18,
  },
];

const findById = (id) => products.find((product) => product.id === Number(id));

const listProducts = () => [...products];

module.exports = {
  products,
  findById,
  listProducts,
};
