from .react_jupyter_widget import ReactJupyterWidget

import ipywidgets as widgets

import matplotlib.pyplot as plt
from matplotlib.colors import to_hex

from hypernetx.drawing.util import get_set_layering

NODE_DEFAULT_STYLES = {
    'fill': 'black',
    'stroke': 'black',
    'stroke-width': 0
}

@widgets.register
class HypernetxWidget(ReactJupyterWidget):
    def __init__(self, H,
        node_size=None,
        node_styles={},
        with_color=True,
        **kwargs
    ):
        # will break if already collapsed
        self.H = H.collapse_nodes_and_edges()

        def get_property(id, value, default):
            if value is None:
                return default
            elif hasattr(value, 'get'):
                return value.get(id, default)
            else:
                return value
        
        levels = get_set_layering(self.H)
        
        nodes = [
            {
                'elements': [
                    {
                        'uid': uid,
                        'value': get_property(uid, node_size, 1),
                        'style': {
                            k: get_property(uid, node_styles.get(k), v)
                            for k, v in NODE_DEFAULT_STYLES.items()
                            if k in node_styles
                        }
                    }
                    for uid in entity.uid
                ]
            }
            for i, entity in enumerate(self.H.nodes())
        ]

        nodes_dict = {
            entity: i
            for i, entity in enumerate(self.H)
        }

        def edge_color(i):
            return to_hex(plt.cm.tab10(i%10)) if with_color else 'black'

        # js friendly representation of the hypergraph
        edges = [
            {
                'uid': list(entity.uid),
                'elements': [nodes_dict[v] for v in entity.elements],
                'level': levels[entity.uid],
                'style': {
                    'stroke-width': len(entity.elements)**.5,
                    'stroke': edge_color(i),
                    'fill': edge_color(i),
                    'fill-opacity': .1
                }
            }
            for i, entity in enumerate(self.H.edges())
        ]
        
        super().__init__(
            nodes=nodes,
            edges=edges,
            **kwargs
        )