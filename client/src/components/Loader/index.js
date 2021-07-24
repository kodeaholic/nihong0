import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
const Loader = (props) => {
  const { loading } = props

  return (
    <>
      {!loading && <></>}
      {loading && (
        // <div className="on-the-fly-loader">
        //   <div className="on-the-fly-dot"></div>
        //   <div className="on-the-fly-dot"></div>
        //   <div className="on-the-fly-dot"></div>
        // </div>
        <div className="four-circle-loader-wrapper">
          <div className="four-circle-loader"></div>
        </div>
      )}
    </>
  )
}

Loader.propTypes = {
  loading: PropTypes.bool,
}

export default Loader
