'use strict';

exports.__esModule = true;
exports.Example = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Example = exports.Example = function Example(props) {
  return _react2.default.createElement(
    'div',
    null,
    'I am a React Jupyter Widget. Here are my props:',
    _react2.default.createElement(
      'pre',
      null,
      JSON.stringify(props, null, 2)
    )
  );
};