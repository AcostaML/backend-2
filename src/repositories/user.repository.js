import { UserDAO } from '../dao/mongo/user.dao.js';

export class UserRepository {
  constructor() {
    this.dao = new UserDAO();
  }

  getUsers() {
    return this.dao.getAll();
  }

  getUserByEmail(email) {
    return this.dao.getByEmail(email);
  }

  getUserById(id) {
    return this.dao.getById(id);
  }

  createUser(userData) {
    return this.dao.create(userData);
  }

  updateUser(id, data) {
    return this.dao.update(id, data);
  }

  deleteUser(id) {
    return this.dao.delete(id);
  }
}
