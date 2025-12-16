import { UserModel } from '../models/user.model.js';

export class UserDAO {
  getAll = () => {
    return UserModel.find();
  };

  getByEmail = (email) => {
    return UserModel.findOne({ email });
  };

  getById = (id) => {
    return UserModel.findById(id);
  };

  create = (userData) => {
    return UserModel.create(userData);
  };

  update = (id, data) => {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  };

  delete = (id) => {
    return UserModel.findByIdAndDelete(id);
  };
}
