import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
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
} from '@coreui/react'
import { getHtmlEntityCodeFromDecodedString } from '../../../helpers/htmlentities'
import { svgService } from '../../../services/api/svgService'
import '../common.css'
const SearchCharacter = () => {
  const [input, setInput] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [disabledSearch, setDisabledSearch] = useState(true)
  const [htmlEntityCode, setHtmlEntityCode] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [characterContent, setCharacterContent] = useState('')
  const [srcSvg, setSrcSvg] = useState('avatars/default.png')
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
      <CCard className="mb-4">
        <CCardBody>
          <CCardTitle className="text-center">
            <CRow className="align-items-center">
              <CCol sm="4"></CCol>
              <CCol sm="4">
                <CFormControl
                  type="text"
                  id="search"
                  aria-describedby="Nhập chữ hoặc code để tìm kiếm"
                  placeholder="Nhập chữ hoặc code để tìm kiếm"
                  onChange={(e) => setInput(e.target.value)}
                />
                <CButton
                  color="primary"
                  variant="outline"
                  style={{ marginTop: '5px' }}
                  disabled={disabledSearch}
                  onClick={() => setSearchKey(input)}
                >
                  Tìm kiếm
                </CButton>
              </CCol>
              <CCol sm="4"></CCol>
            </CRow>
          </CCardTitle>
          <CRow className="align-items-center">
            <CCol sm="4"></CCol>
            <CCol sm="4">
              <CCard>
                <CImage src={srcSvg} size="xs"></CImage>
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
            <CCol sm="4"></CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default SearchCharacter
