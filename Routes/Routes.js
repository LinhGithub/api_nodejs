const express = require("express");
const multer = require("multer");
const app = express.Router();
const { check_assert } = require("../utils/HandleDiagnosis");

const illnessesRepository = require("../repositories/IllnessesRepository");
const rulesRepository = require("../repositories/RulesRepository");

app.get("/", (req, res) => {
  res.send({ code: 200, msg: "Api all ready!" });
});

// illnesses and symptom
// -get
app.get("/illnesses", (req, res) => {
  const { type, rule } = req.query;
  var filter = {};
  if (type) {
    filter["type"] = type;
  }
  if (rule) {
    filter["rule"] = rule;
  }
  if (type && rule) {
    filter = { $or: [{ type: type }, { rule: rule }] };
  }

  var promiseTotal = illnessesRepository.countDoc(filter);
  var promiseData = illnessesRepository.findAll(filter);

  Promise.all([promiseTotal, promiseData])
    .then((rs) => {
      res.send({
        total: rs[0],
        code: 200,
        msg: "success",
        results: rs[1],
      });
    })
    .catch((err) => {
      res.send({ code: 0, msg: "error" });
    });
});

// -post
app.post("/illnesses", multer().none(), async (req, res) => {
  const { name, type, rule } = req.body;
  var promiseFindIllnesse = illnessesRepository.findOne({ name: name });
  Promise.all([promiseFindIllnesse])
    .then((rs) => {
      var find_illness = rs[0];
      if (find_illness === undefined || find_illness === null) {
        const data_new = {
          name: name,
          type: type,
          rule: rule,
        };
        illnessesRepository
          .create(data_new)
          .then((result) => {
            res.send({ code: 200, msg: "Thêm mới thành công", id: "" });
          })
          .catch((error) => res.send({ code: 0, msg: "Có lỗi xảy ra" }));
      } else {
        if (find_illness.type === "illness") {
          res.send({ code: 0, msg: "Tên bệnh đã tồn tại" });
        } else {
          res.send({ code: 0, msg: "Tên triệu chứng đã tồn tại" });
        }
      }
    })
    .catch((err) => {
      res.send({ code: 0, msg: "Có lỗi xảy ra" });
    });
});

// delete
app.delete("/illnesses/:id", (req, res) => {
  const { id } = req.params;
  var count_doc = rulesRepository.countDoc({ illnesses_id: id });
  var count_doc1 = rulesRepository.countDoc({ symptoms: id });
  Promise.all([count_doc, count_doc1])
    .then((rs) => {
      var count_doc_rule = rs[0] + rs[1];
      if (count_doc_rule == 0) {
        illnessesRepository
          .deleteById(id)
          .then((result) => {
            res.send({ code: 200, msg: "Xóa thành công" });
          })
          .catch((error) => {
            res.send({ code: 0, msg: "Xóa thất bại" });
          });
      } else {
        res.send({
          code: 0,
          msg: "Không thể xóa, nó đã được gắn kết với luật",
        });
      }
    })
    .catch((er) => {
      res.send({ code: 0, msg: "Có lỗi xảy ra" });
    });
});

// update
app.put("/illnesses/:id", multer().none(), (req, res) => {
  const { id } = req.params;
  const { name, rule } = req.body;
  var promiseFindIllnesse = illnessesRepository.findOne({
    _id: { $ne: id },
    name: name,
  });

  Promise.all([promiseFindIllnesse])
    .then((rs) => {
      var find_illness = rs[0];
      if (find_illness === undefined || find_illness === null) {
        illnessesRepository
          .findOne({ _id: id })
          .then((result) => {
            if (result) {
              const data_new = {
                name: name,
                rule: rule,
                updated_at: Date.now(),
              };
              illnessesRepository
                .updateById(id, data_new)
                .then((result) => {
                  res.send({ code: 200, msg: "Cập nhật thành công", id: "" });
                })
                .catch((error) => {
                  res.send({ code: 0, msg: "Có lỗi xảy ra" });
                });
            } else {
              res.send({ code: 0, msg: "Không tồn tại" });
            }
          })
          .catch((err) => {
            res.send({ code: 0, msg: "Có lỗi xảy ra" });
          });
      } else {
        if (find_illness.type === "illness") {
          res.send({ code: 0, msg: "Tên bệnh đã tồn tại" });
        } else {
          res.send({ code: 0, msg: "Tên triệu chứng đã tồn tại" });
        }
      }
    })
    .catch((err) => {
      res.send({ code: 0, msg: "Có lỗi xảy ra" });
    });
});
// ===

// rule
app.get("/rules", (req, res) => {
  var promiseTotal = rulesRepository.countDoc({});
  var promiseData = rulesRepository.findAll();

  Promise.all([promiseTotal, promiseData])
    .then((rs) => {
      res.send({
        total: rs[0],
        code: 200,
        msg: "success",
        results: rs[1],
      });
    })
    .catch((err) => {
      res.send({ code: 0, msg: "error" });
    });
});

// create
app.post("/rules", (req, res) => {
  const { symptoms, illnesses_id } = req.body;
  var promiseFindRule = rulesRepository.findOne({
    illnesses_id: illnesses_id,
    symptoms: symptoms,
  });
  Promise.all([promiseFindRule])
    .then((rs) => {
      var find_illness = rs[0];
      if (find_illness === undefined || find_illness === null) {
        const data_new = {
          illnesses_id: illnesses_id,
          symptoms: symptoms,
        };
        rulesRepository
          .create(data_new)
          .then((result) => {
            res.send({ code: 200, msg: "Thêm mới thành công", id: "" });
          })
          .catch((error) => res.send({ code: 0, msg: "Có lỗi xảy ra" }));
      } else {
        res.send({ code: 0, msg: "Luật đã tồn tại" });
      }
    })
    .catch((err) => {
      res.send({ code: 0, msg: "Có lỗi xảy ra" });
    });
});

// delete
app.delete("/rules/:id", (req, res) => {
  const { id } = req.params;
  rulesRepository
    .deleteById(id)
    .then((result) => {
      res.send({ code: 200, msg: "Xóa thành công" });
    })
    .catch((error) => {
      res.send({ code: 0, msg: "Luật không tồn tại" });
    });
});

// update
app.put("/rules/:id", multer().none(), (req, res) => {
  const { id } = req.params;
  const { symptoms, illnesses_id } = req.body;
  var promiseFindIllnesse = rulesRepository.findOne({
    illnesses_id: illnesses_id,
    symptoms: symptoms,
    _id: { $ne: id },
  });

  Promise.all([promiseFindIllnesse])
    .then((rs) => {
      var find_rule = rs[0];
      if (find_rule === undefined || find_rule === null) {
        rulesRepository
          .findOne({ _id: id })
          .then((result) => {
            if (result) {
              const data_new = {
                illnesses_id: illnesses_id,
                symptoms: symptoms,
                updated_at: Date.now(),
              };
              rulesRepository
                .updateById(id, data_new)
                .then((result) => {
                  res.send({ code: 200, msg: "Cập nhật thành công", id: "" });
                })
                .catch((error) => {
                  res.send({ code: 0, msg: "Có lỗi xảy ra" });
                });
            } else {
              res.send({ code: 0, msg: "Luật không tồn tại" });
            }
          })
          .catch((err) => {
            res.send({ code: 0, msg: "Có lỗi xảy ra" });
          });
      } else {
        res.send({ code: 0, msg: "Luật đã tồn tại" });
      }
    })
    .catch((err) => {
      res.send({ code: 0, msg: "Có lỗi xảy ra" });
    });
});
// ===

// diagnosis
app.post("/diagnosis", multer().none(), (req, res) => {
  const { symptoms: symptoms_bd } = req.body;
  var symptoms = [];
  var query = {};
  var facts = [];
  var rules = [];

  for (var symptom of symptoms_bd) {
    symptoms.push([symptom, "person"]);
  }

  rulesRepository
    .findAll()
    .then((symptoms_db) => {
      for (var symptom_db of symptoms_db) {
        d = [symptom_db.symptoms, symptom_db.illnesses_id];
        rules.push(d);
      }

      var results = check_assert(rules, symptoms);
      for (var item of results.facts) {
        var _check = false;
        for (var s of symptoms) {
          if (item[0] === s[0]) {
            _check = true;
            break;
          }
        }
        if (!_check) {
          facts.push(item);
        }
      }

      facts_id = [];
      for (var fact of facts) {
        facts_id.push(fact[0]);
      }

      query = { _id: { $in: facts_id } };
      illnessesRepository
        .findAll(query)
        .then((illnesses_db) => {
          res.send({ code: 200, msg: "Thành công", results: illnesses_db });
        })
        .catch((err) => {
          res.send({ code: 0, msg: "Thất bại", results: [] });
        });
    })
    .catch((err) => {
      res.send({ code: 0, msg: "Thất bại", results: [] });
    });
});
// ===
module.exports = app;
