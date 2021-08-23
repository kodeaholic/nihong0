import React, { useState, useEffect } from 'react'
import './style.css'
import { CFormCheck } from '@coreui/react'
import { useParams } from 'react-router-dom'
import { trialTestService } from 'src/services/api/trialTestService'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { htmlEntityDecode } from '../../../helpers/htmlentities'
import PageNotFoundComponent from 'src/components/404'
import Loader from 'src/components/Loader'
import { sleep } from 'src/helpers/common'
import PropTypes from 'prop-types'
import { getTestPartName, TEST_PART } from 'src/constants/test.constants'
import { v4 as uuidv4 } from 'uuid'
const Part = (props) => {
  const { part, updateScore } = props
  const [answeredQuiz, setAnsweredQuiz] = useState({})
  // const [activeStep, setActiveStep] = useState(1)
  const { quiz, time, groups } = part
  const onQuizAnswered = (e, uuid) => {
    const { value } = e.target
    let clone = { ...answeredQuiz }
    clone[uuid] = value
    setAnsweredQuiz(clone)
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

  return (
    <>
      {/* <div className="content">{renderHTML('content')}</div> */}
      <div className="quiz-container">
        {[TEST_PART.vocabulary, TEST_PART.grammar, TEST_PART.reading].map((type, typeIndex) => {
          const filteredGroup = groups.filter((g) => g.part === type)
          return (
            <div key={typeIndex}>
              {filteredGroup.map((group, groupIndex) => {
                const filteredQuiz = quiz.filter((itm) => itm.group === group.uuid)
                const lastQuizIndex = filteredQuiz.length - 1
                return (
                  <div key={groupIndex}>
                    {filteredQuiz.map((item, idx) => {
                      let question = item.question
                      question = question.replace('>', `>${getNo(item, group, quiz)} 、`)
                      const found = _.findIndex(groups, (group) => group.uuid === item.group)
                      const selectedGroup = groups[found]
                      return (
                        <div key={`quiz-${item.uuid}`}>
                          {groupIndex === 0 && idx === 0 && (
                            <p
                              style={{
                                fontFamily: "'Source Sans Pro', sans-serif",
                                textAlign: 'center',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                border: '1px solid #000',
                              }}
                            >{`${getTestPartName(type)}`}</p>
                          )}
                          {idx === 0 && (
                            <>
                              <div className="content" style={{ fontWeight: 'bold' }}>
                                {selectedGroup.title}
                              </div>
                            </>
                          )}
                          {item.content && (
                            <div
                              className="content"
                              style={{ border: '1px dotted #000', marginTop: 30 }}
                            >
                              {renderHTML(item.content)}
                            </div>
                          )}
                          <div className="quiz-item-container">
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
                              name={'quiz-' + item.uuid}
                              onClick={(e) => {
                                onQuizAnswered(e, item.uuid)
                              }}
                              value="A"
                              disabled={!_.isEmpty(answeredQuiz[item.uuid])}
                              id={`quiz-${item.uuid}-A`}
                            />
                            <CFormCheck
                              type="radio"
                              label={renderHTML(
                                `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-answer="${
                                  item.answer === 'B' ? 'true' : 'false'
                                }">${item.B}</span>`,
                              )}
                              name={'quiz-' + item.uuid}
                              onClick={(e) => {
                                onQuizAnswered(e, item.uuid)
                              }}
                              value="B"
                              disabled={!_.isEmpty(answeredQuiz[item.uuid])}
                              id={`quiz-${item.uuid}-B`}
                            />
                            <CFormCheck
                              type="radio"
                              label={renderHTML(
                                `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-answer="${
                                  item.answer === 'C' ? 'true' : 'false'
                                }">${item.C}</span>`,
                              )}
                              name={'quiz-' + item.uuid}
                              onClick={(e) => {
                                onQuizAnswered(e, item.uuid)
                              }}
                              value="C"
                              disabled={!_.isEmpty(answeredQuiz[item.uuid])}
                              id={`quiz-${item.uuid}-C`}
                            />
                            <CFormCheck
                              type="radio"
                              label={renderHTML(
                                `<span class="dictionary-tooltip option-tooltip" style="margin-bottom: 5px;" data-answer="${
                                  item.answer === 'D' ? 'true' : 'false'
                                }">${item.D}</span>`,
                              )}
                              name={'quiz-' + item.uuid}
                              onClick={(e) => {
                                onQuizAnswered(e, item.uuid)
                              }}
                              value="D"
                              disabled={!_.isEmpty(answeredQuiz[item.uuid])}
                              id={`quiz-${item.uuid}-D`}
                            />
                          </div>
                          {idx === lastQuizIndex && <hr style={{ height: '1px' }} />}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}
Part.propTypes = {
  quiz: PropTypes.array,
  time: PropTypes.number,
  updateScore: PropTypes.func,
  part: PropTypes.object,
}
const PART = {
  one: 'ONE',
  two: 'TWO',
}
const SCREEN = {
  home: 'HOME',
  screen: 'TEST',
}
const TEST_STATUS = {
  new: 'NEW',
  doing: 'DOING',
  completed: 'COMPLETED',
}
const TrialTestWebView = (props) => {
  const { itemId } = useParams()
  const [title, setTitle] = useState('')
  const [pageNotFound, setPageNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [partOne, setPartOne] = useState({})
  const [partTwo, setPartTwo] = useState({})
  const [selectedPart, setSelectedPart] = useState('')
  const [screen, setScreen] = useState('HOME')
  /* Load item */
  useEffect(() => {
    if (itemId) {
      trialTestService.getItem(itemId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404 || res.status === 400) {
            setPageNotFound(true)
          } else {
            setTitle(res?.title.includes(':') ? _.trim(res.title.split(':')[1]) : res.title)
            let initialQuizes = res.quiz
            let clonedQuizes = [...initialQuizes]
            let resultQuizes = clonedQuizes.map(function (item) {
              let newItem = { ...item }
              newItem.question = htmlEntityDecode(newItem.question)
              if (!_.isEmpty(newItem.content)) newItem.content = htmlEntityDecode(newItem.content)
              newItem.uuid = uuidv4()
              return newItem
            })
            const quizOne = resultQuizes.filter((item) => {
              return item.part !== TEST_PART.listening
            })
            const quizTwo = resultQuizes.filter((item) => {
              return item.part === TEST_PART.listening
            })
            const cloneOne = [...quizOne]
            const cloneTwo = [...quizTwo]
            const quizGroups = res.quizGroups
            const groupsOne = quizGroups.filter((item) => {
              return item.part !== TEST_PART.listening
            })
            const groupsTwo = quizGroups.filter((item) => {
              return item.part === TEST_PART.listening
            })
            setPartOne({
              quiz: quizOne,
              total: quizOne.length || 0,
              answered: 0,
              correct: 0,
              score: 0,
              duration: 0,
              time: res.time_part_1 || 0,
              status: TEST_STATUS.new,
              totalScore:
                !_.isEmpty(cloneOne) && cloneOne.length
                  ? cloneOne.reduce((a, b) => {
                      return { point: a.point + b.point }
                    })
                  : 0,
              groups: groupsOne,
            })
            setPartTwo({
              quiz: quizTwo,
              total: quizTwo.length || 0,
              answered: 0,
              correct: 0,
              score: 0,
              duration: 0,
              time: res.time_part_2 || 0,
              status: TEST_STATUS.new,
              totalScore:
                !_.isEmpty(cloneTwo) && cloneTwo.length
                  ? cloneTwo.reduce((a, b) => {
                      return { point: a.point + b.point }
                    })
                  : 0,
              groups: groupsTwo,
            })
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
    const css = ['css/sub-tests/webview.css', 'css/sub-tests/switch.css']
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
            {true && (
              <>
                <main>
                  <p
                    style={{
                      fontFamily: "'Source Sans Pro', sans-serif",
                      textAlign: 'center',
                      fontSize: '20px',
                    }}
                  >{`${title}`}</p>
                  {screen === SCREEN.home && (
                    <>
                      <div
                        style={{
                          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                          height: 'calc(50vh - 60px)',
                          borderRadius: 10,
                          textAlign: 'center',
                          justifyContent: 'center',
                          alignContent: 'center',
                          width: '100%',
                          marginBottom: 20,
                          paddingTop: 35,
                          lineHeight: 1.6,
                          fontWeight: 'bold',
                          fontFamily: "'Source Sans Pro', sans-serif",
                        }}
                      >
                        <p style={{ fontSize: 20 }}>文字・語彙 - 文法 - 読解</p>
                        <p style={{ fontWeigth: 'heavy' }}>Thời lượng: {partOne.time} phút</p>
                        <p style={{ fontWeigth: 'heavy' }}>Tổng số: {partOne.total} câu</p>
                        <p style={{ fontWeigth: 'heavy' }}>Tổng điểm: {partOne.totalScore.point}</p>
                        <hr
                          style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginLeft: 20,
                            marginRight: 20,
                          }}
                        ></hr>
                        {partOne.status === TEST_STATUS.new && (
                          <button
                            style={{
                              backgroundColor: '#65DD57',
                              outline: 'none',
                              borderRadius: 5,
                              border: 'none',
                              boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                              textAlign: 'center',
                              justifyContent: 'center',
                              alignContent: 'center',
                              color: '#ffffff',
                              textTransform: 'uppercase',
                              fontSize: 20,
                              fontWeigth: 'heavy !important',
                              height: 50,
                              marginTop: 10,
                              padding: 10,
                            }}
                            onClick={() => {
                              setSelectedPart(PART.one)
                              setTitle('文字・語彙 - 文法 - 読解')
                              setScreen(SCREEN.TEST)
                            }}
                          >
                            Bắt đầu bài thi
                          </button>
                        )}
                        {partOne.status === TEST_STATUS.completed && (
                          <>
                            <p style={{ fontWeigth: 'heavy' }}>Đã trả lời: {partOne.total} câu</p>
                            <p style={{ fontWeigth: 'heavy' }}>
                              Trả lời đúng: {partOne.correct} câu
                            </p>
                            <p style={{ fontWeigth: 'heavy' }}>Đạt: {partOne.correct} điểm</p>
                            <p style={{ fontWeigth: 'heavy' }}>Thời gian làm: {partOne.duration}</p>
                            <button
                              style={{
                                backgroundColor: '#65DD57',
                                outline: 'none',
                                borderRadius: 5,
                                border: 'none',
                                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignContent: 'center',
                                color: '#ffffff',
                                textTransform: 'uppercase',
                                fontSize: 20,
                                fontWeigth: 'heavy !important',
                                height: 50,
                                marginTop: 10,
                                padding: 10,
                              }}
                            >
                              Xem lại
                            </button>
                          </>
                        )}
                      </div>
                      <div
                        style={{
                          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                          height: 'calc(50vh - 60px)',
                          borderRadius: 10,
                          textAlign: 'center',
                          justifyContent: 'center',
                          alignContent: 'center',
                          width: '100%',
                          marginBottom: 10,
                          paddingTop: 35,
                          lineHeight: 1.6,
                          fontWeight: 'bold',
                          fontFamily: "'Source Sans Pro', sans-serif",
                        }}
                      >
                        <p style={{ fontSize: 20 }}>聴解</p>
                        <p style={{ fontWeigth: 'heavy' }}>Thời lượng: {partTwo.time} phút</p>
                        <p style={{ fontWeigth: 'heavy' }}>Tổng số: {partOne.total} câu</p>
                      </div>
                    </>
                  )}
                  {screen === SCREEN.TEST && selectedPart === PART.one && (
                    <Part part={partOne} updateScore={setPartOne} />
                  )}
                </main>
              </>
            )}
          </div>
        )}
      </>
    )
}

TrialTestWebView.propTypes = {}

export default TrialTestWebView
