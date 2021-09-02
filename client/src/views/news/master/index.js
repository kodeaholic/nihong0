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
  CFormSelect,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { newsService } from '../../../services/api/newsService'
import _ from 'lodash'
import { newsCategoryService } from 'src/services/api/newsCategoryService'
const News = () => {
  const [items, setItems] = useState([])
  const [searching, setSearching] = useState(false)
  const [parent, setParent] = useState('')
  const [title, setTitle] = useState('')
  const [categories, setCategories] = useState([])
  const [redirect, setRedirect] = useState({ redirect: false, path: '' })
  const refresh = (filter) => {
    newsService.getItems(filter).then((res) => {
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
    newsCategoryService.getItems().then((res) => {
      if (res) {
        if (res.status === 401 || res.status === 404 || res.status === 400) {
          setCategories([])
        } else {
          setCategories(res.results)
        }
      }
    })
  }
  const setTitleDebounce = _.debounce(setTitle, 1000)
  useEffect(() => {
    setSearching(true)
    const filter = {}
    if (title) filter.title = title
    if (parent) filter.parent = parent
    refresh(filter)
  }, [title, parent])
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
              {categories.length > 0 && (
                <CFormSelect
                  aria-label="Parent"
                  onChange={(e) => {
                    setParent(e.target.value)
                  }}
                  id="parent"
                  value={parent}
                >
                  <option value="">Không có</option>
                  {categories.map((itm) => (
                    <option key={itm.id} value={itm.id}>
                      {itm.title}
                    </option>
                  ))}
                </CFormSelect>
              )}
              <CButton
                type="button"
                color="danger"
                onClick={() => {
                  const titleEl = document.getElementById('title')
                  if (titleEl) titleEl.value = ''
                  const parentEl = document.getElementById('parent')
                  if (parentEl) parentEl.value = ''
                  setParent('')
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
                    setRedirect({ redirect: true, path: `/news/getNews/${item.id}` })
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

export default News
