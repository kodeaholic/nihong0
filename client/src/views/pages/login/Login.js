import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect, useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormControl,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormFeedback,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { authConstants } from '../../../constants/auth.constants'
import { authService } from '../../../services/api/authService'
import { toast } from 'react-toastify'
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const Login = () => {
  const dispatch = useDispatch()
  const [validated, setValidated] = useState(false)
  const history = useHistory()
  const handleSubmit = (event) => {
    const form = event.currentTarget
    const check = form.checkValidity()
    event.preventDefault()
    event.stopPropagation()
    if (check) {
      setValidated(true)
      dispatch({ type: authConstants.LOGIN_REQUEST, payload: {} })
      sleep(1500).then(() => {
        // Do something after the sleep!
        authService.login(username, password).then((user) => {
          if (!user) {
            dispatch({ type: authConstants.LOGIN_FAILURE, payload: user })
            toast.error('Thông tin email hoặc mật khẩu không đúng', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          } else {
            dispatch({ type: authConstants.LOGIN_SUCCESS, payload: user })
            localStorage.setItem('user', JSON.stringify(user))
            setTimeout(() => {
              history.replace(`/dashboard`)
            })
          }
        })
      })
      // call api login
    } else {
      toast.error('Vui lòng nhập các thông tin bắt buộc', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }
  const loggingIn = useSelector((state) => state.auth.loggingIn)
  const loggedIn = useSelector((state) => state.auth.loggedIn)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // if (loggedIn || localStorage.getItem('user')) return <Redirect exact to="/dashboard" />
  // else
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm noValidate validated={validated} onSubmit={handleSubmit}>
                    <h1>Đăng nhập</h1>
                    <p className="text-medium-emphasis">Đăng nhập bằng tài khoản admin</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                      <CFormControl
                        type="email"
                        placeholder="Email"
                        defaultValue=""
                        required
                        onChange={(e) => {
                          setUsername(e.target.value)
                        }}
                      />
                      <CFormFeedback invalid>Chưa nhập email</CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormControl
                        type="password"
                        placeholder="Password"
                        defaultValue=""
                        required
                        onChange={(e) => {
                          setPassword(e.target.value)
                        }}
                      />
                      <CFormFeedback invalid>Chưa nhập mật khẩu</CFormFeedback>
                    </CInputGroup>
                    <CRow className="text-center">
                      <CCol xs="12">
                        {!loggingIn && (
                          <CButton color="primary" className="px-4" type="submit">
                            Đăng nhập
                          </CButton>
                        )}
                        {loggingIn && <CSpinner />}
                      </CCol>
                      {/* <CCol xs="6" className="text-right">
                        <CButton color="danger" className="px-0" disabled>
                          Quên mật khẩu?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Đăng ký</h2>
                    <p>Hiện tại chưa hỗ trợ đăng ký thêm tài khoản admin</p>
                    {/* <Link to="/register"> */}
                    <CButton color="success" disabled className="mt-3" active tabIndex={-1}>
                      Đăng ký ngay
                    </CButton>
                    {/* </Link> */}
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
