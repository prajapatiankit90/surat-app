import React, { useEffect, useState } from 'react'
import {
  IonGrid,
  IonInput,
  IonRow,
  IonCol,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  useIonToast,
  useIonAlert
} from '@ionic/react'
import { Link } from 'react-router-dom'
import { arrowBackOutline, searchOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import axiosApi from '../../axiosApi'
import ReactPaginate from 'react-paginate'
import Loader from '../../components/Load'
import { getAssembly } from '../../slice/assembly.slice'
import { useSelector, useDispatch } from 'react-redux'

interface FindVoterProps {
  assembly: string
  ward: string
  shaktikendra: string
  booth: string
  fname: string
  mname: string
  surname: string
  relsurname: string
  fAge: string
  tAge: string
  gender: string
  mobile: string
  voterNo: string
  city: string
}

const FindVoter: React.FC = () => {
  const { t } = useTranslation()
  const [prevent] = useIonToast()
  const defaultState = {
    assembly: '',
    ward: '',
    shaktikendra: '',
    booth: '',
    fname: '',
    mname: '',
    surname: '',
    relsurname: '',
    fAge: '',
    tAge: '',
    gender: '',
    mobile: '',
    voterNo: '',
    city: ''
  }

  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')

  const [data, setData] = useState<FindVoterProps>(defaultState)
  const [value, setValue] = useState<any>([])
  const [ward, setWard] = useState([])
  const [shaktikendra, setShaktikendra] = useState([])
  const [city, setCity] = useState([])
  const [booth, setBooth] = useState([])
  const [showName, setShowName] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [load, setLoad] = useState(false)
  const [presentAlert] = useIonAlert()
  const [perPage] = useState(100)
  const [pageCount, setPageCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [total, setTotal] = useState(0)

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) //Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch, data])

  const changeAssembly = (e: any) => {
    setValue([])
    if (e.target.value !== '') {
      setData({
        ...data,
        assembly: e.target.value,
        ward: '',
        booth: '',
        shaktikendra: '',
        city: ''
      })
      getWardList(e.target.value)
      getShkList(e.target.value, '')
      getCityList(e.target.value, '', '', '', 'VILLAGE')
      getCityList(e.target.value, '', '', '', 'BOOTH')
    } else {
      setWard([])
      setBooth([])
      setShaktikendra([])
      setCity([])
      setData({
        ...data,
        assembly: '',
        ward: '',
        booth: '',
        shaktikendra: '',
        city: ''
      })
    }
  }

  const changeWard = (e: any, AcNo: any) => {
    setValue([])
    if (e.target.value !== '') {
      setData({
        ...data,
        assembly: AcNo,
        ward: e.target.value,
        shaktikendra: '',
        booth: '',
        city: ''
      })
      getShkList(AcNo, e.target.value)
      getCityList(AcNo, e.target.value, '', '', 'VILLAGE')
      getCityList(AcNo, e.target.value, '', '', 'BOOTH')
    } else {
      setBooth([])
      setShaktikendra([])
      setCity([])
      setData({ ...data, ward: '', booth: '', shaktikendra: '', city: '' })
    }
  }

  const changeShaktikendra = (e: any, AcNo: any, WardMasNo: any) => {
    setValue([])
    if (e.target.value !== '') {
      setData({
        ...data,
        assembly: AcNo,
        ward: WardMasNo,
        shaktikendra: e.target.value,
        booth: '',
        city: ''
      })
      getCityList(AcNo, WardMasNo, e.target.value, '', 'VILLAGE')
      getCityList(AcNo, WardMasNo, e.target.value, '', 'BOOTH')
    } else {
      setBooth([])
      setCity([])
      setData({ ...data, shaktikendra: '', booth: '', city: '' })
    }
  }
  const changeCity = (e: any, AcNo: any, WardMasNo: any, ShaktiNo: any) => {
    if (e.target.value !== '') {
      setData({
        ...data,
        assembly: AcNo,
        ward: WardMasNo,
        shaktikendra: ShaktiNo,
        city: e.target.value
      })
      getCityList(AcNo, WardMasNo, ShaktiNo, e.target.value, 'BOOTH')
    } else {
      setBooth([])
      setData({ ...data, city: '', booth: '' })
    }
  }

  const getWardList = async (AcNo: any) => {
    setLoad(true)
    await axiosApi
      .get(
        'GetAssemblyWiseWardByUserLoginLevel?pUserLevel=' +
          Name +
          ' &pUserMblNo=' +
          Num +
          '&pAcNo=' +
          AcNo
      )
      .then(res => {
        const Resp = JSON.parse(res.data)
        const Data = JSON.parse(Resp?.data)
        if (Resp?.error === false) {
          setWard(Data)
          setLoad(false)
        } else {
          prevent(Resp?.msg, 3000)
          setLoad(false)
        }
      })
      .catch(err => {
        prevent(err.message, 3000)
        setLoad(false)
      })
  }

  const getShkList = async (AcNo: any, WardMasNo: any) => {
    setLoad(true)
    await axiosApi
      .get(
        'GetShkListByUserLoginLevel?pUserLevel=' +
          Name +
          ' &pUserMblNo=' +
          Num +
          '&pAcNo=' +
          AcNo +
          '&pWardMasNo=' +
          WardMasNo
      )
      .then(res => {
        const Resp = JSON.parse(res.data)
        const Data = JSON.parse(Resp?.data)
        if (Resp?.error === false) {
          if (res.data !== '') {
            setShaktikendra(Data)
            setLoad(false)
          }
        } else {
          prevent(Resp?.msg, 3000)
          setLoad(false)
        }
      })
    // .catch(err => {
    //     prevent(err.message, 3000)
    //     setLoad(false)
    // })
  }

  const getCityList = async (
    AcNo: any,
    WardMasNo: any,
    ShkMasId: any,
    VlgNm: any,
    flag: any
  ) => {
    // setLoad(true)
    await axiosApi
      .get(
        'GetVillageBoothListByUserLoginLevel?pUserLevel=' +
          Name +
          ' &pUserMblNo=' +
          Num +
          '&pAcNo=' +
          AcNo +
          '&pWardMasNo=' +
          WardMasNo +
          '&pShkMasId=' +
          ShkMasId +
          '&pVlgNm=' +
          VlgNm +
          '&pFlag=' +
          flag
      )
      .then(res => {
        const Resp = JSON.parse(res.data)
        const Data = JSON.parse(Resp?.data)
        if (res.data !== '') {
          if (flag === 'VILLAGE') {
            setCity(Data)
            setLoad(false)
          }
        }
        if (flag === 'BOOTH') {
          setBooth(Data)
          setLoad(false)
        } else {
          setLoad(false)
        }

        if (res.data.length === 0) {
          if (flag === 'VILLAGE') {
            // alert('City Details Are Not Available')
          }
          if (flag === 'BOOTH') {
            prevent('Booth Details Are Not Available', 3000)
            setLoad(false)
          }
        }
      })
    // .catch(err => {
    //     prevent(err.message, 3000)
    //     setLoad(false)
    // })
  }

  const getData = async () => {
    if (showName === true && showAddress === false) {
      if (data?.assembly === '') {
        prevent('Please select Assembly', 3000)
        return false
      }
      if (data.assembly !== '') {
        if (data.fname === '' && data.surname === '') {
          prevent('Please Enter First / Surname ', 3000)
          setShowModal(showModal)
          return false
        }
      }
    }

    if (showName === false && showAddress === true) {
      if (data?.assembly === '') {
        prevent('Please select Assembly', 3000)
        return false
      }
    }
    setTotal(0)
    setLoad(true)
    // setValue([])
    const obj = {
      AC_NO: data?.assembly,
      ENG_F_NAME: data?.fname,
      ENG_M_NAME: data?.mname,
      ENG_SURNAME: data?.surname,
      ENG_REL_SURNAME: data?.relsurname,
      FROM_AGE: data?.fAge,
      TO_AGE: data?.tAge,
      SEX: data?.gender,
      BOOTH: data?.booth,
      MOBNO: data?.mobile,
      VOTERNO: data?.voterNo,
      WARD_MAS_ID: data?.ward,
      SHAKTIKENDRA_MAS_ID: data?.shaktikendra,
      VILLAGE: data?.city,
      BLOCK_NAME: '',
      DISTRICT_NAME: '',
      PageIndex: pageIndex,
      PageSize: perPage
    }
    await axiosApi.post('/GetFindVotersDyn_ForIonic', obj).then(res => {
      const Data = res.data.FindVotersList
      const Total = res.data.Total
      setTotal(Total)
      if (Data.length !== 0) {
        setPageCount(Math.ceil(Total / perPage))
        setValue(Data)
        setLoad(load)
      } else {
        prevent('No Data Found..!', 3000)
        setLoad(false)
      }
    })
  }

  useEffect(() => {
    if (
      (showName === true && showAddress === false) ||
      (showAddress === true && showName === false)
    ) {
      getData()
    }
  }, [pageIndex])

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  }

  const changeEvent = (e: any) => {
    setData({ ...data, booth: e.target.value })
  }

  const changeEventValue = (e: any) => {
    let { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const clearDate = () => {
    setData({ ...defaultState })
    setValue([])
  }

  const displayName = () => {
    setShowName(true)
    setShowAddress(false)
    setData({ ...defaultState })
    setValue([])
  }
  const displayAddress = () => {
    setShowAddress(true)
    setShowName(false)
    setData({ ...defaultState })
    setValue([])
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <Link
                  to='/election'
                  className='back-button'
                  onClick={() => clearDate()}
                >
                  <IonIcon src={arrowBackOutline} />
                </Link>
              </IonCol>
              <IonCol>
                <IonTitle>{t('lan.MenuFindVoters')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page_content'>
        <IonGrid>
          <IonRow>
            <IonCol size='6'>
              <IonButton onClick={() => displayName()}>
                {t('lan.lblLangSrchByNm')}
              </IonButton>
            </IonCol>
            <IonCol size='6'>
              <IonButton onClick={() => displayAddress()}>
                {t('lan.lblLangSrchByAdrs')}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {showAddress === true ? (
          <IonGrid>
            <IonRow>
              <IonCol size='6'>
                <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
                <select
                  name='assembly'
                  value={data.assembly}
                  onChange={e => changeAssembly(e)}
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

              <IonCol size='6'>
                <IonLabel>{t('lan.lblLangWardName')}</IonLabel>
                <select
                  name='ward'
                  value={data.ward}
                  onChange={e => changeWard(e, data.assembly)}
                >
                  <option value=''>All</option>
                  {Array.isArray(ward) && ward.length > 0
                    ? ward.map((item: any, key: any) => {
                        return (
                          <option key={key} value={item.WARD_MAS_ID}>
                            {item.WARD_NAME}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size='6'>
                <IonLabel>{t('lan.MenuLangShk')}</IonLabel>
                <select
                  name='shaktikendra'
                  value={data.shaktikendra}
                  onChange={e =>
                    changeShaktikendra(e, data.assembly, data.ward)
                  }
                >
                  <option value=''>All</option>
                  {Array.isArray(shaktikendra) && shaktikendra.length > 0
                    ? shaktikendra.map((item: any, key: any) => {
                        return (
                          <option key={key} value={item.SHAKTIKENDRA_MAS_ID}>
                            {item.SHAKTIKENDRA_NAME}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>{' '}
              </IonCol>

              <IonCol size='6'>
                <IonLabel>{t('lan.lblCity')}</IonLabel>
                <select
                  name='city'
                  value={data.city}
                  onChange={e =>
                    changeCity(
                      e,
                      data?.assembly,
                      data?.ward,
                      data?.shaktikendra
                    )
                  }
                >
                  <option value=''>All</option>
                  {Array.isArray(city) && city.length > 0
                    ? city.map((item: any, key: any) => {
                        return (
                          <option key={key} value={item.VILLAGE}>
                            {item.VILLAGE}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>{' '}
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          ''
        )}

        {showName === true ? (
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
                <select
                  name='assembly'
                  value={data.assembly}
                  onChange={changeEventValue}
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
              <IonCol>
                {' '}
                <IonLabel>{t('lan.lblLangFirstName')}</IonLabel>
                <IonInput
                  name='fname'
                  value={data.fname}
                  onIonChange={changeEventValue}
                />
              </IonCol>
              <IonCol>
                <IonLabel>{t('lan.lblLangSurname')}</IonLabel>
                <IonInput
                  name='surname'
                  value={data.surname}
                  onIonChange={changeEventValue}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel>{t('lan.lblLangMiddleName')}</IonLabel>
                <IonInput
                  name='mname'
                  value={data.mname}
                  onIonChange={changeEventValue}
                />
              </IonCol>
              <IonCol>
                <IonLabel>{t('lan.lblLangRelSurName')}</IonLabel>
                <IonInput
                  name='relsurname'
                  value={data.relsurname}
                  onIonChange={changeEventValue}
                />
              </IonCol>
              <IonCol>
                <IonLabel>{t('lan.lblLangGender')}</IonLabel>
                <select
                  placeholder='Select One'
                  name='gender'
                  value={data.gender}
                  onChange={changeEventValue}
                >
                  <option value=''>{t('lan.lblAll')}</option>
                  <option value='F'>{t('lan.lblLangFemale')}</option>
                  <option defaultValue='male' value='M'>
                    {t('lan.lblLangMale')}
                  </option>
                </select>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel>{t('lan.lblLangAge')}</IonLabel>
                <IonInput
                  name='fAge'
                  value={data.fAge}
                  type='number'
                  onIonChange={changeEventValue}
                />
              </IonCol>
              <IonCol>
                <IonLabel>{t('lan.lblLangFromTo')}</IonLabel>
                <IonInput
                  name='tAge'
                  value={data.tAge}
                  type='number'
                  onIonChange={changeEventValue}
                />
              </IonCol>
              <IonCol>
                <IonLabel>{t('lan.lblLangMobile')}</IonLabel>
                <IonInput
                  type='number'
                  name='mobile'
                  value={data.mobile}
                  onIonChange={changeEventValue}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          ''
        )}
        <IonRow>
          {showAddress === true ? (
            <IonCol>
              <IonLabel>{t('lan.MenuAsWardShakti')}</IonLabel>
              <select name='booth' value={data.booth} onChange={changeEvent}>
                <option value=''>{t('lan.lblAll')}</option>
                {Array.isArray(booth) && booth.length > 0
                  ? booth.map((item: any, key: any) => {
                      return (
                        <option key={key} value={item.BOOTH_NO}>
                          {item.BOOTH_NO} - {item.BOOTH_NAME}
                        </option>
                      )
                    })
                  : 'No Data'}
              </select>{' '}
            </IonCol>
          ) : (
            <IonCol>
              {' '}
              <IonLabel>{t('lan.lblLangVoterId')}</IonLabel>
              <IonInput
                name='voterNo'
                value={data.voterNo}
                onIonChange={changeEventValue}
              />
            </IonCol>
          )}
          <IonCol style={{ marginTop: '1rem' }}>
            <IonButton shape='round' fill='outline' onClick={getData}>
              <IonIcon src={searchOutline} className='button-icon' />
              {t('lan.lblLangLoad')}
            </IonButton>
          </IonCol>
        </IonRow>
        <Loader loading={load} click={() => setLoad(false)} />
        <IonLabel color='danger'>
          {t('lan.lblLangTotalRecords')} : {total}
        </IonLabel>
        {Array.isArray(value) && value.length > 0
          ? value.map((item: any, key: any) => {
              return (
                <IonCard key={key}>
                  <IonCardContent className='complaint-card'>
                    <IonGrid className='rowborder'>
                      <IonRow>
                        <IonCol size='5'>
                          
                          <Link
                            to={{
                              pathname: '/entrythrough',
                              state: { id: item?.VOTERNO }
                            }}
                          >
                            <span className='voter'>
                              <b>{item.VOTERNO}</b>
                            </span>
                          </Link>
                        </IonCol>

                        <IonCol size='7' className='booth'>
                          <span> Booth:{item.BOOTH_NO} </span>
                          <span> Page:{item.PAGE_NO}</span>
                          <span> Sr:{item.SERIAL} </span>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                    <IonGrid className='rowborder'>
                      {Name === 'SHUBHECHHAK' ? (
                        <IonButton
                          onClick={() =>
                            presentAlert({
                              header: 'Are you sure set Target?',
                              cssClass: 'custom-alert',
                              buttons: [
                                {
                                  text: 'No',
                                  cssClass: 'alert-button-cancel'
                                },
                                {
                                  text: 'Yes',
                                  cssClass: 'alert-button-confirm',
                                  handler: () => {
                                    let my_target = {
                                      USERNAME: Num,
                                      ROLE: Name,
                                      ADDRESS: item.ADDRESS,
                                      MOBNO: item?.MOBNO,
                                      AGE: item.AGE,
                                      ALTR_MOBNO: item.ALTERNATE_MOBILE,
                                      BOOTH: item.BOOTH_NO,
                                      F_NAME: item.ENG_F_NAME,
                                      M_NAME: item.ENG_M_NAME,
                                      SURNAME: item.ENG_SURNAME,
                                      HOUSE_NO: item.ENG_HOUSE_NO,
                                      SEX: item.SEX,
                                      AC_NO: item.AC_NO,
                                      FULLNAME: item.FULLNAME,
                                      VOTERNO: item.VOTERNO,
                                      PAGENO: item.PAGE_NO,
                                      SERIAL: item.SERIAL,
                                      DESIGNATION: item.DESIGNATION,
                                      IS_VOTED: '',
                                      IS_CONTACT: '',
                                      SHIFT_ADDRESS: '',
                                      POLLING_STATION_NAME:
                                        item.ENG_POLLING_STATION_NAME,
                                      ENG_FULLNAME: item.ENG_FULLNAME,
                                      ENG_ADDRESS: item.ENG_ADDRESS
                                    }
                                    axiosApi
                                      .post('/SaveMyTarget', my_target)
                                      .then(res => {
                                        if (res.data === 'DUPLICATE') {
                                          prevent(
                                            'Already Set Target..!!',
                                            3000
                                          )
                                        } else {
                                          prevent(
                                            'Your Target is set..!!',
                                            3000
                                          )
                                        }
                                      })
                                  }
                                }
                              ]
                            })
                          }
                        >
                          {t('lan.lblSetTarget')}
                        </IonButton>
                      ) : (
                        ''
                      )}

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
                          <IonLabel>{item.ENG_HOUSE_NO}</IonLabel>
                        </IonCol>
                      </IonRow>
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
                          <IonLabel>
                            <b>{t('lan.lblLangMobile1')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                          <IonLabel>
                            {item.MobileNo != '' ? item.MobileNo : '-'}
                          </IonLabel>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangMobile2')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                          <IonLabel> {item.Alternate_MobileNo}</IonLabel>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangMatdanMathak')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                          <IonLabel>{item.ENG_POLLING_STATION_NAME}</IonLabel>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              )
            })
          : ''}
        {value.length >= 10 ? (
          <ReactPaginate
            previousLabel={'Prev'}
            nextLabel={'Next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        ) : (
          ''
        )}
      </IonContent>
    </IonPage>
  )
}

export default FindVoter
