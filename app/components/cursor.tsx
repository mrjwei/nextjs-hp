'use client'

import React from 'react';

export const Cursor = () => {
  const [pos, setPos] = React.useState({x: 0, y: 0})

  React.useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPos({x: e.clientX, y: e.clientY})

      // const el = document.elementFromPoint(e.clientX, e.clientY)
      // if (el) {
      //   const bgColor = getEffectiveBackgroundColor(el);
      //   console.log('el: ', bgColor)
      //   const contrastColor = computeContrastColor(bgColor)
      //   setBorderColor(contrastColor)
      // }
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  // const computeContrastColor = (bgColor: string) => {
  //   let hex = bgColor.replace('#', '')
  //   if (hex.length === 3) {
  //     hex = hex.split('').map(c => c + c).join('')
  //   }

  //   const r = parseInt(hex.substring(0, 2), 16);
  //   const g = parseInt(hex.substring(2, 4), 16);
  //   const b = parseInt(hex.substring(4, 6), 16);

  //   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  //   return luminance > 0.1 ? '#000000' : '#ffffff'
  // }

  return (
    <div className='custom-cursor' style={{left: `${pos.x}px`, top: `${pos.y}px`}} />
  )
}
