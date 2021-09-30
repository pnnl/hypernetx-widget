import React from 'react'
import {render} from 'react-dom'

import {debounce} from 'lodash';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';

import {HypernetxWidget} from '../../src/'

const defaultUserInput = `{
  "0": ["FN", "TH"],
  "1": ["TH", "JV"],
  "2": ["BM", "FN", "JA"],
  "3": ["JV", "JU", "CH", "BM"],
  "4": ["JU", "CH", "BR", "CN", "CC", "JV", "BM"],
  "5": ["TH", "GP"],
  "6": ["GP", "MP"],
  "7": ["MA", "GP"]
}`;

const emitChange = debounce(
  (value, onChange) => onChange && onChange(value),
  300
);

function JSONTextField({defaultValue, onChange, ...props}) {
  const [userValue, setUserValue] = React.useState(defaultValue);
  const [error, setError] = React.useState();

  const handleValidate = value => {
    try {
      // check that value can be parsed
      const parsedValue = JSON.parse(value);

      // check that object is the right schema
      if (typeof(parsedValue) === 'object' && !Array.isArray(parsedValue)) {
        const invalid = Object.entries(parsedValue)
          .filter(([k, v]) => !Array.isArray(v));

        if (Object.keys(parsedValue).length === 0) {
          setError('Input is empty')
        } else if (invalid.length) {
          setError(`Values for {${invalid[0][0]}} are not arrays of strings`)
        } else {
          emitChange(parsedValue, onChange);
          setError(undefined);
        }
      } else {
        setError('Input is not an Object')
      }
    } catch(e) {
      setError(String(e));
    }
  }

  const handleChange = ev => {
    const value = ev.target.value;
    
    setUserValue(value);
    handleValidate(value);
  }

  return <TextField
    fullWidth
    error={Boolean(error)}
    label={error || 'Valid'}
    value={userValue}
    onChange={handleChange}
    {...props}
  />
}

function Demo() {
  const [incidenceDict, setIncidenceDict] = React.useState(JSON.parse(defaultUserInput));

  const nodesSet = new Map();
  const edges = Object.entries(incidenceDict)
    .map(([uid, elements]) => {
      elements.forEach(uid => {
        nodesSet.set(uid, {uid});
      });

      return {uid, elements}
    });

  const nodes = Array.from(nodesSet.values());

  return <Grid container>
    <Grid item xs={6}>
      <Typography variant='h3'>hnxwidget Demonstration</Typography>
      <Typography variant='caption'>
        GitHub Repository: <a href='https://www.github.com/pnnl/hypernetx-widget'>
          github.com/pnnl/hypernetx-widget
        </a>
      </Typography>
      <Typography>
      This is hypergraph visualization tool that uses an Euler diagram--nodes
      are circles and hyper edges are outlines (rubber bands)
      containing the nodes/circles.

      The input data being visualized in the tool can be edited using
      the text area on the right. The input is in the same format as the
      constructor for a <a href='https://github.com/pnnl/hypernetx'>HypernetX</a>
      object--a dictionary mapping edges to lists of nodes.
      </Typography>

    </Grid>
    
    <Grid item xs={6}>
      <JSONTextField
        onChange={setIncidenceDict}
        defaultValue={ defaultUserInput }
        multiline
        rows={10}
      />
    </Grid>

    <Grid item xs={12}>  
      <HypernetxWidget {...{nodes, edges}} />
    </Grid>
  </Grid>
}

render(<Demo/>, document.querySelector('#demo'))
