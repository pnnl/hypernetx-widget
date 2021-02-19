# Tester Installation
This installation is intended for people who want to test `hnx-widget` with the most recent interface (on any branch). Run the following commands.
```sh
cd widget
pip install -e .
jupyter nbextension install --py --symlink --sys-prefix hnxwidget
jupyter nbextension enable --py --sys-prefix hnxwidget
```

# Developer Installation
If you just want to use the tool with the most recent updates, this installation is not recommended. This installation is intended for people who are developing the JavaScript portion of the library. It will setup the Node.js environments, download packages, etc. To get setup as a developer, run the `setup-develop.sh` script.
