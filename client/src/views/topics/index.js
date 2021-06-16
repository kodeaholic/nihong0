import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import _ from 'lodash'
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
} from '@coreui/react'
import { toast } from 'react-toastify'
import { topicService } from '../../services/api/topicService'
import { pluralize, sleep } from '../../helpers/common'
const Topics = () => {
  const [topics, setTopics] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [searching, setSearching] = useState(false)
  const [redirect, setRedirectTo] = useState({ redirect: false, path: '' })
  //   const [lessonCounter, setLessonCounter] = useState(0)
  const [visibleModalDelete, setVisibleModalDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [itemToDelete, setItemToDelete] = useState({})
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
                            `Không thể xoá được chủ đề này do. Liên hệ web developer để biết thêm chi tiết`,
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
