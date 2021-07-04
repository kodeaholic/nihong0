/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import PropTypes, { string } from 'prop-types'
import { CRow, CCol, CButton } from '@coreui/react'
import { Redirect, useParams } from 'react-router-dom'
import { dialogBoardService } from '../../../services/api/dialogBoardService'
import _ from 'lodash'
import { htmlEntityEncode, htmlEntityDecode } from '../../../helpers/htmlentities'
import renderHTML from 'react-render-html'
import Plyr from 'plyr-react'
import 'plyr-react/dist/plyr.css'
import './mobile.css'
import { hhmmssToSeconds } from 'src/helpers/time.helper'
import { maleAvatarBase64Src, femaleAvatarBase64Src, coupleAvatarBase64Src } from './image'
import { makeElementDraggableOnMobile } from './drag'
const DIALOG = {
  STANDARD_SPEED_RATE: 1,
  MALE: 1,
  FEMALE: 2,
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
  STANDARD_TIME_INTERVAL: 100,
}
const MobileDialogBoard = (props) => {
  const { boardId } = useParams()
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [free, setFree] = useState(1)
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const [tracks, setTracks] = useState([])
  const [audioSrc, setAudioSrc] = useState([])
  const [script, setScript] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [displayScript, setDisplayScript] = useState(true)
  const [player, setPlayer] = useState(null)
  const ref = useRef()
  /* Load item */
  window.interval = undefined
  window.currentTime = 0
  window.currentSpeedRate = DIALOG.STANDARD_SPEED_RATE
  window.playerStatus = ''
  window.duration = 0
  const toggleScript = () => {
    const script = document.getElementById('script-toggle')
    const translate = document.getElementById('translate-toggle')
    const current = script.className
    if (current === 'visible') {
      script.className = 'hidden'
      translate.className = 'visible'
    } else {
      script.className = 'visible'
      translate.className = 'hidden'
    }
  }
  const updateSubtitle = () => {
    let index = _.findIndex(
      window.tracks,
      function (item) {
        return item.start <= window.currentTime && item.stop >= window.currentTime
      },
      0,
    )
    if (index > -1) {
      const subtitleContainer = document.getElementById('subtitleContainer')
      const translateContainer = document.getElementById('translateContainer')
      while (subtitleContainer.firstChild) {
        subtitleContainer.removeChild(subtitleContainer.lastChild)
      }
      while (translateContainer.firstChild) {
        translateContainer.removeChild(translateContainer.lastChild)
      }
      let found = window.tracks[index]
      let imgSrc = found.role === DIALOG.MALE ? maleAvatarBase64Src : femaleAvatarBase64Src
      /* content */
      const imgContent = document.createElement('img')
      imgContent.src = imgSrc
      imgContent.width = 40
      imgContent.height = 40
      const content = document.createElement('span')
      content.className = 'subtitle-text'
      content.innerHTML = found.content
      subtitleContainer.appendChild(imgContent)
      subtitleContainer.appendChild(content)
      /* translate */
      const imgTranslate = document.createElement('img')
      imgTranslate.src = imgSrc
      imgTranslate.width = 40
      imgTranslate.height = 40
      const translate = document.createElement('span')
      translate.className = 'subtitle-text'
      translate.innerHTML = found.contentMeaning
      translateContainer.appendChild(imgTranslate)
      translateContainer.appendChild(translate)
    }
  }
  useEffect(() => {
    if (boardId) {
      dialogBoardService.getBoard(boardId).then((res) => {
        if (res) {
          if (
            res.status === 401 ||
            res.status === 404 ||
            res.status === 400 ||
            res.status === 500
          ) {
            toast.error(`Bài học không tồn tại`, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            setRedirecTo({ isRedirected: true, redirectedPath: '/dialog-boards' })
          } else {
            setData(res)
            setFree(res.free)
            setTitle(res.title)
            setLevel(res.level)
            setScript(res.script ? htmlEntityDecode(res.script) : '')
            setSubtitle(res.subtitle ? htmlEntityDecode(res.subtitle) : '')
            setAudioSrc(res.audioSrc)
            let initialTracks = res.tracks
            let clonedTrackes = [...initialTracks]
            let resultTracks = clonedTrackes.map(function (item) {
              let newItem = { ...item }
              newItem.contentFurigana = htmlEntityDecode(item.contentFurigana)
              if (_.isEmpty(item.start) || item.start >= 0) newItem.start = '00:00:00'
              if (_.isEmpty(item.stop) || item.stop >= 0) newItem.stop = '00:00:00'
              newItem.start = hhmmssToSeconds(newItem.start)
              newItem.stop = hhmmssToSeconds(newItem.stop)
              return newItem
            })

            setTracks(resultTracks)
            window.tracks = resultTracks
            console.log(resultTracks)
          }
        }
      })
    }
  }, [boardId])
  useEffect(() => {
    // FAB
    makeElementDraggableOnMobile('fabContainer')
    // console.log(ref.current.plyr)
    if (ref.current && ref.current.plyr) {
      let pl = ref.current.plyr
      pl.on('loadeddata', function (e) {
        window.duration = e.detail.plyr.duration
      })
      pl.on('play', function () {
        window.playerStatus = DIALOG.PLAYING
        let period = DIALOG.STANDARD_TIME_INTERVAL / window.currentSpeedRate
        // console.log('Play')
        let newInterval = setInterval(() => {
          updateSubtitle()
          window.currentTime = window.currentTime + 0.1
          // console.log(window.currentTime)
        }, period)
        window.interval = newInterval
      })
      pl.on('ratechange', function (e) {
        // console.log('ratechange')
        if (window.interval) {
          clearInterval(window.interval)
        }
        window.currentSpeedRate = e.detail.plyr.speed
        if (window.playerStatus === DIALOG.PLAYING) {
          // console.log(window.playerStatus)
          // set new timeinterval
          let period = DIALOG.STANDARD_TIME_INTERVAL / window.currentSpeedRate
          let newInterval = setInterval(() => {
            updateSubtitle()
            window.currentTime = window.currentTime + 0.1
            // console.log(window.currentTime)
          }, period)
          window.interval = newInterval
        }
      })
      pl.on('pause', function (e) {
        window.playerStatus = DIALOG.PAUSED
        // console.log(DIALOG.PAUSED)
        if (window.interval) clearInterval(window.interval)
        if (window.currentTime + 0.1 >= window.duration) window.currentTime = 0 // stop and rewind
      })
      pl.on('stop', function (e) {
        // console.log('stop')
        window.playerStatus = DIALOG.STOPPED
        // console.log(DIALOG.STOPPED)
        if (window.interval) clearInterval(window.interval)
        window.currentTime = 0
      })
      pl.on('seeked', function (e) {
        // console.log('seeked')
        if (window.interval) {
          clearInterval(window.interval)
        }
        let newCurrentTime = e.detail.plyr.currentTime
        window.currentTime = newCurrentTime
        if (window.currentTime === window.duration) {
          window.currentTime = 0
        } else if (window.playerStatus === DIALOG.PLAYING) {
          // console.log(window.playerStatus)
          // set new timeinterval
          let period = DIALOG.STANDARD_TIME_INTERVAL / window.currentSpeedRate
          let newInterval = setInterval(() => {
            updateSubtitle()
            window.currentTime = window.currentTime + 0.1
            // console.log(window.currentTime)
          }, period)
          window.interval = newInterval
        }
      })
      pl.on('cuechange', function (e) {
        console.log('cuechange')
      })
      setPlayer(pl)
    }
  }, [])
  // useEffect(() => {
  //   if (player) {
  //     console.log(player)
  //   }
  // }, [player])
  const src = {
    type: 'audio',
    sources: [
      {
        src: audioSrc,
      },
    ],
  }
  if (redirectTo.isRedirected) {
    return <Redirect to={redirectTo.redirectedPath} />
  } else {
    return (
      <>
        <CRow>
          <CCol xs="12" sm="12" lg="12" md="12">
            <div
              style={{
                width: '100%',
                height: 'calc(50vh)',
                // paddingTop: 'calc(30vh)',
                backgroundImage: `url('https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569__480.jpg')`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingBottom: '0',
              }}
            >
              <div className="translate-container" id="translateContainer"></div>
              <div className="subtitle-container" id="subtitleContainer">
                <img src={maleAvatarBase64Src} width={40} height={40} />
                <img src={femaleAvatarBase64Src} width={40} height={40} />
                <span className="subtitle-text">Tuỳ chọn tắt tiếng nam/nữ</span>
              </div>
              <Plyr
                source={src}
                ref={ref}
                options={{
                  resetOnEnd: true,
                  displayDuration: true,
                  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
                  controls: ['play', 'progress', 'current-time', 'settings'],
                }}
              />
            </div>
            <div
              style={{
                height: 'calc(35vh - 10px)',
                overflowY: 'scroll',
                margin: '5px',
                padding: '10px',
                backgroundColor: '#dbd4c8',
                border: '1px solid #BCAC92',
                borderRadius: '5px',
              }}
            >
              <div id="script-toggle" className="visible">
                {renderHTML(script)}
              </div>
              <div id="translate-toggle" className="hidden">
                {renderHTML(subtitle)}
              </div>
              {/* {window.currentTime} */}
            </div>
            <div
              style={{
                textAlign: 'center',
                height: 'calc(10vh)',
                backgroundColor: '#dbd4c8',
                paddingTop: '5px',
              }}
            >
              <button className="button" type="button" onClick={() => toggleScript()}>
                Xem lời thoại Việt
              </button>
            </div>
            <div id="fabContainer">
              <div className="fab" id="fab">
                <span className="fab-action-button">
                  <i className="fab-action-button__icon"></i>
                </span>
                <ul className="fab-buttons">
                  <li className="fab-buttons__item">
                    <a className="fab-buttons__link" data-tooltip="Tắt tiếng nữ">
                      <i className="icon-material icon-material_female"></i>
                    </a>
                  </li>
                  <li className="fab-buttons__item">
                    <a className="fab-buttons__link" data-tooltip="Tắt tiếng nam">
                      <i className="icon-material icon-material_male"></i>
                    </a>
                  </li>
                  <li className="fab-buttons__item">
                    <a className="fab-buttons__link" data-tooltip="Không tắt tiếng">
                      <i className="icon-material icon-material_couple"></i>
                      {/* <img src={coupleAvatarBase64Src} width="35" height="35" /> */}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </CCol>
        </CRow>
      </>
    )
  }
}

MobileDialogBoard.propTypes = {}

export default MobileDialogBoard
