# Installation
Installation requires you to first pip install the widget, then install and activate the widget in your jupyter environment. Below, `<version>` refers to the version number of package.

```sh
pip install hnxwidget-<version>.py3-none-any.whl
jupyter nbextension install hnxwidget
jupyter nbextension enable hnxwidget
```

# Getting Started
After a successful installation, you can copy/paste the fragment below into a jupyter notebook cell. Executing the cell will produce an interactive hypergraph visualization. It is required that the last line of the cell returns the widget.
```py
from hnxwidget import HypernetxWidgetView
import hypernetx as hnx

scenes = {
    0: ('FN', 'TH'),
    1: ('TH', 'JV'),
    2: ('BM', 'FN', 'JA'),
    3: ('JV', 'JU', 'CH', 'BM'),
    4: ('JU', 'CH', 'BR', 'CN', 'CC', 'JV', 'BM'),
    5: ('TH', 'GP'),
    6: ('GP', 'MP'),
    7: ('MA', 'GP'),
}

H = hnx.Hypergraph(scenes)
HypernetxWidgetView(H)
```
Example output:
![Screenshot of HNX Widget](hnx-widget-screenshot.png)

# Other Installation Methods
## For testers
This installation is intended for people who want to test `hnx-widget` with the most recent interface (on any branch). Run the following commands.
```sh
cd widget
pip install -e .
jupyter nbextension install --py --symlink --sys-prefix hnxwidget
jupyter nbextension enable --py --sys-prefix hnxwidget
```

## Developer 
If you just want to use the tool with the most recent updates, this installation is not recommended. This installation is intended for people who are developing the JavaScript portion of the library. It will setup the Node.js environments, download packages, etc. To get setup as a developer, run the `setup-develop.sh` script.

To create a universal wheel file, increment the version number in `/widget/hnxwidget/_version.py` and run 
```sh
python setup.py bdist_wheel
```

# How to Uninstall
```sh
jupyter nbextension uninstall hnxwidget
pip unistall hnxwidget
```