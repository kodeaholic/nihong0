import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { getViewAction, getLastPartFromPathName } from 'src/services/helpers/routeHelper'
import {
  CCard,
  CCardBody,
  CRow,
  CImage,
  CCol,
  CCardText,
  CBadge,
  CFormLabel,
  CFormControl,
  CButton,
  CSpinner,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalBody,
  CModalTitle,
} from '@coreui/react'
import {
  getHtmlEntityCodeFromDecodedString,
  htmlEntityEncode,
  htmlEntityDecode,
} from '../../../helpers/htmlentities'
import { svgService } from '../../../services/api/svgService'
import { cardService } from '../../../services/api/cardService'
import { Redirect } from 'react-router-dom'
import parse from 'html-react-parser'
import renderHTML from 'react-render-html'
const Card = (props) => {
  const pathName = props.location.pathname
  const viewAction = getViewAction(pathName)
  const cardId = viewAction === 'add' ? undefined : getLastPartFromPathName(pathName)
  const [data, setData] = useState({})
  const [input, setInput] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [disabledSearch, setDisabledSearch] = useState(true)
  const [htmlEntityCode, setHtmlEntityCode] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [characterContent, setCharacterContent] = useState('')
  const [srcSvg, setSrcSvg] = useState('avatars/default.png')
  const [meaning, setMeaning] = useState('')
  const [onField, setOnField] = useState('')
  const [kunField, setKunField] = useState('')
  const [onExample, setOnExample] = useState('')
  const [kunExample, setKunExample] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [redirectTo, setRedirecTo] = useState({ isRedirected: false, redirectedPath: '' })
  const [visible, setVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    // fetch svg src
    if (searchKey) {
      const svgCode = getHtmlEntityCodeFromDecodedString(searchKey)
      svgService.getSvg(svgCode, searchKey).then((res) => {
        if (res) {
          toast.success(`Tìm thấy  “${searchKey}”`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
          setSrcSvg(res.src)
          setHtmlEntityCode(res.htmlEntityCode)
          setCharacterContent(res.characterContent)
          setSvgCode(res.svgCode)
        } else {
          toast.error(`Không tìm thấy  “${searchKey}”`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      })
    }
  }, [searchKey])
  useEffect(() => {
    if (input) setDisabledSearch(false)
    else setDisabledSearch(true)
  }, [input])
  useEffect(() => {
    // fetch Card
    if (cardId) {
      cardService.getCard(cardId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404) {
            toast.error(`Thẻ không tồn tại`, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            setRedirecTo({ isRedirected: true, redirectedPath: '/cards' })
          } else {
            setData(res)
            setInput(res.letter)
            setMeaning(res.meaning)
            setNote(res.note)
            setOnField(res.onText)
            setOnExample(htmlEntityDecode(res.onTextExample))
            setKunField(res.kunText)
            setKunExample(htmlEntityDecode(res.kunTextExample))
            setSrcSvg(res.svgSrc)
            setSvgCode(res.code)
          }
        } else {
          toast.error(`Thẻ không tồn tại`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      })
    }
  }, [cardId])
  if (redirectTo.isRedirected) {
    return <Redirect to={redirectTo.redirectedPath} />
  } else
    return (
      <>
        <CRow>
          <CCol sm="6" style={{ marginTop: '5px' }}>
            <CRow>
              <CCol sm="8" xs="6">
                <div className="mb-3">
                  <CFormControl
                    type="text"
                    id="search"
                    style={{ marginTop: '10px' }}
                    aria-describedby="Nhập chữ muốn thêm"
                    placeholder="Nhập chữ muốn thêm"
                    defaultValue={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={viewAction !== 'add'}
                    required
                  />
                </div>
              </CCol>
              {viewAction === 'add' && (
                <CCol sm="4" xs="6">
                  <div className="mb-3">
                    <CButton
                      color="primary"
                      variant="outline"
                      style={{ marginTop: '10px', width: '100%' }}
                      disabled={disabledSearch}
                      onClick={() => setSearchKey(input)}
                    >
                      Tìm ảnh
                    </CButton>
                  </div>
                </CCol>
              )}
            </CRow>
            <CRow>
              <CCol sm="12">
                <CCard className="mb-4" style={{ marginTop: '10px' }}>
                  <CImage src={srcSvg} size="sm"></CImage>
                  <CCardBody className="text-center">
                    {characterContent && (
                      <CCardText>
                        Kí tự: <CBadge color="success">{characterContent}</CBadge>
                      </CCardText>
                    )}
                    {svgCode && (
                      <CCardText>
                        Code: <CBadge color="success">{svgCode}</CBadge>
                      </CCardText>
                    )}
                    {htmlEntityCode && (
                      <CCardText>
                        HTML Entity Code: <CBadge color="success">{htmlEntityCode}</CBadge>
                      </CCardText>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCol>
          <CCol sm="6" style={{ marginTop: '5px' }}>
            <CRow>
              <div className="mb-3">
                <CFormLabel htmlFor="meaning" style={{ marginTop: '5px' }}>
                  Giải nghĩa tiếng Việt
                </CFormLabel>
                <CFormControl
                  type="text"
                  id="meaning"
                  onChange={(e) => setMeaning(e.target.value)}
                  defaultValue={meaning}
                  disabled={viewAction === 'get'}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="note" style={{ marginTop: '5px' }}>
                  Mẹo nhớ
                </CFormLabel>
                <CFormControl
                  type="text"
                  id="note"
                  defaultValue={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={viewAction === 'get'}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="onField">On</CFormLabel>
                <CFormControl
                  type="text"
                  id="onField"
                  onChange={(e) => setOnField(e.target.value)}
                  disabled={viewAction === 'get'}
                  defaultValue={onField}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="onExample">
                  Ví dụ ON {viewAction === 'get' ? '' : ''}
                </CFormLabel>
                {viewAction !== 'get' && (
                  <div
                    id="onExample"
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
                      const onExampleEditor = window.CKEDITOR.replace('onExample')
                      onExampleEditor.on('change', function (e) {
                        setOnExample(onExampleEditor.getData())
                      })
                    }}
                  >
                    {renderHTML(onExample)}
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
                    {renderHTML(onExample)}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="kunField">Kun</CFormLabel>
                <CFormControl
                  type="text"
                  id="kunField"
                  onChange={(e) => setKunField(e.target.value)}
                  disabled={viewAction === 'get'}
                  defaultValue={kunField}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="kunExample">
                  Ví dụ KUN {viewAction === 'get' ? '' : ''}
                </CFormLabel>
                {viewAction !== 'get' && (
                  <div
                    id="kunExample"
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
                      const kunExampleEditor = window.CKEDITOR.replace('kunExample')
                      kunExampleEditor.on('change', function (e) {
                        setKunExample(kunExampleEditor.getData())
                      })
                    }}
                  >
                    {renderHTML(kunExample)}
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
                    {renderHTML(kunExample)}
                  </div>
                )}
              </div>
              {viewAction !== 'get' && (
                <div className="mb-3">
                  <CButton
                    color="primary"
                    className="px-4"
                    onClick={() => {
                      setIsSubmitting(true)
                      const data = {
                        letter: input,
                        meaning: meaning,
                        onText: onField,
                        onTextExample: htmlEntityEncode(onExample),
                        kunText: kunField,
                        kunTextExample: htmlEntityEncode(kunExample),
                        svgSrc: srcSvg,
                        code: svgCode,
                        note: note,
                      }
                      const callback = (res) => {
                        setIsSubmitting(false)
                        if (res && res.code !== 400 && res.code !== 403) {
                          toast.success(`Lưu thành công`, {
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
                            redirectedPath: `/cards/getCard/${res.id}`,
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
                            toast.error(`Có lỗi xảy ra khi tạo mới thẻ  “${searchKey}”`, {
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
                      viewAction === 'add'
                        ? cardService.createCard(data).then(callback)
                        : cardService.updateCard(data, cardId).then(callback)
                    }}
                    disabled={disabledSearch}
                  >
                    {isSubmitting ? <CSpinner /> : 'LƯU'}
                  </CButton>
                </div>
              )}
              {viewAction === 'get' && (
                <>
                  <div className="mb-3">
                    <CButton
                      color="primary"
                      className="px-4"
                      onClick={() => {
                        setRedirecTo({
                          isRedirected: true,
                          redirectedPath: `/cards/editCard/${cardId}`,
                        })
                      }}
                    >
                      SỬA THẺ NÀY
                    </CButton>
                    &nbsp;
                    <CButton onClick={() => setVisible(!visible)} color="danger">
                      XOÁ THẺ NÀY
                    </CButton>
                    <CModal visible={visible} onDismiss={() => setVisible(false)}>
                      <CModalHeader onDismiss={() => setVisible(false)}>
                        <CModalTitle>XÁC NHẬN XOÁ THẺ NÀY</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        Bạn chắc chắn muốn xoá{' '}
                        <CBadge color="success">
                          {data.letter} - {data.meaning}
                        </CBadge>{' '}
                        ?
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
                              cardService.deleteCard(cardId).then((res) => {
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
                              setRedirecTo({ isRedirected: true, redirectedPath: '/cards' })
                            }}
                          >
                            XOÁ
                          </CButton>
                        )}
                      </CModalFooter>
                    </CModal>
                  </div>
                </>
              )}
            </CRow>
          </CCol>
        </CRow>
      </>
    )
}

Card.propTypes = {
  location: PropTypes.any,
}

export default Card
