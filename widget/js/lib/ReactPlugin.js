var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

var React = require('react');
var ReactDOM = require('react-dom');

var components = require('../../../lib');

// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var ReactModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'ReactModel',
        _view_name : 'ReactModel',
        _model_module : 'ipy-nlpvis',
        _view_module : 'ipy-nlpvis',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        props : {}
    })
});

 
// Custom View. Renders the widget model.
var ReactView = widgets.DOMWidgetView.extend({
    render: function() {
        this.props_changed();
        this.model.on('change:props', this.props_changed, this);
    },

    props_changed: function() {

        var name = this.model.get('component')
        var view = components[name];
        var props = this.model.get('props');

        if (view) {
            var component = React.createElement(view, props, null);
            ReactDOM.render(component, this.el);        
        } else {
            console.error(`Unable to render component. ${name} not found`);
        }
    }
});


module.exports = {
    ReactModel : ReactModel,
    ReactView : ReactView
};
