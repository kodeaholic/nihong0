import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CButton } from '@coreui/react'

const RedirectButton = ({ styles, path, buttonColor = 'secondary', buttonName = 'Back' }) => {
  const [redirect, setRedirect] = useState(false)
  return (
    <>
      {!redirect && (
        <CButton
          color={buttonColor}
          onClick={() => {
            setRedirect(true)
          }}
          style={styles}
        >
          &#8592; {buttonName}
        </CButton>
      )}
      {redirect && <Redirect to={path} />}
    </>
  )
}

RedirectButton.propTypes = {
  styles: PropTypes.object,
  path: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonName: PropTypes.string,
}

export default RedirectButton
