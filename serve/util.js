"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var methods = {
  array: 'resArr',
  object: 'resObj',
  boolean: 'resBool',
  string: 'resStr',
  number: 'resNum',
  null: 'resNull',
  regexp: 'resReg',
  function: 'resFun'
};

var Result = function Result() {
  _classCallCheck(this, Result);
};

exports.default = Result;

_defineProperty(Result, "resList", function (list) {
  var resultObj = {};

  if (_instanceof(list, Array)) {
    list.forEach(function (item) {
      // if (item.name === 'responseData') {
        // console.log('--------responseData')
        // console.log(item)
        // console.log('+++++++++++++responseData')
      // }

      var method = methods[item.type.toLowerCase()];
      var result = {};

      if (!method) {
        result = Result.resNull(item);
      } else {
        result = Result[method](item);
      } // const result = Result[method](item)


      resultObj[item.name] = result;
    });
    return resultObj;
  }
});

_defineProperty(Result, "resObj", function (obj) {
  /**
   *  "type": "Object",
      "name": "responseData",
      "rule": "",
      "value": "",
      children: [...]
   *
   */

   let test = Result.resList(obj.children)
  // console.log('--------')
  // console.log(test)
  // console.log('+++++++++++++')

  return {
    type: 'object',
    properties: test
  };
});

_defineProperty(Result, "resArr", function (arr) {
  /**
   * "type": "Array",
     "name": "executor",
     "rule": "1",
     "value": "['admin','sadmin','audit','administrator','tenant']",
   */
  var values = [];
  arr.value.replace(/\'(\w|[^\x00-\xff])+\'/g, function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    values.push(args[0].slice(1, args[0].length - 1));
  });

  if (arr.value) {
    return {
      type: 'string',
      enum: values
    };
  }
  /**
   *  "type": "Array",
      "name": "data",
      "rule": "10-30",
      "value": "",
      "children": [...]
   */

  let test = Result.resList(arr.children)

  var arrObj = {
    type: 'array',
    items: {
      type: 'object',
      properties: test
    }
  };

  if (arr.rule) {
    var rule = arr.rule.split('-');
    arrObj.minItems = rule[0];
    arrObj.maxItems = rule[1];
  }

  return arrObj;
});

_defineProperty(Result, "resBool", function (boolean) {
  /**
   *  "type": "Boolean",
      "name": "boolean",
      "rule": "1-2",
      "value": "true",
   *
   */
  return {
    type: 'boolean',
    default: boolean.value === 'true' ? true : false
  };
});

_defineProperty(Result, "resNull", function () {
  return {
    type: 'null'
  };
});

_defineProperty(Result, "resNum", function (number) {
  return {
    type: 'number',
    mock: {
      mock: number.value
    }
  };
});

_defineProperty(Result, "resStr", function (str) {
  /**
   *  "type": "String",
      "name": "result",
      "rule": "1",
      "value": "['成功','失败']",
   *
   */
  if (str.value.includes('[')) {
    return Result.resArr(str);
  }

  var strObj = {
    type: 'string',
    mock: {
      mock: str.value
    }
  };

  if (str.rule) {
    /**
     *  "type": "String",
        "name": "result",
        "rule": "1",
        "value": "['成功','失败']",
    *
    */
    if (str.rule === 1) {
      return {
        type: 'string',
        enum: str.value
      };
    } else {
      /**
       *  "type": "String",
          "name": "result",
          "rule": "1-14",
          "value": "*",
      *
      */
      var length = str.rule.split('-');
      return { ...strObj,
        minLength: length[0],
        maxLength: length[1] || ''
      };
    }
  }

  return strObj;
});

_defineProperty(Result, "resReg", function (reg) {
  return {
    type: 'string',
    pattern: reg.value
  };
});

_defineProperty(Result, "resFun", function (fun) {
  return {
    type: 'string',
    value: fun.value
  };
});

_defineProperty(Result, "resUnd", function (und) {
  return Result.resNull(und);
});