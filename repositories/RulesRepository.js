const Rules = require("../models/Rules");

class RulesRepository {
  constructor(model) {
    this.model = model;
  }

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
  async countDoc(filter) {
    return await this.model.count(filter);
  }
}

module.exports = new RulesRepository(Rules);
