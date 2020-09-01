from .react_jupyter_widget import ReactJupyterWidget

import ipywidgets as widgets

@widgets.register
class HypernetxWidget(ReactJupyterWidget):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
