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
import { boardService } from 'src/services/api/boardService'
import _ from 'lodash'
const getCardsString = (cards) => {
  const arr = cards.map((item) => item.letter)
  return arr.toString()
}
const getTagsFromCards = (cards) => {
  const arr = cards.map((item) => {
    return { id: item.id, content: item.letter }
  })
  return arr
}

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
            <CFormControl
              name="question"
              id={`${id}`}
              aria-describedby="question-label"
              defaultValue={data.question}
              onChange={handleInputChange}
              disabled={disabled}
              type="text"
              component="textarea"
              rows="4"
            />
            {!disabled && (
              <CInputGroupText id={`delete_${id}`} onClick={handleDeleteClicked}>
                Gỡ bỏ
              </CInputGroupText>
            )}
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="2" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionA-label-${id}`}>A</CInputGroupText>
            <CFormControl
              name="A"
              id={`${id}`}
              aria-describedby="optionA-label"
              defaultValue={data.A}
              onChange={handleInputChange}
              disabled={disabled}
            />
          </CInputGroup>
        </CCol>
        <CCol sm="2" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionB-label-${id}`}>B</CInputGroupText>
            <CFormControl
              name="B"
              id={`${id}`}
              aria-describedby="optionB-label"
              defaultValue={data.B}
              onChange={handleInputChange}
              disabled={disabled}
            />
          </CInputGroup>
        </CCol>
        <CCol sm="2" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionC-label-${id}`}>C</CInputGroupText>
            <CFormControl
              name="C"
              id={`${id}`}
              aria-describedby="optionC-label"
              defaultValue={data.C}
              onChange={handleInputChange}
              disabled={disabled}
            />
          </CInputGroup>
        </CCol>
        <CCol sm="2" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionD-label-${id}`}>D</CInputGroupText>
            <CFormControl
              name="D"
              id={`${id}`}
              aria-describedby="optionD-label"
              defaultValue={data.D}
              onChange={handleInputChange}
              disabled={disabled}
            />
          </CInputGroup>
        </CCol>
        <CCol sm="4" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CFormSelect
              id={`${id}`}
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

const Board = (props) => {
  const pathName = props.location.pathname
  const viewAction = getViewAction(pathName)
  const boardId = viewAction === 'add' ? undefined : getLastPartFromPathName(pathName)
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [description, setDescription] = useState('')
  const [free, setFree] = useState(1)
  const [cardsString, setCardsString] = useState('')
  const [cards, setCards] = useState([])
  const [tags, setTags] = useState([])
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [checkingTags, setCheckingTags] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [quiz, setQuiz] = useState([])
  const addQuiz = () => {
    const data = { question: '', A: '', B: '', C: '', D: '', answer: 'A' }
    setQuiz([...quiz, data])
  }
  const handleCheckTags = () => {
    if (cardsString.length) {
      let letters = cardsString.split(',')
      letters = letters.filter((e) => {
        return e.length !== 0
      })
      setCheckingTags(true)
      boardService.checkTagsForCards({ letters: letters }).then((res) => {
        setCheckingTags(false)
        if (res && res.length === letters.length) {
          setTags(res)
        } else {
          let found = res.map((item) => item.content)
          let miss = []
          letters.forEach((item) => {
            if (!found.includes(item)) miss.push(item)
          })
          toast.error(`${miss.toString()} chưa được tạo thẻ. Vui lòng tạo trước`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      })
    }
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
        redirectedPath: `/boards/getBoard/${res.id}`,
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
      const boardBody = {
        title,
        level,
        description,
        free,
        cards,
        quiz,
      }
      viewAction === 'add'
        ? boardService.createBoard(boardBody).then(savingCallback)
        : boardService.updateBoard(boardBody, boardId).then(savingCallback)
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
      boardService.getBoard(boardId).then((res) => {
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
            setDescription(res.description)
            setCardsString(getCardsString(res.cards))
            setTags(getTagsFromCards(res.cards))
            let arr = res.cards.map((item) => item.id)
            setQuiz(res.quiz)
            setCards(arr)
          }
        }
      })
    }
  }, [boardId])

  useEffect(() => {
    // update cards -> include this to boardBody for add/edit
    let arr = tags.map((item) => item.id)
    setCards(arr)
    arr = tags.map((item) => item.content)
    setCardsString(arr.toString())
    document.getElementById('cards_string').value = arr.toString()
  }, [tags])
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
                  onFocus={() => {
                    console.log(window.CKEDITOR)
                    window.CKEDITOR.replace('title')
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="level" className="col-sm-2 col-form-label">
                Trình độ
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  type="text"
                  id="level"
                  placeholder="N5"
                  onChange={(e) => setLevel(e.target.value)}
                  defaultValue={level}
                  disabled={viewAction === 'get'}
                  onFocus={() => {
                    console.log(window.CKEDITOR)
                    window.CKEDITOR.replace('level')
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="description" className="col-sm-2 col-form-label">
                Giới thiệu bài học
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  type="text"
                  id="level"
                  placeholder="Mô tả ngắn gọn về bài học ..."
                  component="textarea"
                  rows="3"
                  onChange={(e) => setDescription(e.target.value)}
                  defaultValue={description}
                  disabled={viewAction === 'get'}
                />
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
              <CFormLabel htmlFor="cards_string" className="col-sm-2 col-form-label">
                Các chữ trong bài học
              </CFormLabel>
              <CCol sm="5">
                <CInputGroup className="mb-3">
                  <CFormControl
                    type="text"
                    id="cards_string"
                    required
                    placeholder="Ví dụ: あ,き,た,ね,は cách nhau bởi dấu ,"
                    onChange={(e) => setCardsString(e.target.value)}
                    defaultValue={cardsString}
                    disabled={viewAction === 'get'}
                  />
                  {viewAction !== 'get' && (
                    <CButton
                      type="button"
                      color="info"
                      style={{ color: 'white' }}
                      disabled={!cardsString}
                      onClick={handleCheckTags}
                    >
                      KIỂM TRA VÀ SẮP XẾP
                    </CButton>
                  )}
                </CInputGroup>
              </CCol>
            </CRow>
            {tags.length > 0 && viewAction !== 'get' && (
              <CRow>
                <CFormLabel className="col-sm-2 col-form-label"></CFormLabel>
                <CCol sm="3">
                  <div className="list-tags">
                    <DraggableArea
                      isList
                      tags={tags}
                      render={({ tag }) => (
                        <div className="row-tag">
                          <img
                            id={tag.id}
                            alt="Delete"
                            className="delete-tag"
                            src={deleteBtn}
                            srcSet={`${deleteBtn2x}2 x`}
                            onClick={(tag) => {
                              const id = tag.target.id
                              const newTags = tags.filter((t) => t.id !== id)
                              setTags(newTags)
                            }}
                          />
                          {tag.content}
                        </div>
                      )}
                      onChange={(tags) => {
                        setTags(tags)
                      }}
                    />
                  </div>
                </CCol>
              </CRow>
            )}
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
                        disabled={!tags.length || !title.length}
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
                          redirectedPath: `/boards/editBoard/${boardId}`,
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
                            boardService.deleteBoard(boardId).then((res) => {
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
                            setRedirecTo({ isRedirected: true, redirectedPath: '/boards' })
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

Board.propTypes = {}

export default Board
