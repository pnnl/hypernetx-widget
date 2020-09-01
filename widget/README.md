hnx-widget
===============================

A widget for interractive visualization of the hypernetx package.

Installation
------------

To install use pip:

    $ pip install hnxwidget
    $ jupyter nbextension enable --py --sys-prefix hnxwidget

To install for jupyterlab

    $ jupyter labextension install hnxwidget

For a development installation (requires npm),

    $ git clone https://github.com/PNNL/hnx-widget.git
    $ cd hnx-widget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix hnxwidget
    $ jupyter nbextension enable --py --sys-prefix hnxwidget
    $ jupyter labextension install js

When actively developing your extension, build Jupyter Lab with the command:

    $ jupyter lab --watch

This takes a minute or so to get started, but then automatically rebuilds JupyterLab when your javascript changes.

Note on first `jupyter lab --watch`, you may need to touch a file to get Jupyter Lab to open.

