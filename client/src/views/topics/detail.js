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
  CButton,
  CSpinner,
  CCardTitle,
  CBadge,
  CCardHeader,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CFormLabel,
  CButtonGroup,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { topicService } from '../../services/api/topicService'
import { chapterService } from '../../services/api/chapterService'
import { sleep } from '../../helpers/common'
import { getLastPartFromPathName } from 'src/services/helpers/routeHelper'
import RedirectButton from '../components/back-navigation'
const AddModal = ({ visible, setVisible, refresh, setRefresh, topicId }) => {
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [meaning, setMeaning] = useState('')
  const isDisabled = name.length > 0 ? false : true
  return (
    <CModal visible={visible} onDismiss={() => setVisible(false)}>
      <CModalHeader onDismiss={() => setVisible(false)}>
        <CModalTitle>THÊM MỚI CHAPTER</CModalTitle>
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
              placeholder="Ví dụ: Chapter 01"
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
              placeholder="Mối quan hệ giữa người với người"
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="description">Mô tả (JP)</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              component="textarea"
              id="meaning"
              required
              placeholder="人と人との関係"
              onChange={(e) => setMeaning(e.target.value)}
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
              chapterService
                .createChapter({ name: name, description: desc, meaning: meaning, topic: topicId })
                .then((res) => {
                  setSaving(false)
                  if (
                    res.ok ||
                    (res.status !== 404 &&
                      res.status !== 400 &&
                      res.code !== 500 &&
                      res.code !== 400)
                  ) {
                    toast.success(`Tạo mới chapter thành công`, {
                      position: 'top-right',
                      autoClose: 2500,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                    setVisible(false)
                    setRefresh(refresh + 1)
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
                      toast.error(
                        `Không thể tạo được chapter này. Liên hệ web developer để biết thêm chi tiết`,
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

const EditModal = ({
  visible,
  setVisible,
  refresh,
  setRefresh,
  item,
  setItem,
  loading,
  topicId,
}) => {
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(item.name)
  const [desc, setDesc] = useState(item.description)
  const [meaning, setMeaning] = useState(item.meaning)
  const isDisabled = name.length > 0 ? false : true
  return (
    <CModal
      visible={visible}
      onDismiss={() => {
        setVisible(false)
        setItem({})
      }}
    >
      <CModalHeader
        onDismiss={() => {
          setVisible(false)
          setItem({})
        }}
      >
        <CModalTitle>SỬA CHAPTER</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-center">
        {!loading && (
          <>
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
                  defaultValue={name}
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
                  placeholder="Mô tả ngắn gọn"
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  defaultValue={desc}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="description">Mô tả (JP)</CFormLabel>
              </CCol>
              <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
                <CFormControl
                  type="text"
                  component="textarea"
                  id="meaning"
                  placeholder="Mô tả ngắn gọn bằng tiếng Nhật"
                  onChange={(e) => setMeaning(e.target.value)}
                  rows={3}
                  defaultValue={meaning}
                />
              </CCol>
            </CRow>
          </>
        )}
        {loading && <CSpinner />}
      </CModalBody>
      {!loading && (
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisible(false)
              setItem({})
            }}
          >
            HUỶ BỎ
          </CButton>
          {saving && <CSpinner />}
          {!saving && (
            <CButton
              disabled={isDisabled}
              color="success"
              onClick={() => {
                setSaving(true)
                chapterService
                  .updateChapter(item.id, {
                    name: name,
                    description: desc,
                    meaning: meaning,
                    topic: topicId,
                  })
                  .then((res) => {
                    setSaving(false)
                    if (
                      res.ok ||
                      (res.status !== 404 &&
                        res.status !== 400 &&
                        res.code !== 500 &&
                        res.code !== 400)
                    ) {
                      toast.success(`Lưu chapter thành công`, {
                        position: 'top-right',
                        autoClose: 2500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                      setVisible(false)
                      setItem({})
                      setRefresh(refresh + 1)
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
                        toast.error(
                          `Không thể lưu được chapter này. Liên hệ web developer để biết thêm chi tiết`,
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
      )}
    </CModal>
  )
}

AddModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  onSuccess: PropTypes.func,
  refresh: PropTypes.number,
  setRefresh: PropTypes.func,
  topicId: PropTypes.string,
}
EditModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  onSuccess: PropTypes.func,
  item: PropTypes.object,
  setItem: PropTypes.func,
  loading: PropTypes.bool,
  topicId: PropTypes.string,
  refresh: PropTypes.number,
  setRefresh: PropTypes.func,
}
const TopicDetails = (props) => {
  const pathName = props.location.pathname
  const topicId = getLastPartFromPathName(pathName)
  const [chapters, setChapters] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [searching, setSearching] = useState(false)
  const [redirect, setRedirectTo] = useState({ redirect: false, path: '' })
  //   const [lessonCounter, setLessonCounter] = useState(0)
  const [visibleModalDelete, setVisibleModalDelete] = useState(false)
  const [visibleModalAdd, setVisibleModalAdd] = useState(false)
  const [visibleModalEdit, setVisibleModalEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [itemToDelete, setItemToDelete] = useState({})
  const [itemToEdit, setItemToEdit] = useState({})
  const [loadingEditModal, setLoadingEditModal] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [topic, setTopic] = useState({})
  const refreshChapters = () => {
    topicService.getTopic(topicId).then((res) => {
      if (res.status === 404) {
        toast.error(`Chủ đề không tồn tại hoặc đã bị xoá`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setRedirectTo({ redirect: true, path: '/topics' })
      }
      setTopic(res)
      setChapters(res['chapters'])
      if (res['chapters'] && !res['chapters'].length)
        toast.success(`Hiện tại chưa có chapter nào nào được thêm`, {
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
    refreshChapters()
  }, [refresh])
  const isDisabledSearch = searchKey.length === 0
  if (redirect.redirect) return <Redirect to={redirect.path} />
  else
    return (
      <>
        <CRow>
          <CCol xs="12" sm="12" lg="6" md="8">
            <CModal visible={visibleModalDelete} onDismiss={() => setVisibleModalDelete(false)}>
              <CModalHeader onDismiss={() => setVisibleModalDelete(false)}>
                <CModalTitle>XÁC NHẬN XOÁ CHAPTER NÀY</CModalTitle>
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
                      chapterService.deleteChapter(itemToDelete.id).then((res) => {
                        setDeleting(false)
                        if (res.ok || (res.status !== 404 && res.status !== 400)) {
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
                          setRefresh(refresh + 1)
                        } else {
                          toast.error(
                            `Không thể xoá được chapter này. Liên hệ web developer để biết thêm chi tiết`,
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
                        setItemToDelete({})
                      })
                    }}
                  >
                    XOÁ
                  </CButton>
                )}
              </CModalFooter>
            </CModal>
            {/* <CInputGroup className="mb-3">
              <CFormControl
                type="text"
                placeholder="Tìm chapter theo tiêu đề ..."
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
                      setChapters(result)
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
                  refreshChapters()
                  // remove search
                  document.getElementById('search-key').value = ''
                }}
                style={{ color: 'white' }}
              >
                ↻
              </CButton>
            </CInputGroup> */}
            <CButtonGroup>
              <RedirectButton
                buttonColor="secondary"
                path="/topics"
                styles={{ color: 'white', marginBottom: '5px' }}
              />
              {topic && (
                <CButton disabled color="primary" style={{ color: 'white', marginBottom: '5px' }}>
                  {topic.name}
                </CButton>
              )}
              <CButton
                color="info"
                style={{ color: 'white', marginBottom: '5px' }}
                onClick={() => {
                  setVisibleModalAdd(true)
                }}
              >
                &#x2B; Thêm chapter
              </CButton>
            </CButtonGroup>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <AddModal
              visible={visibleModalAdd}
              setVisible={setVisibleModalAdd}
              onSuccess={setRefresh}
              refresh={refresh}
              topicId={topicId}
              setRefresh={setRefresh}
            />
            {!_.isEmpty(itemToEdit) && (
              <EditModal
                visible={visibleModalEdit}
                setVisible={setVisibleModalEdit}
                setItem={setItemToEdit}
                item={itemToEdit}
                loading={loadingEditModal}
                refresh={refresh}
                setRefresh={setRefresh}
                topicId={topicId}
              />
            )}
          </CCol>
        </CRow>
        {!searching && (
          <CRow>
            {chapters &&
              chapters.map((item) => (
                <CCol key={item.id} xs="12" sm="6" md="4" lg="3">
                  <CCard style={{ width: 'auto', marginBottom: '5px' }}>
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
                        onClick={() => {
                          setItemToEdit(item)
                          setLoadingEditModal(true)
                          setVisibleModalEdit(true)
                          sleep(200).then(() => {
                            setLoadingEditModal(false)
                          })
                        }}
                      >
                        SỬA
                      </CBadge>
                    </CCardHeader>
                    <CCardBody
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setRedirectTo({
                          redirect: true,
                          path: `/topics/${topicId}/chapterDetail/${item.id}/lessons`,
                        })
                      }}
                    >
                      <CCardTitle>
                        {item.description}
                        <span> / </span>
                        {item.meaning}
                      </CCardTitle>
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

export default TopicDetails
