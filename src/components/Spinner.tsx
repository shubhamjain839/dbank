import React from 'react'
export const Spinner = () => {
  return (
    <div>
      <img src={`${process.env.PUBLIC_URL}/assets/spinner.svg`} alt='spinner' />
    </div>
  )
}
