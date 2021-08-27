import React, { useState, useEffect } from 'react'
import './style.css'
import { CFormCheck } from '@coreui/react'
import { useParams } from 'react-router-dom'
import { grammarService } from 'src/services/api/grammarService'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { htmlEntityDecode } from '../../../helpers/htmlentities'
import PageNotFoundComponent from 'src/components/404'
import Loader from 'src/components/Loader'
import { sleep } from 'src/helpers/common'
import { LEVEL } from 'src/constants/level.constants'

const GrammarWebview = (props) => {
  const { itemId } = useParams()
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [meaning, setMeaning] = useState('')
  const [usage, setUsage] = useState('')
  const [example, setExample] = useState('')
  const [free, setFree] = useState(1)
  const [level, setLevel] = useState(LEVEL.N5)
  const [quiz, setQuiz] = useState([])
  const [pageNotFound, setPageNotFound] = useState(false)
  const [answeredQuiz, setAnsweredQuiz] = useState({})
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const onQuizAnswered = (e, index) => {
    const { value } = e.target
    let clone = { ...answeredQuiz }
    clone[index] = value
    setAnsweredQuiz(clone)
  }
  /* Load item */
  useEffect(() => {
    if (itemId) {
      grammarService.getItem(itemId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404 || res.status === 400) {
            setPageNotFound(true)
          } else {
            setTitle(res?.title.includes(':') ? _.trim(res.title.split(':')[1]) : res.title)
            setName(res.name)
            setLevel(res.level)
            setMeaning(res.meaning)
            setUsage(res.usage)
            setContent(
              res.content
                ? htmlEntityDecode(res.content).replace(
                    '>',
                    `>${'<span style="color: red; font-weight: bold;">Cấu trúc: </span>'}`,
                  )
                : '',
            )
            setExample(res.example ? htmlEntityDecode(res.example) : '')
            setFree(res.free)
            let initialQuizes = res.quiz
            let clonedQuizes = [...initialQuizes]
            let resultQuizes = clonedQuizes.map(function (item) {
              let newItem = { ...item }
              newItem.question = htmlEntityDecode(newItem.question)
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
  }, [itemId])

  /** ComponentDidMount */

  useEffect(() => {
    const removeAllElementsWithClass = (e) => {
      const paras = document.getElementsByClassName(e)
      while (paras[0]) paras[0].parentNode.removeChild(paras[0])
    }
    /* load css on the fly */
    const css = ['css/grammar/webview.css']
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
    return () => {
      removeAllElementsWithClass('css-on-the-fly')
    }
  }, [])
  if (pageNotFound) {
    return <PageNotFoundComponent />
  } else
    return (
      <>
        <Loader loading={loading} />
        {!loading && (
          <div className="page">
            {/* <header tabIndex="0"> {`Luyện đọc ${level} - ${title}`} </header> */}
            {true && (
              <>
                <main>
                  <p
                    style={{
                      fontFamily: "'Source Sans Pro', sans-serif",
                      textAlign: 'center',
                      fontSize: '20px',
                      color: 'green',
                    }}
                  >{`${name}`}</p>
                  <div className="content">{renderHTML(content)}</div>
                  <div className="content">
                    <span style={{ color: '#002060', fontWeight: 'bold' }}>Ý nghĩa:</span> {meaning}
                  </div>
                  <br />
                  <div className="content">
                    <span style={{ color: '#548DD4', fontWeight: 'bold' }}>Cách dùng:</span> {usage}
                  </div>
                  <br />
                  <span style={{ color: '#E36C0A', fontWeight: 'bold' }}>Ví dụ minh họa</span>
                  <div className="content">{renderHTML(example)}</div>
                  <br />
                  <span style={{ color: '#4F3074', fontWeight: 'bold' }}>Bài tập củng cố</span>
                  <div className="quiz-container">
                    {quiz.map((item, index) => {
                      let question = item.question
                      question = question.replace('>', `>${index + 1} 、`)
                      return (
                        <div className="quiz-item-container" key={`quiz-${index}`}>
                          <span
                            className="quiz-question"
                            style={{
                              marginBottom: '5px',
                              verticalAlign: 'middle',
                              fontWeight: 'bold !important',
                            }}
                          >
                            {renderHTML(question)}
                          </span>
                          <CFormCheck
                            type="radio"
                            label={renderHTML(
                              `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-answer="${
                                item.answer === 'A' ? 'true' : 'false'
                              }">${item.A}</span>`,
                            )}
                            name={'quiz-' + index}
                            onClick={(e) => {
                              if (item.answer === 'A') setCount(count + 1)
                              onQuizAnswered(e, index)
                            }}
                            value="A"
                            disabled={!_.isEmpty(answeredQuiz[index])}
                            id={`quiz-${index}-A`}
                          />
                          <CFormCheck
                            type="radio"
                            label={renderHTML(
                              `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-answer="${
                                item.answer === 'B' ? 'true' : 'false'
                              }">${item.B}</span>`,
                            )}
                            name={'quiz-' + index}
                            onClick={(e) => {
                              if (item.answer === 'B') setCount(count + 1)
                              onQuizAnswered(e, index)
                            }}
                            value="B"
                            disabled={!_.isEmpty(answeredQuiz[index])}
                            id={`quiz-${index}-B`}
                          />
                          <CFormCheck
                            type="radio"
                            label={renderHTML(
                              `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-answer="${
                                item.answer === 'C' ? 'true' : 'false'
                              }">${item.C}</span>`,
                            )}
                            name={'quiz-' + index}
                            onClick={(e) => {
                              if (item.answer === 'C') setCount(count + 1)
                              onQuizAnswered(e, index)
                            }}
                            value="C"
                            disabled={!_.isEmpty(answeredQuiz[index])}
                            id={`quiz-${index}-C`}
                          />
                          <CFormCheck
                            type="radio"
                            label={renderHTML(
                              `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-answer="${
                                item.answer === 'D' ? 'true' : 'false'
                              }">${item.D}</span>`,
                            )}
                            name={'quiz-' + index}
                            onClick={(e) => {
                              if (item.answer === 'D') setCount(count + 1)
                              onQuizAnswered(e, index)
                            }}
                            value="D"
                            disabled={!_.isEmpty(answeredQuiz[index])}
                            id={`quiz-${index}-D`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </main>
                {/* {answeredQuiz && (
                  <div className={`fab ${count < quiz.length / 2 ? 'red' : 'green'}`}>
                    {count} | {quiz.length}
                  </div>
                )} */}
              </>
            )}
          </div>
        )}
      </>
    )
}

GrammarWebview.propTypes = {}

export default GrammarWebview
