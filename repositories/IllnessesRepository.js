const Illnesses = require("../models/Illnesses");

class IllnessesRepository {
  constructor(model) {
    this.model = model;
  }

  // create
  create(data) {
    const illnesses = new this.model(data);
    return illnesses.save();
  }

  // delete
  deleteById(id) {
    return this.model.findOneAndDelete({ _id: id });
  }

  // update
  updateById(id, data) {
    const query = { _id: id };
    return this.model.findOneAndUpdate(query, { $set: data });
  }

  // return all illnesses
  findAll(filter) {
    return this.model.find(filter);
  }

  // return one
  findOne(filter) {
    return this.model.findOne(filter);
  }

  // count documents
  countDoc(filter) {
    return this.model.count(filter);
  }
}

module.exports = new IllnessesRepository(Illnesses);
