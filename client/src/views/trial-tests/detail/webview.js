import React, { useState, useEffect } from 'react'
import './style.css'
import { CFormCheck, CBadge } from '@coreui/react'
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
import { msToTime } from 'src/helpers/time.helper'
const Part = (props) => {
  const { part, updateScore, setScreen, status, updateStatus, duration, updateDuration } = props
  const [answeredQuiz, setAnsweredQuiz] = useState({})
  const { quiz, time, groups, partType, listeningAudioSrc } = part
  const [timer, setTimer] = useState(0)
  const onQuizAnswered = (e, item) => {
    const { value } = e.target
    const uuid = item.uuid
    let clone = { ...answeredQuiz }
    clone[uuid] = value
    setAnsweredQuiz(clone)
    const state = { ...part }
    state.answered = state.answered + 1
    if (value === item.answer) {
      state.correct = state.correct + 1
      state.score = state.score + item.point
    }
    updateScore(state)
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

  const parts =
    partType === PART.one
      ? [TEST_PART.vocabulary, TEST_PART.grammar, TEST_PART.reading]
      : [TEST_PART.listening]

  /**Component did mount */
  useEffect(() => {
    let tm
    if (status !== TEST_STATUS.completed) {
      tm = setInterval(() => {
        setTimer((t) => t + 1000)
      }, 1000)
    } else if (status === TEST_STATUS.completed) {
      clearInterval(tm)
    }
    return () => {
      clearInterval(tm)
    }
  }, [status])

  /**Submit on time ends */
  useEffect(() => {
    const msTime = time * 60 * 1000 // time in minutes to ms
    if (timer >= msTime) {
      updateDuration(timer)
      updateStatus(TEST_STATUS.completed)
      setScreen(SCREEN.home)
    }
  }, [timer, time, setScreen, updateStatus, updateDuration])
  return (
    <>
      {!_.isEmpty(listeningAudioSrc) && (
        <audio controls preload="metadata">
          <source src={listeningAudioSrc} />
        </audio>
      )}
      <div className="quiz-container">
        {parts.map((type, typeIndex) => {
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
                          {groupIndex === 0 && idx === 0 && type !== TEST_PART.listening && (
                            <p
                              style={{
                                fontFamily: "'Source Sans Pro', sans-serif",
                                textAlign: 'center',
                                fontSize: '15px',
                                fontWeight: 'normal',
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
                                onQuizAnswered(e, item)
                              }}
                              value="A"
                              disabled={
                                status === TEST_STATUS.completed ||
                                !_.isEmpty(answeredQuiz[item.uuid])
                              }
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
                                onQuizAnswered(e, item)
                              }}
                              value="B"
                              disabled={
                                status === TEST_STATUS.completed ||
                                !_.isEmpty(answeredQuiz[item.uuid])
                              }
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
                                onQuizAnswered(e, item)
                              }}
                              value="C"
                              disabled={
                                status === TEST_STATUS.completed ||
                                !_.isEmpty(answeredQuiz[item.uuid])
                              }
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
                                onQuizAnswered(e, item)
                              }}
                              value="D"
                              disabled={
                                status === TEST_STATUS.completed ||
                                !_.isEmpty(answeredQuiz[item.uuid])
                              }
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
      <div className="scoreboard-wrapper">
        <div className="scoreboard">
          <div className="timer">{msToTime(timer)}</div>
          <div className="score">
            <p style={{ margin: 1, padding: 1 }}>
              <CBadge color="info">
                {part.answered} | {part.total} 問
              </CBadge>
            </p>
            <p style={{ margin: 1, padding: 1 }}>
              <CBadge color="success">
                {part.score} | {part.totalScore.point} 点
              </CBadge>
            </p>
          </div>
          <div
            className="submit-button"
            onClick={() => {
              if (status !== TEST_STATUS.completed) {
                const state = { ...part }
                updateDuration(timer)
                updateScore(state)
                updateStatus(TEST_STATUS.completed)
                setScreen(SCREEN.home)
              } else {
                setScreen(SCREEN.home)
              }
            }}
          >
            {status !== TEST_STATUS.completed ? 'Nộp bài' : 'Quay lại'}
          </div>
        </div>
      </div>
    </>
  )
}
Part.propTypes = {
  quiz: PropTypes.array,
  time: PropTypes.number,
  updateScore: PropTypes.func,
  part: PropTypes.object,
  setScreen: PropTypes.func,
  updateStatus: PropTypes.func,
  status: PropTypes.string,
  updateDuration: PropTypes.func,
  duration: PropTypes.number,
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
  const [originalTitle, setOriginalTitle] = useState('')
  const [pageNotFound, setPageNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [partOne, setPartOne] = useState({})
  const [partTwo, setPartTwo] = useState({})
  const [selectedPart, setSelectedPart] = useState('')
  const [screen, setScreen] = useState('HOME')
  const [partOneStatus, setPartOneStatus] = useState(TEST_STATUS.new)
  const [partTwoStatus, setPartTwoStatus] = useState(TEST_STATUS.new)
  const [partOneDuration, setPartOneDuration] = useState(0)
  const [partTwoDuration, setPartTwoDuration] = useState(0)
  /* Load item */
  useEffect(() => {
    if (itemId) {
      trialTestService.getItem(itemId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404 || res.status === 400) {
            setPageNotFound(true)
          } else {
            setTitle(res?.title.includes(':') ? _.trim(res.title.split(':')[1]) : res.title)
            setOriginalTitle(res?.title.includes(':') ? _.trim(res.title.split(':')[1]) : res.title)
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
              time: res.time_part_1 || 0,
              totalScore:
                !_.isEmpty(cloneOne) && cloneOne.length
                  ? cloneOne.reduce((a, b) => {
                      return { point: a.point + b.point }
                    })
                  : 0,
              groups: groupsOne,
              partType: PART.one,
            })
            setPartTwo({
              quiz: quizTwo,
              total: quizTwo.length || 0,
              answered: 0,
              correct: 0,
              score: 0,
              time: res.time_part_2 || 0,
              totalScore:
                !_.isEmpty(cloneTwo) && cloneTwo.length
                  ? cloneTwo.reduce((a, b) => {
                      return { point: a.point + b.point }
                    })
                  : 0,
              groups: groupsTwo,
              partType: PART.two,
              listeningAudioSrc: res.listeningAudioSrc,
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
    const css = ['css/trial-tests/webview.css', 'css/trial-tests/switch.css']
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

  useEffect(() => {
    if (screen === SCREEN.home) {
      setTitle(originalTitle)
    } else {
      if (selectedPart === PART.one) setTitle('文字・語彙 - 文法 - 読解')
      else setTitle('聴解')
    }
  }, [screen, selectedPart, originalTitle])
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
                          paddingTop: 10,
                          lineHeight: 1.6,
                          fontWeight: 'bold',
                          fontFamily: "'Source Sans Pro', sans-serif",
                        }}
                      >
                        <p style={{ fontSize: 20 }}>文字・語彙 - 文法 - 読解</p>
                        <p style={{ fontWeigth: 'heavy' }}>
                          <CBadge color="info">{partOne.total} 問</CBadge>{' '}
                          <CBadge color="success">{partOne.totalScore.point} 点</CBadge>{' '}
                          <CBadge color="danger">{partOne.time} 分</CBadge>
                        </p>
                        <hr
                          style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginLeft: 20,
                            marginRight: 20,
                          }}
                        ></hr>
                        {partOneStatus === TEST_STATUS.new && (
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
                              setScreen(SCREEN.TEST)
                              setSelectedPart(PART.one)
                              setPartOneStatus(TEST_STATUS.doing)
                            }}
                          >
                            はじめよう
                          </button>
                        )}
                        {partOneStatus === TEST_STATUS.completed && (
                          <>
                            <p style={{ fontWeigth: 'heavy', margin: 5, padding: 1 }}>
                              <CBadge color="info">
                                {partOne.answered} | {partOne.total} 問
                              </CBadge>{' '}
                              <CBadge color="success">
                                {partOne.score} | {partOne.totalScore.point} 点
                              </CBadge>{' '}
                              <CBadge color="danger">{msToTime(partOneDuration)}</CBadge>
                            </p>
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
                                padding: 10,
                              }}
                              onClick={() => {
                                setSelectedPart(PART.one)
                                setScreen(SCREEN.TEST)
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
                          marginBottom: 20,
                          paddingTop: 10,
                          lineHeight: 1.6,
                          fontWeight: 'bold',
                          fontFamily: "'Source Sans Pro', sans-serif",
                        }}
                      >
                        <p style={{ fontSize: 20 }}>聴解</p>
                        <p style={{ fontWeigth: 'heavy' }}>
                          <CBadge color="info">{partTwo.total} 問</CBadge>{' '}
                          <CBadge color="success">{partTwo.totalScore.point} 点</CBadge>{' '}
                          <CBadge color="danger">{partTwo.time} 分</CBadge>
                        </p>
                        <hr
                          style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginLeft: 20,
                            marginRight: 20,
                          }}
                        ></hr>
                        {partTwoStatus === TEST_STATUS.new && (
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
                              setScreen(SCREEN.TEST)
                              setSelectedPart(PART.two)
                              setPartTwoStatus(TEST_STATUS.doing)
                            }}
                          >
                            はじめよう
                          </button>
                        )}
                        {partTwoStatus === TEST_STATUS.completed && (
                          <>
                            <p style={{ fontWeigth: 'heavy', margin: 5, padding: 1 }}>
                              <CBadge color="info">
                                {partTwo.answered} | {partTwo.total} 問
                              </CBadge>{' '}
                              <CBadge color="success">
                                {partTwo.score} | {partTwo.totalScore.point} 点
                              </CBadge>{' '}
                              <CBadge color="danger">{msToTime(partTwoDuration)}</CBadge>
                            </p>
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
                                padding: 10,
                              }}
                              onClick={() => {
                                setSelectedPart(PART.two)
                                setScreen(SCREEN.TEST)
                              }}
                            >
                              Xem lại
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                  {screen === SCREEN.TEST && selectedPart === PART.one && (
                    <Part
                      part={partOne}
                      updateScore={setPartOne}
                      setScreen={setScreen}
                      status={partOneStatus}
                      updateStatus={setPartOneStatus}
                      duration={partOneDuration}
                      updateDuration={setPartOneDuration}
                    />
                  )}
                  {screen === SCREEN.TEST && selectedPart === PART.two && (
                    <Part
                      part={partTwo}
                      updateScore={setPartTwo}
                      setScreen={setScreen}
                      status={partTwoStatus}
                      updateStatus={setPartTwoStatus}
                      duration={partTwoDuration}
                      updateDuration={setPartTwoDuration}
                    />
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
