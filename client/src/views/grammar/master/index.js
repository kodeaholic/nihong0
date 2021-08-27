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
import { grammarService } from '../../../services/api/grammarService'
import { LEVEL } from 'src/constants/level.constants'
import _ from 'lodash'
const Grammars = () => {
  const [items, setItems] = useState([])
  const [searching, setSearching] = useState(false)
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState(LEVEL.ALL)
  const [redirect, setRedirect] = useState({ redirect: false, path: '' })
  const refresh = (filter) => {
    grammarService.getItems(filter).then((res) => {
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
    const filter = {}
    if (level !== LEVEL.ALL) filter.level = level
    if (title) filter.title = title
    refresh(filter)
  }, [level, title])
  if (redirect.redirect) return <Redirect to={redirect.path} />
  else
    return (
      <>
        <CRow>
          <CCol xs="12" sm="12" lg="12">
            <CInputGroup className="mb-3">
              <CFormControl
                type="text"
                placeholder="Tìm bài theo tiêu đề ..."
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
              <CButton
                type="button"
                color="danger"
                onClick={() => {
                  const titleEl = document.getElementById('title')
                  const levelEl = document.getElementById('level')
                  if (titleEl) titleEl.value = ''
                  if (levelEl) levelEl.value = LEVEL.ALL
                  setLevel(LEVEL.ALL)
                  setTitle('')
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
                    setRedirect({ redirect: true, path: `/grammar/getGrammar/${item.id}` })
                  }}
                >
                  <CCard style={{ width: '18rem', marginBottom: '5px' }}>
                    <CCardBody>
                      <CCardTitle>{item.title}</CCardTitle>
                      <CCardSubtitle className="mb-2 text-muted">
                        <CBadge color="success">{item.free ? 'Free' : 'Trả phí'}</CBadge>{' '}
                        <CBadge color="primary">{item.level}</CBadge>{' '}
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

export default Grammars
