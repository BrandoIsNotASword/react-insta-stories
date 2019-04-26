import React from 'react'
import PropTypes from 'prop-types'
import style from './../styles.css'

export default function seeMore(props) {
  return (
    <div onClick={() => {
      props.action('pause')
      window.location.replace(props.link)
    }} className={style.seeMore}>
      <span className={style.seemoreButton}>{props.text}</span>
    </div>
  )
}

seeMore.propTypes = {
  action: PropTypes.func,
  link: PropTypes.string,
  text: PropTypes.string,
}
