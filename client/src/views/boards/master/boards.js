import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import {
  CCol,
  CCardBody,
  CRow,
  CCard,
  CFormControl,
  CInputGroup,
  CButton,
  CSpinner,
  CCardSubtitle,
  CCardTitle,
  CCardText,
  CBadge,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { boardService } from '../../../services/api/boardService'
const Boards = () => {
  const [boards, setBoards] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [searching, setSearching] = useState(false)
  const [redirect, setRedirect] = useState({ redirect: false, path: '' })
  const refresh = () => {
    boardService.getBoards().then((res) => {
      setBoards(res.results)
      if (!res.results || !res.results.length)
        toast.success(`Hiện tại chưa có bài từ vựng nào được thêm`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
    })
  }
  useEffect(() => {
    refresh()
  }, [])
  const isDisabled = searchKey.length === 0
  if (redirect.redirect) return <Redirect to={redirect.path} />
  else
    return (
      <>
        <CRow>
          <CCol xs="12" sm="6" lg="3">
            <CInputGroup className="mb-3">
              <CFormControl
                type="text"
                placeholder="Tìm bài theo tiêu đề ..."
                defaultValue={searchKey}
                onChange={(e) => {
                  setSearchKey(e.target.value)
                }}
                id="search-key"
              />
              <CButton
                type="button"
                color="secondary"
                disabled={isDisabled}
                onClick={() => {
                  if (!searchKey.length) {
                    toast.error(`Nhập từ khoá trước khi tìm kiếm`, {
                      position: 'top-right',
                      autoClose: 3000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                  } else {
                    setSearching(true)
                    boardService.getBoards({ title: searchKey }).then((res) => {
                      setSearching(false)
                      const result = res.results
                      if (!result.length)
                        toast.success(`Không thấy kết quả tương tự`, {
                          position: 'top-right',
                          autoClose: 3000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        })
                      setBoards(result)
                    })
                  }
                }}
              >
                Tìm
              </CButton>
              <CButton
                type="button"
                color="danger"
                onClick={() => {
                  setSearchKey('')
                  refresh()
                  // remove search
                  document.getElementById('search-key').value = ''
                }}
                style={{ color: 'white' }}
              >
                ↻
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
        {!searching && (
          <CRow>
            {boards &&
              boards.map((item) => (
                <CCol
                  key={item.id}
                  xs="12"
                  sm="6"
                  lg="3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setRedirect({ redirect: true, path: `/boards/getBoard/${item.id}` })
                  }}
                >
                  <CCard style={{ width: '18rem', marginBottom: '5px' }}>
                    <CCardBody>
                      <CCardTitle>{item.title}</CCardTitle>
                      <CCardSubtitle className="mb-2 text-muted">
                        <CBadge color="success">{item.free ? 'Free' : 'Trả phí'}</CBadge>{' '}
                        <CBadge color="primary">{item.level}</CBadge>{' '}
                        <CBadge color="info">{item.cards.length} chữ</CBadge>
                      </CCardSubtitle>
                      {/* <CCardText>{item.description}</CCardText> */}
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
          </CRow>
        )}
        {searching && <CSpinner />}
      </>
    )
}

export default Boards
