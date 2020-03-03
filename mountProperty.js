"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MountProperty = /*#__PURE__*/function () {
  function MountProperty() {
    _classCallCheck(this, MountProperty);
  }

  _createClass(MountProperty, null, [{
    key: "mount",
    value: function mount(data) {
      MountProperty.removeRepetition(data);
      var readyRemoveIndex = [];
      var parents = {};
      data.forEach(function (property, index) {
        if (property.parentId !== -1) {
          if (!parents[property.parentId]) {
            parents[property.parentId] = [];
          }

          parents[property.parentId].push(property);
          readyRemoveIndex.push(index);
        }
      });
      var dataWithChildren = MountProperty.mountParent(parents, data);
      return MountProperty.removeChildrenProperty(readyRemoveIndex, dataWithChildren);
    }
  }, {
    key: "mountParent",
    value: function mountParent(parents, arr) {
      var parentIds = Object.keys(parents);
      parentIds.forEach(function (parentId) {
        var parentIndex = arr.findIndex(function (item) {
          return item.id.toString() === parentId;
        });

        if (parentIndex !== -1) {
          arr[parentIndex].children = parents[parentId];
        }
      });
      return arr;
    }
  }, {
    key: "removeChildrenProperty",
    value: function removeChildrenProperty(indexs, data) {
      // 从后向前删除数组
      indexs.reverse().forEach(function (index) {
        data.splice(index, 1);
      });
      return data;
    } // 去除rap重复数据

  }, {
    key: "removeRepetition",
    value: function removeRepetition(data) {
      // 1. 根据parentId不为-1或者该parentId可在数组内id找到
      // 1. 根据name以及createTime确定重复数据
      // 2. 根据parentId确定上级重复数据,若无则以改数据为parent
      // 3. 根据重读上级id,确定下级多个重复数据去重
      var repetitionItem = MountProperty.ensureRepetition(data);

      if (!repetitionItem) {
        return data;
      }

      // console.log('--------');
      // console.log(JSON.stringify(repetitionItem)); // console.log(parentIndex)

      // console.log('+++++++++++++');
      var readyRemoveIndexs = MountProperty.ensureRepetionIndexs(repetitionItem, data);
      readyRemoveIndexs.reverse().forEach(function (item) {
        data.splice(item, 1);
      });
      MountProperty.removeRepetition(data);
    }
  }, {
    key: "ensureRepetition",
    value: function ensureRepetition(data) {
      var repetitionItem = null;
      data.some(function (outItem) {
        if (outItem.parentId === -1) {
          return false;
        }

        var item = data.find(function (innerItem) {
          return innerItem.id === outItem.parentId;
        });

        if (!item) {
          repetitionItem = item;
          return true;
        }
      });



      return repetitionItem; // let targetItem = null
      // let repetitionItem = null
      // data.some((outItem, index) => {
      //     let item = data.slice(index + 1).find(item => item.name === outItem.name)
      //     if (item) {
      //         targetItem = outItem
      //         repetitionItem = item
      //         return true
      //     }
      //     return false
      // })
      // if (!targetItem) {
      //     return null
      // }
      // return targetItem.createdAt > repetitionItem.createdAt ? repetitionItem : targetItem
    }
  }, {
    key: "ensureRepetionIndexs",
    value: function ensureRepetionIndexs(repetitionItem, data) {
      var removeIndexs = [];
      data.filter(function (item, index) {
        if (repetitionItem.id === item.id) {
          removeIndexs.push(index);
        }

        if (item.id === repetitionItem.parentId || repetitionItem.id === item.parentId) {
          removeIndexs.push(index);
        }
      });
      return removeIndexs;
    }
  }]);

  return MountProperty;
}();

exports.default = MountProperty;