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
        console.log(arr[0].name)
        console.log(parentIndex)
        arr[parentIndex].children = parents[parentId];
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
    }
  }]);

  return MountProperty;
}();

exports.default = MountProperty;