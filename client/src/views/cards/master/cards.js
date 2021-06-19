import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import {
  CCol,
  CImage,
  CRow,
  CWidgetIcon,
  CFormControl,
  CInputGroup,
  CButton,
  CSpinner,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { cardService } from '../../../services/api/cardService'
const Cards = () => {
  const [cards, setCards] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [searching, setSearching] = useState(false)
  const [redirect, setRedirect] = useState({ redirect: false, path: '' })
  const refresh = () => {
    cardService.getCards().then((res) => {
      setCards(res.results)
      if (!res.results || !res.results.length)
        toast.success(`Hiện tại chưa có thẻ nào được thêm`, {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
    })
  }
  useEffect(() => {
    refresh()
  }, [])
  const isDisabled = searchKey.length === 0
  if (redirect.redirect) return <Redirect to={redirect.path} />
  else
    return (
      <>
        <CRow>
          <CCol xs="12" sm="6" lg="3">
            <CInputGroup className="mb-3">
              <CFormControl
                type="text"
                placeholder="Tìm chữ ..."
                defaultValue={searchKey}
                onChange={(e) => {
                  setSearchKey(e.target.value)
                }}
                id="search-key"
              />
              <CButton
                type="button"
                color="secondary"
                disabled={isDisabled}
                onClick={() => {
                  if (!searchKey.length) {
                    toast.error(`Nhập từ khoá trước khi tìm kiếm`, {
                      position: 'top-right',
                      autoClose: 3000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                  } else {
                    setSearching(true)
                    cardService.getCards({ letter: searchKey }).then((res) => {
                      setSearching(false)
                      const result = res.results
                      if (!result.length)
                        toast.success(`Không thấy kết quả tương tự`, {
                          position: 'top-right',
                          autoClose: 3000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        })
                      setCards(result)
                    })
                  }
                }}
              >
                Tìm
              </CButton>
              <CButton
                type="button"
                color="danger"
                onClick={() => {
                  setSearchKey('')
                  refresh()
                  // remove search
                  document.getElementById('search-key').value = ''
                }}
                style={{ color: 'white' }}
              >
                ↻
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
        {!searching && (
          <CRow>
            {cards &&
              cards.map((item) => (
                <CCol
                  key={item.id}
                  xs="12"
                  sm="6"
                  lg="3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setRedirect({ redirect: true, path: `/cards/getCard/${item.id}` })
                  }}
                >
                  <CWidgetIcon
                    className="mb-3"
                    padding={0}
                    icon={
                      <CImage
                        src={item.svgSrc}
                        width={24}
                        name="cil-settings"
                        className="icon icon-xl"
                      />
                    }
                    iconPadding={4}
                    value={item.meaning}
                  />
                </CCol>
              ))}
          </CRow>
        )}
        {searching && <CSpinner />}
      </>
    )
}

export default Cards
