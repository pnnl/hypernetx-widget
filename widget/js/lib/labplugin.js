var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'hnx-widget',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'hnx-widget',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

