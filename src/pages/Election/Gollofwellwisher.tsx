import React, { useCallback, useEffect, useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCheckbox,
  useIonAlert,
  useIonToast,
  IonTextarea
} from '@ionic/react'
import { useHistory } from 'react-router-dom'
import axiosApi from '../../axiosApi'
import {
  arrowBackOutline,
  callOutline,
  chatbubbleEllipsesOutline,
  chatbubblesOutline,
  logoWhatsapp,
  saveOutline,
  searchOutline
} from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import Loader from '../../components/Load'
import useDownLoad from '../../hooks/download.hook'
import { getAssembly } from '../../slice/assembly.slice'
import { useSelector, useDispatch } from 'react-redux'

interface GoalOfwellWisherProps {
  assembly: any
  fname: any
  mname: any
  lname: any
  contected: any
  mobileNo: any
}

const GoalOfwellWisher: React.FC<GoalOfwellWisherProps> = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const defaultState = {
    assembly: '',
    fname: '',
    mname: '',
    lname: '',
    contected: '',
    mobileNo: ''
  }
  const [presentAlert] = useIonAlert()
  const [present] = useIonToast()
  const [data, setData] = useState(defaultState)
  const [assembly, setAssembly] = useState([])
  const [value, setValue] = useState<any>([])
  const [showModal, setShowModal] = useState(false)
  const [pop, setPop] = useState(false)
  const [popAdd, setPopAdd] = useState(false)
  const [newData, setnewData] = useState<any>({
    mobile: '',
    address: ''
  })
  const [isContact, setIsContact] = useState<any>('Y')
  const [isVoted, setIsVoted] = useState('N')
  const [load, setLoad] = useState(false)
  const Lok = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')

  const { call, smsLong, smsShort } = useDownLoad()

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) // Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch])

  const changeEvent = (e: any) => {
    // setValue([])
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const changeNewEvent = (e: any) => {
    let { name, value } = e.target
    setnewData({ ...newData, [name]: value })
  }

  const chkChangeEvent = (e: any, voter: any, acno: any) => {
    const { checked } = e.target
    const checkValue = checked === true ? 'Y' : 'N'
    console.log(e.target)
    axiosApi
      .get(
        '/UpdateShubhechhakGoal?userid=' +
          Num +
          '&voterid=' +
          voter +
          '&pflagColNm=IS_CONTACT&pFlagVal=' +
          checkValue +
          '&pAssembly=' +
          acno
      )
      .then(res => {
        if (res.data === 'true') {
          checkValue === 'Y'
            ? present('Contacted..', 3000)
            : present('UnContacted..', 3000)
          search()
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  
  const search = async () => {
    if (data.assembly === '') {
      present('Please Select Assembly..!', 3000)
    } else {
      setLoad(true)
      setValue([])
      await axiosApi
        .get(
          '/GetSubhechhakGoalDyn?puserid=' +
            Num +
            '&pVoterid=' +
            ' ' +
            '&pAsmblyNo=' +
            data.assembly +
            '&pFirstName=' +
            data.fname +
            '&pMiddleName=' +
            data.mname +
            '&pLastName=' +
            data.lname +
            '&pSamparkKaryu=' +
            data.contected +
            '&pMobileNo=' +
            data.mobileNo
        )
        .then(res => {
          if (res.data !== '') {
            const Resp = JSON.parse(res.data)
            const Data = JSON.parse(Resp?.data)
            console.log(Data)
            if (Resp?.error === false) {
              setValue(Data)
              setLoad(false)
              setShowModal(!showModal)
            } else {
              present(Resp.msg, 3000)
              setLoad(false)
            }
          } else {
            present('No Data Found..', 3000)
            setLoad(false)
          }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    }
  }

  const search2 = async () => {
    
      setLoad(true)
      setValue([])
      await axiosApi
        .get(
          '/GetSubhechhakGoalDyn?puserid=' +
            Num +
            '&pVoterid=' +
            ' ' +
            '&pAsmblyNo=' +
            data.assembly +
            '&pFirstName=' +
            data.fname +
            '&pMiddleName=' +
            data.mname +
            '&pLastName=' +
            data.lname +
            '&pSamparkKaryu=' +
            data.contected +
            '&pMobileNo=' +
            data.mobileNo
        )
        .then(res => {
          if (res.data !== '') {
            const Resp = JSON.parse(res.data)
            const Data = JSON.parse(Resp?.data)
            console.log(Data)
            if (Resp?.error === false) {
              setValue(Data)
              setLoad(false)
              setShowModal(!showModal)
            } else {
              present(Resp.msg, 3000)
              setLoad(false)
            }
          } else {
            present('No Data Found..', 3000)
            setLoad(false)
          }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    
  }


  const remove = async (voter: any, acno: any) => {
    await axiosApi
      .get(
        '/UpdateShubhechhakGoal?userid=' +
          Num +
          '&voterid=' +
          voter +
          '&pflagColNm=DELETE&pFlagVal=Y&pAssembly=' +
          acno
      )
      .then(res => {
        if (res.data === 'true') {
          search()
          // setData({...defaultState})
          present('Removed', 3000)
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  const clearData = () => {
    history.replace('/election')
    setData({
      assembly: '',
      fname: '',
      mname: '',
      lname: '',
      contected: '',
      mobileNo: ''
    })
    setValue([])
  }

  const addAddress = async (voter: any, acno: any) => {
    if (newData.address === '') {
      present('Address is required', 2000)
    } else {
      await axiosApi
        .get(
          '/UpdateShubhechhakGoal?userid=' +
            Num +
            '&voterid=' +
            voter +
            '&pflagColNm=shift_address&pFlagVal=' +
            newData.address +
            '&pAssembly=' +
            acno
        )
        .then(res => {
          if (res.data === 'true') {
            present('Successfully Changed Address..', 3000)
            setPopAdd(false)
            setnewData({ ...newData, address: '' })
            search()
          }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    }
  }

  const addMobile = async (voter: any, acno: any) => {
    if (newData.mobile === '') {
      present('Enter Mobile No..', 2000)
    }
    if (newData.mobile.length < 10) {
      present('Please Enter 10 digit Mobile No', 2000)
    } else {
      await axiosApi
        .get(
          '/UpdateShubhechhakGoal?userid=' +
            Num +
            '&voterid=' +
            voter +
            '&pflagColNm=ALTR_MOBNO&pFlagVal=' +
            newData.mobile +
            '&pAssembly=' +
            acno
        )
        .then(res => {
          if (res.data === 'true') {
            present('Successfully Changed Mobile..', 3000)
            setPop(false)
            setnewData({ ...newData, mobile: '' })
            search()
          }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    }
  }

  const contacted = useCallback(
    (voter: any, acno: any) => {
      setIsContact('Y')
      axiosApi
        .get(
          '/UpdateShubhechhakGoal?userid=' +
            Num +
            '&voterid=' +
            voter +
            '&pflagColNm=IS_CONTACT&pFlagVal=' +
            isContact +
            '&pAssembly=' +
            acno
        )
        .then(res => {
          if (res.data === 'true') {
            isContact === 'Y'
              ? present('Contacted..', 3000)
              : present('UnContacted..', 3000)
            search2()
          }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    },
    [isContact]
  )

  const voted = useCallback(
    (voter: any, acno: any) => {
      setIsVoted('Y')
      axiosApi
        .get(
          '/UpdateShubhechhakGoal?userid=' +
            Num +
            '&voterid=' +
            voter +
            '&pflagColNm=is_voted&pFlagVal=' +
            isVoted +
            '&pAssembly=' +
            acno
        )
        .then(res => {
          if (res.data === 'true') {
            isVoted === 'Y'
              ? present('Voted..', 3000)
              : present('UnVoted..', 3000)
            search2()
          }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    },
    [isVoted]
  )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <IonIcon
                  onClick={() => clearData()}
                  className='back-button'
                  src={arrowBackOutline}
                />
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{t('lan.MenuGoalOfGreeter')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page_content'>
        <IonGrid>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <select
                name='assembly'
                value={data.assembly}
                onChange={changeEvent}
              >
                <option value=''>{t('lan.lblAll')}</option>
                {Array.isArray(assemblyList) && assemblyList.length > 0
                  ? assemblyList.map((item: any, key: any) => {
                      return (
                        <option key={key} value={item.AS_SEAT_ID}>
                          {item.AS_SEAT_NM}
                        </option>
                      )
                    })
                  : 'No Data'}
              </select>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangFirstName')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonInput
                name='fname'
                value={data.fname}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangMiddleName')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonInput
                name='mname'
                value={data.mname}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangLastName')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonInput
                name='lname'
                value={data.lname}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangContacted')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <select
                name='contected'
                value={data.contected}
                onChange={changeEvent}
              >
                <option defaultValue='' value=''>
                  All
                </option>
                <option defaultValue='' value='Y'>
                  Yes
                </option>
                <option defaultValue='' value='N'>
                  No
                </option>
              </select>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangMobile')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonInput
                type='number'
                name='mobileNo'
                value={data.mobileNo}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonButton shape='round' fill='outline' onClick={search}>
              <IonIcon src={searchOutline} className='button-icon' />
              {t('lan.lblLangLoad')}
            </IonButton>
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />
        {value.length > 0 ? (
          <span style={{ display: 'block' }} className='voter'>
            <b>
              {' '}
              {t('lan.lblLangTotalVoter')} :{' '}
              {Array.isArray(value) && value.length}
            </b>
          </span>
        ) : (
          ''
        )}
        {Array.isArray(value) && value.length > 0
          ? value.map((item: any, key: any) => {
              return (
                <div key={key}>
                  <IonCard key={key}>
                    <IonCardContent className='complaint-card'>
                      <IonGrid className='rowborder'>
                        <IonRow>
                          <IonCol size='5'>
                            {' '}
                            <span className='voter'>
                              <b>{item.VOTERNO}</b>
                            </span>
                          </IonCol>

                          <IonCol size='7' className='booth'>
                            <span> Booth:{item.BOOTH} </span>
                            <span> Page:{item.PAGENO}</span>
                            <span> Sr:{item.SERIAL} </span>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                      <IonGrid className='rowborder'>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangName')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.ENG_FULLNAME}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangAddress')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.ENG_ADDRESS}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblHouseNo')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.HOUSE_NO}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            {' '}
                            <IonLabel
                              color='primary'
                              onClick={() =>
                                setPopAdd(prev =>
                                  prev === key ? undefined : key
                                )
                              }
                            >
                              {t('lan.lblNewAddress')}
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.SHIFT_ADDRESS}</IonLabel>
                          </IonCol>
                        </IonRow>
                        {popAdd === key ? (
                          <IonRow>
                            <IonCol size='4'></IonCol>
                            <IonCol size='8'>
                              <>
                                <IonTextarea
                                  name='address'
                                  value={newData.address}
                                  onIonChange={changeNewEvent}
                                />
                                <IonIcon
                                  style={{ top: '-30%' }}
                                  className='showpass'
                                  src={saveOutline}
                                  onClick={() =>
                                    addAddress(item.VOTERNO, item.AC_NO)
                                  }
                                />
                              </>
                            </IonCol>
                          </IonRow>
                        ) : (
                          ''
                        )}
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangAge')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='2'>
                            <IonLabel>{item.AGE}</IonLabel>
                          </IonCol>
                          <IonCol size='3'>
                            <IonLabel>
                              <b>{t('lan.lblLangGender')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='3'>
                            <IonLabel>
                              {item.SEX === 'M' ? 'MALE' : 'FEMALE'}
                            </IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangContacted')}?</IonLabel>
                          </IonCol>
                          <IonCol size='2'>
                            <IonCheckbox
                              name='isContact'
                              checked={
                                item.IS_CONTACT != null &&
                                item.IS_CONTACT !== 'N'
                                  ? true
                                  : false
                              }
                              onClick={() =>
                                contacted(item.VOTERNO, item.AC_NO)
                              }
                            />
                          </IonCol>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangThayelMatdan')}?</IonLabel>
                          </IonCol>
                          <IonCol size='2'>
                            <IonCheckbox
                              checked={
                                item.IS_VOTED != null && item.IS_VOTED !== 'N'
                                  ? true
                                  : false
                              }
                              onClick={() => voted(item.VOTERNO, item.AC_NO)}
                            />
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangMobile1')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>
                              {item.MOBNO != 0 ? item.MOBNO : '-'}
                            </IonLabel>
                          </IonCol>
                        </IonRow>
                        {item.MOBNO !== 0 && item.MOBNO !== null ? (
                          <IonRow>
                            <IonCol size='4'></IonCol>
                            <IonCol size='2'>
                              <IonIcon
                                style={{ color: 'black' }}
                                src={callOutline}
                                onClick={() => call(item.MOBNO)}
                              />
                            </IonCol>
                            <IonCol size='2'>
                              <IonIcon
                                style={{ color: 'black' }}
                                src={chatbubbleEllipsesOutline}
                                onClick={() => smsShort(item.MOBNO, item.SSD)}
                              />
                            </IonCol>
                            <IonCol size='2'>
                              <IonIcon
                                style={{ color: 'black' }}
                                src={chatbubblesOutline}
                                onClick={() => smsLong(item.MOBNO, item.LSD)}
                              />
                            </IonCol>
                            <IonCol size='2'>
                              <a href={`https://wa.me/91${item.MOBNO}`}>
                                <IonIcon
                                  style={{ color: 'black' }}
                                  src={logoWhatsapp}
                                />
                              </a>
                            </IonCol>
                          </IonRow>
                        ) : (
                          ''
                        )}
                        <IonRow>
                          {/* <IonCol size='4'><IonLabel><b>{t('lan.lblLangMobile2')}</b></IonLabel></IonCol> */}
                          <IonCol size='4'>
                            <IonLabel
                              color='primary'
                              onClick={() =>
                                setPop(prev => (prev === key ? undefined : key))
                              }
                            >
                              <b>{t('lan.lblLangMobile2')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel> {item.ALTR_MOBNO}</IonLabel>
                          </IonCol>
                        </IonRow>
                        {pop === key ? (
                          <>
                            <IonRow>
                              <IonCol size='4'></IonCol>
                              <IonCol size='8'>
                                <>
                                  <IonInput
                                    type='number'
                                    minlength={10}
                                    maxlength={10}
                                    name='mobile'
                                    value={newData.mobile}
                                    onIonChange={changeNewEvent}
                                  />
                                  <IonIcon
                                    style={{ top: '-40%' }}
                                    className='showpass'
                                    src={saveOutline}
                                    onClick={() =>
                                      addMobile(item.VOTERNO, item.AC_NO)
                                    }
                                  />
                                </>
                              </IonCol>
                            </IonRow>
                          </>
                        ) : (
                          ''
                        )}
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangMatdanMathak')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.POLLING_STATION_NAME}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol>
                            <IonButton
                              shape='round'
                              color='danger'
                              fill='outline'
                              onClick={() =>
                                presentAlert({
                                  header:
                                    'Do you want to remove this voter from my target?',
                                  cssClass: 'custom-alert',
                                  buttons: [
                                    {
                                      text: 'No',
                                      role: 'cancel',
                                      cssClass: 'alert-button-cancel'
                                    },
                                    {
                                      text: 'Yes',
                                      role: 'confirm',
                                      cssClass: 'alert-button-confirm',
                                      handler: () => {
                                        remove(item.VOTERNO, item.AC_NO)
                                      }
                                    }
                                  ]
                                })
                              }
                            >
                              {t('lan.lblRemove')}
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </div>
              )
            })
          : ''}
      </IonContent>
    </IonPage>
  )
}

export default GoalOfwellWisher
