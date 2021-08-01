import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
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
  CInputGroup,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { sleep } from '../../helpers/common'
import { dictionaryService } from 'src/services/api/dictionaryService'
import parse from 'html-react-parser'
import { htmlEntityEncode, htmlEntityDecode } from '../../helpers/htmlentities'
import renderHTML from 'react-render-html'
import { extractFuriganaFromHTMLString } from 'src/helpers/dom'
const AddModal = ({ visible, setVisible, refresh, setRefresh }) => {
  const [saving, setSaving] = useState(false)
  const [phrase, setPhrase] = useState('')
  const [meaning, setMeaning] = useState('')
  const [furigana, setFurigana] = useState('')
  const [example, setExample] = useState('')
  const [exampleMeaning, setExampleMeaning] = useState('')
  const [audioSrc, setAudioSrc] = useState('')
  const isDisabled = phrase.length > 0 ? false : true
  return (
    <CModal visible={visible} onDismiss={() => setVisible(false)}>
      <CModalHeader onDismiss={() => setVisible(false)}>
        <CModalTitle>THÊM MỚI</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="phrase">Từ/Cụm từ</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              id="phrase"
              placeholder="Từ cần thêm"
              onChange={(e) => setPhrase(e.target.value)}
            />
          </CCol>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="example">Cách đọc Hiragana (nếu có)</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            {true && (
              <div
                id="furigana"
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
                  const editor = window.CKEDITOR.replace('furigana', {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        // xử lý data
                        let content = editor.getData()
                        setFurigana(content)
                      },
                    },
                  })
                }}
              >
                {furigana ? renderHTML(furigana) : renderHTML('&nbsp;')}
              </div>
            )}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
            <CFormLabel htmlFor="meaning">Giải nghĩa</CFormLabel>
          </CCol>
          <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
            <CFormControl
              type="text"
              component="textarea"
              id="meaning"
              placeholder="họ hàng, bà con thân thuộc"
              onChange={(e) => setMeaning(e.target.value)}
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
              dictionaryService
                .createItem({
                  phrase,
                  meaning,
                  furigana: htmlEntityEncode(furigana),
                  example: htmlEntityEncode(example),
                  exampleMeaning,
                  audioSrc,
                  extractedFurigana: extractFuriganaFromHTMLString(furigana),
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
                    toast.success(`Tạo mới từ thành công`, {
                      position: 'top-right',
                      autoClose: 2500,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                    setPhrase('')
                    setMeaning('')
                    setExample('')
                    setExampleMeaning('')
                    setFurigana('')
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
                        `Không thể tạo từ này. Liên hệ web developer để biết thêm chi tiết`,
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

const EditModal = ({ visible, setVisible, refresh, setRefresh, item, setItem, loading }) => {
  const [saving, setSaving] = useState(false)
  const [furigana, setFurigana] = useState(htmlEntityDecode(item.furigana))
  const [meaning, setMeaning] = useState(item.meaning)
  const [phrase, setPhrase] = useState(item.phrase)
  const [example, setExample] = useState(htmlEntityDecode(item.example))
  const [exampleMeaning, setExampleMeaning] = useState(item.exampleMeaning)
  const [audioSrc, setAudioSrc] = useState(item.audioSrc)
  const isDisabled = phrase.length > 0 ? false : true
  const [edited, setEdited] = useState(false)
  const [toCheck, setToCheck] = useState(item) // check if some field edited
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
        <CModalTitle>SỬA</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-center">
        {!loading && (
          <>
            <CRow>
              <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="phrase">Từ/Cụm từ</CFormLabel>
              </CCol>
              <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
                <CFormControl
                  type="text"
                  id="phrase"
                  placeholder="Từ cần sửa"
                  onChange={(e) => {
                    setPhrase(e.target.value)
                    setToCheck({ ...toCheck, phrase: e.target.value })
                  }}
                  defaultValue={item.phrase}
                />
              </CCol>
              <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="vocab">
                  Cách đọc Hiragana (nếu có)<span style={{ color: 'red' }}></span>
                </CFormLabel>
              </CCol>
              <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
                {true && (
                  <div
                    id="furigana"
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
                      const editor = window.CKEDITOR.replace('furigana', {
                        on: {
                          instanceReady: function (evt) {
                            document.getElementById(evt.editor.id + '_top').style.display = 'none'
                          },
                          change: function (e) {
                            // xử lý data
                            let content = editor.getData()
                            setToCheck({ ...toCheck, furigana: content })
                            setFurigana(content)
                          },
                        },
                      })
                    }}
                  >
                    {furigana ? renderHTML(furigana) : renderHTML('&nbsp;')}
                  </div>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol xs="12" sm="3" lg="3" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="meaning">Giải nghĩa</CFormLabel>
              </CCol>
              <CCol xs="12" sm="9" lg="9" style={{ marginBottom: '5px' }}>
                <CFormControl
                  type="text"
                  component="textarea"
                  id="meaning"
                  placeholder="họ hàng, bà con thân thuộc"
                  onChange={(e) => {
                    setMeaning(e.target.value)
                    setToCheck({ ...toCheck, meaning: e.target.value })
                  }}
                  rows={3}
                  defaultValue={item.meaning}
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
                            setToCheck({ ...toCheck, example: content })
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
                  onChange={(e) => {
                    setToCheck({ ...toCheck, exampleMeaning: e.target.value })
                    setExampleMeaning(e.target.value)
                  }}
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
                  onChange={(e) => {
                    setAudioSrc(e.target.value)
                    setToCheck({ ...toCheck, audioSrc: e.target.value })
                  }}
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
              disabled={isDisabled || JSON.stringify(toCheck) === JSON.stringify(item)}
              color="success"
              onClick={() => {
                setSaving(true)
                dictionaryService
                  .updateItem(item.id, {
                    phrase,
                    meaning,
                    example: htmlEntityEncode(example),
                    exampleMeaning,
                    audioSrc,
                    furigana: htmlEntityEncode(furigana),
                    extractedFurigana: extractFuriganaFromHTMLString(furigana),
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
                      toast.success(`Lưu thành công`, {
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
                          `Không thể lưu được. Liên hệ web developer để biết thêm chi tiết`,
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
  vocabId: PropTypes.string,
}

const Dictionary = (props) => {
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
  const [dictionary, setDictionary] = useState([])
  const refreshList = () => {
    dictionaryService.getItems().then((res) => {
      if (res.status === 404) {
        toast.error(`Không có dữ liệu`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setRedirectTo({ redirect: true, path: '/' })
      }
      setDictionary(res['results'])
      if (!res['results'].length)
        toast.success(`Hiện tại chưa có từ nào được thêm`, {
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
                <CModalTitle>XÁC NHẬN XOÁ</CModalTitle>
              </CModalHeader>
              <CModalBody>{parse(htmlEntityDecode(itemToDelete.phrase))}</CModalBody>
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
                      dictionaryService.deleteItem(itemToDelete.id).then((res) => {
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
                            `Không thể xoá được. Liên hệ web developer để biết thêm chi tiết`,
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
          </CCol>
          <CCol xs="12" sm="12" lg="12" md="12">
            <AddModal
              visible={visibleModalAdd}
              setVisible={setVisibleModalAdd}
              onSuccess={setRefresh}
              refresh={refresh}
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
              />
            )}
          </CCol>
          <CCol xs="12">
            <CInputGroup className="mb-3">
              <CFormControl
                type="text"
                placeholder="Tìm từ ..."
                defaultValue={searchKey}
                onChange={(e) => {
                  setSearchKey(e.target.value)
                }}
                id="search-key"
              />
              <CButtonGroup>
                <CButton
                  type="button"
                  color="secondary"
                  disabled={isDisabledSearch}
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
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
                      dictionaryService.getItems({ phrase: searchKey }).then((res) => {
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
                        setDictionary(result)
                      })
                    }
                  }}
                >
                  Tìm
                </CButton>
                <CButton
                  type="button"
                  color="info"
                  style={{ color: 'white' }}
                  onClick={() => {
                    setVisibleModalAdd(true)
                  }}
                >
                  &#x2B; Thêm từ
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
              </CButtonGroup>
            </CInputGroup>
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
                <b>Từ/Cụm từ</b>
              </CCol>
              <CCol
                md="6"
                className="text-left"
                style={{ borderTop: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6' }}
              >
                <b>Ví dụ</b>
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
              {!_.isEmpty(dictionary) &&
                dictionary.map((item, index) => (
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
                          <audio preload="auto" type="audio/mpeg" id={`phrase-${item.id}`}>
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
                              const audioId = str.replace('play-', 'phrase-')
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
                      {item.furigana && (
                        <div style={{ fontSize: 15 }}>{parse(htmlEntityDecode(item.furigana))}</div>
                      )}
                      <div style={{ fontSize: 15 }}>{item.phrase}</div>
                      <div style={{ fontSize: 15 }}>{item.meaning}</div>
                    </CCol>
                    <CCol
                      md="6"
                      className="text-left"
                      style={{ borderBottom: '1px solid #dee2e6', fontSize: '15px' }}
                    >
                      {parse(
                        `<div style:"font-size: 15px;">${htmlEntityDecode(
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

export default Dictionary
