import React, { lazy, useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import {
  CAvatar,
  CCard,
  CCardBody,
  CCol,
  CFormControl,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { getTimeDiffFromTimestamp } from 'src/helpers/time.helper.js'
import { _ } from 'core-js'

const firebaseConfig = {
  apiKey: 'AIzaSyAlEC53kiwYJByue5_vGhTfkXJutUwHODk',
  authDomain: 'nihongo365-318404.firebaseapp.com',
  databaseURL: 'https://nihongo365-318404-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'nihongo365-318404',
  storageBucket: 'nihongo365-318404.appspot.com',
  messagingSenderId: '401904380301',
  appId: '1:401904380301:web:dcfd672798d69b1358b5c4',
  measurementId: 'G-D29PX99VFE',
}

firebase.initializeApp(firebaseConfig)

const Logs = () => {
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState('')
  const setSearchDebounce = _.debounce(setSearch, 1000)
  // useEffect(() => {
  //   console.log('Getting logs from firestore ...')
  //   const unsubscribe = firebase
  //     .firestore()
  //     .collection('logs')
  //     .orderBy('time', 'desc')
  //     .onSnapshot((querySnapshot) => {
  //       const items = querySnapshot.docs
  //         .filter((documentSnapshot) => {
  //           const data = documentSnapshot.data()
  //           if (!_.isEmpty(search)) {
  //             const user = _.get(data, 'user')
  //             console.log(user)
  //             return (
  //               (user.email.includes(search.toLowerCase()) ||
  //                 user.name.toLowerCase().includes(search.toLowerCase())) &&
  //               data.time > Date.now() - 86400000 * 5
  //             )
  //           } else return data.time > Date.now() - 86400000 * 5
  //         })
  //         .map((filteredSnapshot) => {
  //           const item = {
  //             id: filteredSnapshot.id,
  //             ...filteredSnapshot.data(),
  //           }
  //           return item
  //         })
  //       setLogs(items)
  //     })
  //   return () => {
  //     unsubscribe && unsubscribe()
  //   }
  // }, [search])
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CFormControl
              type="text"
              placeholder="Tìm kiếm"
              defaultValue={search}
              onChange={(e) => {
                setSearchDebounce(e.target.value)
              }}
              id="search"
              style={{ width: 'calc(100% - 30px)', marginLeft: '15px', marginTop: '15px' }}
            />
            <CCardBody>
              <CTable hover responsive align="middle" className="mb-0 border">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">Số</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Avatar</CTableHeaderCell>
                    <CTableHeaderCell className="text-left">Tên người dùng</CTableHeaderCell>
                    <CTableHeaderCell className="text-left">Email</CTableHeaderCell>
                    <CTableHeaderCell className="text-left">
                      Thao tác người dùng trên app
                    </CTableHeaderCell>
                    <CTableHeaderCell>Thời điểm</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {logs &&
                    logs.map((log, index) => {
                      const user = _.get(log, 'user')
                      if (index > 80) return <></>
                      else
                        return (
                          <CTableRow key={log.id}>
                            <CTableDataCell className="text-center">
                              <div>{logs.length - index}</div>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CAvatar
                                size="md"
                                src={user.photo ? user.photo : 'avatars/default_avatar.png'}
                                status=""
                                style={{ border: '2px solid green' }}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{user.name}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{user.email}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{log.content}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="small text-medium-emphasis">
                                {getTimeDiffFromTimestamp(log.time)}
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        )
                    })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Logs
