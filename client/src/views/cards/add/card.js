import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CRow,
  CCardFooter,
  CImage,
  CCol,
  CCardText,
  CBadge,
  CCardTitle,
  CForm,
  CFormLabel,
  CFormControl,
  CButton,
  CSpinner,
} from '@coreui/react'
import { getHtmlEntityCodeFromDecodedString } from '../../../helpers/htmlentities'
import { svgService } from '../../../services/api/svgService'
import { cardService } from '../../../services/api/cardService'
const Card = ({ props }) => {
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
  // const [cards, setCards] = useState([])
  // useEffect(() => {
  //   cardService.getCards()
  // }, [cards])
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
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </CCol>
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
                placeholder="Bán ( Một nửa )"
                onChange={(e) => setMeaning(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="note" style={{ marginTop: '5px' }}>
                Mẹo nhớ
              </CFormLabel>
              <CFormControl
                type="text"
                id="note"
                placeholder="Mẹo để nhớ"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="onField">On</CFormLabel>
              <CFormControl
                type="text"
                id="onField"
                placeholder="はん"
                onChange={(e) => setOnField(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="onExample">Ví dụ (On)</CFormLabel>
              <CFormControl
                component="textarea"
                onChange={(e) => setOnExample(e.target.value)}
                id="onExample"
                rows="3"
                placeholder="半額　(はんがく – Giảm nửa giá )&#10;
                 半分　(はんぶん – Một nửa )&#10;
            　半年　(はんとし – Nửa năm )
"
              ></CFormControl>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="kunField">Kun</CFormLabel>
              <CFormControl
                type="text"
                id="kunField"
                placeholder="なか"
                onChange={(e) => setKunField(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="kunExample">Ví dụ (Kun)</CFormLabel>
              <CFormControl
                component="textarea"
                onChange={(e) => setKunExample(e.target.value)}
                id="kunExample"
                rows="3"
                placeholder="半ば (なかば – Giữa )
               半ばまぐれで (なかばまぐれで – Một nửa là do may mắn)
"
              ></CFormControl>
            </div>
            <div className="mb-3">
              <CButton
                color="primary"
                className="px-4"
                onClick={() => {
                  setIsSubmitting(true)
                  const data = {
                    letter: searchKey,
                    meaning: meaning,
                    onText: onField,
                    onTextExample: onExample,
                    kunText: kunField,
                    kunTextExample: kunExample,
                    svgSrc: srcSvg,
                    code: svgCode,
                  }
                  cardService.createCard(data).then((res) => {
                    setIsSubmitting(false)
                    if (res && res.ok) {
                      console.log(res)
                      toast.success(`Tạo thành công  “${searchKey}”`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                    } else {
                      toast.error(`Có lỗi xảy ra khi tạo mới thẻ  “${searchKey}”`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                    }
                  })
                }}
                disabled={disabledSearch}
              >
                {isSubmitting ? <CSpinner /> : 'TẠO THẺ'}
              </CButton>
            </div>
          </CRow>
        </CCol>
      </CRow>
    </>
  )
}

Card.propTypes = {
  props: PropTypes.any,
}

export default Card
