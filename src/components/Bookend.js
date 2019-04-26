import React from 'react'
import PropTypes from 'prop-types'
import style from './../styles.css'

export default function bookend(props) {
  return (
    <div className={style.bookend}>
      HOLA
      <div onClick={() => {
        props.reset()
      }} className={style.seeMoreClose}><span>↻ RESET</span></div>
    </div>
  )
}

bookend.propTypes = {
  reset: PropTypes.func,
}
