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
      while (subtitleContainer.firstChild) {
        subtitleContainer.removeChild(subtitleContainer.lastChild)
      }
      let found = window.tracks[index]
      let imgSrc = found.role === DIALOG.MALE ? `avatars/boy_white.png` : `avatars/girl_white.png`
      const img = document.createElement('img')
      img.src = imgSrc
      img.width = 40
      img.height = 40
      const span = document.createElement('span')
      span.className = 'subtitle-text'
      span.innerHTML = found.content
      subtitleContainer.appendChild(img)
      subtitleContainer.appendChild(span)
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
              <div className="subtitle-container" id="subtitleContainer">
                <img src="avatars/boy_white.png" width={40} height={40} />
                <img src="avatars/girl_white.png" width={40} height={40} />
                <span className="subtitle-text">Chọn vai nam/nữ để bắt đầu bài học</span>
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
            <div style={{ height: 'calc(50vh)', overflowY: 'scroll', margin: '10px' }}>
              {renderHTML(script)}
              {/* {window.currentTime} */}
              <div style={{ textAlign: 'center' }}>
                <CButton style={{ backgroundColor: '#65DD57', border: 'none' }}>
                  Xem lời thoại Việt
                </CButton>
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
