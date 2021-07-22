import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { getViewAction, getLastPartFromPathName } from 'src/services/helpers/routeHelper'
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
import { readingBoardService } from 'src/services/api/readingBoardService'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { htmlEntityEncode, htmlEntityDecode } from '../../../helpers/htmlentities'
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
  if (_.isEmpty(data))
    data = {
      question: '',
      A: '',
      B: '',
      C: '',
      D: '',
      answer: 'A',
      question_vn: '',
      A_vn: '',
      B_vn: '',
      C_vn: '',
      D_vn: '',
    }

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
    <div className="quiz-item-wrapper">
      <CRow>
        <CCol sm="12" style={{ marginTop: '0px' }}>
          <CInputGroup>
            <CInputGroupText id={`question-label-${id}`}>Câu {id + 1}</CInputGroupText>
            <CFormControl
              name="question"
              id={`${id}`}
              aria-describedby="question-label"
              defaultValue={data.question}
              onChange={handleInputChange}
              disabled={disabled}
              type="text"
              component="textarea"
              rows="3"
            />
            {!disabled && (
              <CInputGroupText
                id={`delete_${id}`}
                onClick={handleDeleteClicked}
                className="quiz-delete-button"
              >
                Gỡ bỏ
              </CInputGroupText>
            )}
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="12" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <CInputGroup>
            <CInputGroupText id={`question-label-${id}`}>Câu {id + 1} (Dịch)</CInputGroupText>
            <CFormControl
              name="question_vn"
              id={`${id}`}
              aria-describedby="question_vn-label"
              defaultValue={data.question_vn}
              onChange={handleInputChange}
              disabled={disabled}
              type="text"
              component="textarea"
              rows="3"
            />
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionA-label-${id}`}>A</CInputGroupText>
            <CFormControl
              name="A"
              id={`${id}`}
              aria-describedby="optionA-label"
              defaultValue={data.A}
              onChange={handleInputChange}
              disabled={disabled}
              component="textarea"
              rows="2"
            />
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionB-label-${id}`}>B</CInputGroupText>
            <CFormControl
              name="B"
              id={`${id}`}
              aria-describedby="optionB-label"
              defaultValue={data.B}
              onChange={handleInputChange}
              disabled={disabled}
              component="textarea"
              rows="2"
            />
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionC-label-${id}`}>C</CInputGroupText>
            <CFormControl
              name="C"
              id={`${id}`}
              aria-describedby="optionC-label"
              defaultValue={data.C}
              onChange={handleInputChange}
              disabled={disabled}
              component="textarea"
              rows="2"
            />
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionD-label-${id}`}>D</CInputGroupText>
            <CFormControl
              name="D"
              id={`${id}`}
              aria-describedby="optionD-label"
              defaultValue={data.D}
              onChange={handleInputChange}
              disabled={disabled}
              component="textarea"
              rows="2"
            />
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionA-label-${id}`}>A (dịch)</CInputGroupText>
            <CFormControl
              name="A_vn"
              id={`${id}`}
              aria-describedby="optionA_vn-label"
              defaultValue={data.A_vn}
              onChange={handleInputChange}
              disabled={disabled}
              component="textarea"
              rows="2"
            />
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionB-label-${id}`}>B (dịch)</CInputGroupText>
            <CFormControl
              name="B_vn"
              id={`${id}`}
              aria-describedby="optionB_vn-label"
              defaultValue={data.B_vn}
              onChange={handleInputChange}
              disabled={disabled}
              component="textarea"
              rows="2"
            />
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionC-label-${id}`}>C (dịch)</CInputGroupText>
            <CFormControl
              name="C_vn"
              id={`${id}`}
              aria-describedby="optionC_vn-label"
              defaultValue={data.C_vn}
              onChange={handleInputChange}
              disabled={disabled}
              component="textarea"
              rows="2"
            />
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionD-label-${id}`}>D (dịch)</CInputGroupText>
            <CFormControl
              name="D_vn"
              id={`${id}`}
              aria-describedby="optionD_vn-label"
              defaultValue={data.D_vn}
              onChange={handleInputChange}
              disabled={disabled}
              component="textarea"
              rows="2"
            />
          </CInputGroup>
        </CCol>
        <CCol sm="1" style={{ marginTop: '5px', marginBottom: '0px' }}>
          <CFormLabel htmlFor="answer">Đáp án</CFormLabel>
        </CCol>
        <CCol sm="2" style={{ marginTop: '5px', marginBottom: '0px' }}>
          <CInputGroup>
            <CFormSelect
              id={`${id}`}
              aria-label="answer"
              defaultValue={data.answer}
              name="answer"
              onChange={handleInputChange}
              disabled={disabled}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </CFormSelect>
          </CInputGroup>
        </CCol>
      </CRow>
    </div>
  )
}

QuizItem.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
  parentQuiz: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

const ReadingBoard = (props) => {
  const pathName = props.location.pathname
  const viewAction = getViewAction(pathName)
  const boardId = viewAction === 'add' ? undefined : getLastPartFromPathName(pathName)
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [free, setFree] = useState(1)
  const [content, setContent] = useState('')
  const [contentVn, setContentVn] = useState('')
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [quiz, setQuiz] = useState([])
  const addQuiz = () => {
    const data = { question: '', A: '', B: '', C: '', D: '', answer: 'A' }
    setQuiz([...quiz, data])
  }
  const savingCallback = (res) => {
    setSaving(false)
    if (res && res.code !== 400 && res.code !== 403 && res.code !== 401 && res.code !== 500) {
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
        redirectedPath: `/reading-boards/getBoard/${res.id}`,
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
      if (
        !(
          item.question &&
          item.A &&
          item.B &&
          item.C &&
          item.D &&
          item.answer &&
          item.question_vn &&
          item.A_vn &&
          item.B_vn &&
          item.C_vn &&
          item.D_vn
        )
      )
        valid = false
    })
    return valid
  }
  const handleSubmit = () => {
    if (isQuizValidated()) {
      setSaving(true)
      const boardBody = {
        title,
        level,
        free,
        quiz,
        content: htmlEntityEncode(content),
        content_vn: htmlEntityEncode(contentVn),
      }
      viewAction === 'add'
        ? readingBoardService.createBoard(boardBody).then(savingCallback)
        : readingBoardService.updateBoard(boardBody, boardId).then(savingCallback)
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
      readingBoardService.getBoard(boardId).then((res) => {
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
            setRedirecTo({ isRedirected: true, redirectedPath: '/reading-boards' })
          } else {
            setFree(res.free)
            setTitle(res.title)
            setLevel(res.level)
            setContent(res.content ? htmlEntityDecode(res.content) : '')
            setContentVn(res.content_vn ? htmlEntityDecode(res.content_vn) : '')
            setQuiz(res.quiz)
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
                  placeholder="Ví dụ: Bài 01 - N5"
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
                  aria-label="Level"
                  onChange={(e) => {
                    setLevel(e.target.value)
                    console.log(e.target.value)
                  }}
                  id="searchByLevel"
                  disabled={viewAction === 'get'}
                  value={level}
                >
                  <option value="N1">N1</option>
                  <option value="N2">N2</option>
                  <option value="N3">N3</option>
                  <option value="N4">N4</option>
                  <option value="N5">N5</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <fieldset className="row mb-3">
              <legend className="col-form-label col-sm-2 pt-0">Loại bài</legend>
              <CCol sm="10">
                <CFormCheck
                  id="free"
                  label="Miễn phí"
                  checked={free === 1}
                  onChange={() => setFree(1 - free)}
                />
              </CCol>
            </fieldset>
            <CRow className="mb-3">
              <CFormLabel htmlFor="content" className="col-sm-2 col-form-label">
                Bài đọc
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
                    }}
                    onClick={(e) => {
                      const contentEditor = window.CKEDITOR.replace('content')
                      contentEditor.on('change', function (e) {
                        setContent(contentEditor.getData())
                      })
                    }}
                  >
                    {renderHTML(content)}
                  </div>
                )}
                {viewAction === 'get' && (
                  <div
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#D8DBE0',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      marginTop: '7px',
                    }}
                  >
                    {renderHTML(content)}
                  </div>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="contentVn" className="col-sm-2 col-form-label">
                Bài đọc dịch nghĩa
              </CFormLabel>
              <CCol sm="10">
                {viewAction !== 'get' && (
                  <div
                    id="contentVn"
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#fff',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      marginTop: '7px',
                      cursor: 'text',
                    }}
                    onClick={(e) => {
                      const contentVnEditor = window.CKEDITOR.replace('contentVn')
                      contentVnEditor.on('change', function (e) {
                        setContentVn(contentVnEditor.getData())
                      })
                    }}
                  >
                    {renderHTML(contentVn)}
                  </div>
                )}
                {viewAction === 'get' && (
                  <div
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#D8DBE0',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      marginTop: '7px',
                    }}
                  >
                    {renderHTML(contentVn)}
                  </div>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CFormLabel className="col-sm-2 col-form-label">Bài tập củng cố</CFormLabel>
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
                        THÊM CÂU HỎI TRẮC NGHIỆM
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
                          redirectedPath: `/reading-boards/editBoard/${boardId}`,
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
                      <CModalTitle>XÁC NHẬN XOÁ THẺ NÀY</CModalTitle>
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
                            readingBoardService.deleteBoard(boardId).then((res) => {
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
                            setRedirecTo({ isRedirected: true, redirectedPath: '/reading-boards' })
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

ReadingBoard.propTypes = {}

export default ReadingBoard
