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
import { grammarService } from 'src/services/api/grammarService'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { htmlEntityEncode, htmlEntityDecode } from '../../../helpers/htmlentities'
import { getTestTypeName } from 'src/constants/test.constants'
import { LEVEL } from 'src/constants/level.constants'

const Exercise = (props) => {
  const { quiz, onQuizItemChange, disabled, testId } = props
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
            testId={testId}
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
  testId: PropTypes.string,
}
const QuizItem = (props) => {
  const [duplicated, setDuplicated] = useState('')
  let { data, id, parentQuiz, onChange, disabled, testId } = props
  if (_.isEmpty(data))
    data = {
      question: '',
      A: '',
      B: '',
      C: '',
      D: '',
      answer: 'A',
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
    <div className={`quiz-item-wrapper ${duplicated}`}>
      <CRow>
        <CCol sm="12" style={{ marginTop: '0px' }}>
          <CInputGroup>
            <CInputGroupText id={`question-label-${id}`}>Câu {id + 1}</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  width: '80%',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`question-${id}`, {
                    on: {
                      // instanceReady: function (evt) {
                      //   document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      // },
                      change: async function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        const data = editor.getData()
                        // check if exists in current test
                        quizes[index]['question'] = data
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="question"
                id={`question-${id}`}
                aria-describedby="question-label"
              >
                {parentQuiz[parseInt(id)]['question']
                  ? renderHTML(parentQuiz[parseInt(id)]['question'])
                  : ''}
              </div>
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                  width: '90%',
                  height: 'auto',
                }}
              >
                {parentQuiz[parseInt(id)]['question']
                  ? renderHTML(parentQuiz[parseInt(id)]['question'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
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
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionA-label-${id}`} style={{ width: '15%' }}>
              A
            </CInputGroupText>
            {!disabled && (
              <CFormControl
                type="text"
                name="A"
                id={`A-${id}`}
                aria-describedby="A-label"
                onChange={(e) => {
                  let index = parseInt(id)
                  let quizes = [...parentQuiz]
                  quizes[index]['A'] = e.target.value
                  onChange(quizes)
                }}
                defaultValue={parentQuiz[parseInt(id)]['A']}
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                  height: 'auto',
                  width: '85%',
                }}
              >
                {parentQuiz[parseInt(id)]['A'] ? renderHTML(parentQuiz[parseInt(id)]['A']) : ''}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionB-label-${id}`} style={{ width: '15%' }}>
              B
            </CInputGroupText>
            {!disabled && (
              <CFormControl
                type="text"
                name="B"
                id={`B-${id}`}
                aria-describedby="B-label"
                onChange={(e) => {
                  let index = parseInt(id)
                  let quizes = [...parentQuiz]
                  quizes[index]['B'] = e.target.value
                  onChange(quizes)
                }}
                defaultValue={parentQuiz[parseInt(id)]['B']}
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                  height: 'auto',
                  width: '85%',
                }}
              >
                {parentQuiz[parseInt(id)]['B'] ? renderHTML(parentQuiz[parseInt(id)]['B']) : ''}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionC-label-${id}`} style={{ width: '15%' }}>
              C
            </CInputGroupText>
            {!disabled && (
              <CFormControl
                type="text"
                name="C"
                id={`C-${id}`}
                aria-describedby="C-label"
                onChange={(e) => {
                  let index = parseInt(id)
                  let quizes = [...parentQuiz]
                  quizes[index]['C'] = e.target.value
                  onChange(quizes)
                }}
                defaultValue={parentQuiz[parseInt(id)]['C']}
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                  height: 'auto',
                  width: '85%',
                }}
              >
                {parentQuiz[parseInt(id)]['C'] ? renderHTML(parentQuiz[parseInt(id)]['C']) : ''}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionD-label-${id}`} style={{ width: '15%' }}>
              D
            </CInputGroupText>
            {!disabled && (
              <CFormControl
                type="text"
                name="D"
                id={`D-${id}`}
                aria-describedby="D-label"
                onChange={(e) => {
                  let index = parseInt(id)
                  let quizes = [...parentQuiz]
                  quizes[index]['D'] = e.target.value
                  onChange(quizes)
                }}
                defaultValue={parentQuiz[parseInt(id)]['D']}
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                  height: 'auto',
                  width: '85%',
                }}
              >
                {parentQuiz[parseInt(id)]['D'] ? renderHTML(parentQuiz[parseInt(id)]['D']) : ''}
              </div>
            )}
          </CInputGroup>
        </CCol>
        {/* <CCol sm="3" style={{ marginTop: '5px', marginBottom: '0px' }}>
          <CFormLabel htmlFor="answer">Đáp án</CFormLabel>
        </CCol> */}
        <CCol sm="3" style={{ marginTop: '5px', marginBottom: '0px' }}>
          <CInputGroup>
            <CInputGroupText>Đáp án</CInputGroupText>
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
  testId: PropTypes.string,
}

const Grammar = (props) => {
  const pathName = props.location.pathname
  const viewAction = getViewAction(pathName)
  const itemId = viewAction === 'add' ? undefined : getLastPartFromPathName(pathName)
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [level, setLevel] = useState(LEVEL.N5)
  const [free, setFree] = useState(1)
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [quiz, setQuiz] = useState([])
  const [content, setContent] = useState('')
  const [meaning, setMeaning] = useState('')
  const [usage, setUsage] = useState('')
  const [example, setExample] = useState('')
  const addQuiz = () => {
    const data = {
      question: '',
      A: '',
      B: '',
      C: '',
      D: '',
      answer: 'A',
    }
    setQuiz([...quiz, data])
  }
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
        redirectedPath: `/grammar/getGrammar/${res.id}`,
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
        toast.error(`Có lỗi xảy ra khi tạo bài`, {
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

  const transformQuizToSave = () => {
    const clone = quiz.map((item) => {
      let newItem = item
      newItem.question = htmlEntityEncode(newItem.question)
      return newItem
    })
    return clone
  }

  const handleSubmit = () => {
    if (title.length > 0) {
      setSaving(true)
      const quizToSave = transformQuizToSave()
      let data = {
        title,
        level,
        free,
        quiz: quizToSave,
        content: htmlEntityEncode(content),
        example: htmlEntityEncode(example),
        usage,
        meaning,
        name,
      }
      viewAction === 'add'
        ? grammarService.createItem(data).then(savingCallback)
        : grammarService.updateItem(data, itemId).then(savingCallback)
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
      grammarService.getItem(itemId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404 || res.status === 400) {
            toast.error(`Bài thi không tồn tại`, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            setRedirecTo({ isRedirected: true, redirectedPath: '/grammar' })
          } else {
            setFree(res.free)
            setName(res.name)
            setTitle(res.title)
            setLevel(res.level)
            setMeaning(res.meaning)
            setUsage(res.usage)
            setContent(htmlEntityDecode(res.content))
            setExample(htmlEntityDecode(res.example))
            let initialQuizes = res.quiz
            let clonedQuizes = [...initialQuizes]
            let resultQuizes = clonedQuizes.map(function (item) {
              let newItem = { ...item }
              newItem.question = htmlEntityDecode(newItem.question)
              return newItem
            })
            setQuiz(resultQuizes)
          }
        }
      })
    }
  }, [itemId])

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
            {/* <CRow className="mb-3">
              <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">
                Tên ngữ pháp <span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  type="text"
                  id="name"
                  required
                  placeholder="Ví dụ: 〜（か）と思うと・〜（か）と思ったら"
                  onChange={(e) => setName(e.target.value)}
                  defaultValue={name}
                  disabled={viewAction === 'get'}
                />
              </CCol>
            </CRow> */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="content" className="col-sm-2 col-form-label">
                Nội dung
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
            {/* <CRow className="mb-3">
              <CFormLabel htmlFor="meaning" className="col-sm-2 col-form-label">
                Ý nghĩa
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  type="text"
                  component="textarea"
                  rows="4"
                  id="meaning"
                  required
                  placeholder="Sự việc, hay một sự thay đổi đột ngột xảy ra sau một hành động, sự việc nào đó. Có thể dịch thuần là “Tôi vừa nghĩ là…"
                  onChange={(e) => setMeaning(e.target.value)}
                  defaultValue={meaning}
                  disabled={viewAction === 'get'}
                />
              </CCol>
            </CRow> */}
            {/* <CRow className="mb-3">
              <CFormLabel htmlFor="usage" className="col-sm-2 col-form-label">
                Cách dùng
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  type="text"
                  component="textarea"
                  rows="4"
                  id="usage"
                  required
                  placeholder="Không dùng cho hành vi của chính người nói. Vế phía sau mang nội dung bất ngờ. Không dùng để thể hiện nguyện vọng, ý chí của người nói"
                  onChange={(e) => setUsage(e.target.value)}
                  defaultValue={usage}
                  disabled={viewAction === 'get'}
                />
              </CCol>
            </CRow> */}
            {/* <CRow className="mb-3">
              <CFormLabel htmlFor="example" className="col-sm-2 col-form-label">
                Ví dụ
              </CFormLabel>
              <CCol sm="10">
                {viewAction !== 'get' && (
                  <div
                    id="example"
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
                      const editor = window.CKEDITOR.replace('example', {
                        on: {
                          // instanceReady: function (evt) {
                          //   document.getElementById(evt.editor.id + '_top').style.display = 'none'
                          // },
                          change: function (e) {
                            // xử lý data
                            let example = editor.getData()
                            setExample(example)
                          },
                        },
                      })
                    }}
                  >
                    {example ? renderHTML(example) : ''}
                  </div>
                )}
                {viewAction === 'get' && !_.isEmpty(example) && (
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
                    {example ? renderHTML(example) : ''}
                  </div>
                )}
              </CCol>
            </CRow> */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="level" className="col-sm-2 col-form-label">
                Trình độ
              </CFormLabel>
              <CCol sm="10">
                <CFormSelect
                  aria-label="Level"
                  onChange={(e) => {
                    setLevel(e.target.value)
                  }}
                  id="level"
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
            {/* <fieldset className="row mb-3">
              <legend className="col-form-label col-sm-2 pt-0">Phí</legend>
              <CCol sm="10">
                <CFormCheck
                  id="free"
                  label="Miễn phí"
                  checked={free === 1}
                  onChange={() => setFree(1 - free)}
                />
              </CCol>
            </fieldset> */}
            {/* <CRow>
              <CFormLabel className="col-sm-2 col-form-label">Câu hỏi</CFormLabel>
              <CCol sm="12">
                <Exercise
                  quiz={quiz}
                  onQuizItemChange={setQuiz}
                  disabled={viewAction === 'get'}
                  testId={itemId}
                />
              </CCol>
            </CRow> */}
            <CRow>
              {viewAction !== 'get' && (
                <>
                  <CCol className="col-sm-6" style={{ marginTop: '5px' }}>
                    <CButtonGroup>
                      <CButton
                        onClick={handleSubmit}
                        style={{ color: 'white', marginRight: '5px' }}
                      >
                        LƯU BÀI HỌC
                      </CButton>
                      {/* <CButton onClick={addQuiz} color="success">
                        THÊM CÂU HỎI TRẮC NGHIỆM
                      </CButton> */}
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
                          redirectedPath: `/grammar/editGrammar/${itemId}`,
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
                            grammarService.deleteItem(itemId).then((res) => {
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
                            setRedirecTo({ isRedirected: true, redirectedPath: '/grammar' })
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
            {viewAction === 'get' && (
              <CRow>
                <CCol className="col-sm-3">
                  <CButton
                    style={{ color: 'white', marginTop: '10px' }}
                    color="success"
                    onClick={() => {
                      setRedirecTo({
                        isRedirected: true,
                        redirectedPath: `/grammar/getGrammar/webview/${itemId}`,
                      })
                    }}
                  >
                    XEM UI MOBILE
                  </CButton>
                </CCol>
              </CRow>
            )}
          </CForm>
        </CRow>
      </>
    )
}

Grammar.propTypes = {}

export default Grammar
