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
  CFormSelect,
  CBadge,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { subTestService } from '../../../services/api/subTestService'
import { getTestTypeName, testTypes } from 'src/constants/test.constants'
import { LEVEL } from 'src/constants/level.constants'
import _ from 'lodash'
const ReadingBoards = () => {
  const [items, setItems] = useState([])
  const [searching, setSearching] = useState(false)
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState(LEVEL.ALL)
  const [type, setType] = useState(testTypes.ALL)
  const [redirect, setRedirect] = useState({ redirect: false, path: '' })
  const refresh = (level = LEVEL.ALL, type = testTypes.ALL, title = '') => {
    const filter = {}
    if (level && level !== LEVEL.ALL) filter.level = level
    if (type && type !== testTypes.ALL) filter.type = type
    if (title) filter.title = title
    subTestService.getItems(filter).then((res) => {
      setItems(res.results)
      setSearching(false)
      if (!res.results || !res.results.length)
        toast.success(`Hiện tại chưa có mục nào tương tự`, {
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
  const setTitleDebounce = _.debounce(setTitle, 1000)
  useEffect(() => {
    setSearching(true)
    refresh(level, type, title)
  }, [level, type, title])
  if (redirect.redirect) return <Redirect to={redirect.path} />
  else
    return (
      <>
        <CRow>
          <CCol xs="12" sm="12" lg="12">
            <CInputGroup className="mb-3">
              <CFormControl
                type="text"
                placeholder="Tìm bài thi theo tiêu đề ..."
                defaultValue={title}
                onChange={(e) => {
                  setTitleDebounce(e.target.value)
                }}
                id="title"
              />
              <CFormSelect
                aria-label="Level"
                onChange={(e) => {
                  setLevel(e.target.value)
                }}
                id="level"
              >
                <option value="ALL">Tìm theo trình độ</option>
                <option value="N1">N1</option>
                <option value="N2">N2</option>
                <option value="N3">N3</option>
                <option value="N4">N4</option>
                <option value="N5">N5</option>
              </CFormSelect>
              <CFormSelect
                aria-label="Loại bài"
                onChange={(e) => {
                  setType(e.target.value)
                }}
                id="type"
              >
                <option value="0">Tìm theo loại bài</option>
                <option value={testTypes.TUVUNG}>Từ vựng</option>
                <option value={testTypes.CHUHAN}>Chữ Hán</option>
                <option value={testTypes.NGUPHAP}>Ngữ pháp</option>
                <option value={testTypes.TIMNGHIA}>Tìm đúng nghĩa</option>
                <option value={testTypes.GHEPCAU}>Ghép câu</option>
              </CFormSelect>
              <CButton
                type="button"
                color="danger"
                onClick={() => {
                  const titleEl = document.getElementById('title')
                  const typeEl = document.getElementById('type')
                  const levelEl = document.getElementById('level')
                  if (titleEl) titleEl.value = ''
                  if (typeEl) typeEl.value = testTypes.ALL
                  if (levelEl) levelEl.value = LEVEL.ALL
                  setLevel(LEVEL.ALL)
                  setTitle('')
                  setType(testTypes.ALL)
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
            {items &&
              items.map((item) => (
                <CCol
                  key={item.id}
                  xs="12"
                  sm="6"
                  lg="3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setRedirect({ redirect: true, path: `/sub-tests/getItem/${item.id}` })
                  }}
                >
                  <CCard style={{ width: '18rem', marginBottom: '5px' }}>
                    <CCardBody>
                      <CCardTitle>{item.title}</CCardTitle>
                      <CCardSubtitle className="mb-2 text-muted">
                        <CBadge color="success">{item.free ? 'Free' : 'Trả phí'}</CBadge>{' '}
                        <CBadge color="primary">{item.level}</CBadge>{' '}
                        <CBadge color="info">{getTestTypeName(item.type)}</CBadge>
                      </CCardSubtitle>
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

export default ReadingBoards
