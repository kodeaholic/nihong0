import React, { lazy, useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormControl,
  CFormSelect,
  CInputGroup,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { getTimeDiffFromTimestamp } from 'src/helpers/time.helper.js'
import { _ } from 'core-js'
import { toast } from 'react-toastify'
import { userService } from 'src/services/api/userService.js'

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
const WidgetsDropdown = lazy(() => import('../components/widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../components/widgets/WidgetsBrand.js'))

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const setSearchDebounce = _.debounce(setSearch, 1000)
  const [reload, setReload] = useState(0)
  const [type, setType] = useState('EMAIL')
  const refresh = (filter) => {
    userService.getItems(filter).then((res) => {
      setUsers(res.results)
    })
  }
  useEffect(() => {
    setTimeout(() => {
      setReload((rl) => rl + 1)
    }, 60000)
  }, [reload])
  useEffect(() => {
    let filter = {}
    if (search && type) {
      if (type === 'EMAIL') filter.email = search
      else filter.name = search
      refresh(filter)
    } else refresh()
  }, [reload, search, type])
  return (
    <>
      {/* <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 id="traffic" className="card-title mb-0">
                Lượt đăng ký mới
              </h4>
              <div className="small text-medium-emphasis">January - July 2021</div>
            </CCol>
            <CCol sm="7" className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon name="cil-cloud-download" />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                  fill: true,
                },
                {
                  label: 'My Second dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-success'),
                  pointHoverBackgroundColor: getStyle('--cui-success'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                },
                {
                  label: 'My Third dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-danger'),
                  pointHoverBackgroundColor: getStyle('--cui-danger'),
                  borderWidth: 1,
                  borderDash: [8, 5],
                  data: [65, 65, 65, 65, 65, 65, 65],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow className="text-center">
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Visits</div>
              <strong>29.703 Users (40%)</strong>
              <CProgress thin className="mt-2" precision={1} color="success" value={40} />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Unique</div>
              <strong>24.093 Users (20%)</strong>
              <CProgress thin className="mt-2" precision={1} color="info" value={40} />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Pageviews</div>
              <strong>78.706 Views (60%)</strong>
              <CProgress thin className="mt-2" precision={1} color="warning" value={40} />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">New Users</div>
              <strong>22.123 Users (80%)</strong>
              <CProgress thin className="mt-2" precision={1} color="danger" value={40} />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Bounce Rate</div>
              <strong>Average Rate (40.15%)</strong>
              <CProgress thin className="mt-2" precision={1} value={40} />
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>

      <WidgetsBrand withCharts /> */}

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CInputGroup
              style={{ width: 'calc(100% - 30px)', marginLeft: '15px', marginTop: '15px' }}
            >
              <CFormControl
                type="text"
                placeholder="Tìm kiếm"
                defaultValue={search}
                onChange={(e) => {
                  setSearchDebounce(e.target.value)
                }}
                id="search"
                style={{ width: 'calc(70% - 30px)', marginTop: '15px', borderRadius: 5 }}
              />
              <CFormSelect
                defaultValue={type}
                name="type"
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: 'calc(30% - 30px)',
                  marginLeft: '15px',
                  marginTop: '15px',
                  borderRadius: 5,
                }}
              >
                <option value="EMAIL">Tìm theo email</option>
                <option value="NAME">Tìm theo tên</option>
              </CFormSelect>
            </CInputGroup>
            <CCardBody>
              {/* <CRow>
                <CCol xs="12" md="6" xl="6">
                  <CRow>
                    <CCol sm="6">
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-medium-emphasis small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol sm="6">
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Recurring Clients</div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="text-medium-emphasis small">Monday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="info" value={34} />
                      <CProgress thin color="danger" value={78} />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="text-medium-emphasis small">Tuesday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="info" value={56} />
                      <CProgress thin color="danger" value={94} />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="text-medium-emphasis small">Wednesday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="info" value={12} />
                      <CProgress thin color="danger" value={67} />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="text-medium-emphasis small">Thursday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="info" value={43} />
                      <CProgress thin color="danger" value={91} />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="text-medium-emphasis small">Friday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="info" value={22} />
                      <CProgress thin color="danger" value={73} />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="text-medium-emphasis small">Saturday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="info" value={53} />
                      <CProgress thin color="danger" value={82} />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="text-medium-emphasis small">Sunday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="info" value={9} />
                      <CProgress thin color="danger" value={69} />
                    </div>
                  </div>
                </CCol>

                <CCol xs="12" md="6" xl="6">
                  <CRow>
                    <CCol sm="6">
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol sm="6">
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  <div className="progress-group mb-4">
                    <div className="progress-group-header">
                      <CIcon className="icon icon-lg me-2" name="cil-user" />
                      <span>Male</span>
                      <span className="ms-auto font-semibold">43%</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="warning" value={43} />
                    </div>
                  </div>
                  <div className="progress-group mb-5">
                    <div className="progress-group-header">
                      <CIcon className="icon icon-lg me-2" name="cil-user-female" />
                      <span>Female</span>
                      <span className="ms-auto font-semibold">37%</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="warning" value={37} />
                    </div>
                  </div>

                  <div className="progress-group">
                    <div className="progress-group-header">
                      <CIcon className="icon icon-lg me-2" name="cib-google" />
                      <span>Organic Search</span>
                      <span className="ms-auto font-semibold">
                        191,235 <span className="text-medium-emphasis small">(56%)</span>
                      </span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="success" value={56} />
                    </div>
                  </div>
                  <div className="progress-group">
                    <div className="progress-group-header">
                      <CIcon name="cib-facebook" className="icon icon-lg me-2" />
                      <span>Facebook</span>
                      <span className="ms-auto font-semibold">
                        51,223 <span className="text-medium-emphasis small">(15%)</span>
                      </span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="success" value={15} />
                    </div>
                  </div>
                  <div className="progress-group">
                    <div className="progress-group-header">
                      <CIcon name="cib-twitter" className="icon icon-lg me-2" />
                      <span>Twitter</span>
                      <span className="ms-auto font-semibold">
                        37,564 <span className="text-medium-emphasis small">(11%)</span>
                      </span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="success" value={11} />
                    </div>
                  </div>
                  <div className="progress-group">
                    <div className="progress-group-header">
                      <CIcon name="cib-linkedin" className="icon icon-lg me-2" />
                      <span>LinkedIn</span>
                      <span className="ms-auto font-semibold">
                        27,319 <span className="text-medium-emphasis small">(8%)</span>
                      </span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="success" value={8} />
                    </div>
                  </div>
                </CCol>
              </CRow>

              <br /> */}

              <CTable hover responsive align="middle" className="mb-0 border">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">Số</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      <CIcon name="cil-people" />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-left">User ({users.length})</CTableHeaderCell>
                    {/* <CTableHeaderCell className="text-center">Country</CTableHeaderCell> */}
                    {/* <CTableHeaderCell>Usage</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Payment Method</CTableHeaderCell> */}
                    <CTableHeaderCell>Gia nhập</CTableHeaderCell>
                    <CTableHeaderCell>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users &&
                    users.map((user, index) => {
                      if (index > 20) return <></>
                      else
                        return (
                          <CTableRow key={user.id}>
                            <CTableDataCell className="text-center">
                              <div>{users.length - index}</div>
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
                              {/* <div className="small text-medium-emphasis">
                                <span>New</span> | Registered: Jan 1, 2015
                              </div> */}
                            </CTableDataCell>
                            {/* <CTableDataCell className="text-center">
                              <CIcon size="xl" name="cif-us" title="us" id="us" />
                            </CTableDataCell> */}
                            {/* <CTableDataCell>
                              <div className="clearfix">
                                <div className="float-start">
                                  <strong>50%</strong>
                                </div>
                                <div className="float-end">
                                  <small className="text-medium-emphasis">
                                    Jun 11, 2015 - Jul 10, 2015
                                  </small>
                                </div>
                              </div>
                              <CProgress thin color="success" value={50} />
                            </CTableDataCell> */}
                            {/* <CTableDataCell className="text-center">
                              <CIcon size="xl" name="cib-cc-mastercard" />
                            </CTableDataCell> */}
                            <CTableDataCell>
                              {/* <div className="small text-medium-emphasis">Last login</div> */}
                              {/* <strong>10 sec ago</strong> */}
                              <div className="small text-medium-emphasis">
                                {getTimeDiffFromTimestamp(user.createdAt)}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButtonGroup>
                                {/* <CButton
                                  type="button"
                                  color="success"
                                  style={{ color: 'white' }}
                                  onClick={() => {
                                    const ok = window.confirm(
                                      `Xác nhận xóa thông tin thiết bị cũ để người dùng đăng nhập trên thiết bị mới\nEmail---${user.email}\nTên người dùng---${user.name}`,
                                    )
                                    if (ok) {
                                      firebase
                                        .firestore()
                                        .collection('USERS')
                                        .doc(user.id)
                                        .update({
                                          device: firebase.firestore.FieldValue.delete(),
                                        })
                                        .then((res) => {
                                          console.log(res)
                                          toast.success(`Xóa thành công`, {
                                            position: 'top-right',
                                            autoClose: 2500,
                                            hideProgressBar: true,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                          })
                                        })
                                        .catch((err) => {
                                          console.log(err)
                                          toast.error(`Không thành công`, {
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
                                  }}
                                >
                                  Refresh thiết bị
                                </CButton> */}
                                <CButton
                                  type="button"
                                  color="info"
                                  style={{ color: 'white' }}
                                  onClick={() => {
                                    window.confirm(
                                      `Email ${user.email}\nTên người dùng ${user.name}`,
                                    )
                                  }}
                                >
                                  Thông tin
                                </CButton>
                              </CButtonGroup>
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

export default Dashboard
