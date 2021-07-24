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
const DictionaryForm = (props) => {
  const { dictionary, onChange } = props
  return (
    <>
      <CForm>
        {dictionary.map((sentence, index) => {
          return (
            <div className="mb-3" key={`sentence-${index}`}>
              <CFormLabel htmlFor={`sentence-${index}`}>
                Câu {`${index + 1}`} - {renderHTML(sentence['sentence'])}
              </CFormLabel>
              <CFormControl
                type="text"
                name={`sentence-${index}`}
                id={`sentence-${index}`}
                placeholder="Dịch"
                component="textarea"
                rows="2"
                onChange={(e) => {
                  const { name, value } = e.target
                  console.log(value)
                  const index = parseInt(name.replace('sentence-', ''))
                  const newSentences = [...dictionary]
                  newSentences[index]['trans'] = value
                  onChange(newSentences)
                }}
              />
            </div>
          )
        })}
      </CForm>
    </>
  )
}
DictionaryForm.propTypes = {
  dictionary: PropTypes.array,
  onChange: PropTypes.func,
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
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  width: 'auto',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`question-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['question'] = editor.getData()
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
                  : renderHTML('&nbsp;&nbsp;')}
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
                  width: 'auto',
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
        <CCol sm="12" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <CInputGroup>
            <CInputGroupText id={`question_vn-label-${id}`}>Câu {id + 1} (Dịch)</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  width: 'auto',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`question_vn-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['question_vn'] = editor.getData()
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="question_vn"
                id={`question_vn-${id}`}
                aria-describedby="question_vn-label"
              >
                {parentQuiz[parseInt(id)]['question_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['question_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
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
                  width: 'auto',
                }}
              >
                {parentQuiz[parseInt(id)]['question_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['question_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionA-label-${id}`}>A</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`A-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['A'] = editor.getData()
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="A"
                id={`A-${id}`}
                aria-describedby="A-label"
              >
                {parentQuiz[parseInt(id)]['A']
                  ? renderHTML(parentQuiz[parseInt(id)]['A'])
                  : renderHTML('&nbsp;&nbsp;')}
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
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              >
                {parentQuiz[parseInt(id)]['A']
                  ? renderHTML(parentQuiz[parseInt(id)]['A'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionB-label-${id}`}>B</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`B-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['B'] = editor.getData()
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="B"
                id={`B-${id}`}
                aria-describedby="B-label"
              >
                {parentQuiz[parseInt(id)]['B']
                  ? renderHTML(parentQuiz[parseInt(id)]['B'])
                  : renderHTML('&nbsp;&nbsp;')}
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
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              >
                {parentQuiz[parseInt(id)]['B']
                  ? renderHTML(parentQuiz[parseInt(id)]['B'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionC-label-${id}`}>C</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`C-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['C'] = editor.getData()
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="C"
                id={`C-${id}`}
                aria-describedby="C-label"
              >
                {parentQuiz[parseInt(id)]['C']
                  ? renderHTML(parentQuiz[parseInt(id)]['C'])
                  : renderHTML('&nbsp;&nbsp;')}
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
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              >
                {parentQuiz[parseInt(id)]['C']
                  ? renderHTML(parentQuiz[parseInt(id)]['C'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionD-label-${id}`}>D</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`D-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['D'] = editor.getData()
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="D"
                id={`D-${id}`}
                aria-describedby="D-label"
              >
                {parentQuiz[parseInt(id)]['D']
                  ? renderHTML(parentQuiz[parseInt(id)]['D'])
                  : renderHTML('&nbsp;&nbsp;')}
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
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              >
                {parentQuiz[parseInt(id)]['D']
                  ? renderHTML(parentQuiz[parseInt(id)]['D'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionA-label-${id}`}>A (dịch)</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`A_vn-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['A_vn'] = editor.getData()
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="A_vn"
                id={`A_vn-${id}`}
                aria-describedby="A_vn-label"
              >
                {parentQuiz[parseInt(id)]['A_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['A_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
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
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              >
                {parentQuiz[parseInt(id)]['A_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['A_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionB-label-${id}`}>B (dịch)</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`B_vn-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['B_vn'] = editor.getData()
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="B_vn"
                id={`B_vn-${id}`}
                aria-describedby="B_vn-label"
              >
                {parentQuiz[parseInt(id)]['B_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['B_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
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
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              >
                {parentQuiz[parseInt(id)]['B_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['B_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionC-label-${id}`}>C (dịch)</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`C_vn-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['C_vn'] = editor.getData()
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="C_vn"
                id={`C_vn-${id}`}
                aria-describedby="C_vn-label"
              >
                {parentQuiz[parseInt(id)]['C_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['C_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
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
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              >
                {parentQuiz[parseInt(id)]['C_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['C_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
          </CInputGroup>
        </CCol>
        <CCol sm="3" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`optionD-label-${id}`}>D (dịch)</CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
                onClick={(e) => {
                  const editor = window.CKEDITOR.replace(`D_vn-${id}`, {
                    on: {
                      instanceReady: function (evt) {
                        document.getElementById(evt.editor.id + '_top').style.display = 'none'
                      },
                      change: function (e) {
                        let index = parseInt(id)
                        let quizes = [...parentQuiz]
                        quizes[index]['D_vn'] = editor.getData()
                        onChange(quizes)
                      },
                    },
                  })
                }}
                name="D_vn"
                id={`D_vn-${id}`}
                aria-describedby="D_vn-label"
              >
                {parentQuiz[parseInt(id)]['D_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['D_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
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
                  height: 'auto',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              >
                {parentQuiz[parseInt(id)]['D_vn']
                  ? renderHTML(parentQuiz[parseInt(id)]['D_vn'])
                  : renderHTML('&nbsp;&nbsp;')}
              </div>
            )}
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
  const [sentences, setSentences] = useState([])
  const addQuiz = () => {
    const data = {
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

  const transformQuizToSave = () => {
    const clone = quiz.map((item) => {
      let newItem = item
      newItem.question = htmlEntityEncode(newItem.question)
      newItem.question_vn = htmlEntityEncode(newItem.question_vn)
      newItem.A = htmlEntityEncode(newItem.A)
      newItem.B = htmlEntityEncode(newItem.B)
      newItem.C = htmlEntityEncode(newItem.C)
      newItem.D = htmlEntityEncode(newItem.D)
      newItem.A_vn = htmlEntityEncode(newItem.A_vn)
      newItem.B_vn = htmlEntityEncode(newItem.B_vn)
      newItem.C_vn = htmlEntityEncode(newItem.C_vn)
      newItem.D_vn = htmlEntityEncode(newItem.D_vn)
      return newItem
    })
    return clone
  }

  const transofmContentVnToSave = () => {
    let length = sentences.length
    if (length > 0) {
      let content = {}
      for (let i = 0; i < length; i++) {
        const wrapper = document.createElement('div')
        let innerHTML = sentences[i]['sentence']
        let trans = sentences[i]['trans']
        innerHTML = innerHTML.replace("class=''", "class='dictionary-tooltip'")
        innerHTML =
          _.isEmpty(trans) || trans === undefined
            ? innerHTML
            : innerHTML.replace(
                '</span>',
                `<span class='dictionary-tooltiptext'>${trans}</span></span>`,
              )
        wrapper.innerHTML = innerHTML
        const span = wrapper.childNodes[0]
        const paragraphIndex = span.getAttribute('data-paragraph-index')
        let sentence =
          _.isEmpty(content[paragraphIndex]) || content[paragraphIndex] === undefined
            ? ''
            : content[paragraphIndex]
        sentence += innerHTML
        content[paragraphIndex] = sentence
      }
      let valuesArray = []
      valuesArray = Object.values(content)
      let result = ''
      valuesArray.forEach((item) => {
        result += `<p class="paragraph-dictionary-tooltip">${item}</p>`
      })
      console.log(result)
      return result
    }
  }
  const handleSubmit = () => {
    if (isQuizValidated()) {
      setSaving(true)
      const quizToSave = transformQuizToSave()
      let vnContent = transofmContentVnToSave()
      let boardBody = {
        title,
        level,
        free,
        quiz: quizToSave,
        content: htmlEntityEncode(content),
      }
      if (!_.isEmpty(sentences)) boardBody.content_vn = htmlEntityEncode(vnContent)
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
            let initialQuizes = res.quiz
            let clonedQuizes = [...initialQuizes]
            let resultQuizes = clonedQuizes.map(function (item) {
              let newItem = { ...item }
              newItem.question = htmlEntityDecode(newItem.question)
              newItem.question_vn = htmlEntityDecode(newItem.question_vn)
              newItem.A = htmlEntityDecode(newItem.A)
              newItem.B = htmlEntityDecode(newItem.B)
              newItem.C = htmlEntityDecode(newItem.C)
              newItem.D = htmlEntityDecode(newItem.D)
              newItem.A_vn = htmlEntityDecode(newItem.A_vn)
              newItem.B_vn = htmlEntityDecode(newItem.B_vn)
              newItem.C_vn = htmlEntityDecode(newItem.C_vn)
              newItem.D_vn = htmlEntityDecode(newItem.D_vn)
              return newItem
            })
            setQuiz(resultQuizes)
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
                      const editor = window.CKEDITOR.replace('content', {
                        on: {
                          instanceReady: function (evt) {
                            document.getElementById(evt.editor.id + '_top').style.display = 'none'
                          },
                          change: function (e) {
                            const traverseTopLevel = (node) => {
                              let newSentences = [...sentences]
                              let sentenceIndex = 0
                              for (let i = 0; i < node.childNodes.length; i++) {
                                let paragraphIndex = i
                                let child = node.childNodes[paragraphIndex]
                                if (child.innerHTML) {
                                  // xử lý tách câu
                                  let paragraphInnerText = child.innerHTML
                                  let arrayOfSentences = paragraphInnerText.split('。')
                                  arrayOfSentences = arrayOfSentences.filter(
                                    (item) => !_.isEmpty(item),
                                  )
                                  for (let i = 0; i < arrayOfSentences.length; i++) {
                                    let sentence = arrayOfSentences[i]
                                    if (!_.isEmpty(sentence)) {
                                      let newSentence = `<span data-sentence-index='${sentenceIndex}' data-paragraph-index='${paragraphIndex}' class=''>${sentence}。</span>`
                                      let toPush = sentences[sentenceIndex]
                                        ? sentences[sentenceIndex]
                                        : {}
                                      toPush['sentence'] = newSentence
                                      newSentences[sentenceIndex] = toPush
                                      sentenceIndex++
                                    }
                                  }
                                }
                              }
                              setSentences(newSentences)
                            }
                            // xử lý data
                            let originalContent = editor.getData()
                            setContent(originalContent)
                            originalContent = originalContent.replaceAll('<b>', '')
                            originalContent = originalContent.replaceAll('</b>', '')
                            let wrapper = document.createElement('div')
                            wrapper.innerHTML = originalContent
                            traverseTopLevel(wrapper)
                          },
                        },
                      })
                    }}
                  >
                    {content ? renderHTML(content) : renderHTML('&nbsp;&nbsp;')}
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
                    {content ? renderHTML(content) : renderHTML('&nbsp;&nbsp;')}
                  </div>
                )}
              </CCol>
            </CRow>
            {!_.isEmpty(sentences) && (
              <CRow className="mb-3">
                <CFormLabel className="col-sm-2 col-form-label">Dịch nghĩa</CFormLabel>
                <CCol sm="12">
                  <DictionaryForm dictionary={sentences} onChange={setSentences} />
                </CCol>
              </CRow>
            )}
            <CRow>
              <CFormLabel className="col-sm-2 col-form-label">Bài tập củng cố</CFormLabel>
              <CCol sm="12">
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
            {viewAction === 'get' && (
              <CRow>
                <CCol className="col-sm-3">
                  <CButton
                    style={{ color: 'white', marginTop: '10px' }}
                    color="success"
                    onClick={() => {
                      setRedirecTo({
                        isRedirected: true,
                        redirectedPath: `/reading-boards/getBoard/webview/${boardId}`,
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

ReadingBoard.propTypes = {}

export default ReadingBoard
