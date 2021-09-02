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
  CCardTitle,
  CCardText,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { newsCategoryService } from '../../../services/api/newsCategoryService'
import _ from 'lodash'
const NewsCategories = () => {
  const [items, setItems] = useState([])
  const [searching, setSearching] = useState(false)
  const [title, setTitle] = useState('')
  const [redirect, setRedirect] = useState({ redirect: false, path: '' })
  const refresh = (filter) => {
    newsCategoryService.getItems(filter).then((res) => {
      const results = res.results.filter((item) => _.isEmpty(item.parent)) // category level 1
      setItems(results)
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
    if (title) filter.title = title
    refresh(filter)
  }, [title])
  if (redirect.redirect) return <Redirect to={redirect.path} />
  else
    return (
      <>
        <CRow>
          <CCol xs="12" sm="12" lg="12">
            <CInputGroup className="mb-3">
              <CFormControl
                type="text"
                placeholder="Tìm theo tiêu đề ..."
                defaultValue={title}
                onChange={(e) => {
                  setTitleDebounce(e.target.value)
                }}
                id="title"
              />
              <CButton
                type="button"
                color="danger"
                onClick={() => {
                  const titleEl = document.getElementById('title')
                  if (titleEl) titleEl.value = ''
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
                    setRedirect({ redirect: true, path: `/news-categories/getCategory/${item.id}` })
                  }}
                >
                  <CCard style={{ width: '18rem', marginBottom: '5px' }}>
                    <CCardBody>
                      <CCardTitle>{item.title}</CCardTitle>
                      <CCardText>{item.description}</CCardText>
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

export default NewsCategories
