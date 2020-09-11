from .react_jupyter_widget import ReactJupyterWidget

import ipywidgets as widgets

from hypernetx.drawing.util import get_set_layering

@widgets.register
class HypernetxWidget(ReactJupyterWidget):
    def __init__(self, H,
        node_size=None,
        **kwargs
    ):
        # will break if already collapsed
        self.H = H.collapse_nodes_and_edges()

        def get_node_size(v):
            if node_size is None:
                return 1
            elif hasattr(node_size, 'get'):
                return node_size.get(v, 1)
            else:
                return node_size
        
        levels = get_set_layering(self.H)
        
        nodes = [
            {
                'elements': [
                    {
                        'uid': v,
                        'value': get_node_size(v)
                    }
                    for v in entity.uid
                ]
            }
            for i, entity in enumerate(self.H.nodes())
        ]

        nodes_dict = {
            entity: i
            for i, entity in enumerate(self.H)
        }
                
        # js friendly representation of the hypergraph
        edges = [
            {
                'uid': list(entity.uid),
                'elements': [nodes_dict[v] for v in entity.elements],
                'level': levels[entity.uid]
            }
            for entity in self.H.edges()
        ]
        
        super().__init__(
            nodes=nodes,
            edges=edges,
            **kwargs
        )