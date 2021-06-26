import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { DraggableArea } from 'react-draggable-tags'
import { getViewAction, getLastPartFromPathName } from 'src/services/helpers/routeHelper'
import deleteBtn from '../../../assets/images/delete.png'
import deleteBtn2x from '../../../assets/images/delete@2x.png'
import './style.css'
import {
  CForm,
  CFormCheck,
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
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CButtonGroup,
} from '@coreui/react'
import { Redirect } from 'react-router-dom'
import { listeningBoardService } from '../../../services/api/listeningBoardService'
import _ from 'lodash'
import { htmlEntityEncode, htmlEntityDecode } from '../../../helpers/htmlentities'
import renderHTML from 'react-render-html'
const Exercise = (props) => {
  const { quiz, onQuizItemChange, disabled } = props
  return (
    <>
      {quiz.map((item, index) => {
        return (
          <QuizItem
            data={item}
            id={index}
            key={index}
            parentQuiz={quiz}
            onChange={onQuizItemChange}
            disabled={disabled}
          />
        )
      })}
    </>
  )
}
Exercise.propTypes = {
  quiz: PropTypes.array,
  onQuizItemChange: PropTypes.func,
  disabled: PropTypes.bool,
}
const QuizItem = (props) => {
  let { data, id, parentQuiz, onChange, disabled } = props
  if (_.isEmpty(data)) data = { question: '', A: '', B: '', C: '', D: '', answer: 'A' }

  const handleInputChange = (e) => {
    let { id, name, value } = e.target
    let index = parseInt(id)
    if (parentQuiz[index]) {
      parentQuiz[index][name] = value
      onChange(parentQuiz)
    }
  }
  const handleDeleteClicked = (e) => {
    console.log(e.target)
    let { id } = e.target
    id = id.replace('delete_', '')
    let index = parseInt(id)
    if (parentQuiz[index]) {
      let arr = [...parentQuiz]
      arr.splice(index, 1)
      onChange(arr)
    }
  }

  return (
    <>
      <CRow>
        <CCol sm="12" style={{ marginTop: '10px' }}>
          <CInputGroup>
            <CInputGroupText id={`question-label-${id}`}>Câu {id + 1}</CInputGroupText>
            {!disabled && (
              <CFormControl
                name="question"
                id={`question-${id}`}
                aria-describedby="question-label"
                defaultValue={data.question}
                onChange={handleInputChange}
                disabled={disabled}
                type="text"
                component="textarea"
                rows="4"
                onFocus={(e) => {
                  const quizEditor = window.CKEDITOR.replace(`question-${id}`)
                  quizEditor.on('change', function (e) {
                    let index = parseInt(id)
                    let quizes = [...parentQuiz]
                    if (quizes[index]) {
                      quizes[index]['question'] = quizEditor.getData()
                      onChange(quizes)
                    }
                  })
                }}
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid grey',
                  borderRadius: '0 5px 5px 0',
                  backgroundColor: '#fff',
                }}
              >
                {renderHTML(data.question)}
              </div>
            )}
            {!disabled && (
              <CInputGroupText
                id={`delete_${id}`}
                onClick={handleDeleteClicked}
                style={{ cursor: 'pointer' }}
              >
                Gỡ bỏ
              </CInputGroupText>
            )}
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionA-label-${id}`}>A</CInputGroupText>
            {!disabled && (
              <CFormControl
                type="text"
                component="textarea"
                rows={2}
                name="A"
                id={`optionA-${id}`}
                aria-describedby="optionA-label"
                defaultValue={data.A}
                onChange={handleInputChange}
                disabled={disabled}
                onFocus={(e) => {
                  const quizEditor = window.CKEDITOR.replace(`optionA-${id}`)
                  quizEditor.on('change', function (e) {
                    let index = parseInt(id)
                    let quizes = [...parentQuiz]
                    if (quizes[index]) {
                      quizes[index]['A'] = quizEditor.getData()
                      onChange(quizes)
                    }
                  })
                }}
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid grey',
                  borderRadius: '0 5px 5px 0',
                  backgroundColor: '#fff',
                }}
              >
                {renderHTML(data.A)}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="6" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionB-label-${id}`}>B</CInputGroupText>
            {!disabled && (
              <CFormControl
                type="text"
                component="textarea"
                rows={2}
                name="B"
                id={`optionB-${id}`}
                aria-describedby="optionB-label"
                defaultValue={data.B}
                onChange={handleInputChange}
                disabled={disabled}
                onFocus={(e) => {
                  const quizEditor = window.CKEDITOR.replace(`optionB-${id}`)
                  quizEditor.on('change', function (e) {
                    let index = parseInt(id)
                    let quizes = [...parentQuiz]
                    if (quizes[index]) {
                      quizes[index]['B'] = quizEditor.getData()
                      onChange(quizes)
                    }
                  })
                }}
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid grey',
                  borderRadius: '0 5px 5px 0',
                  backgroundColor: '#fff',
                }}
              >
                {renderHTML(data.B)}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="6" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionC-label-${id}`}>C</CInputGroupText>
            {!disabled && (
              <CFormControl
                type="text"
                component="textarea"
                rows={2}
                name="C"
                id={`optionC-${id}`}
                aria-describedby="optionC-label"
                defaultValue={data.C}
                onChange={handleInputChange}
                disabled={disabled}
                onFocus={(e) => {
                  const quizEditor = window.CKEDITOR.replace(`optionC-${id}`)
                  quizEditor.on('change', function (e) {
                    let index = parseInt(id)
                    let quizes = [...parentQuiz]
                    if (quizes[index]) {
                      quizes[index]['C'] = quizEditor.getData()
                      onChange(quizes)
                    }
                  })
                }}
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid grey',
                  borderRadius: '0 5px 5px 0',
                  backgroundColor: '#fff',
                }}
              >
                {renderHTML(data.C)}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="6" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionD-label-${id}`}>D</CInputGroupText>
            {!disabled && (
              <CFormControl
                type="text"
                component="textarea"
                rows={2}
                name="D"
                id={`optionD-${id}`}
                aria-describedby="optionD-label"
                defaultValue={data.D}
                onChange={handleInputChange}
                disabled={disabled}
                onFocus={(e) => {
                  const quizEditor = window.CKEDITOR.replace(`optionD-${id}`)
                  quizEditor.on('change', function (e) {
                    let index = parseInt(id)
                    let quizes = [...parentQuiz]
                    if (quizes[index]) {
                      quizes[index]['D'] = quizEditor.getData()
                      onChange(quizes)
                    }
                  })
                }}
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid grey',
                  borderRadius: '0 5px 5px 0',
                  backgroundColor: '#fff',
                }}
              >
                {renderHTML(data.D)}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="4" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`answer-label-${id}`}>Đáp án đúng</CInputGroupText>
            <CFormSelect
              id={`answer-label-${id}`}
              aria-label="A"
              defaultValue={data.answer}
              name="answer"
              onChange={handleInputChange}
              disabled={disabled}
            >
              <option>Đáp án đúng</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </CFormSelect>
          </CInputGroup>
        </CCol>
      </CRow>
    </>
  )
}

QuizItem.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
  parentQuiz: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

const ListeningBoard = (props) => {
  const pathName = props.location.pathname
  const viewAction = getViewAction(pathName)
  const boardId = viewAction === 'add' ? undefined : getLastPartFromPathName(pathName)
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [free, setFree] = useState(1)
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [quiz, setQuiz] = useState([])
  const [audioSrc, setAudioSrc] = useState([])
  const [script, setScript] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const addQuiz = () => {
    const data = { question: '', A: '', B: '', C: '', D: '', answer: 'A' }
    setQuiz([...quiz, data])
  }
  const savingCallback = (res) => {
    setSaving(false)
    if (res && res.code !== 400 && res.code !== 403 && res.code !== 401) {
      toast.success(`Lưu thành công bài học`, {
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
        redirectedPath: `/listening-boards/getBoard/${res.id}`,
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
        toast.error(`Có lỗi xảy ra khi tạo bài học”`, {
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
  const isQuizValidated = () => {
    let valid = true
    quiz.forEach((item) => {
      if (!(item.question && item.A && item.B && item.C && item.D && item.answer)) valid = false
    })
    return valid
  }
  const handleSubmit = () => {
    if (isQuizValidated()) {
      setSaving(true)
      /**Handle quiz data */
      let quizes = [...quiz]
      let resultQuiz = quizes.map(function (item) {
        let newItem = { ...item }
        newItem.question = htmlEntityEncode(item.question)
        newItem.A = htmlEntityEncode(item.A)
        newItem.B = htmlEntityEncode(item.B)
        newItem.C = htmlEntityEncode(item.C)
        newItem.D = htmlEntityEncode(item.D)
        return newItem
      })
      const boardBody = {
        title,
        level,
        script: htmlEntityEncode(script),
        subtitle: htmlEntityEncode(subtitle),
        audioSrc,
        free,
        quiz: resultQuiz,
      }
      viewAction === 'add'
        ? listeningBoardService.createBoard(boardBody).then(savingCallback)
        : listeningBoardService.updateBoard(boardBody, boardId).then(savingCallback)
    } else {
      toast.error(`Vui lòng không để trống ô nào trong câu hỏi trắc nghiệm`, {
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
    if (boardId) {
      listeningBoardService.getBoard(boardId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404 || res.status === 400) {
            toast.error(`Bài học không tồn tại`, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            setRedirecTo({ isRedirected: true, redirectedPath: '/boards' })
          } else {
            setData(res)
            setFree(res.free)
            setTitle(res.title)
            setLevel(res.level)
            setScript(htmlEntityDecode(res.script))
            setSubtitle(htmlEntityDecode(res.subtitle))
            setAudioSrc(res.audioSrc)
            let initialQuiz = res.quiz
            let quizes = [...initialQuiz]
            let resultQuiz = quizes.map(function (item) {
              let newItem = { ...item }
              newItem.question = htmlEntityDecode(item.question)
              newItem.A = htmlEntityDecode(item.A)
              newItem.B = htmlEntityDecode(item.B)
              newItem.C = htmlEntityDecode(item.C)
              newItem.D = htmlEntityDecode(item.D)
              return newItem
            })
            setQuiz(resultQuiz)
          }
        }
      })
    }
  }, [boardId])

  if (redirectTo.isRedirected) {
    return <Redirect to={redirectTo.redirectedPath} />
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
                  placeholder="Ví dụ: Bài 01"
                  onChange={(e) => setTitle(e.target.value)}
                  defaultValue={title}
                  disabled={viewAction === 'get'}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="level" className="col-sm-2 col-form-label">
                Trình độ
              </CFormLabel>
              <CCol sm="10">
                <CFormSelect
                  sm="10"
                  id="level"
                  onChange={(e) => setLevel(e.target.value)}
                  defaultValue={level}
                  disabled={viewAction === 'get'}
                >
                  <option value="N5" selected={level === 'N5'}>
                    N5
                  </option>
                  <option value="N4" selected={level === 'N4'}>
                    N4
                  </option>
                  <option value="N3" selected={level === 'N3'}>
                    N3
                  </option>
                  <option value="N2" selected={level === 'N2'}>
                    N2
                  </option>
                  <option value="N1" selected={level === 'N1'}>
                    N1
                  </option>
                </CFormSelect>
              </CCol>

              {/* <CCol sm="10">
                <CFormControl
                  type="text"
                  id="level"
                  placeholder="N5"
                  onChange={(e) => setLevel(e.target.value)}
                  defaultValue={level}
                  disabled={viewAction === 'get'}
                />
              </CCol> */}
            </CRow>
            <fieldset className="row mb-3">
              <legend className="col-form-label col-sm-2 pt-0">Loại bài</legend>
              <CCol sm="10">
                <CFormCheck
                  id="free"
                  label="Miễn phí"
                  checked={free === 1}
                  onChange={() => setFree(1 - free)}
                  disabled={viewAction === 'get'}
                />
              </CCol>
            </fieldset>
            <CRow>
              <CCol xs="12" sm="2" lg="2" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="audioSrc">URL file audio</CFormLabel>
              </CCol>
              <CCol xs="12" sm="10" lg="10" style={{ marginBottom: '5px' }}>
                <CFormControl
                  type="text"
                  component="textarea"
                  id="audioSrc"
                  placeholder="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
                  onChange={(e) => setAudioSrc(e.target.value)}
                  rows={2}
                  defaultValue={audioSrc}
                  disabled={viewAction === 'get'}
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
            <CRow className="mb-3">
              <CFormLabel htmlFor="script" className="col-sm-2 col-form-label">
                Lời thoại tiếng Nhật
              </CFormLabel>
              <CCol sm="10">
                {viewAction !== 'get' && (
                  <CFormControl
                    type="text"
                    id="script"
                    placeholder="Phần II: Câu hỏi + Lời thoại tiếng Nhật"
                    component="textarea"
                    rows="5"
                    onChange={(e) => setScript(e.target.value)}
                    defaultValue={script}
                    disabled={viewAction === 'get'}
                    onFocus={(e) => {
                      const scriptEditor = window.CKEDITOR.replace('script')
                      scriptEditor.on('change', function (e) {
                        setScript(scriptEditor.getData())
                      })
                    }}
                  />
                )}
                {viewAction === 'get' && renderHTML(script)}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="subtitle" className="col-sm-2 col-form-label">
                Giải nghĩa lời thoại
              </CFormLabel>
              <CCol sm="10">
                {viewAction !== 'get' && (
                  <CFormControl
                    type="text"
                    id="subtitle"
                    placeholder="Phần II: Câu hỏi + Lời thoại tiếng Nhật"
                    component="textarea"
                    rows="5"
                    onChange={(e) => setSubtitle(e.target.value)}
                    defaultValue={subtitle}
                    disabled={viewAction === 'get'}
                    onFocus={(e) => {
                      const subtitleEditor = window.CKEDITOR.replace('subtitle')
                      subtitleEditor.on('change', function (e) {
                        setSubtitle(subtitleEditor.getData())
                      })
                    }}
                  />
                )}
                {viewAction === 'get' && renderHTML(subtitle)}
              </CCol>
            </CRow>
            <CRow>
              <CFormLabel className="col-sm-2 col-form-label">Câu hỏi phần I</CFormLabel>
              <CCol sm="10">
                <Exercise quiz={quiz} onQuizItemChange={setQuiz} disabled={viewAction === 'get'} />
              </CCol>
            </CRow>
            <CRow>
              {viewAction !== 'get' && (
                <>
                  <CCol className="col-sm-6" style={{ marginTop: '5px' }}>
                    <CButtonGroup>
                      <CButton
                        onClick={handleSubmit}
                        disabled={!title.length}
                        style={{ color: 'white', marginRight: '5px' }}
                      >
                        LƯU BÀI HỌC
                      </CButton>
                      <CButton onClick={addQuiz} color="success">
                        THÊM CÂU HỎI CHO PHẦN I
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
                          redirectedPath: `/listening-boards/editBoard/${boardId}`,
                        })
                      }}
                    >
                      SỬA BÀI NÀY
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
                    XOÁ BÀI NÀY
                  </CButton>
                  <CModal visible={visible} onDismiss={() => setVisible(false)}>
                    <CModalHeader onDismiss={() => setVisible(false)}>
                      <CModalTitle>XÁC NHẬN XOÁ BÀI NÀY</CModalTitle>
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
                            listeningBoardService.deleteBoard(boardId).then((res) => {
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
                              redirectedPath: '/listening-boards',
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
          </CForm>
        </CRow>
      </>
    )
}

ListeningBoard.propTypes = {}

export default ListeningBoard
