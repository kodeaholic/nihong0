/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import PropTypes, { string } from 'prop-types'
import { CRow, CCol, CButton } from '@coreui/react'
import { Redirect, useParams } from 'react-router-dom'
import { dialogBoardService } from '../../../services/api/dialogBoardService'
import _ from 'lodash'
import { htmlEntityDecode } from '../../../helpers/htmlentities'
import renderHTML from 'react-render-html'
import Plyr from 'plyr-react'
import 'plyr-react/dist/plyr.css'
import './mobilev2.css'
import './modal.css'
import { hhmmssToSeconds } from 'src/helpers/time.helper'
import { maleAvatarBase64Src, femaleAvatarBase64Src } from './image'
import Loader from 'src/components/Loader'
import { sleep } from 'src/helpers/common'
const DIALOG = {
  STANDARD_SPEED_RATE: 1,
  MALE: 1,
  FEMALE: 2,
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
  STANDARD_TIME_INTERVAL: 100,
}

const ListItem = (props) => {
  const { data } = props
  const [audio, setAudio] = useState(new Audio(data.audioSrc))
  const [audioButtonClassName, setAudioButtonClassName] = useState('background-material_play')
  const onButtonClick = (e) => {
    const currentClass = e.target.classList[1]
    if (currentClass.includes('play')) {
      setAudioButtonClassName('background-material_pause')
      if (audio) audio.play()
    } else {
      setAudioButtonClassName('background-material_play')
      if (audio) audio.pause()
    }
  }
  const avatarClass =
    data.role === DIALOG.FEMALE ? 'background-material_female' : 'background-material_male'
  useEffect(() => {
    audio.addEventListener('ended', () => setAudioButtonClassName('background-material_play'))
    return () => {
      audio.removeEventListener('ended', () => setAudioButtonClassName('background-material_play'))
    }
  }, [audio])
  let string = htmlEntityDecode(data.contentFurigana)
  string = string.replaceAll('style="background: white;"', '')
  string = string.replaceAll('style="background: white"', '')
  string = string.replaceAll('style="background:white"', '')
  return (
    <div className="listItem">
      <div className={`listItem_left ${audioButtonClassName}`} onClick={onButtonClick} />
      <div className="listItem_right">
        {/* <div className={`listItem_avatar ${avatarClass}`} /> */}
        <div className="content">{renderHTML(string)}</div>
      </div>
    </div>
  )
}
ListItem.propTypes = {
  data: PropTypes.object,
}
const MobileDialogBoardV2 = (props) => {
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
  const [loading, setLoading] = useState(true)

  //window.player = undefined
  const toggleScript = (e) => {
    const button = e.target
    const script = document.getElementById('script-toggle')
    const translate = document.getElementById('translate-toggle')
    const current = script.className
    if (current === 'visible') {
      button.innerHTML = 'Xem lời thoại gốc'
      script.className = 'hidden'
      translate.className = 'visible'
    } else {
      button.innerHTML = 'Xem lời dịch'
      script.className = 'visible'
      translate.className = 'hidden'
    }
  }

  const ScriptButton = () => (
    <button className="button" type="button" onClick={(e) => toggleScript(e)}>
      Xem lời thoại
    </button>
  )
  useEffect(() => {
    if (boardId) {
      async function loadData() {
        await sleep(3000)
        dialogBoardService
          .getBoard(boardId)
          .then((res) => {
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
              }
              setLoading(false)
            }
          })
          .catch((error) => {
            alert(error)
            setLoading(false)
          })
      }
      loadData()
    }
  }, [boardId])
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
        {/* <CRow>
          <CCol xs="12" sm="12" lg="12" md="12">
            <div
              style={{
                width: '100%',
                height: 'calc(50vh)',
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
            <div className="animated-box in" style={{ margin: '5px', padding: '5px' }}>
              <div
                style={{
                  height: 'calc(35vh - 10px)',
                  overflowY: 'scroll',
                  margin: '5px',
                  padding: '10px',
                  backgroundColor: '#dbd4c8',
                  borderRadius: '5px',
                }}
              >
                <div id="script-toggle" className="visible">
                  {renderHTML(script)}
                </div>
                <div id="translate-toggle" className="hidden">
                  {renderHTML(subtitle)}
                </div>
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                height: 'calc(10vh)',
                backgroundColor: '#dbd4c8',
                paddingTop: '5px',
              }}
            ></div>
          </CCol>
        </CRow> */}
        <Loader loading={loading} />
        {!loading && (
          <div className="viewContainer">
            <div className="listContainer">
              {tracks.map(function (item, index) {
                return <ListItem data={item} key={`track-${index}`} />
              })}
            </div>
            <div className="mainAudioPlayerContainer">
              <Plyr
                source={src}
                options={{
                  resetOnEnd: true,
                  displayDuration: true,
                  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
                  controls: ['play', 'progress', 'current-time', 'settings'],
                }}
              />
            </div>
            {/* <div className="buttonToggleContainer"><ScriptButton /></div> */}
            <div className="container">
              <details>
                <summary>
                  <div className="button">Hiện lời dịch</div>
                  <div className="details-modal-overlay"></div>
                </summary>
                <div className="details-modal">
                  <div className="details-modal-close">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="details-modal-title">
                    <h1>Lời dịch</h1>
                  </div>
                  <div className="details-modal-content">{renderHTML(subtitle)}</div>
                </div>
              </details>
            </div>
          </div>
        )}
      </>
    )
  }
}

MobileDialogBoardV2.propTypes = {}

export default MobileDialogBoardV2
