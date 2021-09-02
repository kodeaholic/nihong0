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
import { newsCategoryService } from 'src/services/api/newsCategoryService'
import _ from 'lodash'

const NewsCategory = (props) => {
  const pathName = props.location.pathname
  const viewAction = getViewAction(pathName)
  const itemId = viewAction === 'add' ? undefined : getLastPartFromPathName(pathName)
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [parent, setParent] = useState('')
  const [children, setChildren] = useState([])
  const [description, setDescription] = useState('')
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
        redirectedPath: `/news-categories/getCategory/${res.id}`,
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
        description,
      }
      if (parent) data.parent = parent
      viewAction === 'add'
        ? newsCategoryService.createItem(data).then(savingCallback)
        : newsCategoryService.updateItem(data, itemId).then(savingCallback)
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
      newsCategoryService.getItem(itemId).then((res) => {
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
            setRedirecTo({ isRedirected: true, redirectedPath: '/news-categories' })
          } else {
            setTitle(res.title)
            setDescription(res.description)
            setParent(res.parent)
            setChildren(res.children)
            console.log(res.children)
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
          console.log(res.results)
          const list = res.results.filter((itm) => itm.id !== itemId && _.isEmpty(itm.parent))
          console.log(list)
          setCategories(list)
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
              <CFormLabel htmlFor="description" className="col-sm-2 col-form-label">
                Mô tả ngắn gọn
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  type="text"
                  component="textarea"
                  id="description"
                  required
                  placeholder="Ví dụ: Các bài viết tổng hợp"
                  onChange={(e) => setDescription(e.target.value)}
                  defaultValue={description}
                  disabled={viewAction === 'get'}
                />
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
                      console.log(e.target.value)
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
            {viewAction === 'get' && !_.isEmpty(children) && (
              <CRow>
                <CFormLabel className="col-sm-2 col-form-label">Chuyên mục con</CFormLabel>
                <CCol sm="10">
                  <CRow>
                    {!_.isEmpty(categories) &&
                      children.map((item) => {
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
                          redirectedPath: `/news-categories/editCategory/${itemId}`,
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
                      <CModalTitle>
                        XÁC NHẬN XOÁ MỤC NÀY VÀ CÁC BÀI VIẾT TRONG CHUYÊN MỤC
                      </CModalTitle>
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
                            newsCategoryService.deleteItem(itemId).then((res) => {
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
                              redirectedPath: _.isEmpty(parent)
                                ? '/news-categories'
                                : `/news-categories/${parent}`,
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
                        redirectedPath: `/news-categories/getNewsCategory/webview/${itemId}`,
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

NewsCategory.propTypes = {}

export default NewsCategory
