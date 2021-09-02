import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { getViewAction, getLastPartFromPathName } from 'src/services/helpers/routeHelper'
import './style.css'
import {
  CForm,
  CRow,
  CBadge,
  CCol,
  CFormLabel,
  CFormControl,
  CButton,
  CSpinner,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CFormSelect,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
} from '@coreui/react'
import { Redirect } from 'react-router-dom'
import { newsService } from 'src/services/api/newsService'
import _ from 'lodash'
import { htmlEntityDecode, htmlEntityEncode } from 'src/helpers/htmlentities'
import renderHTML from 'react-render-html'
import { newsCategoryService } from 'src/services/api/newsCategoryService'

const NewsItem = (props) => {
  const pathName = props.location.pathname
  const viewAction = getViewAction(pathName)
  const itemId = viewAction === 'add' ? undefined : getLastPartFromPathName(pathName)
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [parent, setParent] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState([])
  const [item, setItem] = useState({})
  const savingCallback = (res) => {
    setSaving(false)
    if (res && res.code !== 400 && res.code !== 403 && res.code !== 401 && res.code !== 500) {
      toast.success(`Lưu thành công`, {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setRedirecTo({
        isRedirected: true,
        redirectedPath: `/news/getNews/${res.id}`,
      })
    } else {
      if (res.code === 400) {
        toast.error(`${res.message}`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } else
        toast.error(`Có lỗi xảy ra khi lưu”`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
    }
  }

  const handleSubmit = () => {
    if (title.length > 0) {
      setSaving(true)
      let data = {
        title,
        content: htmlEntityEncode(content),
      }
      if (parent) data.parent = parent
      viewAction === 'add'
        ? newsService.createItem(data).then(savingCallback)
        : newsService.updateItem(data, itemId).then(savingCallback)
    } else {
      toast.error(`Hoàn thành các trường để trống hoặc sửa ô báo đỏ`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }
  /* Load item */
  useEffect(() => {
    if (itemId) {
      newsService.getItem(itemId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404 || res.status === 400) {
            toast.error(`Mục không tồn tại`, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            setRedirecTo({ isRedirected: true, redirectedPath: '/news' })
          } else {
            setTitle(res.title)
            setParent(res.parent)
            setContent(!_.isEmpty(res.content) ? htmlEntityDecode(res.content) : '')
            setItem(res)
          }
        }
      })
    }
    newsCategoryService.getItems().then((res) => {
      if (res) {
        if (res.status === 401 || res.status === 404 || res.status === 400) {
          setCategories([])
        } else {
          setCategories(res.results)
        }
      }
    })
  }, [itemId])

  if (redirectTo.isRedirected) {
    if (redirectTo.reload)
      setTimeout(() => {
        window.location.reload()
      }, 300)
    return <Redirect exact to={redirectTo.redirectedPath} />
  } else
    return (
      <>
        <CRow>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="title" className="col-sm-2 col-form-label">
                Tiêu đề <span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  type="text"
                  id="title"
                  required
                  placeholder="Ví dụ: Tổng hợp"
                  onChange={(e) => setTitle(e.target.value)}
                  defaultValue={title}
                  disabled={viewAction === 'get'}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="content" className="col-sm-2 col-form-label">
                Nội dung bài viết
              </CFormLabel>
              <CCol sm="10">
                {viewAction !== 'get' && (
                  <div
                    id="content"
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#fff',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      marginTop: '7px',
                      cursor: 'text',
                      minHeight: 200,
                      width: '100%',
                    }}
                    onClick={(e) => {
                      const editor = window.CKEDITOR.replace('content', {
                        on: {
                          // instanceReady: function (evt) {
                          //   document.getElementById(evt.editor.id + '_top').style.display = 'none'
                          // },
                          change: function (e) {
                            // xử lý data
                            let content = editor.getData()
                            setContent(content)
                          },
                        },
                      })
                    }}
                  >
                    {content ? renderHTML(content) : ''}
                  </div>
                )}
                {viewAction === 'get' && !_.isEmpty(content) && (
                  <div
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#D8DBE0',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      marginTop: '7px',
                      width: '100%',
                      height: 'auto',
                    }}
                  >
                    {content ? renderHTML(content) : ''}
                  </div>
                )}
              </CCol>
            </CRow>
            {viewAction !== 'get' && !_.isEmpty(categories) && (
              <CRow className="mb-3">
                <CFormLabel htmlFor="parent" className="col-sm-2 col-form-label">
                  Chuyên mục cha
                </CFormLabel>
                <CCol sm="10">
                  <CFormSelect
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
                </CCol>
              </CRow>
            )}
            {viewAction === 'get' && !_.isEmpty(parent) && (
              <CRow>
                <CFormLabel className="col-sm-2 col-form-label">Chuyên mục cha</CFormLabel>
                <CCol sm="10">
                  <CRow>
                    {!_.isEmpty(categories) &&
                      [parent].map((item) => {
                        const index = _.findIndex(categories, function (category) {
                          return category.id.toString() === item
                        })
                        const category = index > -1 ? categories[index] : {}
                        return (
                          <CCol
                            key={category.id}
                            xs="12"
                            sm="6"
                            lg="3"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setRedirecTo({
                                isRedirected: true,
                                redirectedPath: `/news-categories/getCategory/${category.id}`,
                                reload: true,
                              })
                            }}
                          >
                            <CCard style={{ width: '18rem', marginBottom: '5px' }}>
                              <CCardBody>
                                <CCardTitle>{category.title}</CCardTitle>
                                <CCardText>{category.description}</CCardText>
                              </CCardBody>
                            </CCard>
                          </CCol>
                        )
                      })}
                  </CRow>
                </CCol>
              </CRow>
            )}
            <CRow>
              {viewAction !== 'get' && (
                <>
                  <CCol className="col-sm-6" style={{ marginTop: '5px' }}>
                    <CButtonGroup>
                      <CButton
                        onClick={handleSubmit}
                        style={{ color: 'white', marginRight: '5px' }}
                      >
                        LƯU
                      </CButton>
                    </CButtonGroup>
                  </CCol>
                </>
              )}
            </CRow>

            {viewAction === 'get' && (
              <CRow>
                <CCol className="col-sm-3">
                  {saving && <CSpinner />}
                  {!saving && (
                    <CButton
                      style={{ color: 'white', marginBottom: '10px' }}
                      onClick={() => {
                        setRedirecTo({
                          isRedirected: true,
                          redirectedPath: `/news/editNews/${itemId}`,
                        })
                      }}
                    >
                      SỬA
                    </CButton>
                  )}
                </CCol>
              </CRow>
            )}

            {viewAction === 'get' && (
              <CRow>
                <CCol className="col-sm-3">
                  <CButton
                    color="danger"
                    style={{ color: 'white' }}
                    onClick={() => setVisible(!visible)}
                  >
                    XOÁ
                  </CButton>
                  <CModal visible={visible} onDismiss={() => setVisible(false)}>
                    <CModalHeader onDismiss={() => setVisible(false)}>
                      <CModalTitle>XÁC NHẬN XOÁ MỤC NÀY</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      Bạn chắc chắn muốn xoá <CBadge color="success">{title}</CBadge> ?
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={() => setVisible(false)}>
                        HUỶ BỎ
                      </CButton>
                      {deleting && <CSpinner />}
                      {!deleting && (
                        <CButton
                          color="danger"
                          onClick={() => {
                            setDeleting(true)
                            newsService.deleteItem(itemId).then((res) => {
                              setDeleting(false)
                            })
                            toast.success(`Xoá thành công`, {
                              position: 'top-right',
                              autoClose: 2500,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                            })
                            setRedirecTo({
                              isRedirected: true,
                              redirectedPath: '/news',
                            })
                          }}
                        >
                          XOÁ
                        </CButton>
                      )}
                    </CModalFooter>
                  </CModal>
                </CCol>
              </CRow>
            )}
            {/* {viewAction === 'get' && (
              <CRow>
                <CCol className="col-sm-3">
                  <CButton
                    style={{ color: 'white', marginTop: '10px' }}
                    color="success"
                    onClick={() => {
                      setRedirecTo({
                        isRedirected: true,
                        redirectedPath: `/news-categories/getNewsItem/webview/${itemId}`,
                      })
                    }}
                  >
                    XEM UI MOBILE
                  </CButton>
                </CCol>
              </CRow>
            )} */}
          </CForm>
        </CRow>
      </>
    )
}

NewsItem.propTypes = {}

export default NewsItem
