import React from 'react'
import PropTypes from 'prop-types'
import style from './../styles.css'

export default function bookend(props) {
  return (
    <div className={style.bookend}>
      <span className={style.bookendTitle}>Get the best rate</span>
      <span className={style.bookendContentText}>Get the best rate in the market by booking in our web page!</span>
      <div onClick={() => {
        window.location.replace(props.link)
      }}>
        <span className={style.bookendButton}>BOOK NOW</span>
      </div>
      <div onClick={() => {
        props.reset()
      }} className={style.bookendReset}><span>↻ VIEW AGAIN</span></div>
    </div>
  )
}

bookend.propTypes = {
  link: PropTypes.string,
  reset: PropTypes.func,
}
