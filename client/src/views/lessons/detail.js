import React, { useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
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
  CCardSubtitle,
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
import { sleep } from '../../helpers/common'
import RedirectButton from '../components/back-navigation'
const AddModal = ({ visible, setVisible, refresh, setRefresh, lessonId }) => {
  const [saving, setSaving] = useState(false)
  const [vocab, setVocab] = useState('')
  const [vocabMeaning, setVocabMeaning] = useState('')
  const [chinese, setChinese] = useState('')
  const [example, setExample] = useState('')
  const [exampleMeaning, setExampleMeaning] = useState('')
  const [audioSrc, setAudioSrc] = useState('')
  const isDisabled = vocab.length > 0 ? false : true
  return (
    <CModal visible={visible} onDismiss={() => setVisible(false)}>
      <CModalHeader onDismiss={() => setVisible(false)}>
        <CModalTitle>THÊM MỚI TỪ VỰNG</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="vocab">
              Từ vựng <span style={{ color: 'red' }}>*</span>
            </CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              id="vocab"
              placeholder="Ví dụ: みうち"
              onChange={(e) => setVocab(e.target.value)}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="chinese">Hán tự</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              id="chinese"
              placeholder="Ví dụ: 身内"
              onChange={(e) => setChinese(e.target.value)}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="vocabMeaning">Giải nghĩa</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              component="textarea"
              id="vocabMeaning"
              placeholder="họ hàng, bà con thân thuộc"
              onChange={(e) => setVocabMeaning(e.target.value)}
              rows={3}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="example">Ví dụ</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              component="textarea"
              id="example"
              placeholder="身内に医者がいると、何かと安心だ。"
              onChange={(e) => setExample(e.target.value)}
              rows={3}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="exampleMeaning">Giải nghĩa ví dụ</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              component="textarea"
              id="exampleMeaning"
              placeholder="Nếu trong họ hàng có một bác sĩ, gì thì gì cũng sẽ yên tâm hơn."
              onChange={(e) => setExampleMeaning(e.target.value)}
              rows={3}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="audioSrc">URL file audio</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              component="textarea"
              id="audioSrc"
              placeholder="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
              onChange={(e) => setAudioSrc(e.target.value)}
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
              topicService
                .createVocab(lessonId, {
                  vocab,
                  vocabMeaning,
                  chinese,
                  example,
                  exampleMeaning,
                  audioSrc,
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
                    toast.success(`Tạo mới từ vựng thành công`, {
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
                        `Không thể tạo từ vựng này. Liên hệ web developer để biết thêm chi tiết`,
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
  chapterId,
  lessonId,
}) => {
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(item.title)
  const [desc, setDesc] = useState(item.description)
  const [meaning, setMeaning] = useState(item.meaning)
  const [audioSrc, setAudioSrc] = useState(item.audioSrc)
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
                  placeholder="Ví dụ: Gia đình"
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
                <CFormLabel htmlFor="meaning">Tiêu đề trong tiếng Nhật</CFormLabel>
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
            <CRow>
              <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="audioSrc">URL file audio</CFormLabel>
              </CCol>
              <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
                <CFormControl
                  type="text"
                  component="textarea"
                  id="audioSrc"
                  placeholder="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
                  onChange={(e) => setAudioSrc(e.target.value)}
                  rows={3}
                  defaultValue={audioSrc}
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
                topicService
                  .updateLesson(chapterId, lessonId, {
                    title: name,
                    description: desc,
                    meaning: meaning,
                    audioSrc: audioSrc,
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
                      toast.success(`Lưu bài học thành công`, {
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
                          `Không thể lưu được bài học này. Liên hệ web developer để biết thêm chi tiết`,
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
  lessonId: PropTypes.string,
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
  chapterId: PropTypes.string,
  lessonId: PropTypes.string,
}
const ChapterDetails = (props) => {
  const { lessonId } = useParams()
  const [topicId, setTopicId] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [lesson, setLesson] = useState({})
  const [searchKey, setSearchKey] = useState('')
  const [searching, setSearching] = useState(false)
  const [redirect, setRedirectTo] = useState({ redirect: false, path: '' })
  const [visibleModalDelete, setVisibleModalDelete] = useState(false)
  const [visibleModalAdd, setVisibleModalAdd] = useState(false)
  const [visibleModalEdit, setVisibleModalEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [itemToDelete, setItemToDelete] = useState({})
  const [itemToEdit, setItemToEdit] = useState({})
  const [loadingEditModal, setLoadingEditModal] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [chapter, setChapter] = useState({})
  const [topicName, setTopicName] = useState('')
  const [vocab, setVocab] = useState([])
  const refreshList = () => {
    topicService.getVocab(lessonId).then((res) => {
      if (res.status === 404) {
        toast.error(`Chapter không tồn tại hoặc đã bị xoá`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setRedirectTo({ redirect: true, path: '/topics/topicDetail/' + topicId })
      }
      setChapter(res['chapters'][0])
      setLesson(res['chapters'][0]['lessons'][0])
      setTopicName(res['name'])
      setTopicId(res['id'])
      setChapterId(res['chapters'][0]._id)
      setVocab(res['chapters'][0]['lessons'][0].vocab)
      if (!res['chapters'][0]['lessons'][0].vocab.length)
        toast.success(`Hiện tại chưa có từ vựng nào được thêm`, {
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
    refreshList()
  }, [refresh])
  const isDisabledSearch = searchKey.length === 0
  if (redirect.redirect) return <Redirect to={redirect.path} />
  else
    return (
      <>
        <CRow>
          <CCol xs="12" sm="12" lg="12" md="12">
            <CModal visible={visibleModalDelete} onDismiss={() => setVisibleModalDelete(false)}>
              <CModalHeader onDismiss={() => setVisibleModalDelete(false)}>
                <CModalTitle>XÁC NHẬN XOÁ TỪ VỰNG NÀY</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Bạn chắc chắn muốn xoá từ vựng <CBadge color="success">{itemToDelete.title}</CBadge>{' '}
                ?
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
                      topicService.deleteVocab(lessonId, itemToDelete._id).then((res) => {
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
                            `Không thể xoá được từ vựng này. Liên hệ web developer để biết thêm chi tiết`,
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
                  refreshList()
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
                path={`/topics/${topicId}/chapterDetail/${chapterId}/lessons`}
                styles={{ color: 'white', marginBottom: '5px' }}
              />
              {lesson && chapter && (
                <CButton disabled color="primary" style={{ color: 'white', marginBottom: '5px' }}>
                  {topicName} - {chapter.name} - Bài {lesson.title}
                </CButton>
              )}
              <CButton
                color="info"
                style={{ color: 'white', marginBottom: '5px' }}
                onClick={() => {
                  setVisibleModalAdd(true)
                }}
              >
                &#x2B; Thêm từ vựng
              </CButton>
            </CButtonGroup>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <AddModal
              visible={visibleModalAdd}
              setVisible={setVisibleModalAdd}
              onSuccess={setRefresh}
              refresh={refresh}
              lessonId={lessonId}
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
                chapterId={chapterId}
                lessonId={itemToEdit._id}
              />
            )}
          </CCol>
        </CRow>
        {!searching && (
          <CRow>
            {vocab &&
              vocab.map((item, index) => (
                <CCol key={item._id} xs="12" sm="6" lg="3">
                  <CCard style={{ width: 'auto', marginBottom: '5px' }}>
                    <CCardHeader>
                      Từ vựng {index + 1}: {item.vocab}
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
                        // setRedirectTo({
                        //   redirect: true,
                        //   path: `/topics/${topicId}/chapterDetail/${item._id}`,
                        // })
                      }}
                    >
                      <CCardTitle>
                        {item.vocab}
                        <span> / </span>
                        {item.chinese}
                      </CCardTitle>
                      <CCardTitle>{item.vocabMeaning}</CCardTitle>
                      <CCardSubtitle className="mb-2 text-muted">
                        {/* <CBadge color="success">{item.free ? 'Free' : 'Trả phí'}</CBadge>{' '} */}
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

export default ChapterDetails
