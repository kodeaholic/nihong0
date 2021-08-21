import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
const Loader = (props) => {
  const { loading, customClasses } = props

  return (
    <>
      {!loading && <></>}
      {loading && (
        // <div className="on-the-fly-loader">
        //   <div className="on-the-fly-dot"></div>
        //   <div className="on-the-fly-dot"></div>
        //   <div className="on-the-fly-dot"></div>
        // </div>
        <div className={customClasses ? customClasses.wrapper : 'four-circle-loader-wrapper'}>
          <div className={customClasses ? customClasses.loader : 'four-circle-loader'}></div>
        </div>
      )}
    </>
  )
}

Loader.propTypes = {
  loading: PropTypes.bool,
  customClasses: PropTypes.object,
}

export default Loader
