import React from 'react'

import {select} from 'd3-selection'
import {drag} from 'd3-drag'

import './NavigableSVG.css'

export const RESET = 'reset'
export const PAN = 'pan'
export const ZOOM_IN = 'zoom-in'
export const ZOOM_OUT = 'zoom-out'

export const NavigableSVG = ({children, navigation, scale=1.5, width, height, ...props}) => {

  const drawRect = [PAN, ZOOM_IN, ZOOM_OUT]
    .indexOf(navigation) !== -1;

  return <svg
    viewBox={`0 0 ${width} ${height}`}
    className='navigable-svg'
    {...{width, height}}
    {...props}
    ref={ele => {
      if (!ele) return;

      const svg = select(ele);
      const rect = svg.select('rect.navigation-handle');

      const getViewBox = () =>
        svg.attr('viewBox')
          .split(' ')
          .map(Number);

      let viewBoxStart, evStart;

      const handleDragStart = ev => {
        viewBoxStart = getViewBox();
        evStart = ev;
      }

      const handleDrag = ev => {
        const [viewX, viewY, viewWidth, viewHeight] = viewBoxStart;

        const dx = evStart.sourceEvent.pageX - ev.sourceEvent.pageX;
        const dy = evStart.sourceEvent.pageY - ev.sourceEvent.pageY;

        const viewBox = [
          viewX + dx*viewWidth/width,
          viewY + dy*viewHeight/height,
          viewWidth,
          viewHeight
        ].join(' ');

        svg.attr('viewBox', viewBox);
      }

      const handleZoom = (ev, scale) => {
        const [viewX, viewY, viewWidth, viewHeight] = getViewBox();
        const newViewWidth = viewWidth*scale;
        const newViewHeight = viewHeight*scale;

        // when zooming out, prevent zooming out too far
        if (newViewWidth >= width) {
          return svg.attr('viewBox', `0 0 ${width} ${height}`);
        }

        // project mouse event into viewBox?
        const x = viewX + ev.offsetX*viewWidth/width;
        const y = viewY + ev.offsetY*viewHeight/height;

        const viewBox = [
          x - newViewWidth/2,
          y - newViewHeight/2,
          newViewWidth,
          newViewHeight
        ].join(' ');

        svg.attr('viewBox', viewBox);
      }

      const handleZoomIn = ev => 
        handleZoom(ev, 1/scale)

      const handleZoomOut = ev =>
        handleZoom(ev, scale)

      if (navigation === PAN) {
        rect.call(
          drag()
            .on('start', handleDragStart)
            .on('drag', handleDrag)
        );
      } else if (navigation === ZOOM_IN) {
        rect.on('click', handleZoomIn);
      } else if (navigation === ZOOM_OUT) {
        rect.on('click', handleZoomOut);
      } else if (navigation === RESET) {
        svg.attr('viewBox', `0 0 ${width} ${height}`);
      }
    }}
  >
    { children }
    { drawRect &&
        <rect
            className={`navigation-handle ${navigation}`}
            {...{width, height}}
        />
    }
  </svg>
}

export default NavigableSVG
