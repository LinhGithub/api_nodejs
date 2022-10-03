const mongodb = require("mongoose");
const { Schema } = mongodb;

const rulesSchema = new Schema({
  illnesses_id: {
    type: String,
    require: true,
  },
  symptoms: {
    type: Array,
    default: [],
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

const Rules = mongodb.model("Rules", rulesSchema);

module.exports = Rules;
