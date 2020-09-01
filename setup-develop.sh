npm install
npm run build -- --copy-files --no-demo
cd widget/js
npm install
npm run prepublish
cd ..
pip install -e .
cd ..
jupyter nbextension install --py --symlink --sys-prefix hnxwidget
jupyter nbextension enable --py --sys-prefix hnxwidget
jupyter labextension install js
