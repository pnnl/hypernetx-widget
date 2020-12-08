from .react_jupyter_widget import ReactJupyterWidget

import ipywidgets as widgets

import matplotlib.pyplot as plt
from matplotlib.colors import to_rgba_array, to_hex
import numpy as np

from hypernetx.drawing.util import get_set_layering, inflate_kwargs

converters = {
    'edgecolor': 'Stroke',
    'edgecolors': 'Stroke',
    'facecolor': 'Fill',
    'facecolors': 'Fill',
    'color': 'Fill',
    'colors': 'Fill',
    'linewidths': 'StrokeWidth',
    'linewidth': 'StrokeWidth'
}

def prepare_kwargs(items, kwargs, prefix=''):
    return {
        prefix + converters.get(k, k):
            dict(zip(items, hex_array(v) if 'color' in k else v))
        for k, v in inflate_kwargs(items, kwargs).items()
    }

def hex_array(values):
    return [
        to_hex(c, keep_alpha=True)
        for c in to_rgba_array(values)
    ]

def hnx_kwargs_to_props(H,
    nodes_kwargs={},
    edges_kwargs={},
    node_labels_kwargs={},
    edge_labels_kwargs={},
    **kwargs
):
    # reproduce default hnx coloring behaviors
    edges_kwargs = edges_kwargs.copy()
    edges_kwargs.setdefault('edgecolors', plt.cm.tab10(np.arange(len(H.edges))%10))
    edges_kwargs.setdefault('linewidths', 2)
    
    # props = kwargs.copy()
    props = {}
    props.update(prepare_kwargs(H.nodes, nodes_kwargs, prefix='node'))
    props.update(prepare_kwargs(H.nodes, node_labels_kwargs, prefix='nodeLabel'))
    props.update(prepare_kwargs(H.edges, edges_kwargs, prefix='edge'))
    props.update(prepare_kwargs(H.edges, edge_labels_kwargs, prefix='edgeLabel'))
    
    # if not otherwise specified, set the edge label color
    # to be the same as the edge color
    props.setdefault('edgeLabelColor', props['edgeStroke'])
    
    return props

@widgets.register
class HypernetxWidget(ReactJupyterWidget):
    def __init__(self, H,
        node_size=None,
        node_styles={},
        with_color=True,
        **kwargs
    ):
        # will break if already collapsed
        self.H = H.collapse_nodes()

        def get_property(id, value, default):
            if value is None:
                return default
            elif hasattr(value, 'get'):
                return value.get(id, default)
            else:
                return value
        
        levels = get_set_layering(self.H, collapse=False)
        
        nodes = [
            {
                'elements': [
                    {
                        'uid': uid,
                        'value': get_property(uid, node_size, 1)
                    }
                    for uid in entity.uid
                ]
            }
            for entity in self.H.nodes()
        ]

        nodes_dict = {
            entity: i
            for i, entity in enumerate(self.H)
        }

        # js friendly representation of the hypergraph
        edges = [
            {
                'uid': entity.uid,
                'elements': [nodes_dict[v] for v in entity.elements],
                'level': levels[entity.uid]
            }
            for entity in self.H.edges()
        ]

        super().__init__(
            nodes=nodes,
            edges=edges,
            **hnx_kwargs_to_props(H, **kwargs)
        )