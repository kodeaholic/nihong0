import React, { useState, useEffect } from 'react'
import './style.css'
import './switch.css'
import { CFormCheck } from '@coreui/react'
import { useParams } from 'react-router-dom'
import { readingBoardService } from 'src/services/api/readingBoardService'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { htmlEntityDecode } from '../../../helpers/htmlentities'
import PageNotFoundComponent from 'src/components/404'
import './webview.css'
const removeColor = (elem) => {
  if (_.get(elem, 'style.color')) {
    elem.style.color = ''
  }
}
const allDescendants = (node) => {
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i]
    allDescendants(child)
    removeColor(child)
  }
}
const ReadingBoardWebView = (props) => {
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [free, setFree] = useState(1)
  const [content, setContent] = useState('')
  const [contentVn, setContentVn] = useState('')
  const [quiz, setQuiz] = useState([])
  const [pageNotFound, setPageNotFound] = useState(false)
  const [answeredQuiz, setAnsweredQuiz] = useState({})
  const onQuizAnswered = (e, index) => {
    const { value } = e.target
    let clone = { ...answeredQuiz }
    clone[index] = value
    setAnsweredQuiz(clone)
    const correctOption = quiz[index].answer
    const colorForAnsweredOption = value === correctOption ? '#65DD57' : '#ff0000'
    const colorForCorrectAnswer = '#65DD57'
    const answeredLabel = document.querySelector(`label[for='quiz-${index}-${value}']`)
    const correctLabel = document.querySelector(`label[for='quiz-${index}-${correctOption}']`)
    if (correctLabel) {
      allDescendants(correctLabel)
      correctLabel.style.color = colorForCorrectAnswer
      correctLabel.style.fontWeight = 'bold'
    }
    if (answeredLabel) {
      allDescendants(answeredLabel)
      answeredLabel.style.color = colorForAnsweredOption
      answeredLabel.style.fontWeight = 'bold'
    }
  }
  /* Load item */
  useEffect(() => {
    if (boardId) {
      readingBoardService.getBoard(boardId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404 || res.status === 400) {
            setPageNotFound(true)
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

  if (pageNotFound) {
    return <PageNotFoundComponent />
  } else
    return (
      <>
        <div className="page">
          <header tabIndex="0"> {`Luyện đọc ${level} - ${title}`} </header>
          <div id="nav-container">
            <div className="bg"> </div>
            <div className="button" tabIndex="0">
              <span className="icon-bar"> </span> <span className="icon-bar"> </span>
              <span className="icon-bar"> </span>
            </div>
            <div id="nav-content" tabIndex="0">
              <div id="toggles">
                <div className="switch-wrapper">
                  <div className="switch">
                    <input type="checkbox" name="checkbox1" id="checkbox1" className="ios-toggle" />
                    <label htmlFor="checkbox1" className="checkbox-label" />
                  </div>
                  <div className="switch-label">Giao diện ban đêm</div>
                </div>
                {/* <div className="switch-wrapper">
                  <input type="checkbox" name="checkbox2" id="checkbox2" className="ios-toggle" />
                  <label htmlFor="checkbox2" className="checkbox-label" />
                </div> */}
                <div className="switch-wrapper">
                  <div className="switch">
                    <input type="checkbox" name="checkbox2" id="checkbox2" className="ios-toggle" />
                    <label htmlFor="checkbox2" className="checkbox-label" />
                  </div>
                  <div className="switch-label">Hiragana</div>
                </div>
              </div>
            </div>
          </div>
          <main>
            <div className="content">{renderHTML(content)}</div>
            <div className="quiz-container">
              {quiz.map((item, index) => {
                return (
                  <div className="quiz-item-container" key={`quiz-${index}`}>
                    <div className="quiz-question">{renderHTML(item.question)}</div>
                    <CFormCheck
                      type="radio"
                      label={renderHTML(item.A)}
                      name={'quiz-' + index}
                      onClick={(e) => onQuizAnswered(e, index)}
                      value="A"
                      disabled={!_.isEmpty(answeredQuiz[index])}
                      id={`quiz-${index}-A`}
                    />
                    <CFormCheck
                      type="radio"
                      label={renderHTML(item.B)}
                      name={'quiz-' + index}
                      onClick={(e) => onQuizAnswered(e, index)}
                      value="B"
                      disabled={!_.isEmpty(answeredQuiz[index])}
                      id={`quiz-${index}-B`}
                    />
                    <CFormCheck
                      type="radio"
                      label={renderHTML(item.C)}
                      name={'quiz-' + index}
                      onClick={(e) => onQuizAnswered(e, index)}
                      value="C"
                      disabled={!_.isEmpty(answeredQuiz[index])}
                      id={`quiz-${index}-C`}
                    />
                    <CFormCheck
                      type="radio"
                      label={renderHTML(item.D)}
                      name={'quiz-' + index}
                      onClick={(e) => onQuizAnswered(e, index)}
                      value="D"
                      disabled={!_.isEmpty(answeredQuiz[index])}
                      id={`quiz-${index}-D`}
                    />
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </>
    )
}

ReadingBoardWebView.propTypes = {}

export default ReadingBoardWebView