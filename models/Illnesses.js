const mongoose = require("mongoose");
const { Schema } = mongoose;

const illnessesSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    default: "illness",
  },
  rule: {
    type: String,
    default: "only",
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

const Illnesses = mongoose.model("Illnesses", illnessesSchema);

module.exports = Illnesses;
