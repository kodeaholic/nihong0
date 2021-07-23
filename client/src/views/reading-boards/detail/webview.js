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
import { Redirect, useParams } from 'react-router-dom'
import { readingBoardService } from 'src/services/api/readingBoardService'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { htmlEntityDecode } from '../../../helpers/htmlentities'
import PageNotFoundComponent from 'src/components/404'
import './webview.css'
const ReadingBoardWebView = (props) => {
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [free, setFree] = useState(1)
  const [content, setContent] = useState('')
  const [contentVn, setContentVn] = useState('')
  const [quiz, setQuiz] = useState([])
  const [pageNotFound, setPageNotFound] = useState(false)
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
          <header tabIndex="0"> {`Luyện đọc ${level} - ${title}`} </header>{' '}
          <div id="nav-container">
            <div className="bg"> </div>{' '}
            <div className="button" tabIndex="0">
              <span className="icon-bar"> </span> <span className="icon-bar"> </span>{' '}
              <span className="icon-bar"> </span>{' '}
            </div>{' '}
            <div id="nav-content" tabIndex="0">
              <ul>
                <li>
                  <a href="#0"> Home </a>{' '}
                </li>{' '}
                <li>
                  <a href="#0"> Services </a>{' '}
                </li>{' '}
              </ul>{' '}
            </div>{' '}
          </div>{' '}
          <main>
            <div className="content">
              <h2>
                Off - screen navigation using <span>: focus - within </span>{' '}
              </h2>{' '}
              <p>
                {' '}
                {`Adding yet another pure CSS technique to the list of off-screen navigation by
                "hacking" the :focus-within pseudo-class. Have a look at the code to see how it
                works.`}{' '}
              </p>{' '}
              <small>
                <strong> NB! </strong> Use a browser that supports :focus-within{' '}
              </small>{' '}
            </div>{' '}
          </main>{' '}
        </div>{' '}
      </>
    )
}

ReadingBoardWebView.propTypes = {}

export default ReadingBoardWebView
