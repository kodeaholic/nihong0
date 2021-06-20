import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CCardText,
  CButton,
  CCardHeader,
  CCardTitle,
  CFormControl,
} from '@coreui/react'
import { generateRubyAnnotationString } from 'src/helpers/furigana'
import parse from 'html-react-parser'
const Furigana = () => {
  const [key, setKey] = useState('')
  const [result, setResult] = useState('')
  const sample = ['新[あたら]しい', 'あの 人[ひと]']
  const copyTextFromElement = (elementID) => {
    let element = document.getElementById(elementID) //select the element
    if (element) {
      let elementText = element.value //get the text content from the element
      copyText(elementText) //use the copyText function below
    }
  }
  //If you only want to put some Text in the Clipboard just use this function
  // and pass the string to copied as the argument.
  const copyText = (text) => {
    toast.success(`Đã copy!`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    navigator.clipboard.writeText(text)
  }
  return (
    <>
      <CRow>
        <CCol sm="12" style={{ marginTop: '5px' }}>
          <CCard>
            <CCardHeader>Tạo chuỗi Furigana để hiển thị cách đọc cho học viên</CCardHeader>
            <CCardBody>
              <CCardTitle>Hướng dẫn sử dụng</CCardTitle>
              <CCardText>Xem ví dụ minh hoạ để hiểu</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm="6" style={{ marginTop: '5px' }}>
          <CCard>
            <CCardHeader>Ví dụ minh hoạ 新しい</CCardHeader>
            <CCardBody>
              <CCardText>1. Anh đang muốn tạo cách đọc cho cụm từ {'新しい'}</CCardText>
              <CCardText>
                2. Hiểu cú pháp {'<chữ_cần_tạo_cách_đọc>[cách_đọc]<các chữ khác>'} của Tool
              </CCardText>
              <CCardText>
                3. Trong trường hợp này {'<chữ_cần_tạo_cách_đọc> là 新, cách_đọc của nó là あたら'},
                chữ không cần cách đọc ở đây là {'しい'}
              </CCardText>
              <CCardText>
                4. Vậy thì anh nhập vào Tool là {sample[0]} và bấm {'"Tạo chuỗi"'}
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm="6" style={{ marginTop: '5px' }}>
          <CCard>
            <CCardHeader>Ví dụ minh hoạ あの人</CCardHeader>
            <CCardBody>
              <CCardText>1. Anh đang muốn tạo cách đọc cho cụm từ {'あの人'}</CCardText>
              <CCardText>
                2. Hiểu cú pháp {'<chữ_cần_tạo_cách_đọc>[cách_đọc]<các chữ khác>'} của Tool
              </CCardText>
              <CCardText>
                3. Trong trường hợp này {'<chữ_cần_tạo_cách_đọc> là 人, cách_đọc của nó là ひと'},
                chữ không cần cách đọc ở đây là {'あの'}
              </CCardText>
              <CCardText>
                4. Vậy thì anh nhập vào Tool là <span>{sample[1]}</span> và bấm {'"Tạo chuỗi"'}. Lưu
                ý có dấu cách ở giữa <span>あの{'<dấu cách>'}人[ひと]</span>
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm="6" style={{ marginTop: '5px' }}>
          <CCard>
            <CCardHeader>Tool</CCardHeader>
            <CCardBody>
              <CFormControl
                type="text"
                id="search"
                // style={{ marginTop: '10px' }}
                aria-describedby="Nhập chuỗi"
                placeholder="Nhập chuỗi"
                defaultValue={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <CButton
                style={{ marginTop: '5px' }}
                disabled={!key || key.length === 0}
                onClick={() => setResult(generateRubyAnnotationString(key))}
              >
                Tạo chuỗi
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm="6" style={{ marginTop: '5px' }}>
          <CCard>
            <CCardHeader>Chuỗi kết quả</CCardHeader>
            <CCardBody>
              <CFormControl type="text" disabled defaultValue={result} id="furigana" />
              {result && (
                <div
                  style={{
                    fontSize: '50px',
                    border: '1px solid',
                    marginTop: '5px',
                    minWidth: '50%',
                  }}
                >
                  {parse(result)}
                </div>
              )}
              <CButton onClick={copyTextFromElement('furigana')} style={{ marginTop: '5px' }}>
                COPY
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

Furigana.propTypes = {
  location: PropTypes.any,
}

export default Furigana
