const users = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@stareast.com',
    password: 'password123',
  },
  {
    id: 2,
    name: 'Jamie Lee',
    email: 'jamie@stareast.com',
    password: 'password123',
  },
  {
    id: 3,
    name: 'Taylor Morgan',
    email: 'taylor@stareast.com',
    password: 'password123',
  },
];

let nextId = 4;

const findByEmail = (email) =>
  users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());

const findById = (id) => users.find((user) => user.id === Number(id));

const addUser = ({ name, email, password }) => {
  const user = {
    id: nextId,
    name,
    email,
    password,
  };

  nextId += 1;
  users.push(user);
  return user;
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

module.exports = {
  users,
  findByEmail,
  findById,
  addUser,
  sanitizeUser,
};
