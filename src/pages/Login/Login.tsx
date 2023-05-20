import {
  IonApp,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonModal,
  IonPopover,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonToast
} from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import { alarmOutline, closeCircleOutline } from 'ionicons/icons'
import { useHistory } from 'react-router'
import axiosApi from '../../axiosApi'
import { Device } from '@ionic-native/device'
import axios from 'axios'
import '../../App.css'
import { App } from '@capacitor/app'
import Loader from '../../components/Load'
import localforage from 'localforage'
import { useStorage } from '../../hooks/useStorage'

const Login: React.FC = () => {
  const useFocus = () => {
    const htmlElRef: any = useRef(null)
    const setFocus = () => {
      htmlElRef.current && htmlElRef.current.focus()
    }
    return [htmlElRef, setFocus]
  }
  const [present] = useIonToast()
  const inputReference = useRef<any>(null)
  const defaultState = {
    mobile: '',
    level: '',
    otp: '',
    guestName: ''
  }
  const [data, setData] = useState<any>(defaultState)
  const [vol, setVol] = useState(false)
  const [guest, setGuest] = useState(false)
  const [level, setLevel] = useState<any>([])
  const [flag, setFlag] = useState<String>()
  const [otp, setOtp] = useState(false)
  const [name, setName] = useState<any>({})
  const [count, setCount] = useState(1)
  const [time, setTime] = useState(120)
  const [start, setStart] = useState(false)
  const [regTkn, setRegTkn] = useState<any>({})
  const [version, setVersion] = useState(false)
  const [load, setLoad] = useState(false)
  const currentVersion = '1.0.0'
  const [newVersion, setNewVersion] = useState('')

  const history = useHistory()

  const { addLocalforage } = useStorage() // Insert value in localforage

  // const nullEntry: any[] = []
  // const [notifications, setnotifications] = useState<any>(nullEntry);

  // useEffect(() => {
  //     axiosApi.get("/version")
  //         .then((res) => {
  //             if (currentVersion !== res.data) {
  //                 setVersion(!version);
  //                 setNewVersion(res.data);
  //             }
  //         })
  //         .catch((errors) => {
  //             console.error(errors)
  //         })
  // }, [])

  //GET VALUE IN INDEXDB
  useEffect(() => {
    setLoad(true)
    const GetLocalForge = async () => {
      await localforage.getItem('NAVSARI_APP_LOGIN').then((val: any) => {
        console.log(val)
        if (val !== null) {
          localStorage.setItem('flag', val[0].LOGIN_AS)
          localStorage.setItem('accessToken', val[0].ACCESS_TOKEN)
          localStorage.setItem('token_type', val[0].TOKEN_TYPE)
          localStorage.setItem(
            'header',
            val[0].TOKEN_TYPE + ' ' + val[0].ACCESS_TOKEN
          )
          localStorage.setItem('req_status', val[0].REQ_STATUS)
          localStorage.setItem('loginas', val[0].LOGIN_AS) //Level
          localStorage.setItem('loginUserName', val[0].LOGIN_AS_NAME) //name
          localStorage.setItem('loginUserMblNo', val[0].LOGIN_AS_MOBNO)
          localStorage.setItem('GuestVtrId', val[0].LOGIN_AS_NAME)
          localStorage.setItem('Device_Platform', Device.platform)
          localStorage.setItem('Ticket_Flag', 'Ionic_App')
          localStorage.setItem('Device_UUID', Device.uuid)
          localStorage.setItem('Device_Model', Device.model)
          localStorage.setItem('Device_Version', Device.version)
          localStorage.setItem('SelectedLang', val[0].SelectedLang)
          localStorage.setItem('DeviceRegisterId', regTkn)
         // LocalStorge(val[0])
          history.replace('/home')
          setLoad(false)
        } else {
          setLoad(false)
        }
      })
    }

    GetLocalForge()
  }, [])

  // useEffect(() => {
  //   PushNotifications.checkPermissions().then(res => {
  //     if (res.receive !== 'granted') {
  //       PushNotifications.requestPermissions().then(res => {
  //         if (res.receive === 'denied') {
  //           alert('Push Notification permission denied')
  //         } else {
  //           alert('Push Notification permission granted')
  //           register()
  //         }
  //       })
  //     } else {
  //       register()
  //     }
  //   })
  // }, [])

 

  const showVolPopup = () => {
    setVol(true)
  }

  const showGuestPopup = () => {
    setGuest(true)
    setFlag('GUEST')
  }

  const hnadleChange = (e: any) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  useEffect(() => {
    if (data.mobile !== '') {
      getMobileDetails()
    }
  }, [data.mobile.length >= 10])

  const getMobileDetails = async () => {
    if (flag !== 'GUEST' && data.mobile.length >= 10) {
      setLoad(true)
      setData({ ...data, level: '' })
      await axiosApi
        .get('/getLognUserDetailsByMobNo?pMobile=' + data.mobile)
        .then(res => {
          if (res.data !== '') {
            const Resp = JSON.parse(res.data)
            const Data = JSON.parse(Resp.data)
            if (res.data !== '') {
              if (Resp?.error === false) {
                setLevel(Data)
                setLoad(false)
              } else {
                present(Resp?.msg, 3000)
                setLoad(false)
              }
            } else {
              if (data.mobile.length >= 10) {
                setLevel([])
                present('Please Enter valid Mobile Number..', 3000)
                setLoad(false)
              }
            }
          } else {
            setLevel([])
            present('Please Enter valid Mobile Number..', 3000)
            setLoad(false)
          }
        })
    }
  }

  useEffect(() => {
    level.length > 1
      ? setName(level.find((item: any) => item.LOGIN_USER_ROLE === data.level))
      : setName(level.find((item: any) => item.MOBILE == data.mobile))
  }, [level, data])

  const loginVolutter = () => {
    if (data.mobile.length <= 10 && level.length !== 0) {
      if (level.length > 1 && data.level === '') {
        present('Please Select Any Level!!', 3000)
      } else {
        alert(
          'Dear ' +
            name.NAME +
            ' Definitely want to login as ' +
            name.LOGIN_USER_ROLE
        )
        loginApi()
      }
    } else {
      present('Please Enter Valid Mobile Number.', 3000)
    }
  }

  const loginAsGuest = () => {
    if (data.name === '' || data.mobile === '') {
      present('Invalid Creaditionals', 3000)
    } else if (data.mobile.length > 10 || data.mobile.length < 10) {
      present('Please Enter 10 digit Mobile No.', 3000)
    } else {
      loginApi()
    }
  }

  const LocalStorge = (response: any) => {
    console.log(response)
    localStorage.setItem('flag', flag === 'GUEST' ? 'GUEST' : data.level)
    localStorage.setItem('accessToken', response.access_token)
    localStorage.setItem('token_type', response.token_type)
    localStorage.setItem(
      'header',
      response.token_type + ' ' + response.access_token
    )
    localStorage.setItem('req_status', response.req_status)
    localStorage.setItem(
      'loginas',
      flag === 'GUEST' ? 'GUEST' : name?.LOGIN_USER_ROLE
    ) //Level
    localStorage.setItem(
      'loginUserName',
      flag === 'GUEST' ? data.guestName : name?.NAME
    ) //name
    localStorage.setItem('loginUserMblNo', data.mobile)
    localStorage.setItem(
      'GuestVtrId',
      flag === 'GUEST' ? data.guestName : name?.NAME
    )
    localStorage.setItem('Device_Platform', Device.platform)
    localStorage.setItem('Ticket_Flag', 'Ionic_App')
    localStorage.setItem('Device_UUID', Device.uuid)
    localStorage.setItem('Device_Model', Device.model)
    localStorage.setItem('Device_Version', Device.version)
    localStorage.setItem('SelectedLang', 'Eng')
    localStorage.setItem('DeviceRegisterId', regTkn)
  }

  const loginApi = () => {
    // register()
    const login_history = {
      VOTERID:
        flag === 'GUEST'
          ? data.guestName.split(' ').join('_')
          : name?.NAME.split(' ').join('_'),
      PWD: data.mobile,
      LOGIN_AS_MOBNO: data.mobile,
      LOGIN_AS: flag === 'GUEST' ? 'GUEST' : name?.LOGIN_USER_ROLE,
      LOGIN_AS_NAME:
        flag === 'GUEST'
          ? data.guestName.split(' ').join('_')
          : name?.NAME.split(' ').join('_'),
      DATE: '',
      TIME: '',
      DEV_REG_ID: '',
      DEVICE_ID: '',
      PLATFORM: '',
      MODEL: '',
      VERSION: '',
      IP: '',
      CITY: '',
      AC_NO: '',
      BOOTH_NO: '',
      MP_SEAT_ID: '77',
      TICKET_FLAG: 'Ionic_App'
    }

    var strSer: any = []
    var FnlstrSer: any = []
    let obj: any = login_history

    var str = []
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    strSer = str.join('&')
    var firstSignIndex = strSer.indexOf('=')
    var result =
      strSer.slice(0, firstSignIndex) +
      strSer.slice(firstSignIndex).replace(/=/g, '%3D')
    var SecondSignIndex = result.indexOf('&')
    FnlstrSer =
      result.slice(0, SecondSignIndex) +
      result.slice(SecondSignIndex).replace(/&/g, '%26')

    const user =
      flag === 'GUEST'
        ? data.guestName.split(' ').join('_')
        : name?.NAME.split(' ').join('_')
    const pass = data.mobile

    var request = new XMLHttpRequest()
    request.open('POST', 'https://darshanajardoshoffice.com/Portal/token', true)

    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    )
    request.setRequestHeader('Accept', 'application/json')
    request.send(
      'grant_type=password&scope=' +
        JSON.stringify(FnlstrSer) +
        '&username=' +
        user +
        '&password=' +
        pass +
        ''
    )
    request.onload = function () {
      const Res = JSON.parse(request.responseText)
      if (request.status === 400) {
        present('Invalid Credentials.', 3000)
        setData({ ...defaultState })
      } else {
        LocalStorge(Res)
        //  setVol(false)
        // validateIonicUserLogin()
        // history.replace('/home1')
        getOtp()
        setOtp(true)
        setStart(true)
        if (time === 0) {
          setTime(120)
        }
      }
    }
  }

  const validateIonicUserLogin = async () => {
    const login_history: any = {
      PWD: localStorage.getItem('loginUserMblNo'),
      DEV_REG_ID: localStorage.getItem('DeviceRegisterId'),
      CITY: '',
      VOTERID: localStorage.getItem('loginUserName'),
      LOGIN_AS: localStorage.getItem('loginas'),
      LOGIN_AS_NAME: localStorage.getItem('loginUserName'),
      LOGIN_AS_MOBNO: localStorage.getItem('loginUserMblNo'),
      DATE: '',
      TIME: '',
      DEVICE_ID: localStorage.getItem('Device_UUID'),
      PLATFORM: localStorage.getItem('Device_Platform'),
      MODEL: localStorage.getItem('Device_Model'),
      VERSION: localStorage.getItem('Device_Version'),
      IP: '',
      MP_SEAT_ID: localStorage.getItem('MP_SEAT_ID'),
      TICKET_FLAG: localStorage.getItem('Ticket_Flag'),
      ACCESS_TOKEN: localStorage.getItem('accessToken'),
      APP_TYPE: 'Varanasi_App'
    }
    let voter = {
      REQ_STATUS: localStorage.getItem('req_status'),
      loginas: localStorage.getItem('loginas')
    }

    let wrapperVoter: any = {}
    wrapperVoter.login_history = login_history
    wrapperVoter.voter2 = voter
    wrapperVoter.IsLoginAgain = ''

    var url = process.env.REACT_APP_API_URL + 'IonicValidateLoginUserDetails'
    axios
      .post(url, wrapperVoter)
      .then(res => {
        if (res.data.voter2.REQ_STATUS === 'SUCCESS') {
          setVol(false)
          setGuest(false)
          history.push('/home')
          present('Login Successfully!!', 2000)
        }
      })
      .catch(err => {
        present(err.message, 3000)
      })

    // STORE VALUE IN INDEXEDB FOR PARMENT LOGIN 11/05/2023 ANKIT PRAJAPATI
    await addLocalforage()
  }

  const getOtp = async () => {
    let OTPCounter = 0
    const postData = {
      MobileNo: data.mobile,
      LoginAs: flag === 'GUEST' ? 'GUEST' : name?.LOGIN_USER_ROLE,
      LoginUserName: flag === 'GUEST' ? data.guestName : name?.NAME,
      OTPCounter: OTPCounter
    }
    if (count === 3) {
      setVol(false)
      setGuest(false)
      setOtp(false)
      present('Please try after few minutes later', 3000)
      setTimeout(() => {
        // App.exitApp();
        // window.location.reload();
      }, 3000)
    }
    await axios
      .post(process.env.REACT_APP_API_URL + 'GetOTP_OtherApps', postData)
      .then((res: any) => {
        if (res.status === 200) {
          localStorage.setItem('OTP', res.data.OTP)
          OTPCounter++
          setCount(count + 1)
          // smsRead();
        }
      })
      .catch(err => {
        present(err.message, 3000)
      })
  }
  const validateOtp = () => {
    const otp = localStorage.getItem('OTP')
    if (data.otp === '') {
      present('Please Enter OTP..!!', 3000)
    } else {
      if (otp === data.otp) {
        // clearData();
        setOtp(false)
        setVol(false)
        setGuest(false)
        history.push('/home')
        validateIonicUserLogin()
        clearData()
      } else {
        present('Invalid OTP', 3000)
      }
    }
  }

  const clearData = () => {
    setData({ ...defaultState })
    setVol(false)
    setGuest(false)
    setOtp(false)
    setTime(0)
  }

  useEffect(() => {
    let interval: any = null
    if (start) {
      interval = setInterval(() => {
        setTime((prevTime: any) => prevTime - 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [start])

  useEffect(() => {
    if (time === 0) {
      setStart(false)
      setTime(time)
    }
  }, [time])

  const closeOTP = () => {
    setOtp(false)
    setTime(0)
  }

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Loader loading={load} click={() => setLoad(false)} />
        {/* <IonImg className='login-img' src={Img} /> */}
        <IonGrid>
          <IonRow style={{ textAlign: 'center' }}>
            {/* <IonCol size="12"><IonLabel className='login'>SHREE MANOJ KOTAK</IonLabel></IonCol> */}
            <IonCol size='12'>
              <IonLabel className='login'>Navsari Loksabha</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow style={{ textAlign: 'center' }}>
            <IonCol size='12'>
              <IonButton onClick={showVolPopup}>Login As Volunteer</IonButton>
            </IonCol>
            <IonCol size='12'>
              <IonButton onClick={showGuestPopup}>Login As Guest</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonModal isOpen={vol} backdropDismiss={false}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Volunteer Login </IonTitle>
              <IonIcon
                slot='end'
                style={{ size: '24px' }}
                src={closeCircleOutline}
                onClick={() => clearData()}
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
              <IonRow>
                <IonCol size='3'>
                  <IonLabel>Mobile No</IonLabel>
                </IonCol>
                <IonCol size='9'>
                  <IonInput
                    ref={ref => (inputReference.current = ref)}
                    type='number'
                    name='mobile'
                    value={data.mobile}
                    onIonChange={hnadleChange}
                    placeholder='mobile'
                  />
                </IonCol>
              </IonRow>

              {Array.isArray(level) &&
              level.length > 1 &&
              data.mobile.length === 10 ? (
                <IonRow>
                  <IonCol size='3'>
                    <IonLabel>Level</IonLabel>
                  </IonCol>
                  <IonCol size='9'>
                    <select
                      name='level'
                      value={data.level}
                      onChange={hnadleChange}
                      placeholder='Select Level'
                    >
                      <option value=''>Select</option>
                      {level.map((item: any, key: any) => (
                        <option key={key} value={item.LOGIN_USER_ROLE}>
                          {item.LOGIN_USER_ROLE_DISPLAY}
                        </option>
                      ))}
                    </select>
                  </IonCol>
                </IonRow>
              ) : (
                ''
              )}
              {data.mobile.length >= 10 && level.length !== 0 ? (
                <IonRow>
                  <IonCol size='6'>
                    <IonButton
                      disabled={level.length == 0}
                      onClick={loginVolutter}
                    >
                      LOGIN
                    </IonButton>
                  </IonCol>
                </IonRow>
              ) : (
                ''
              )}
            </IonGrid>
            {otp === true ? (
              <>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>OTP Verification</IonCardTitle>
                    <IonCardSubtitle>
                      OTP has been send on your registered Mobile number..
                    </IonCardSubtitle>
                  </IonCardHeader>

                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol>
                          <IonLabel position='stacked'>
                            One Time Password
                          </IonLabel>
                          <IonInput
                            ref={ref => (inputReference.current = ref)}
                            maxlength={6}
                            type='number'
                            name='otp'
                            value={data.otp}
                            onIonChange={hnadleChange}
                            placeholder='OTP'
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='6'>
                          <IonLabel>
                            <IonIcon src={alarmOutline} /> {time} Second
                          </IonLabel>
                        </IonCol>
                        <IonCol size='6'>
                          {time === 0 ? (
                            <IonLabel color='danger' onClick={loginVolutter}>
                              {' '}
                              {count - 1} attempt.. <br />
                              Resend OTP?
                            </IonLabel>
                          ) : (
                            ''
                          )}
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        {/* <IonButton onClick={readOtp}>Read</IonButton> */}
                        {/* <IonButton onClick={getCode}>Get Code</IonButton>
                                                <IonButton onClick={smsRead}>Start Watch</IonButton> */}
                        <IonButton onClick={validateOtp}>Login</IonButton>
                        <IonButton onClick={closeOTP}>Cancel</IonButton>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </>
            ) : (
              ''
            )}
          </IonContent>
        </IonModal>

        <IonModal isOpen={guest} backdropDismiss={false}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Guest Login</IonTitle>
              <IonIcon
                slot='end'
                style={{ size: '24px' }}
                src={closeCircleOutline}
                onClick={() => clearData()}
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
              <IonRow>
                <IonCol size='3'>Name</IonCol>
                <IonCol size='9'>
                  <IonInput
                    name='guestName'
                    value={data.guestName}
                    onIonChange={hnadleChange}
                    placeholder='Name'
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size='3'>Mobile No</IonCol>
                <IonCol size='9'>
                  <IonInput
                    type='number'
                    name='mobile'
                    value={data.mobile}
                    onIonChange={hnadleChange}
                    placeholder='Mobile No'
                  />
                </IonCol>
              </IonRow>

              <IonRow>
                <IonButton onClick={loginAsGuest}>Login As Guest</IonButton>
              </IonRow>
            </IonGrid>
            {otp === true ? (
              <>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>OTP Verification</IonCardTitle>
                    <IonCardSubtitle>
                      OTP has been send on your registered Mobile number..
                    </IonCardSubtitle>
                  </IonCardHeader>

                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol>
                          <IonLabel>One Time Password</IonLabel>
                          <IonInput
                            type='number'
                            name='otp'
                            value={data.otp}
                            onIonChange={hnadleChange}
                            placeholder='OTP'
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='6'>
                          <IonLabel>{time} Second</IonLabel>
                        </IonCol>
                        <IonCol size='6'>
                          {time === 0 ? (
                            <IonLabel onClick={loginAsGuest}>
                              Resend OTP?
                            </IonLabel>
                          ) : (
                            ''
                          )}
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonButton onClick={validateOtp}>Login</IonButton>
                        <IonButton onClick={closeOTP}>Cancel</IonButton>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </>
            ) : (
              ''
            )}
          </IonContent>
        </IonModal>

        {/* Version Popup */}
        <IonPopover
          isOpen={version}
          alignment='start'
          backdropDismiss={false}
          onDidDismiss={() => clearData()}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Notification</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
              <IonRow>
                <IonCol size='12'>
                  New update is available, Version {newVersion}{' '}
                </IonCol>
              </IonRow>

              <IonRow>
                <IonButton>
                  <a
                    href='https://play.google.com/store/apps/details?id=com.manojkotak.mp'
                    style={{ color: 'white' }}
                  >
                    Update{' '}
                  </a>
                </IonButton>
                <IonButton onClick={() => App.exitApp()}>Cancel</IonButton>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonPopover>
      </IonContent>
    </IonApp>
  )
}

export default Login
