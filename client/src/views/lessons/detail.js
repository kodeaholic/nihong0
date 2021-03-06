import React, { useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  CCol,
  CRow,
  CFormControl,
  CButton,
  CSpinner,
  CBadge,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CFormLabel,
  CButtonGroup,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { sleep } from '../../helpers/common'
import RedirectButton from '../components/back-navigation'
import { lessonService } from 'src/services/api/lessonService'
import { vocabService } from 'src/services/api/vocabService'
import parse from 'html-react-parser'
import { htmlEntityEncode, htmlEntityDecode } from '../../helpers/htmlentities'
import './style.css'
import { DraggableArea } from 'react-draggable-tags'
import renderHTML from 'react-render-html'
const AddModal = ({ visible, setVisible, refresh, setRefresh, lessonId }) => {
  const [saving, setSaving] = useState(false)
  const [vocab, setVocab] = useState('')
  const [vocabMeaning, setVocabMeaning] = useState('')
  const [chinese] = useState('')
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
            {true && (
              <div
                id="vocab"
                style={{
                  border: '1px solid grey',
                  borderRadius: '5px 5px 5px 5px',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  width: '100%',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace('vocab', {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        // xử lý data
                        let content = editor.getData()
                        setVocab(content)
                      },
                    },
                  })
                }}
              >
                {vocab ? renderHTML(vocab) : renderHTML('&nbsp;')}
              </div>
            )}
          </CCol>
        </CRow>
        {/* <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="chinese">Cách đọc</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              id="chinese"
              placeholder="Ví dụ: 身内"
              onChange={(e) => setChinese(e.target.value)}
            />
          </CCol>
        </CRow> */}
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
            {true && (
              <div
                id="example"
                style={{
                  border: '1px solid grey',
                  borderRadius: '5px 5px 5px 5px',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  width: '100%',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace('example', {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        // xử lý data
                        let content = editor.getData()
                        setExample(content)
                      },
                    },
                  })
                }}
              >
                {example ? renderHTML(example) : renderHTML('&nbsp;')}
              </div>
            )}
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
        {!_.isEmpty(audioSrc) && (
          <CRow>
            <CCol xs="12" sm="12" lg="12" md="12">
              <audio controls style={{ width: '100%' }} preload="auto" type="audio/mpeg">
                <source src={audioSrc} />
                Your browser does not support the audio element.
              </audio>
            </CCol>
          </CRow>
        )}
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
              vocabService
                .createVocab({
                  vocab: htmlEntityEncode(vocab),
                  vocabMeaning,
                  chinese,
                  example: htmlEntityEncode(example),
                  exampleMeaning,
                  audioSrc,
                  lesson: lessonId,
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
                    setVocab('')
                    setVocabMeaning('')
                    setExample('')
                    setExampleMeaning('')
                    setAudioSrc('')
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
  lessonId,
  vocabId,
}) => {
  const [saving, setSaving] = useState(false)
  const [vocab, setVocab] = useState(htmlEntityDecode(item.vocab))
  const [vocabMeaning, setVocabMeaning] = useState(item.vocabMeaning)
  const [chinese] = useState(item.chinese)
  const [example, setExample] = useState(htmlEntityDecode(item.example))
  const [exampleMeaning, setExampleMeaning] = useState(item.exampleMeaning)
  const [audioSrc, setAudioSrc] = useState(item.audioSrc)
  const isDisabled = vocab.length > 0 ? false : true
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
        <CModalTitle>SỬA TỪ VỰNG</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-center">
        {!loading && (
          <>
            <CRow>
              <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="vocab">
                  Từ vựng <span style={{ color: 'red' }}>*</span>
                </CFormLabel>
              </CCol>
              <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
                {true && (
                  <div
                    id="vocab"
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#fff',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      cursor: 'text',
                      width: '100%',
                    }}
                    onClick={(e) => {
                      const editor = window.CKEDITOR.replace('vocab', {
                        on: {
                          instanceReady: function (evt) {
                            document.getElementById(evt.editor.id + '_top').style.display = 'none'
                          },
                          change: function (e) {
                            // xử lý data
                            let content = editor.getData()
                            setVocab(content)
                          },
                        },
                      })
                    }}
                  >
                    {vocab ? renderHTML(vocab) : renderHTML('&nbsp;')}
                  </div>
                )}
              </CCol>
            </CRow>
            {/* <CRow>
              <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="chinese">Cách đọc</CFormLabel>
              </CCol>
              <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
                <CFormControl
                  type="text"
                  id="chinese"
                  placeholder="Ví dụ: 身内"
                  onChange={(e) => setChinese(e.target.value)}
                  defaultValue={item.chinese}
                />
              </CCol>
            </CRow> */}
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
                  defaultValue={item.vocabMeaning}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="example">Ví dụ</CFormLabel>
              </CCol>
              <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
                {true && (
                  <div
                    id="example"
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#fff',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      cursor: 'text',
                      width: '100%',
                    }}
                    onClick={(e) => {
                      const editor = window.CKEDITOR.replace('example', {
                        on: {
                          instanceReady: function (evt) {
                            document.getElementById(evt.editor.id + '_top').style.display = 'none'
                          },
                          change: function (e) {
                            // xử lý data
                            let content = editor.getData()
                            setExample(content)
                          },
                        },
                      })
                    }}
                  >
                    {example ? renderHTML(example) : renderHTML('&nbsp;')}
                  </div>
                )}
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
                  defaultValue={item.exampleMeaning}
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
                  defaultValue={item.audioSrc}
                />
              </CCol>
            </CRow>
            {!_.isEmpty(audioSrc) && (
              <CRow>
                <CCol xs="12" sm="12" lg="12" md="12">
                  <audio controls style={{ width: '100%' }} preload="auto" type="audio/mpeg">
                    <source src={audioSrc} />
                    Your browser does not support the audio element.
                  </audio>
                </CCol>
              </CRow>
            )}
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
                vocabService
                  .updateVocab(item.id, {
                    vocab: htmlEntityEncode(vocab),
                    vocabMeaning,
                    chinese,
                    example: htmlEntityEncode(example),
                    exampleMeaning,
                    audioSrc,
                    lesson: lessonId,
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
                      toast.success(`Lưu từ vựng thành công`, {
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
                          `Không thể lưu được từ vựng này. Liên hệ web developer để biết thêm chi tiết`,
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

const ModalSort = ({ visible, setVisible, refresh, setRefresh, tags, setTags, lessonId }) => {
  const [saving, setSaving] = useState(false)
  return (
    <CModal visible={visible} onDismiss={() => setVisible(false)}>
      <CModalHeader onDismiss={() => setVisible(false)}>
        <CModalTitle>SẮP XẾP TỪ VỰNG</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CFormLabel className="col-sm-2 col-form-label"></CFormLabel>
          <CCol sm="3">
            <div className="list-tags">
              <DraggableArea
                isList
                tags={tags}
                render={({ tag, index }) => (
                  <div className="row-tag">
                    <span className="delete-tag">{index + 1}</span>
                    {parse(htmlEntityDecode(tag.content))}
                  </div>
                )}
                onChange={(tags) => {
                  setTags(tags)
                }}
              />
            </div>
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
            color="success"
            onClick={() => {
              setSaving(true)
              const orderedList = tags.map((item, index) => {
                return { id: item.id, orderInParent: index + 1 }
              })
              lessonService
                .sortVocab(lessonId, {
                  orderedList: orderedList,
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
                    toast.success(`Sắp xếp thành công`, {
                      position: 'top-right',
                      autoClose: 2500,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                    // setVisible(false)
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
                        `Không thể sắp xếp. Liên hệ web developer để biết thêm chi tiết`,
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
  vocabId: PropTypes.string,
}

ModalSort.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  onSuccess: PropTypes.func,
  refresh: PropTypes.number,
  setRefresh: PropTypes.func,
  tags: PropTypes.array,
  setTags: PropTypes.func,
  lessonId: PropTypes.string,
}
const LessonDetail = (props) => {
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
  const [visibleModalSort, setVisibleModalSort] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [itemToDelete, setItemToDelete] = useState({})
  const [itemToEdit, setItemToEdit] = useState({})
  const [loadingEditModal, setLoadingEditModal] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [chapter, setChapter] = useState({})
  const [topicName, setTopicName] = useState('')
  const [vocab, setVocab] = useState([])
  const [tags, setTags] = useState([])
  const refreshList = () => {
    lessonService.getLesson(lessonId).then((res) => {
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
      setChapter(res['chapter'])
      setLesson(res)
      setTopicName(res['chapter']['topic']['name'])
      setTopicId(res['chapter']['topic']['id'])
      setChapterId(res['chapter']['id'])
      setVocab(res['vocabs'])
      // console.log(res['vocabs'])
      const list = res['vocabs'].map((item) => {
        return { id: item.id, content: item.vocab }
      })
      setTags(list)
      if (!res['vocabs'].length)
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
  useEffect(() => {
    console.log('Tags: ', tags)
  }, [tags])
  const isDisabledSearch = searchKey.length === 0
  if (redirect.redirect) return <Redirect to={redirect.path} />
  else
    return (
      <>
        <CRow>
          <CCol xs="12" sm="12" lg="12" md="12">
            <CModal visible={visibleModalDelete} onDismiss={() => setVisibleModalDelete(false)}>
              <CModalHeader onDismiss={() => setVisibleModalDelete(false)}>
                <CModalTitle>XÁC NHẬN XOÁ TỪ VỰNG</CModalTitle>
              </CModalHeader>
              <CModalBody>{parse(htmlEntityDecode(itemToDelete.vocab))}</CModalBody>
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
                      vocabService.deleteVocab(itemToDelete.id).then((res) => {
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
                  {topicName} - {chapter.name} - Bài {lesson.name}
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
              <CButton
                color="success"
                style={{ color: 'white', marginBottom: '5px' }}
                onClick={() => {
                  setVisibleModalSort(true)
                }}
              >
                &#9650; &#9660; Sắp xếp lại từ vựng
              </CButton>
            </CButtonGroup>
          </CCol>
          {lesson && lesson.audioSrc && (
            <CCol xs="12" sm="12" lg="12" md="12">
              <audio controls style={{ width: '100%' }} preload="auto" type="audio/mpeg">
                <source src={lesson.audioSrc} />
                Your browser does not support the audio element.
              </audio>
            </CCol>
          )}
          <CCol xs="12" sm="6" lg="3">
            <AddModal
              visible={visibleModalAdd}
              setVisible={setVisibleModalAdd}
              onSuccess={setRefresh}
              refresh={refresh}
              lessonId={lessonId}
              setRefresh={setRefresh}
            />
            <ModalSort
              visible={visibleModalSort}
              setVisible={setVisibleModalSort}
              onSuccess={setRefresh}
              refresh={refresh}
              tags={tags}
              setRefresh={setRefresh}
              setTags={setTags}
              lessonId={lessonId}
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
                lessonId={lessonId}
                vocabId={itemToEdit.id}
              />
            )}
          </CCol>
        </CRow>
        {!searching && (
          <>
            <CRow>
              <CCol
                md="1"
                className="text-center"
                style={{ borderTop: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6' }}
              >
                <b>STT</b>
              </CCol>
              <CCol
                md="3"
                className="text-left"
                style={{ borderTop: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6' }}
              >
                <b>Từ vựng</b>
              </CCol>
              <CCol
                md="6"
                className="text-left"
                style={{ borderTop: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6' }}
              >
                <b>Giải nghĩa</b>
              </CCol>
              <CCol
                md="2"
                className="text-left"
                style={{ borderTop: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6' }}
              >
                <b>Quản lý</b>
              </CCol>
            </CRow>
            <>
              {vocab &&
                vocab.map((item, index) => (
                  <CRow key={item.id}>
                    <CCol
                      md="1"
                      className="text-center"
                      style={{ borderBottom: '1px solid #dee2e6' }}
                    >
                      #{index + 1}
                      <br />
                      {item.audioSrc && (
                        <>
                          <audio preload="auto" type="audio/mpeg" id={`vocab-${item.id}`}>
                            <source src={item.audioSrc} />
                            Your browser does not support the audio element.
                          </audio>
                          <img
                            alt="play"
                            src="assets/play.jpg"
                            height={20}
                            style={{ cursor: 'pointer' }}
                            id={`play-${item.id}`}
                            onClick={(e) => {
                              const str = e.target.id
                              const audioId = str.replace('play-', 'vocab-')
                              document.getElementById(audioId).play()
                            }}
                          />
                        </>
                      )}
                    </CCol>
                    <CCol
                      key={item.id}
                      md="3"
                      className="text-left"
                      style={{ borderBottom: '1px solid #dee2e6', fontSize: '30px' }}
                    >
                      {parse(htmlEntityDecode(item.vocab))}
                      {item.extractedVocab && (
                        <span style={{ fontSize: '12px' }}>Từ điển: {item.extractedVocab}</span>
                      )}
                      {item.extractedFurigana && (
                        <span style={{ fontSize: '12px' }}>[{item.extractedFurigana}]</span>
                      )}
                      <div style={{ fontSize: 15 }}>{item.vocabMeaning}</div>
                    </CCol>
                    <CCol
                      md="6"
                      className="text-left"
                      style={{ borderBottom: '1px solid #dee2e6', fontSize: '30px' }}
                    >
                      {parse(
                        `<div style:"font-size: 30px;">${htmlEntityDecode(
                          item.example,
                        )}</div><div style="font-size: 15px;">${item.exampleMeaning}</>`,
                      )}
                    </CCol>
                    <CCol
                      md="2"
                      className="text-left"
                      style={{ borderBottom: '1px solid #dee2e6' }}
                    >
                      <CBadge
                        style={{
                          marginTop: '5px',
                          cursor: 'pointer',
                          marginRight: '2px',
                        }}
                        color="danger"
                        shape="rounded-pill"
                        onClick={() => {
                          setItemToDelete(item)
                          setVisibleModalDelete(!visibleModalDelete)
                        }}
                      >
                        XOÁ
                      </CBadge>
                      <CBadge
                        style={{ marginTop: '5px', cursor: 'pointer' }}
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
                    </CCol>
                  </CRow>
                ))}
            </>
          </>
        )}
        {searching && <CSpinner />}
      </>
    )
}

export default LessonDetail
