import React from 'react';

import NavigableSVG, {PAN, RESET, ZOOM_IN, ZOOM_OUT}  from '../NavigableSVG'

export default {
  title: 'HNX Widget SVG/Navigation',
};

const props = {
  width: 400,
  height: 300
};

const Pattern = () => <React.Fragment>
  <circle cx={80} cy={20} r={10} />
  <circle cx={80} cy={80} r={30} />
  <circle cx={20} cy={80} r={16} />
  <text x={150} y={150}>How do we make font size constant?</text>
</React.Fragment>

function SimpleNavigation() {
  const [nav, setNav] = React.useState();

  const options = [undefined, RESET, PAN, ZOOM_IN, ZOOM_OUT];

  const handleClick = ev =>
    console.log(ev.target.value) ||
    setNav(ev.target.value)

  return <div>
    { options.map(d =>
        <div>
          <button value={d} onClick={handleClick}>
            {d || 'Undefined'}
          </button>
        </div>
      )
    }

    <NavigableSVG {...props} navigation={nav}>
      <Pattern />
    </NavigableSVG>
  </div>
}

export const Default = () =>
  <NavigableSVG {...props} >
    <Pattern />
  </NavigableSVG>

export const Pan = () =>
  <NavigableSVG {...props} navigation={PAN} >
    <Pattern />
  </NavigableSVG>

export const ZoomIn = () =>
  <NavigableSVG {...props} navigation={ZOOM_IN}  >
    <Pattern />
  </NavigableSVG>

export const ZoomOut = () =>
  <NavigableSVG {...props} navigation={ZOOM_OUT}  >
    <Pattern />
  </NavigableSVG>

export const Interactive = () =>
  <SimpleNavigation />
