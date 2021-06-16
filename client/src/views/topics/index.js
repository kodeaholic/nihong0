import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import _ from 'lodash'
import PropTypes from 'prop-types'
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
  CCardHeader,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CFormLabel,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { topicService } from '../../services/api/topicService'
import { pluralize } from '../../helpers/common'
const AddModal = ({ visible, setVisible, onSuccess }) => {
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const isDisabled = name.length > 0 ? false : true
  return (
    <CModal visible={visible} onDismiss={() => setVisible(false)}>
      <CModalHeader onDismiss={() => setVisible(false)}>
        <CModalTitle>THÊM MỚI CHỦ ĐỀ</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="name">
              Tiêu đề <span style={{ color: 'red' }}>*</span>
            </CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              id="name"
              required
              placeholder="Ví dụ: 3000 từ vựng JPLT"
              onChange={(e) => setName(e.target.value)}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="description">Mô tả</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              component="textarea"
              id="description"
              required
              placeholder="Mô tả ngắn gọn"
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
            />
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          HUỶ BỎ
        </CButton>
        {saving && <CSpinner />}
        {!saving && (
          <CButton
            disabled={isDisabled}
            color="success"
            onClick={() => {
              setSaving(true)
              topicService.createTopic({ name: name, description: desc }).then((res) => {
                setSaving(false)
                if (res.ok || (res.status !== 404 && res.status !== 400)) {
                  const toAdd = res
                  toast.success(`Tạo mới chủ đề thành công`, {
                    position: 'top-right',
                    autoClose: 2500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                  setVisible(false)
                  onSuccess(toAdd)
                } else {
                  toast.error(
                    `Không thể tạo được chủ đề này. Liên hệ web developer để biết thêm chi tiết`,
                    {
                      position: 'top-right',
                      autoClose: 2500,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    },
                  )
                }
              })
            }}
          >
            LƯU
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

AddModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  onSuccess: PropTypes.func,
}
const Topics = () => {
  const [topics, setTopics] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [searching, setSearching] = useState(false)
  const [redirect, setRedirectTo] = useState({ redirect: false, path: '' })
  //   const [lessonCounter, setLessonCounter] = useState(0)
  const [visibleModalDelete, setVisibleModalDelete] = useState(false)
  const [visibleModalAdd, setVisibleModalAdd] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [itemToDelete, setItemToDelete] = useState({})
  const addNewToTopics = (item) => {
    setTopics(topics.concat(item))
  }
  const refreshTopics = () => {
    topicService.getTopics().then((res) => {
      let result = res.results
      setTopics(res.results)
      if (!result.length)
        toast.success(`Hiện tại chưa có chủ đề nào nào được thêm`, {
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
    refreshTopics()
  }, [])
  const isDisabledSearch = searchKey.length === 0
  if (redirect.redirect) return <Redirect to={redirect.path} />
  else
    return (
      <>
        <CRow>
          <CCol xs="12" sm="6" lg="3">
            <CModal visible={visibleModalDelete} onDismiss={() => setVisibleModalDelete(false)}>
              <CModalHeader onDismiss={() => setVisibleModalDelete(false)}>
                <CModalTitle>XÁC NHẬN XOÁ CHỦ ĐỀ NÀY</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Bạn chắc chắn muốn xoá <CBadge color="success">{itemToDelete.name}</CBadge> ?
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisibleModalDelete(false)}>
                  HUỶ BỎ
                </CButton>
                {deleting && <CSpinner />}
                {!deleting && (
                  <CButton
                    color="danger"
                    onClick={() => {
                      setDeleting(true)
                      topicService.deleteTopic(itemToDelete.id).then((res) => {
                        setDeleting(false)
                        if (res.ok || (res.status !== 404 && res.status !== 400)) {
                          const toRemove = res
                          toast.success(`Xoá thành công`, {
                            position: 'top-right',
                            autoClose: 2500,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          })
                          setVisibleModalDelete(!visibleModalDelete)
                          let index = _.findIndex(topics, function (item) {
                            return item.id === toRemove.id
                          })
                          setTopics(topics.filter((_, i) => i !== index))
                        } else {
                          toast.error(
                            `Không thể xoá được chủ đề này. Liên hệ web developer để biết thêm chi tiết`,
                            {
                              position: 'top-right',
                              autoClose: 2500,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                            },
                          )
                        }
                      })
                    }}
                  >
                    XOÁ
                  </CButton>
                )}
              </CModalFooter>
            </CModal>
            <CInputGroup className="mb-3">
              <CFormControl
                type="text"
                placeholder="Tìm chủ đề theo tiêu đề ..."
                defaultValue={searchKey}
                onChange={(e) => {
                  setSearchKey(e.target.value)
                }}
                id="search-key"
              />
              <CButton
                type="button"
                color="secondary"
                disabled={isDisabledSearch}
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
                    topicService.getTopics({ name: searchKey }).then((res) => {
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
                      setTopics(result)
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
                  refreshTopics()
                  // remove search
                  document.getElementById('search-key').value = ''
                }}
                style={{ color: 'white' }}
              >
                ↻
              </CButton>
            </CInputGroup>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <AddModal
              visible={visibleModalAdd}
              setVisible={setVisibleModalAdd}
              onSuccess={addNewToTopics}
            />
            <CButton
              color="info"
              style={{ color: 'white' }}
              onClick={() => {
                setVisibleModalAdd(true)
              }}
            >
              Thêm chủ đề
            </CButton>
          </CCol>
        </CRow>
        {!searching && (
          <CRow>
            {topics &&
              topics.map((item) => (
                <CCol key={item.id} xs="12" sm="6" lg="3">
                  <CCard style={{ width: '18rem', marginBottom: '5px' }}>
                    <CCardHeader>
                      {item.name}
                      <CBadge
                        style={{ float: 'right', marginTop: '2px', cursor: 'pointer' }}
                        color="danger"
                        shape="rounded-pill"
                        onClick={() => {
                          setItemToDelete(item)
                          setVisibleModalDelete(!visibleModalDelete)
                        }}
                      >
                        XOÁ
                      </CBadge>
                      {/* <CBadge style={{ float: 'right' }}> </CBadge> */}
                      <CBadge
                        style={{
                          float: 'right',
                          marginRight: '5px',
                          marginTop: '2px',
                          cursor: 'pointer',
                        }}
                        color="success"
                        shape="rounded-pill"
                      >
                        SỬA
                      </CBadge>
                    </CCardHeader>
                    <CCardBody
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setRedirectTo({ redirect: true, path: `/topics/getTopic/${item.id}` })
                      }}
                    >
                      <CCardTitle>{item.description}</CCardTitle>
                      <CCardSubtitle className="mb-2 text-muted">
                        {/* <CBadge color="success">{item.free ? 'Free' : 'Trả phí'}</CBadge>{' '} */}
                        <CBadge color="primary">
                          {item['chapters'].length}{' '}
                          {pluralize(item['chapters'].length, 'chapter', 'chapters')}
                        </CBadge>{' '}
                        {/* <CBadge color="info">{item.cards.length} chữ</CBadge> */}
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

export default Topics
