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
const DIALOG = {
  STANDARD_SPEED_RATE: 1,
  MALE: 1,
  FEMALE: 2,
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
  STANDARD_TIME_INTERVAL: 1000,
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
  const [timeInterval, setTimeInterval] = useState(DIALOG.STANDARD_TIME_INTERVAL)
  const [playerState, setPlayerState] = useState({
    status: '',
    currentTime: 0,
    currentSpeedRate: 1,
    roleToMute: 0,
  })
  const ref = useRef()
  /* Load item */
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
              return newItem
            })
            setTracks(resultTracks)
          }
        }
      })
    }
  }, [boardId])
  //   useEffect(() => {
  //     const player = new Plyr('#player')
  //   }, [])
  useEffect(() => {
    console.log(ref.current.plyr)
    if (ref.current && ref.current.plyr) {
      let pl = ref.current.plyr
      pl.on('play', function () {
        const newPlayerState = { ...playerState }
        newPlayerState.status = DIALOG.PLAYING
        setPlayerState(newPlayerState)
        let period = DIALOG.STANDARD_TIME_INTERVAL / newPlayerState.currentSpeedRate
        console.log('Period: ', period)
        let newInterval = setInterval(() => {
          const plState = { ...playerState }
          plState.currentTime = plState.currentTime + 1
          console.log(plState)
        }, period)
        setTimeInterval(newInterval)
      })
      pl.on('ratechange', function (e) {
        const newPlayerState = { ...playerState }
        newPlayerState.currentSpeedRate = e.detail.plyr.speed
        console.log(newPlayerState)
        setPlayerState(newPlayerState)
      })
      setPlayer(pl)
    }
  }, [])
  useEffect(() => {
    if (player) {
      console.log(player)
    }
  }, [player])
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
                paddingTop: 'calc(40vh)',
                backgroundImage: `url('https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569__480.jpg')`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingBottom: '0',
              }}
            >
              <Plyr
                source={src}
                ref={ref}
                options={{
                  resetOnEnd: true,
                  displayDuration: true,
                  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
                }}
              />
            </div>
            <div style={{ height: 'calc(50vh)', overflowY: 'scroll', margin: '10px' }}>
              {renderHTML(script)}
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
