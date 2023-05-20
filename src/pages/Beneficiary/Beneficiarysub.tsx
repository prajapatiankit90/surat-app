import React, { useEffect, useState } from 'react'
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonToast
} from '@ionic/react'
import { useTranslation } from 'react-i18next'
import axiosApi from '../../axiosApi'
import { RouteComponentProps } from 'react-router'
import { useHistory } from 'react-router-dom'
import {
  arrowBackOutline,
  arrowForwardOutline,
  callOutline,
  chatbubbleEllipsesOutline,
  chatbubblesOutline,
  closeCircleOutline,
  logoWhatsapp
} from 'ionicons/icons'
import ReactPaginate from 'react-paginate'
import Loader from '../../components/Load'
import useDownLoad from '../../hooks/download.hook'
import Select from '../../components/Select'
import { getAssembly } from '../../slice/assembly.slice'
import { useSelector, useDispatch } from 'react-redux'
import { useDeviceInfo } from '../../hooks/useDeviceInfo'

interface MyParams {
  menu: string
  sub: string
}

const Beneficiarysub: React.FC<RouteComponentProps<MyParams>> = props => {
  const url: any = props.history.location.state
  let menuName = url === undefined ? undefined : url.menu
  let subMenu = url === undefined ? undefined : url.submenu

  const history = useHistory()
  const [present] = useIonToast()
  const defaultState = {
    desc: '',
    assembly: '',
    ward: '',
    shaktikendra: '',
    booth: '',
    city: ''
  }
  const { t } = useTranslation()
  const [designation, setDesignation] = useState<any>([])
  const [data, setData] = useState(defaultState)
  const [value, setValue] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [showModal, setShowModal] = useState<any>(false)
  const [viewData, setViewData] = useState<any>([])
  const [ward, setWard] = useState([])
  const [shaktikendra, setShaktikendra] = useState([])
  const [city, setCity] = useState([])
  const [booth, setBooth] = useState([])
  const [perPage] = useState(50)
  const [pageCount, setPageCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState(false)

  const langs = localStorage.getItem('SelectedLang')
  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')

  const { call, smsLong, smsShort } = useDownLoad()
  const { DeviceInfo } = useDeviceInfo()

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) //Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch, data])

  useEffect(() => {
    setDesignation([])
    const getSubmenu = async () => {
      await axiosApi
        .get(
          '/GetBeneficiarySubItemWithCategoryItemType?pLang=' +
            langs +
            '&pCategory=BENEFICIARY&pitemType=' +
            menuName
        )
        .then(res => {
          if (res.data !== '') {
            const Resp = JSON.parse(res.data)
            const Data = Resp?.data

            if (Resp?.error === false) {
              if (res.data !== '') {
                details('PARENTITEM')
              } else {
                setDesignation(Data)
                details('CHILDITEM')
              }
            } else {
              present(Resp.msg, 3000)
            }
          }
        })

      // .catch((error) => {
      //     present(error.message, 3000)
      //     setLoad(false)
      // });
    }
    getSubmenu()
    return
  }, [menuName, data, pageIndex])

  const details = async (tag: any) => {
    if (url !== undefined) {
      setTotal(0)
      setLoad(true)
      const ReqObj = {
        BENF_FLAG: tag,
        BENF_CATEGORY: 'BENEFICIARY',
        BENF_ITEM_NAME: menuName,
        BENF_SUB_ITEM_NAME: data?.desc,
        AC_NO: data?.assembly,
        BOOTH: data?.booth,
        WARD_ID: data?.ward,
        SHAKTIKENDRA_MAS_ID: data?.shaktikendra,
        BENF_VILLAGE: data?.city,
        PageIndex: pageIndex,
        PageSize: perPage
      }

      await axiosApi
        .post('GetBeneficiaryDetailsWithSubMenu_ForIonic', ReqObj)
        .then(res => {
          const Data = res.data.BeneficiaryDetailsList
          const Total = res.data.Total
          setTotal(Total)
          if (Data.length !== 0) {
            setPageCount(Math.ceil(Total / perPage))
            setValue(Data)
            setLoad(false)
          } else {
            present('No Data Found...', 3000)
            setLoad(false)
          }
        })
    }
  }
  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  }

  const handleChange = (e: any) => {
    setValue([])
    const { name, value } = e.target
    setData({ ...data, [name]: value })
    details('CHILDITEM')
  }

  const clearData = () => {
    history.replace('/beneficiary')
  }

  const getViewData = (id: any) => {
    const Dats = value.filter((ids: any) => ids.BENF_DETAIL_ID === id)
    setViewData(Dats)
    setShowModal(true)
  }

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
      setPageIndex(1)
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
      setPageIndex(1)
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
      setPageIndex(1)
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
      setPageIndex(1)
      getCityList(AcNo, WardMasNo, ShaktiNo, e.target.value, 'BOOTH')
    } else {
      setBooth([])
      setData({ ...data, booth: '' })
    }
  }

  const changeBooth = (e: any) => {
    setValue([])
    setData({ ...data, booth: e.target.value })
    setPageIndex(1)
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
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp?.data)
          if (Resp?.error === false) {
            setWard(Data)
            setLoad(false)
          } else {
            present(Resp?.msg, 3000)
            setLoad(false)
          }
        }
      })
    // .catch(err => {
    //     present(err.message, 3000)
    //     setLoad(false)
    // })
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
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp?.data)
          if (Resp?.error === false) {
            if (res.data !== '') {
              setShaktikendra(Data)
              setLoad(false)
            }
          } else {
            present(Resp.msg, 3000)
            setLoad(false)
          }
        }
      })
    // .catch(err => {
    //     present(err.message, 3000)
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
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp?.data)

          if (flag === 'VILLAGE') {
            if (res.data !== '') {
              setCity(Data)
            }
          }
          if (flag === 'BOOTH') {
            setBooth(Data)
          }

          if (res.data.length === 0) {
            if (flag === 'VILLAGE') {
              // alert('City Details Are Not Available')
            }
            if (flag === 'BOOTH') {
              present('Booth Details Are Not Available', 3000)
            }
          }
        }
      })
    // .catch(err => {
    //     present(err.message, 3000)
    //     setLoad(false)
    // })
  }
  useEffect(() => {
    if (data.desc === '') {
      setData(defaultState)
    }
  }, [data.desc])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <IonIcon
                  onClick={clearData}
                  className='back-button'
                  src={arrowBackOutline}
                />
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{subMenu}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          {filter === true ? (
            <>
              {Array.isArray(designation) && designation.length !== 0 ? (
                <IonRow>
                  <IonCol size='4'>
                    <IonLabel>{t('lan.lblLangDesignation')}</IonLabel>
                  </IonCol>
                  <IonCol size='8'>
                    <select
                      name='desc'
                      value={data.desc}
                      onChange={handleChange}
                    >
                      <option value=''>ALL</option>
                      {Array.isArray(designation) && designation.length >= 0
                        ? designation.map((item: any, key: any) => (
                            <option key={key} value={item.BENF_ITEM_TYPE}>
                              {item.BENF_ITEM_NAME}
                            </option>
                          ))
                        : ''}
                    </select>
                  </IonCol>
                </IonRow>
              ) : (
                ''
              )}

              <IonRow>
                <IonCol size='4'>
                  <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
                </IonCol>
                <IonCol size='8'>
                  <Select
                    selectType={t('lan.lblAll')}
                    name='assembly'
                    values={data.assembly}
                    changes={changeAssembly}
                    array={assemblyList}
                    optName='AS_SEAT_NM'
                    optValue='AS_SEAT_ID'
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size='4'>
                  <IonLabel>{t('lan.lblLangWardName')}</IonLabel>
                </IonCol>
                <IonCol size='8'>
                  <Select
                    selectType={t('lan.lblAll')}
                    name='ward'
                    values={data.ward}
                    changes={(e: any) => changeWard(e, data.assembly)}
                    array={ward}
                    optName='WARD_NAME'
                    optValue='WARD_MAS_ID'
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size='4'>
                  <IonLabel>{t('lan.MenuLangShk')}</IonLabel>
                </IonCol>
                <IonCol size='8'>
                  <Select
                    selectType={t('lan.lblAll')}
                    name='shaktikendra'
                    values={data.shaktikendra}
                    changes={(e: any) =>
                      changeShaktikendra(e, data.assembly, data.ward)
                    }
                    array={shaktikendra}
                    optName='SHAKTIKENDRA_NAME'
                    optValue='SHAKTIKENDRA_MAS_ID'
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size='4'>
                  <IonLabel>{t('lan.lblCity')}</IonLabel>
                </IonCol>
                <IonCol size='8'>
                  <Select
                    selectType={t('lan.lblAll')}
                    name='city'
                    values={data.city}
                    changes={(e: any) =>
                      changeCity(
                        e,
                        data?.assembly,
                        data?.ward,
                        data?.shaktikendra
                      )
                    }
                    array={city}
                    optName='VILLAGE'
                    optValue='VILLAGE'
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size='4'>
                  <IonLabel>{t('lan.MenuAsWardShakti')}</IonLabel>
                </IonCol>
                <IonCol>
                  <Select
                    selectType={t('lan.lblAll')}
                    name='booth'
                    values={data.booth}
                    changes={changeBooth}
                    array={booth}
                    optName='BOOTH_NAME'
                    optValue='BOOTH_NO'
                  />
                </IonCol>
              </IonRow>
            </>
          ) : (
            ''
          )}
        </IonGrid>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() =>
                  filter !== true ? setFilter(true) : setFilter(false)
                }
              >
                <IonLabel color='light'>
                  {filter !== true ? 'Show Filter' : 'Hide Filter'}
                </IonLabel>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />

        {Array.isArray(viewData) && viewData.length > 0
          ? viewData.map((item: any, key: any) => {
              return (
                <IonModal key={key} isOpen={showModal} backdropDismiss={false}>
                  <IonHeader>
                    <IonToolbar>
                      <IonGrid>
                        <IonRow>
                          <IonCol size='10'>
                            <IonTitle>{t('lan.lblProfile')}</IonTitle>
                          </IonCol>
                          <IonCol size='2'>
                            <IonIcon
                              src={closeCircleOutline}
                              onClick={() => setShowModal(false)}
                            />
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonToolbar>
                  </IonHeader>

                  <div key={key} className='grid-scroll'>
                    <IonCard key={key}>
                      <IonCardContent className='complaint-card'>
                        <IonGrid>
                          <IonRow>
                            <IonCol>
                              <span className='numberCircle'>
                                <b>{key + 1}</b>
                              </span>
                              <IonLabel>{item?.VOTERNO}</IonLabel>
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
                              <IonLabel>{item?.BENF_NAME}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangAddress')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.BENF_ADDRESS}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangVillage')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.VILLAGE}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangGender')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>
                                {item?.SEX === 'M' ? 'MALE' : 'FEMALE'}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangBloodGroup')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.BENF_BLOOD_GROUP}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangbirthdate')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.BENF_DOB}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangDOA')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.BENF_DOA}</IonLabel>
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
                                {item?.BENF_MOBILE === 0
                                  ? ''
                                  : item?.BENF_MOBILE}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                          {item?.MOBNO != 0 && item?.MOBNO !== null ? (
                            <IonRow>
                              <IonCol size='4'></IonCol>
                              <IonCol size='2'>
                                <IonIcon
                                  style={{ color: 'black' }}
                                  src={callOutline}
                                  onClick={() => call(item?.BENF_MOBILE)}
                                />
                              </IonCol>
                              <IonCol size='2'>
                                <IonIcon
                                  style={{ color: 'black' }}
                                  src={chatbubbleEllipsesOutline}
                                  onClick={() =>
                                    smsShort(item?.BENF_MOBILE, item?.SSD)
                                  }
                                />
                              </IonCol>
                              <IonCol size='2'>
                                <IonIcon
                                  style={{ color: 'black' }}
                                  src={chatbubblesOutline}
                                  onClick={() =>
                                    smsLong(item?.BENF_MOBILE, item?.LSD)
                                  }
                                />
                              </IonCol>
                              <IonCol size='2'>
                                <a
                                  href={`https://wa.me/91${item?.BENF_MOBILE}`}
                                >
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
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangCaste')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.BENF_CASTE}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangAssembly')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.AC_NAME}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangMandal')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.WARD_NAME}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangShaktiKendraName')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.SHAKTIKENDRA_NAME}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangBoothName')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>
                                {item?.BOOTH}-{item?.BOOTH_NAME}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangWardName')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.TALUKA}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangBlock')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.BLOCK_NAME}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangZillaPanchayat')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>
                                {item?.JILLA_PANCHAYAT_SEAT_NAME}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangPartyAffiliation')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.BENF_PARTYAFFIALATION}</IonLabel>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                        <IonGrid className='rowborder'>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangDesignation')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.BENF_DESIGNATION}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangEmail')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>
                                {item?.BENF_EMAIL !== null
                                  ? item?.BENF_EMAIL
                                  : '-'}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangWhatsApp')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <a href={`https://wa.me/91${item?.BENF_MOBILE}`}>
                                <IonIcon
                                  style={{ color: 'black' }}
                                  src={logoWhatsapp}
                                />
                              </a>
                              <IonLabel>
                                {item?.BENF_WHATSAPPNO !== null
                                  ? item?.BENF_WHATSAPPNO
                                  : '-'}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangFB')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>
                                {item?.BENF_FB !== null ? item?.BENF_FB : '-'}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangInstagram')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>
                                {item?.BENF_INSTAGRAM !== null
                                  ? item?.BENF_INSTAGRAM
                                  : '-'}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonCardContent>
                    </IonCard>
                  </div>
                </IonModal>
              )
            })
          : ''}

        <div className='table-design'>
          <IonLabel color='danger'>
            {t('lan.lblLangTotalRecords')} : {total}
          </IonLabel>
          <table>
            <thead>
              <tr>
                <th>{t('lan.lblLangNo')}.</th>
                <th>{t('lan.lblLangName')}</th>
                <th>{t('lan.lblLangMobile')}</th>
                <th></th>
              </tr>
            </thead>

            {Array.isArray(value) && value.length >= 0
              ? value.map((item: any, key: any) => {
                  return (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{item.BENF_NAME}</td>
                      <td >
                        {item?.BENF_MOBILE !== null ? (
                          DeviceInfo !== null ? (
                            <IonIcon
                              style={{ color: 'black' }}
                              src={callOutline}
                              onClick={() => call(item?.BENF_MOBILE)}
                            />
                          ) : (
                            <a href={`tel:${item?.BENF_MOBILE}`}>
                              <IonIcon
                                style={{ color: 'black' }}
                                src={callOutline}
                              />
                            </a>
                          )
                        ) : (
                          ''
                        )}
                        {item.BENF_MOBILE}
                      </td>
                      <td>
                        <IonIcon
                          src={arrowForwardOutline}
                          onClick={() => getViewData(item.BENF_DETAIL_ID)}
                        />
                      </td>
                    </tr>
                  )
                })
              : ''}
          </table>
        </div>
        {value.length > 0 ? (
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

export default Beneficiarysub
