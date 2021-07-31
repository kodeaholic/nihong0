import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PropTypes, { string } from 'prop-types'
import { DraggableArea } from 'react-draggable-tags'
import { getViewAction, getLastPartFromPathName } from 'src/services/helpers/routeHelper'
import deleteBtn from '../../../assets/images/delete.png'
import deleteBtn2x from '../../../assets/images/delete@2x.png'
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
import { Redirect } from 'react-router-dom'
import { dialogBoardService } from '../../../services/api/dialogBoardService'
import _ from 'lodash'
import { htmlEntityEncode, htmlEntityDecode } from '../../../helpers/htmlentities'
import renderHTML from 'react-render-html'
const Tracks = (props) => {
  const { tracks, onItemChange, disabled } = props
  // console.log(tracks)
  if (_.isEmpty(tracks)) return <></>
  return (
    <>
      {tracks.length &&
        _.isArray(tracks) &&
        tracks.map((item, index) => {
          return (
            <Track
              data={item}
              id={index}
              key={index}
              parentTracks={tracks}
              onChange={onItemChange}
              disabled={disabled}
            />
          )
        })}
    </>
  )
}
Tracks.propTypes = {
  tracks: PropTypes.array,
  onItemChange: PropTypes.func,
  disabled: PropTypes.bool,
}
const Track = (props) => {
  let { data, id, parentTracks, onChange, disabled } = props
  if (_.isEmpty(data))
    data = {
      content: '',
      contentMeaning: '',
      contentFurigana: '',
      start: '00:00:00',
      stop: '00:00:00',
      role: 1,
    }

  const handleInputChange = (e) => {
    let { id, name, value } = e.target
    let index = parseInt(id.replace(`${name}-`, ''))
    if (parentTracks[index]) {
      parentTracks[index][name] = value
      onChange(parentTracks)
    }
  }
  const handleTimeInputChange = (id, name, value) => {
    let index = parseInt(id)
    if (parentTracks[index]) {
      parentTracks[index][name] = value
      onChange(parentTracks)
    }
  }
  const handleDeleteClicked = (e) => {
    // console.log(e.target)
    let { id } = e.target
    id = id.replace('delete_', '')
    let index = parseInt(id)
    if (parentTracks[index]) {
      let arr = [...parentTracks]
      arr.splice(index, 1)
      onChange(arr)
    }
  }

  return (
    <>
      <CRow>
        {/* <CCol sm="12" style={{ marginTop: '10px' }}>
          <CInputGroup>
            <CInputGroupText id={`content-label-${id}`}>
              Lời {id + 1} tiếng Nhật (không rắc Hiragana)
            </CInputGroupText>
            {!disabled && (
              <CFormControl
                name="content"
                id={`content-${id}`}
                aria-describedby="content-label"
                defaultValue={data.content}
                onChange={handleInputChange}
                disabled={disabled}
                type="text"
                component="textarea"
                rows="2"
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid grey',
                  borderRadius: '0 5px 5px 0',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                }}
              >
                {renderHTML(data.content)}
              </div>
            )}
            {!disabled && (
              <CInputGroupText
                id={`delete_${id}`}
                onClick={handleDeleteClicked}
                style={{ cursor: 'pointer' }}
              >
                Gỡ bỏ lời {id + 1}
              </CInputGroupText>
            )}
          </CInputGroup>
        </CCol> */}
        <CCol sm="12" style={{ marginTop: '10px' }}>
          <CInputGroup>
            <CInputGroupText id={`contentFurigana-label-${id}`}>
              Lời {id + 1} tiếng Nhật
            </CInputGroupText>
            {!disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  width: 'auto',
                }}
                onClick={(e) => {
                  const contentFuriganaEditor = window.CKEDITOR.replace(`contentFurigana-${id}`)
                  contentFuriganaEditor.on('change', function (e) {
                    let index = parseInt(id)
                    let tracks = [...parentTracks]
                    if (tracks[index]) {
                      tracks[index]['contentFurigana'] = contentFuriganaEditor.getData()
                      onChange(tracks)
                    }
                  })
                }}
                name="contentFurigana"
                id={`contentFurigana-${id}`}
                aria-describedby="contentFurigana-label"
                defaultValue={data.contentFurigana}
                onChange={handleInputChange}
                disabled={disabled}
                type="text"
                component="textarea"
                rows="3"
              >
                {renderHTML(parentTracks[parseInt(id)]['contentFurigana'])}
              </div>
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                  width: 'auto',
                }}
              >
                {renderHTML(parentTracks[parseInt(id)]['contentFurigana'])}
              </div>
            )}
            {!disabled && (
              <CInputGroupText
                id={`delete_${id}`}
                onClick={handleDeleteClicked}
                style={{ cursor: 'pointer' }}
              >
                Gỡ bỏ lời {id + 1}
              </CInputGroupText>
            )}
          </CInputGroup>
        </CCol>
        {/* <CCol sm="12" style={{ marginTop: '10px' }}>
          <CInputGroup>
            <CInputGroupText id={`contentMeaning-label-${id}`}>
              Lời {id + 1} dịch nghĩa
            </CInputGroupText>
            {!disabled && (
              <CFormControl
                name="contentMeaning"
                id={`contentMeaning-${id}`}
                aria-describedby="contentMeaning-label"
                defaultValue={data.contentMeaning}
                onChange={handleInputChange}
                disabled={disabled}
                type="text"
                component="textarea"
                rows="2"
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid #b1b7c1',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                  cursor: 'text',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                  width: 'auto',
                }}
              >
                {renderHTML(data.contentMeaning)}
              </div>
            )}
          </CInputGroup>
        </CCol> */}
      </CRow>
      <CRow>
        <CCol sm="4" style={{ marginTop: '5px', marginBottom: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`role-label-${id}`}>Vai</CInputGroupText>
            <CFormSelect
              id={`role-${id}`}
              aria-label={`role-${id}`}
              defaultValue={data.role}
              name="role"
              onChange={handleInputChange}
              disabled={disabled}
            >
              <option value="1">Nam</option>
              <option value="2">Nữ</option>
            </CFormSelect>
          </CInputGroup>
        </CCol>
        {/* <CCol sm="4" style={{ marginTop: '5px', marginBottom: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`start-${id}`}>Thời điểm bắt đầu</CInputGroupText>
            <TimePicker
              name="start"
              maxDetail="second"
              clearIcon={null}
              clockIcon={null}
              minTime="00:00:00"
              maxTime="01:00:00"
              openClockOnFocus={false}
              value={data.start}
              onChange={(value) => {
                handleTimeInputChange(id, 'start', value)
              }}
            />
          </CInputGroup>
        </CCol>
        <CCol sm="4" style={{ marginTop: '5px', marginBottom: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`stop-${id}`}>Thời điểm kết thúc</CInputGroupText>
            <TimePicker
              name="stop"
              maxDetail="second"
              clearIcon={null}
              clockIcon={null}
              minTime="00:00:00"
              maxTime="01:00:00"
              openClockOnFocus={false}
              value={data.stop}
              onChange={(value) => {
                handleTimeInputChange(id, 'stop', value)
              }}
            />
          </CInputGroup>
        </CCol> */}
        <CCol sm="8" style={{ marginTop: '5px' }}>
          <CInputGroup>
            <CInputGroupText id={`audioSrc-label-${id}`}>Link audio</CInputGroupText>
            {!disabled && (
              <CFormControl
                name="audioSrc"
                id={`audioSrc-${id}`}
                aria-describedby="audioSrc-label"
                defaultValue={data.audioSrc}
                onChange={handleInputChange}
                disabled={disabled}
                type="text"
              />
            )}
            {disabled && (
              <div
                style={{
                  border: '1px solid grey',
                  borderRadius: '0 5px 5px 0',
                  backgroundColor: '#fff',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                  paddingTop: '5px',
                }}
              >
                {data.audioSrc}
              </div>
            )}
          </CInputGroup>
        </CCol>
      </CRow>
      {!_.isEmpty(data.audioSrc) && (
        <CRow>
          <CCol xs="12" sm="12" lg="12" md="12">
            <audio controls style={{ width: '100%' }} preload="auto" type="audio/mpeg">
              <source src={data.audioSrc} />
              Your browser does not support the audio element.
            </audio>
          </CCol>
        </CRow>
      )}
    </>
  )
}

Track.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
  parentTracks: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

const DialogBoard = (props) => {
  const pathName = props.location.pathname
  const viewAction = getViewAction(pathName)
  const boardId = viewAction === 'add' ? undefined : getLastPartFromPathName(pathName)
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [free, setFree] = useState(1)
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [tracks, setTracks] = useState([])
  const [audioSrc, setAudioSrc] = useState([])
  const [script, setScript] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const addTrack = () => {
    const data = {
      content: '',
      contentMeaning: '',
      contentFurigana: '',
      start: 0,
      stop: 0,
      role: 1,
    }
    setTracks([...tracks, data])
  }
  const savingCallback = (res) => {
    setSaving(false)
    if (res && res.code !== 400 && res.code !== 403 && res.code !== 401 && res.code !== 500) {
      toast.success(`Lưu thành công bài học`, {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setRedirecTo({
        isRedirected: true,
        redirectedPath: `/dialog-boards/getBoard/${res.id}`,
      })
    } else {
      if (res.code === 400) {
        toast.error(`${res.message}`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } else
        toast.error(`Có lỗi xảy ra khi tạo bài học`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
    }
  }
  const areTracksValidated = () => {
    let valid = true
    tracks.forEach((item) => {
      if (
        !(
          item.contentFurigana &&
          // item.contentMeaning &&
          // item.start &&
          // item.stop &&
          // item.content &&
          item.role &&
          item.audioSrc
        )
      )
        valid = false
    })
    return valid
  }
  const handleSubmit = () => {
    if (areTracksValidated()) {
      setSaving(true)
      /**Handle tracks data */
      let newTracks = [...tracks]
      let resultTracks = newTracks.map(function (item) {
        let newItem = { ...item }
        newItem.contentFurigana = htmlEntityEncode(item.contentFurigana)
        newItem.start = '00:00:00'
        newItem.stop = '00:00:00'
        return newItem
      })
      console.log(resultTracks)
      const boardBody = {
        title,
        level: level ? level : 'N5',
        script: htmlEntityEncode(script),
        subtitle: htmlEntityEncode(subtitle),
        audioSrc,
        free,
        tracks: resultTracks,
      }
      viewAction === 'add'
        ? dialogBoardService.createBoard(boardBody).then(savingCallback)
        : dialogBoardService.updateBoard(boardBody, boardId).then(savingCallback)
    } else {
      toast.error(`Vui lòng không để trống ô nào trong các phân đoạn lời thoại`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }
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

  if (redirectTo.isRedirected) {
    return <Redirect to={redirectTo.redirectedPath} />
  } else
    return (
      <>
        <CRow>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="title" className="col-sm-2 col-form-label">
                Tiêu đề <span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  type="text"
                  id="title"
                  required
                  placeholder="Ví dụ: Bài 01"
                  onChange={(e) => setTitle(e.target.value)}
                  defaultValue={title}
                  disabled={viewAction === 'get'}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="level" className="col-sm-2 col-form-label">
                Trình độ
              </CFormLabel>
              <CCol sm="10">
                <CFormSelect
                  sm="10"
                  id="level"
                  onChange={(e) => setLevel(e.target.value)}
                  defaultValue={level}
                  disabled={viewAction === 'get'}
                >
                  <option value="N5" selected={level === 'N5'}>
                    N5
                  </option>
                  <option value="N4" selected={level === 'N4'}>
                    N4
                  </option>
                  <option value="N3" selected={level === 'N3'}>
                    N3
                  </option>
                  <option value="N2" selected={level === 'N2'}>
                    N2
                  </option>
                  <option value="N1" selected={level === 'N1'}>
                    N1
                  </option>
                </CFormSelect>
              </CCol>
            </CRow>
            <fieldset className="row mb-3">
              <legend className="col-form-label col-sm-2 pt-0">Loại bài</legend>
              <CCol sm="10">
                <CFormCheck
                  id="free"
                  label="Miễn phí"
                  checked={free === 1}
                  onChange={() => setFree(1 - free)}
                  disabled={viewAction === 'get'}
                />
              </CCol>
            </fieldset>
            <CRow>
              <CCol xs="12" sm="2" lg="2" style={{ marginBottom: '5px' }}>
                <CFormLabel htmlFor="audioSrc">
                  URL file audio <span style={{ color: 'red' }}>*</span>
                </CFormLabel>
              </CCol>
              <CCol xs="12" sm="10" lg="10" style={{ marginBottom: '5px' }}>
                <CFormControl
                  type="text"
                  component="textarea"
                  id="audioSrc"
                  placeholder="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
                  onChange={(e) => setAudioSrc(e.target.value)}
                  rows={2}
                  defaultValue={audioSrc}
                  disabled={viewAction === 'get'}
                />
              </CCol>
            </CRow>
            {!_.isEmpty(audioSrc) && (
              <CRow>
                <CCol xs="12" sm="12" lg="12" md="12">
                  <audio controls style={{ width: '100%' }} preload="auto" type="audio/mpeg">
                    <source src={audioSrc} />
                    Your browser does not support the audio element.
                  </audio>
                </CCol>
              </CRow>
            )}
            <CRow>
              <CFormLabel className="col-sm-2 col-form-label">Các phân đoạn lời thoại</CFormLabel>
              <CCol sm="10">
                <Tracks tracks={tracks} onItemChange={setTracks} disabled={viewAction === 'get'} />
              </CCol>
            </CRow>
            {/* <CRow className="mb-3">
              <CFormLabel htmlFor="script" className="col-sm-2 col-form-label">
                Lời thoại tiếng Nhật
              </CFormLabel>
              <CCol sm="10">
                {viewAction !== 'get' && (
                  <CFormControl
                    type="text"
                    id="script"
                    placeholder="Phần II: Câu hỏi + Lời thoại tiếng Nhật"
                    component="textarea"
                    rows="5"
                    onChange={(e) => setScript(e.target.value)}
                    defaultValue={script}
                    disabled={viewAction === 'get'}
                    onFocus={(e) => {
                      const scriptEditor = window.CKEDITOR.replace('script')
                      scriptEditor.on('change', function (e) {
                        setScript(scriptEditor.getData())
                      })
                    }}
                  />
                )}
                {viewAction === 'get' && (
                  <div
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#fff',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      marginTop: '7px',
                    }}
                  >
                    {renderHTML(script)}
                  </div>
                )}
              </CCol>
            </CRow> */}
            <CRow className="mb-3">
              <CFormLabel htmlFor="subtitle" className="col-sm-2 col-form-label">
                Lời thoại dịch tiếng Việt
              </CFormLabel>
              <CCol sm="10">
                {viewAction !== 'get' && (
                  <div
                    id="subtitle"
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#fff',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      marginTop: '7px',
                      cursor: 'text',
                    }}
                    onClick={(e) => {
                      const subtitleEditor = window.CKEDITOR.replace('subtitle')
                      subtitleEditor.on('change', function (e) {
                        setSubtitle(subtitleEditor.getData())
                      })
                    }}
                  >
                    {renderHTML(subtitle)}
                  </div>
                )}
                {viewAction === 'get' && (
                  <div
                    style={{
                      border: '1px solid grey',
                      borderRadius: '5px 5px 5px 5px',
                      backgroundColor: '#D8DBE0',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      paddingTop: '5px',
                      marginTop: '7px',
                    }}
                  >
                    {renderHTML(subtitle)}
                  </div>
                )}
              </CCol>
            </CRow>
            <CRow>
              {viewAction !== 'get' && (
                <>
                  <CCol className="col-sm-6" style={{ marginTop: '5px' }}>
                    <CButtonGroup>
                      <CButton
                        onClick={handleSubmit}
                        disabled={!title.length}
                        style={{ color: 'white', marginRight: '5px' }}
                      >
                        LƯU BÀI HỌC
                      </CButton>
                      <CButton onClick={addTrack} color="success">
                        THÊM PHÂN ĐOẠN LỜI THOẠI
                      </CButton>
                    </CButtonGroup>
                  </CCol>
                </>
              )}
            </CRow>

            {viewAction === 'get' && (
              <CRow>
                <CCol className="col-sm-3">
                  {saving && <CSpinner />}
                  {!saving && (
                    <CButton
                      style={{ color: 'white', marginBottom: '10px' }}
                      onClick={() => {
                        setRedirecTo({
                          isRedirected: true,
                          redirectedPath: `/dialog-boards/editBoard/${boardId}`,
                        })
                      }}
                    >
                      SỬA BÀI NÀY
                    </CButton>
                  )}
                </CCol>
              </CRow>
            )}

            {viewAction === 'get' && (
              <CRow>
                <CCol className="col-sm-3">
                  <CButton
                    color="danger"
                    style={{ color: 'white', marginBottom: '10px' }}
                    onClick={() => setVisible(!visible)}
                  >
                    XOÁ BÀI NÀY
                  </CButton>
                  <CModal visible={visible} onDismiss={() => setVisible(false)}>
                    <CModalHeader onDismiss={() => setVisible(false)}>
                      <CModalTitle>XÁC NHẬN XOÁ BÀI NÀY</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      Bạn chắc chắn muốn xoá <CBadge color="success">{title}</CBadge> ?
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={() => setVisible(false)}>
                        HUỶ BỎ
                      </CButton>
                      {deleting && <CSpinner />}
                      {!deleting && (
                        <CButton
                          color="danger"
                          onClick={() => {
                            setDeleting(true)
                            dialogBoardService.deleteBoard(boardId).then((res) => {
                              setDeleting(false)
                            })
                            toast.success(`Xoá thành công`, {
                              position: 'top-right',
                              autoClose: 2500,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                            })
                            setRedirecTo({
                              isRedirected: true,
                              redirectedPath: '/dialog-boards',
                            })
                          }}
                        >
                          XOÁ
                        </CButton>
                      )}
                    </CModalFooter>
                  </CModal>
                </CCol>
              </CRow>
            )}
            {/* {viewAction === 'get' && (
              <CRow>
                <CCol className="col-sm-3">
                  {saving && <CSpinner />}
                  {!saving && (
                    <CButton
                      style={{ color: 'white', marginBottom: '10px' }}
                      onClick={() => {
                        setRedirecTo({
                          isRedirected: true,
                          redirectedPath: `/dialog-boards/mobile/${boardId}`,
                        })
                      }}
                    >
                      XEM GIAO DIỆN MOBILE
                    </CButton>
                  )}
                </CCol>
              </CRow>
            )} */}
            {viewAction === 'get' && (
              <CRow>
                <CCol className="col-sm-3">
                  {saving && <CSpinner />}
                  {!saving && (
                    <CButton
                      style={{ color: 'white', marginBottom: '10px' }}
                      onClick={() => {
                        setRedirecTo({
                          isRedirected: true,
                          redirectedPath: `/dialog-boards/mobilev2/${boardId}`,
                        })
                      }}
                    >
                      XEM GIAO DIỆN MOBILE
                    </CButton>
                  )}
                </CCol>
              </CRow>
            )}
          </CForm>
        </CRow>
      </>
    )
}

DialogBoard.propTypes = {}

export default DialogBoard
