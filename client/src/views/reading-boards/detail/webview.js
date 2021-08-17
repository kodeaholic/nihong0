import React, { useState, useEffect } from 'react'
import './style.css'
import { CFormCheck } from '@coreui/react'
import { useParams } from 'react-router-dom'
import { readingBoardService } from 'src/services/api/readingBoardService'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { htmlEntityDecode } from '../../../helpers/htmlentities'
import PageNotFoundComponent from 'src/components/404'
import Loader from 'src/components/Loader'
import { sleep } from 'src/helpers/common'
import { v4 as uuidv4 } from 'uuid'
const removeRedundantTags = (e, fontOption = false) => {
  let result = e.replaceAll('<b>', '')
  result = result.replaceAll('</b>', '')
  if (fontOption) {
    result = result.replaceAll('Arial', 'Source Sans Pro')
  }
  return result
}
const removeColor = (elem) => {
  if (_.get(elem, 'style.color')) {
    elem.style.color = ''
  }
}
const allDescendants = (node) => {
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i]
    if (child.nodeType === Node.ELEMENT_NODE) {
      allDescendants(child)
      removeColor(child)
    }
  }
}
const ReadingBoardWebView = (props) => {
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [tooltipContent, setTooltipContent] = useState('')
  const [quiz, setQuiz] = useState([])
  const [pageNotFound, setPageNotFound] = useState(false)
  const [answeredQuiz, setAnsweredQuiz] = useState({})
  const [showFurigana, setShowFurigana] = useState(true)
  const [showTranslator, setShowTranslator] = useState(false)
  const [loading, setLoading] = useState(true)
  const onQuizAnswered = (e, index) => {
    const { value } = e.target
    let clone = { ...answeredQuiz }
    clone[index] = value
    setAnsweredQuiz(clone)
  }
  /* Load item */
  useEffect(() => {
    if (boardId) {
      readingBoardService.getBoard(boardId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404 || res.status === 400) {
            setPageNotFound(true)
          } else {
            setTitle(res.title)
            setLevel(res.level)
            // setContent(res.content ? htmlEntityDecode(res.content) : '')
            setTooltipContent(res.tooltipContent ? htmlEntityDecode(res.tooltipContent) : '')
            let initialQuizes = res.quiz
            let clonedQuizes = [...initialQuizes]
            let resultQuizes = clonedQuizes.map(function (item) {
              let newItem = { ...item }
              newItem.question = htmlEntityDecode(newItem.question)
              // newItem.question_vn = htmlEntityDecode(newItem.question_vn)
              newItem.A = htmlEntityDecode(newItem.A)
              newItem.B = htmlEntityDecode(newItem.B)
              newItem.C = htmlEntityDecode(newItem.C)
              newItem.D = htmlEntityDecode(newItem.D)
              // newItem.A_vn = htmlEntityDecode(newItem.A_vn)
              // newItem.B_vn = htmlEntityDecode(newItem.B_vn)
              // newItem.C_vn = htmlEntityDecode(newItem.C_vn)
              // newItem.D_vn = htmlEntityDecode(newItem.D_vn)
              return newItem
            })
            setQuiz(resultQuizes)
            sleep(1500).then(() => {
              setLoading(false)
            })
          }
        }
      })
    }
  }, [boardId])

  /** ComponentDidMount */

  useEffect(() => {
    const removeAllElementsWithClass = (e) => {
      const paras = document.getElementsByClassName(e)
      while (paras[0]) paras[0].parentNode.removeChild(paras[0])
    }
    /* load css on the fly */
    const css = ['css/reading-boards/webview.css', 'css/reading-boards/switch.css']
    css.forEach((item) => {
      const link = document.createElement('link')
      // set the attributes for link element
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = item
      link.classList.add('css-on-the-fly')
      // Get HTML head element to append
      // link element to it
      document.getElementsByTagName('HEAD')[0].appendChild(link)
    })

    /** Add scroll event catching */
    const removeClicked = () => {
      const clicked = document.getElementsByClassName('tooltip-clicked')[0]
      if (clicked) clicked.classList.remove('tooltip-clicked')
    }
    // document.addEventListener('touchmove', removeClicked, false)
    document.addEventListener('touchstart', removeClicked, false)
    // document.addEventListener('scroll', removeClicked, false)
    return () => {
      removeAllElementsWithClass('css-on-the-fly')
      // document.removeEventListener('touchmove', removeClicked, true)
      // document.removeEventListener('scroll', removeClicked, true)
      document.removeEventListener('touchstart', removeClicked, true)
    }
  }, [])
  useEffect(() => {
    if (showTranslator) {
      const list = document.getElementsByClassName('dictionary-tooltip')
      if (list.length > 0) {
        for (let item of list) {
          const nextSibling = item.nextSibling
          const parent = item.parentElement
          let id = item.getAttribute('id')
          if (_.isEmpty(id)) {
            id = uuidv4()
            item.setAttribute('id', id)
          }
          item.addEventListener('click', function () {
            const retargetedItem = document.getElementById(id)
            retargetedItem.classList.add('tooltip-clicked')
            const tooltipTextElement = document.querySelector(`[data-tooltip-text-id="${id}"]`)
            tooltipTextElement.style.left = `${
              (window.innerWidth - tooltipTextElement.offsetWidth) / 2
            }px`
            const boundingClientRect = retargetedItem.getBoundingClientRect()
            const { y, width, height, top } = boundingClientRect
            tooltipTextElement.style.bottom = `${window.innerHeight - top}px`
          })
          if (!nextSibling || (nextSibling && !nextSibling.getAttribute('data-type'))) {
            const text = item.getAttribute('data-tooltip')
            if (text && text.length) {
              const span = document.createElement('span')
              span.classList.add('custom-tooltip')
              span.setAttribute('data-type', 'custom-tooltip')
              span.setAttribute('data-tooltip-text-id', id)
              span.innerHTML = text
              parent.insertBefore(span, nextSibling)
            }
          }
        }
      }
    }
  }, [showTranslator])
  if (pageNotFound) {
    return <PageNotFoundComponent />
  } else
    return (
      <>
        {!showFurigana && (
          <link
            rel="stylesheet"
            type="text/css"
            href="css/reading-boards/furigana.css"
            className="css-on-the-fly"
          />
        )}
        {!showTranslator && (
          <link
            rel="stylesheet"
            type="text/css"
            href="css/reading-boards/tooltip.css"
            className="css-on-the-fly"
          />
        )}
        <Loader loading={loading} />
        {!loading && (
          <div className="page">
            {/* <header tabIndex="0"> {`Luyện đọc ${level} - ${title}`} </header> */}
            {true && (
              <>
                <main>
                  <p
                    style={{ fontFamily: "'Shippori Mincho', serif", textAlign: 'center' }}
                  >{`${title}`}</p>
                  <div className="content">{renderHTML(tooltipContent)}</div>
                  <hr />
                  <div className="quiz-container">
                    {quiz.map((item, index) => {
                      let question = item.question
                      let question_vn = item.question_vn
                      question = question.replaceAll('<b>', '')
                      question = question.replaceAll('</b>', '')
                      return (
                        <div className="quiz-item-container" key={`quiz-${index}`}>
                          <span
                            className="quiz-question dictionary-tooltip"
                            style={{ marginBottom: '5px' }}
                            data-tooltip={question_vn}
                          >
                            {renderHTML(question)}
                          </span>
                          <CFormCheck
                            type="radio"
                            label={renderHTML(
                              `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-tooltip="${
                                item.A_vn
                              }" data-answer="${
                                item.answer === 'A' ? 'true' : 'false'
                              }">${removeRedundantTags(item.A)}</span>`,
                            )}
                            name={'quiz-' + index}
                            onClick={(e) => onQuizAnswered(e, index)}
                            value="A"
                            disabled={!_.isEmpty(answeredQuiz[index])}
                            id={`quiz-${index}-A`}
                          />
                          <CFormCheck
                            type="radio"
                            label={renderHTML(
                              `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-tooltip="${
                                item.B_vn
                              }" data-answer="${
                                item.answer === 'B' ? 'true' : 'false'
                              }">${removeRedundantTags(item.B)}</span>`,
                            )}
                            name={'quiz-' + index}
                            onClick={(e) => onQuizAnswered(e, index)}
                            value="B"
                            disabled={!_.isEmpty(answeredQuiz[index])}
                            id={`quiz-${index}-B`}
                          />
                          <CFormCheck
                            type="radio"
                            label={renderHTML(
                              `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-tooltip="${
                                item.C_vn
                              }" data-answer="${
                                item.answer === 'C' ? 'true' : 'false'
                              }">${removeRedundantTags(item.C)}</span>`,
                            )}
                            name={'quiz-' + index}
                            onClick={(e) => onQuizAnswered(e, index)}
                            value="C"
                            disabled={!_.isEmpty(answeredQuiz[index])}
                            id={`quiz-${index}-C`}
                          />
                          <CFormCheck
                            type="radio"
                            label={renderHTML(
                              `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-tooltip="${
                                item.D_vn
                              }" data-answer="${
                                item.answer === 'D' ? 'true' : 'false'
                              }">${removeRedundantTags(item.D)}</span>`,
                            )}
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
                <div id="toggles">
                  <div className="switch-wrapper">
                    <div className="switch">
                      <input
                        type="checkbox"
                        name="checkbox2"
                        id="checkbox2"
                        className="ios-toggle"
                        defaultChecked={showFurigana}
                        onChange={() => {
                          setShowFurigana(!showFurigana)
                        }}
                      />
                      <label htmlFor="checkbox2" className="checkbox-label" />
                    </div>
                    <div className="switch-label">Hiện cách đọc</div>
                  </div>
                  <div className="switch-wrapper">
                    <div className="switch">
                      <input
                        type="checkbox"
                        name="checkbox1"
                        id="checkbox1"
                        className="ios-toggle"
                        defaultChecked={showTranslator}
                        onChange={(e) => {
                          // if (showTranslator) {
                          //   window.Alert7.alert('Đã tắt dịch')
                          // } else window.Alert7.alert('Chạm để dịch')
                          setShowTranslator(!showTranslator)
                        }}
                      />
                      <label htmlFor="checkbox1" className="checkbox-label" />
                    </div>
                    <div className="switch-label">Chạm để dịch</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </>
    )
}

ReadingBoardWebView.propTypes = {}

export default ReadingBoardWebView
