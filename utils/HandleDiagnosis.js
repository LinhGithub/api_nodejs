const assert_fact = (fact, facts) => {
  var is_changed = false;
  var factMore;
  for (var f of facts) {
    if (f[0] === fact[0] && f[1] === fact[1]) {
      is_changed = true;
      break;
    }
  }

  if (!is_changed) {
    factMore = fact;
  }
  return { facts: factMore };
};

const check_assert = (rules, facts) => {
  var is_changed = true;
  var factsNew = [...facts];
  if (rules) {
    while (is_changed) {
      is_changed = false;
      for (var fact of factsNew) {
        for (var rule of rules) {
          if (rule[0].length == 1) {
            if (fact[0] == rule[0][0]) {
              var result = assert_fact([rule[1], fact[1]], factsNew);
              if (result.facts) {
                is_changed = true;
                factsNew.push(result.facts);
              }
            }
          } else {
            var fact_exists = [];
            var _check = true;
            for (var f of factsNew) {
              fact_exists.push(f[0]);
            }

            for (var r of rule[0]) {
              if (!fact_exists.includes(r)) {
                _check = false;
                break;
              }
            }

            if (_check) {
              var result = assert_fact([rule[1], fact[1]], factsNew);
              if (result.facts) {
                is_changed = true;
                factsNew.push(result.facts);
              }
            }
          }
        }
      }
    }
  }
  return { facts: factsNew };
};

module.exports = { check_assert };
