/* eslint-disable default-case */
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
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import Button from '@material-ui/core/Button'
import { Redirect } from 'react-router-dom'
import { trialTestService } from 'src/services/api/trialTestService'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { htmlEntityEncode, htmlEntityDecode } from '../../../helpers/htmlentities'
import { TEST_PART } from 'src/constants/test.constants'
import { LEVEL } from 'src/constants/level.constants'
import { v4 as uuidv4 } from 'uuid'
import { StepButton } from '@material-ui/core'
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

function getSteps() {
  return [
    'P1. Từ vựng - Chữ Hán (文字・語彙)',
    'P1. Ngữ pháp (文法)',
    'P1. Đọc hiểu (読解)',
    'P2. Nghe hiểu (聴解)',
  ]
}

const Exercise = (props) => {
  const { quiz, onQuizItemChange, disabled, testId, group } = props
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
            group={group}
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
  activeStep: PropTypes.number,
  group: PropTypes.object,
}
const QuizItem = (props) => {
  const [duplicated, setDuplicated] = useState('')
  let { data, id, parentQuiz, onChange, disabled, testId, group } = props
  if (_.isEmpty(data))
    data = {
      question: '',
      A: '',
      B: '',
      C: '',
      D: '',
      answer: 'A',
      part: group.part,
      point: 0,
      group: group.uuid,
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

  const getNo = (data, group, quiz) => {
    const filtered = quiz.filter((item) => {
      return item.group === group.uuid
    })
    if (filtered.length) {
      const index = _.findIndex(filtered, (item) => item._id === data._id)
      if (index < 0) return filtered.length
      else return index + 1
    } else {
      return 1
    }
  }

  if (data.group !== group.uuid) return <></>
  else
    return (
      <div className={`quiz-item-wrapper ${duplicated}`}>
        <CRow>
          <CCol sm="12" style={{ marginTop: '0px' }}>
            <CInputGroup>
              <CInputGroupText id={`question-label-${id}`}>
                Câu {getNo(data, group, parentQuiz)}
              </CInputGroupText>
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
                          if (!_.isEmpty(data)) {
                            let found = _.findIndex(quizes, function (quiz) {
                              return quiz.question === data
                            })
                            if (found >= 0) {
                              if (found === index) {
                                quizes[index]['question'] = data
                                onChange(quizes)
                                setDuplicated('')
                              } else {
                                toast.error(`Câu bị trùng`, {
                                  position: 'top-right',
                                  autoClose: 5000,
                                  hideProgressBar: true,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                })
                                quizes[index]['question'] = ''
                                onChange(quizes)
                                setDuplicated('duplicated')
                              }
                            } else {
                              // check in DB
                              const condition = {
                                question: htmlEntityEncode(data),
                              }
                              if (testId) condition.excludedId = testId
                              const test = await trialTestService.findByQuestion(condition)
                              if (test) {
                                toast.error(
                                  `Câu đã có trong cơ sở dữ liệu. Xem lại ${test.title} - ${test.level}`,
                                  {
                                    position: 'top-right',
                                    autoClose: 8000,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  },
                                )
                                quizes[index]['question'] = ''
                                onChange(quizes)
                                setDuplicated('duplicated')
                              } else {
                                quizes[index]['question'] = data
                                onChange(quizes)
                                setDuplicated('')
                              }
                            }
                          } else {
                            quizes[index]['question'] = data
                            onChange(quizes)
                            setDuplicated('')
                          }
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
          <CCol sm="3" style={{ marginTop: '5px' }}>
            <CInputGroup>
              <CInputGroupText id={`point-${id}`} style={{ width: '30%' }}>
                Điểm số
              </CInputGroupText>
              <CFormControl
                type="number"
                name="point"
                id={`point-${id}`}
                aria-describedby="point"
                onChange={(e) => {
                  let index = parseInt(id)
                  let quizes = [...parentQuiz]
                  quizes[index]['point'] = e.target.value
                  onChange(quizes)
                }}
                disabled={disabled}
                value={parentQuiz[parseInt(id)]['point']}
                style={parentQuiz[parseInt(id)]['point'] > 0 ? {} : { border: '2px dotted red' }}
              />
            </CInputGroup>
          </CCol>
        </CRow>
      </div>
    )
}

QuizItem.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
  // objectId: PropTypes.string,
  parentQuiz: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  testId: PropTypes.string,
  activeStep: PropTypes.number,
  group: PropTypes.object,
}

const TrialTest = (props) => {
  const pathName = props.location.pathname
  const viewAction = getViewAction(pathName)
  const itemId = viewAction === 'add' ? undefined : getLastPartFromPathName(pathName)
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState(LEVEL.N5)
  const [free, setFree] = useState(1)
  const [time_part_1, setTime1] = useState(0)
  const [time_part_2, setTime2] = useState(0)
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [quiz, setQuiz] = useState([])
  const [vocabularyContent, setVocabularyContent] = useState('')
  const [grammarContent, setGrammarContent] = useState('')
  const [readingContent, setReadingContent] = useState('')
  const [listeningContent, setListeningContent] = useState('')
  const [listeningAudioSrc, setListeningAudioSrc] = useState('')
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState({})
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    // update selectedGroup
    const filteredGroups = groups.filter((group) => group.part === activeStep)
    if (!_.isEmpty(filteredGroups)) {
      const n = filteredGroups.length
      setSelectedGroup(filteredGroups[n - 1])
    } else setSelectedGroup(undefined)
  }, [activeStep, groups])

  const steps = getSteps()
  const isLastStep = () => {
    return activeStep === TEST_PART.listening
  }
  const isFirstStep = () => {
    return activeStep === TEST_PART.vocabulary
  }
  const handleNext = () => {
    const newActiveStep = isLastStep()
      ? TEST_PART.vocabulary // reset to the first
      : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    const newActiveStep = isFirstStep()
      ? TEST_PART.listening // reset to the first
      : activeStep - 1
    setActiveStep(newActiveStep)
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
  }

  const addQuiz = (group) => {
    const data = {
      question: '',
      A: '',
      B: '',
      C: '',
      D: '',
      answer: 'A',
      part: group.part,
      group: group.uuid,
      _id: uuidv4(),
    }
    setQuiz([...quiz, data])
  }
  const savingCallback = (res) => {
    setSaving(false)
    if (res && res.code !== 400 && res.code !== 403 && res.code !== 401 && res.code !== 500) {
      toast.success(`Lưu thành công bài thi`, {
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
        redirectedPath: `/trial-tests/getTrialTest/${res.id}`,
      })
    } else {
      if (res.code === 400) {
        toast.error(`Kiểm tra các trường bỏ trống`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } else
        toast.error(`Có lỗi xảy ra khi tạo bài thi”`, {
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
      if (newItem._id) delete newItem._id // remove ID
      return newItem
    })
    return clone
  }

  const handleSubmit = () => {
    if (
      isQuizValidated() &&
      title.length > 0 &&
      time_part_1 > 0 &&
      time_part_2 &&
      quiz.length > 0
    ) {
      setSaving(true)
      const quizToSave = transformQuizToSave()
      let data = {
        title,
        level,
        free,
        quiz: quizToSave,
        time_part_1,
        time_part_2,
        vocabularyContent: htmlEntityEncode(vocabularyContent),
        grammarContent: htmlEntityEncode(grammarContent),
        readingContent: htmlEntityEncode(readingContent),
        listeningContent: htmlEntityEncode(listeningContent),
        listeningAudioSrc,
        quizGroups: groups,
      }
      viewAction === 'add'
        ? trialTestService.createItem(data).then(savingCallback)
        : trialTestService.updateItem(data, itemId).then(savingCallback)
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
      trialTestService.getItem(itemId).then((res) => {
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
            setRedirecTo({ isRedirected: true, redirectedPath: '/trial-tests' })
          } else {
            setFree(res.free)
            setTitle(res.title)
            setLevel(res.level)
            setTime1(res.time_part_1)
            setTime2(res.time_part_2)
            setVocabularyContent(htmlEntityDecode(res.vocabularyContent))
            setGrammarContent(htmlEntityDecode(res.grammarContent))
            setReadingContent(htmlEntityDecode(res.readingContent))
            setListeningContent(htmlEntityDecode(res.listeningContent))
            setListeningAudioSrc(res.listeningAudioSrc)
            let initialQuizes = res.quiz
            let clonedQuizes = [...initialQuizes]
            let resultQuizes = clonedQuizes.map(function (item) {
              let newItem = { ...item }
              newItem.question = htmlEntityDecode(newItem.question)
              return newItem
            })
            setQuiz(resultQuizes)
            setGroups(res.quizGroups)
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
                style={title.length ? {} : { border: '2px dotted red' }}
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
          <CRow className="mb-3">
            <CFormLabel htmlFor="time_part_1" className="col-sm-2 col-form-label">
              Thời lượng P1 (phút)
            </CFormLabel>
            <CCol sm="2">
              <CFormControl
                type="number"
                id="time_part_1"
                min="0"
                required
                placeholder="Nhập 120 cho thời gian 120 phút làm bài"
                onChange={(e) => setTime1(e.target.value)}
                value={parseInt(time_part_1)}
                disabled={viewAction === 'get'}
                style={time_part_1 > 0 ? {} : { border: '2px dotted red' }}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="time_part_2" className="col-sm-2 col-form-label">
              Thời lượng P2 (phút)
            </CFormLabel>
            <CCol sm="2">
              <CFormControl
                type="number"
                id="time_part_2"
                min="0"
                required
                placeholder="Nhập 120 cho thời gian 120 phút làm bài"
                onChange={(e) => setTime2(e.target.value)}
                value={parseInt(time_part_2)}
                disabled={viewAction === 'get'}
                style={time_part_2 > 0 ? {} : { border: '2px dotted red' }}
              />
            </CCol>
          </CRow>
          <fieldset className="row mb-3">
            <legend className="col-form-label col-sm-2 pt-0">Phí</legend>
            <CCol sm="10">
              <CFormCheck
                id="free"
                label="Miễn phí"
                checked={free === 1}
                onChange={() => setFree(1 - free)}
              />
            </CCol>
          </fieldset>
        </CForm>
        <div className={classes.root} style={{ marginBottom: 10, backgroundColor: '#ebedef' }}>
          <Stepper
            nonLinear
            activeStep={activeStep - 1}
            alternativeLabel
            style={{ backgroundColor: '#ebedef', border: '1px dotted grey', borderRadius: 10 }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={handleStep(index + 1)}>{label}</StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            <div>
              {/* Content */}
              {/* {activeStep === TEST_PART.vocabulary && (
                <CRow className="mb-3">
                  <CFormLabel htmlFor="vocabularyContent" className="col-sm-2 col-form-label">
                    Đề bài ({getTestPartName(activeStep)})
                  </CFormLabel>
                  <CCol sm="10">
                    {viewAction !== 'get' && (
                      <div
                        id="vocabularyContent"
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
                          const editor = window.CKEDITOR.replace('vocabularyContent', {
                            on: {
                              // instanceReady: function (evt) {
                              //   document.getElementById(evt.editor.id + '_top').style.display = 'none'
                              // },
                              change: function (e) {
                                // xử lý data
                                let content = editor.getData()
                                setVocabularyContent(content)
                              },
                            },
                          })
                        }}
                      >
                        {vocabularyContent ? renderHTML(vocabularyContent) : ''}
                      </div>
                    )}
                    {viewAction === 'get' && !_.isEmpty(vocabularyContent) && (
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
                        {vocabularyContent ? renderHTML(vocabularyContent) : ''}
                      </div>
                    )}
                  </CCol>
                </CRow>
              )} */}
              {/* {activeStep === TEST_PART.grammar && (
                <CRow className="mb-3">
                  <CFormLabel htmlFor="grammarContent" className="col-sm-2 col-form-label">
                    Đề bài ({getTestPartName(activeStep)})
                  </CFormLabel>
                  <CCol sm="10">
                    {viewAction !== 'get' && (
                      <div
                        id="grammarContent"
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
                          const editor = window.CKEDITOR.replace('grammarContent', {
                            on: {
                              // instanceReady: function (evt) {
                              //   document.getElementById(evt.editor.id + '_top').style.display = 'none'
                              // },
                              change: function (e) {
                                // xử lý data
                                let content = editor.getData()
                                setGrammarContent(content)
                              },
                            },
                          })
                        }}
                      >
                        {grammarContent ? renderHTML(grammarContent) : ''}
                      </div>
                    )}
                    {viewAction === 'get' && !_.isEmpty(grammarContent) && (
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
                        {grammarContent ? renderHTML(grammarContent) : ''}
                      </div>
                    )}
                  </CCol>
                </CRow>
              )} */}
              {/* {activeStep === TEST_PART.reading && (
                <CRow className="mb-3">
                  <CFormLabel htmlFor="readingContent" className="col-sm-2 col-form-label">
                    Đề bài ({getTestPartName(activeStep)})
                  </CFormLabel>
                  <CCol sm="10">
                    {viewAction !== 'get' && (
                      <div
                        id="readingContent"
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
                          const editor = window.CKEDITOR.replace('readingContent', {
                            on: {
                              // instanceReady: function (evt) {
                              //   document.getElementById(evt.editor.id + '_top').style.display = 'none'
                              // },
                              change: function (e) {
                                // xử lý data
                                let content = editor.getData()
                                setReadingContent(content)
                              },
                            },
                          })
                        }}
                      >
                        {readingContent ? renderHTML(readingContent) : ''}
                      </div>
                    )}
                    {viewAction === 'get' && !_.isEmpty(readingContent) && (
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
                        {readingContent ? renderHTML(readingContent) : ''}
                      </div>
                    )}
                  </CCol>
                </CRow>
              )} */}
              {activeStep === TEST_PART.listening && (
                <>
                  {/* <CRow className="mb-3">
                    <CFormLabel htmlFor="listeningContent" className="col-sm-2 col-form-label">
                      Đề bài ({getTestPartName(activeStep)})
                    </CFormLabel>
                    <CCol sm="10">
                      {viewAction !== 'get' && (
                        <div
                          id="listeningContent"
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
                            const editor = window.CKEDITOR.replace('listeningContent', {
                              on: {
                                // instanceReady: function (evt) {
                                //   document.getElementById(evt.editor.id + '_top').style.display = 'none'
                                // },
                                change: function (e) {
                                  // xử lý data
                                  let content = editor.getData()
                                  setListeningContent(content)
                                },
                              },
                            })
                          }}
                        >
                          {listeningContent ? renderHTML(listeningContent) : ''}
                        </div>
                      )}
                      {viewAction === 'get' && !_.isEmpty(listeningContent) && (
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
                          {listeningContent ? renderHTML(listeningContent) : ''}
                        </div>
                      )}
                    </CCol>
                  </CRow> */}
                  <CRow>
                    <CFormLabel htmlFor="listeningAudioSrc" className="col-sm-2 col-form-label">
                      URL file nghe
                    </CFormLabel>
                    <CCol sm="10" style={{ marginBottom: '5px', marginTop: '5px' }}>
                      <CFormControl
                        type="text"
                        component="textarea"
                        id="listeningAudioSrc"
                        placeholder="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
                        onChange={(e) => setListeningAudioSrc(e.target.value)}
                        rows={2}
                        defaultValue={listeningAudioSrc}
                        disabled={viewAction === 'get'}
                      />
                    </CCol>
                  </CRow>
                  {!_.isEmpty(listeningAudioSrc) && (
                    <CRow>
                      <CCol xs="12" sm="12" lg="12" md="12">
                        <audio controls style={{ width: '100%' }} preload="auto" type="audio/mpeg">
                          <source src={listeningAudioSrc} />
                          Your browser does not support the audio element.
                        </audio>
                      </CCol>
                    </CRow>
                  )}
                </>
              )}
              <CRow>
                <CForm>
                  {!_.isEmpty(groups) &&
                    groups
                      .filter((group) => {
                        return group.part === activeStep
                      })
                      .map((group, index) => {
                        return (
                          <div key={group.uuid}>
                            <CRow>
                              <CFormLabel htmlFor="group-title" className="col-sm-2 col-form-label">
                                問題{index + 1}
                              </CFormLabel>
                              <CCol sm="10" style={{ marginBottom: '5px', marginTop: '5px' }}>
                                <CInputGroup>
                                  <CFormControl
                                    type="text"
                                    component="textarea"
                                    id={`group-${group.uuid}`}
                                    placeholder="Ví dụ: 問題1　＿＿＿の言葉の読み方として最もよいものを、１・２・３・４から一つ選びなさい。"
                                    onChange={(e) => {
                                      let newGroup = { ...group }
                                      newGroup.title = e.target.value
                                      let index = _.findIndex(
                                        groups,
                                        (item) => item.uuid === newGroup.uuid,
                                      )
                                      let newGroups = [...groups]
                                      newGroups[index] = newGroup
                                      setGroups(newGroups)
                                    }}
                                    rows={2}
                                    defaultValue={group.title}
                                    disabled={viewAction === 'get'}
                                  />
                                  {viewAction !== 'get' && (
                                    <CInputGroupText
                                      id={`delete-group-${group.uuid}`}
                                      onClick={() => {
                                        const newGroups = [...groups]
                                        let index = _.findIndex(
                                          groups,
                                          (item) => item.uuid === group.uuid,
                                        )
                                        newGroups.splice(index, 1)
                                        setGroups(newGroups)
                                      }}
                                      className="quiz-delete-button"
                                    >
                                      Gỡ bỏ
                                    </CInputGroupText>
                                  )}
                                </CInputGroup>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol sm="12">
                                <Exercise
                                  quiz={quiz}
                                  onQuizItemChange={setQuiz}
                                  disabled={viewAction === 'get'}
                                  testId={itemId}
                                  group={group}
                                />
                              </CCol>
                            </CRow>
                          </div>
                        )
                      })}
                </CForm>
              </CRow>
              {/* End content */}
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <Button
                  disabled={activeStep === TEST_PART.vocabulary}
                  onClick={handleBack}
                  variant="contained"
                  color="primary"
                >
                  TRƯỚC
                </Button>{' '}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={activeStep === TEST_PART.listening}
                >
                  SAU
                </Button>
              </div>
            </div>
          </div>
        </div>
        <CRow>
          <CForm>
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
                      <CButton
                        onClick={() => {
                          const uuid = uuidv4()
                          const newGroup = { title: '', part: activeStep, uuid: uuid }
                          let newGroups = [...groups]
                          newGroups.push(newGroup)
                          setGroups(newGroups)
                        }}
                        color="success"
                        style={{ color: 'white', marginRight: '5px' }}
                        disabled={
                          !_.isEmpty(selectedGroup) &&
                          quiz.filter((item) => item.group === selectedGroup.uuid).length === 0
                        }
                      >
                        <AddIcon /> 問題
                      </CButton>
                      <CButton
                        onClick={() => addQuiz(selectedGroup)}
                        color="success"
                        style={{ color: 'white', marginRight: '5px' }}
                        disabled={selectedGroup === undefined}
                      >
                        <AddIcon /> CÂU HỎI TRẮC NGHIỆM
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
                          redirectedPath: `/trial-tests/editTrialTest/${itemId}`,
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
                            trialTestService.deleteItem(itemId).then((res) => {
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
                            setRedirecTo({ isRedirected: true, redirectedPath: '/trial-tests' })
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
                        redirectedPath: `/trial-tests/getTrialTest/webview/${itemId}`,
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

TrialTest.propTypes = {}

export default TrialTest
