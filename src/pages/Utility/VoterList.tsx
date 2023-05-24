import React, { useState, useEffect, useCallback } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonInput,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonImg,
  useIonToast,
  IonModal,
  IonButtons
} from '@ionic/react'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import axiosApi from '../../axiosApi'

import {
  addOutline,
  arrowBackOutline,
  arrowForwardCircleOutline,
  arrowForwardOutline,
  callOutline,
  chatbubbleEllipsesOutline,
  chatbubblesOutline,
  closeCircleOutline,
  closeOutline,
  handLeftSharp,
  lockClosedOutline,
  lockOpenOutline,
  logoWhatsapp,
  removeOutline,
  searchOutline
} from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import useDownLoad from '../../hooks/download.hook'
import Loader from '../../components/Load'
import { useSelector, useDispatch } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'
import { getBooth } from '../../slice/booth.slice'
import { useDeviceInfo } from '../../hooks/useDeviceInfo'

interface MyParams {
  assa: string
  booth: string
}

interface WardProps {
  assembly: string
  booth: string
  page: any
}

const VoterList: React.FC<RouteComponentProps<MyParams>> = () => {
  const history = useHistory()
  const [prevent] = useIonToast()
  const { t } = useTranslation()
  const defaultState = {
    assembly: '',
    booth: '',
    page: 0
  }
  const [data, setData] = useState<WardProps>(defaultState)
  const [booth, setBooth] = useState<any>([])
  const [pageNo, setPageNo] = useState(0)
  const [value, setValue] = useState<any>([])
  const [checked, setChecked] = useState('N')
  const [load, setLoad] = useState(false)
  const [count, setCount] = useState(0)
  const [showModal, setShowModal] = useState<any>(false)
  const [viewData, setViewData] = useState<any>([])
  const [perPage] = useState(30)
  const [pageCount, setPageCount] = useState(0)
  const [pagination, setPagination] = useState<any>([])
  const [showBeneficiary, setShowBeneficiary] = useState(false)
  const [beneficiary, setBeneficiary] = useState<any>([])

  const { createPDFDownload, call, smsLong, smsShort } = useDownLoad()
  const { DeviceInfo } = useDeviceInfo()

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly)
  const { boothList } = useSelector((state: any) => state.booth)
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch])

  const clear = () => {
    history.replace('/utility')
    setData({ ...defaultState })
    setValue([])
    setPageNo(0)
    setLoad(false)
  }
  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')

  const changeEventBooth = async (e: any) => {
    setData({ ...data, assembly: e.target.value, booth: '' })
    setBooth([])
    setValue([])
    setLoad(true)
    dispatch(
      getBooth({
        acNo: e.target.value,
        wardNo: '',
        ShaktiId: '',
        village: '',
        flag: 'BOOTH'
      })
    )
    setLoad(false)
  }

  const changeEventPage = (e: any) => {
    setValue([])
    setData({ ...data, booth: e.target.value, page: 1 })

    const findpage = boothList.find(
      (item: any) => item.BOOTH_NO == e.target.value
    )

    setCount(1)
    setPageNo(findpage?.MAX_PAGENO)
  }

  const changeEventData = (e: any) => {
    count === 0 ? setCount(1) : setCount(e.target.value)
    setLoad(true)
    setValue([])
  }
  const checkedSumbit = useCallback(
    (voter: any) => {
      setChecked('Y')
      axiosApi
        .get(
          '/UpdateAssemblyColVal?asmbno=' +
            data.assembly +
            '&voterid=' +
            voter +
            '&pflagColNm=' +
            'as_voted' +
            '&pFlagVal=' +
            checked
        )
        .then(res => {
          checked === 'Y' ? prevent('UnVoted', 3000) : prevent('Voted', 3000)
        })
    },
    [checked]
  )

  useEffect(() => {
    if (data.assembly !== '') {
      getData()
    }
  }, [count])

  const getData = () => {
    if (data.assembly === '') {
      prevent('Please Select Assembly', 3000)
    } else if (data.booth === '') {
      prevent('Please Select Booth', 3000)
    } else {
      setLoad(true)
      axiosApi
        .get(
          '/GetVoterList?pAssemblyNo=' +
            data.assembly +
            '&pBoothNo=' +
            data.booth +
            '&pSelPageView=ORIGINAL&pPageNo=' +
            count
        )
        .then(res => {
          const resp = JSON.parse(res.data)
          const Data = resp?.data
          console.log(Data)
          if (res.data !== undefined) {
            if (resp.error === false) {
              setPagination(Data)
              const data = Data.slice(0, 30)
              setPageCount(Math.ceil(Data.length / perPage))
              setValue(data)
              setLoad(false)
            } else {
              prevent(resp.msg, 3000)
              setLoad(false)
            }
          } else {
            prevent('No Data', 3000)
            setLoad(false)
          }
        })
        .catch(err => {
          console.error(err.message)
          setLoad(false)
        })
    }
  }

  const handlePageClick = (selected: any) => {
    const pagesVisited = selected.selected * perPage
    const lastSetData = pagesVisited + perPage
    setValue(pagination.slice(pagesVisited, lastSetData))
    window.scroll(0, 0)
  }

  const getViewData = (id: any) => {
    const Dats = value.filter((ids: any) => ids.VOTERNO === id)
    setViewData(Dats)
    setShowModal(true)
  }

  const incrementPage = () => {
    if (data.assembly === '' || data.booth === '') {
      prevent('Select Any Assembly && Booth !!', 3000)
    } else if (data.assembly === '') {
      prevent('Select Any Assembly !!', 3000)
    } else if (data.booth === '') {
      prevent('Select Any booth !!', 3000)
    } else {
      setCount(prevCount => prevCount + 1)
    }
  }

  const decrementPage = () => {
    if (count > 0) {
      setLoad(true)
      setCount(prevCount => prevCount - 1)
    }
  }

  const beneDetails = async (voterid: any) => {
    await axiosApi
      .get('GetBeneficiaryDetailsByVoterNo?pVoterNo=' + voterid)
      .then(res => {
        setLoad(true)
        const Resp = JSON.parse(res.data)
        const Data = JSON.parse(Resp?.data)
        console.log(Data)
        if (Resp.error === false) {
          setShowBeneficiary(true)
          setBeneficiary(Data)
          setLoad(false)
        } else {
          prevent(Resp.msg, 3000)
          setLoad(false)
        }
      })
      .catch(err => {
        prevent(err.message, 3000)
      })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <IonIcon src={arrowBackOutline} onClick={clear} />
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{t('lan.MenuVoterList')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page_content'>
        <IonGrid>
          <IonRow>
            <IonCol size='3'>
              {' '}
              <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <select
                name='assembly'
                value={data.assembly}
                onChange={changeEventBooth}
              >
                <option value=''>{t('lan.lblLangSelect')}</option>
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
              {' '}
              <IonLabel>{t('lan.lblLangBoothNo')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <select
                name='booth'
                value={data.booth}
                onChange={changeEventPage}
              >
                <option value=''>{t('lan.lblLangSelect')}</option>
                {Array.isArray(boothList) && boothList.length > 0
                  ? boothList.map((item: any, key: any) => {
                      return (
                        <option key={key} value={item.BOOTH_NO}>
                          {item.BOOTH_NO}-{item.BOOTH_NAME}
                        </option>
                      )
                    })
                  : 'No Data'}
              </select>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              {' '}
              <IonLabel>{t('lan.lblLangPageNo')}</IonLabel>
            </IonCol>
            <IonCol size='1'>
              <IonIcon
                hidden={count === 1}
                src={removeOutline}
                style={{ color: 'black', marginTop: '10px' }}
                onClick={decrementPage}
              />
            </IonCol>
            <IonCol size='4'>
              {' '}
              <IonInput
                style={{ textAlign: 'center' }}
                disabled={true}
                type='number'
                name='count'
                value={count}
                onIonChange={changeEventData}
              />
            </IonCol>
            <IonCol size='3' style={{ marginTop: '10px' }}>
              <IonLabel>
                <span style={{ fontSize: '20px' }}> / {pageNo}</span>{' '}
              </IonLabel>
            </IonCol>
            <IonCol size='1'>
              <IonIcon
                src={addOutline}
                hidden={count === pageNo}
                style={{ color: 'black', marginTop: '10px' }}
                onClick={incrementPage}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='4'>
              <IonButton onClick={() => getData()}>
                <IonIcon src={searchOutline} className='button-icon' />
                {t('lan.lblLangLoad')}
              </IonButton>
            </IonCol>
            {/* <IonCol size="4">

                            <IonButton disabled={data.assembly === '' || data.booth === ''} onClick={() =>
                                presentAction({
                                    header: 'Download Type',
                                    cssClass: 'my-custom-class',
                                    mode: 'ios',
                                    buttons: [
                                        {
                                            text: 'Voter List',
                                            role: 'destructive',
                                            handler() {
                                                createPDFDownload(process.env.REACT_APP_API_URL+ "DwnldVoterList?pAssembly=" + data.assembly + "&pbooth=" + data.booth, "Voter_List.pdf", "Voter ID Card");
                                            },
                                        },
                                        {
                                            text: 'Id Card',
                                            handler() {
                                                createPDFDownload(process.env.REACT_APP_API_URL+ "DwnldIDCard?pAssembly=" + data.assembly + "&pbooth=" + data.booth + "&pPageNo=" + data.page, "Voter_Id_Card.pdf" , "Voter ID Card" );
                                            },
                                        }
                                    ],
                                })
                            }>{t('lan.lblLangDownload')}</IonButton></IonCol> */}
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />
        {Array.isArray(value) && value?.length > 0
          ? value?.map((item: any, key: any) => {
              return (
                <div key={key}>
                  <IonCard
                    key={key}
                    className={
                      item?.DESIGNATION == 'PP'
                        ? 'IsLabharthi'
                        : item?.DESIGNATION == 'PC'
                        ? 'IsLabharthi2'
                        : item?.DESIGNATION == 'MS'
                        ? 'IsLabharthi3'
                        : ''
                    }
                  >
                    <IonCardContent className='complaint-card'>
                      <IonGrid>
                        <IonRow>
                          <IonCol size='6'>
                            <span className='numberCircle'>
                              <b>{key + 1}</b>
                            </span>
                            {item?.REC_DATA_LOCK === 'Y' ? (
                              <span
                                onClick={() => {
                                  prevent({
                                    message: 'Record is Locked',
                                    duration: 3000,
                                    position: 'bottom',
                                    color: 'danger',
                                    icon: closeOutline
                                  })
                                }}
                                className={
                                  item?.REC_DATA_LOCK != 'Y'
                                    ? 'voter'
                                    : 'voter-lock'
                                }
                              >
                                <b>{item?.VOTERNO} </b>
                              </span>
                            ) : (
                              // <Link to={`/entrythrough-ed/${item?.VOTERNO}`}><span className={item?.REC_DATA_LOCK != "Y" ? 'voter' : 'voter-lock'}><b>{item?.VOTERNO} </b></span></Link>
                              <Link
                                to={{
                                  pathname: '/entrythrough',
                                  state: { id: item?.VOTERNO }
                                }}
                              >
                                <span
                                  className={
                                    item?.REC_DATA_LOCK != 'Y'
                                      ? 'voter'
                                      : 'voter-lock'
                                  }
                                >
                                  <b>{item?.VOTERNO}</b>
                                </span>
                              </Link>
                            )}
                          </IonCol>
                          <IonCol size='3'></IonCol>
                          <IonCol size='3'>
                            {item?.REC_DATA_LOCK === 'Y' ? (
                              <IonIcon
                                style={{ color: 'black' }}
                                src={lockClosedOutline}
                              />
                            ) : (
                              <IonIcon
                                style={{ color: 'black' }}
                                src={lockOpenOutline}
                              />
                            )}
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                      <IonGrid className='rowborder'>
                        <IonRow>
                          <IonCol size='4' className='booth'>
                            <b>
                              {t('lan.lblLangAssembly')}: {item?.AC_NO}
                            </b>
                          </IonCol>
                          <IonCol size='8' className='booth'>
                            <span>
                              {t('lan.lblLangBoothNo')}:{item?.BOOTH_NO}{' '}
                            </span>
                            <span>
                              {' '}
                              {t('lan.lblLangPageNo')}:{item?.PAGE_NO}
                            </span>
                            <span>
                              {' '}
                              {t('lan.lblLangNo')}:{item?.SERIAL}{' '}
                            </span>
                          </IonCol>
                        </IonRow>
                      </IonGrid>

                      <IonGrid className='rowborder'>
                        <IonRow>
                          <IonCol size='3'>
                            <IonLabel>
                              <b>{t('lan.lblLangName')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='9'>
                            <IonLabel>{item?.ENG_FULLNAME}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='3'>
                            <IonLabel>
                              <b>{t('lan.lblLangAddress')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='9'>
                            <IonLabel>{item?.ADDRESS}</IonLabel>
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
                              {item?.MOBNO === 0 ? '' : item?.MOBNO}{' '}
                            </IonLabel>
                          </IonCol>
                        </IonRow>
                        {item?.MOBNO != 0 && item?.MOBNO !== null ? (
                          <IonRow>
                            <IonCol size='4'></IonCol>
                            <IonCol size='2'>
                              {DeviceInfo !== null ? (
                                <IonIcon
                                  style={{ color: 'black' }}
                                  src={callOutline}
                                  onClick={() => call(item?.MOBNO)}
                                />
                              ) : (
                                <a href={`tel:${item?.MOBNO}`}>
                                  <IonIcon
                                    style={{ color: 'black' }}
                                    src={callOutline}
                                  />
                                </a>
                              )}
                            </IonCol>
                            <IonCol size='2'>
                              <IonIcon
                                style={{ color: 'black' }}
                                src={chatbubbleEllipsesOutline}
                                onClick={() => smsShort(item?.MOBNO, item?.SSD)}
                              />
                            </IonCol>
                            <IonCol size='2'>
                              <IonIcon
                                style={{ color: 'black' }}
                                src={chatbubblesOutline}
                                onClick={() => smsLong(item?.MOBNO, item?.LSD)}
                              />
                            </IonCol>
                            <IonCol size='2'>
                              <a href={`https://wa.me/91${item?.MOBNO}`}>
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
                        {item?.BENF_ITEM_TYPE !== null &&
                        item?.BENF_ITEM_TYPE !== '' ? (
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>{t('lan.MenuBeneficiary')}</IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel
                                color='success'
                                onClick={() => beneDetails(item?.VOTERNO)}
                              >
                                {item?.BENF_ITEM_TYPE}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                        ) : (
                          ''
                        )}
                      </IonGrid>

                      <IonGrid>
                        {item?.VOTER_PROFILE !== null ? (
                          <IonRow>
                            <IonCol size='4'>
                              <IonImg src={item?.VOTER_PROFILE} />
                            </IonCol>
                          </IonRow>
                        ) : (
                          ''
                        )}

                        {/* <IonButton onClick={() => getViewData(item.VOTERNO)}>
                          {t('lan.lblViewmore')}
                        </IonButton> */}
                        <IonRow>
                          <IonCol></IonCol>
                          <IonCol>
                            <IonLabel color='primary' onClick={() => getViewData(item.VOTERNO)}>
                              {t('lan.lblViewmore')} 
                            </IonLabel>
                          </IonCol>
                          <IonCol></IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </div>
              )
            })
          : ''}

        {/* BENEFICIARY DETAILS MODAL 27/04/2023 */}

        <IonModal isOpen={showBeneficiary}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Beneficiary Details</IonTitle>
              <IonButtons slot='end'>
                <IonIcon
                  onClick={() => setShowBeneficiary(false)}
                  icon={closeCircleOutline}
                />
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {Array.isArray(beneficiary) && beneficiary.length > 0
              ? beneficiary.map((item: any, key: any) => {
                  return (
                    <IonCard key={key}>
                      <IonCardContent className='complaint-card'>
                        <IonGrid>
                          <IonRow>
                            <IonCol size='3'>
                              <IonLabel>Catagory</IonLabel>
                            </IonCol>
                            <IonCol size='9'>
                              <IonLabel>{item?.BENF_CATEGORY}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='3'>
                              <IonLabel>Item Name</IonLabel>
                            </IonCol>
                            <IonCol size='9'>
                              <IonLabel>{item?.BENF_ITEM_NAME}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='3'>
                              <IonLabel>Sub Item Name</IonLabel>
                            </IonCol>
                            <IonCol size='9'>
                              <IonLabel>{item?.BENF_SUB_ITEM_NAME}</IonLabel>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonCardContent>
                    </IonCard>
                  )
                })
              : ''}
          </IonContent>
        </IonModal>

        {/* {value.length > 0 ? (
                    <IonButton onClick={getData}>Load More...</IonButton>
                ) : ""} */}

        {Array.isArray(viewData) && viewData.length > 0
          ? viewData.map((item: any, key: any) => {
              return (
                <IonModal key={key} isOpen={showModal}>
                  <IonHeader>
                    <IonToolbar>
                      <IonGrid>
                        <IonRow>
                          <IonCol size='10'>
                            <IonTitle>{t('lan.MenuVoterList')}</IonTitle>
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
                    <IonCard
                      key={key}
                      className={
                        item?.DESIGNATION == 'PP'
                          ? 'IsLabharthi'
                          : item?.DESIGNATION == 'PC'
                          ? 'IsLabharthi2'
                          : item?.DESIGNATION == 'MS'
                          ? 'IsLabharthi3'
                          : ''
                      }
                    >
                      <IonCardContent className='complaint-card'>
                        <IonGrid>
                          <IonRow>
                            <IonCol size='6'>
                              <span className='numberCircle'>
                                <b>{key + 1}</b>
                              </span>
                              {item?.REC_DATA_LOCK === 'Y' ? (
                                <span
                                  onClick={() => {
                                    prevent({
                                      message: 'Record is Locked',
                                      duration: 3000,
                                      position: 'bottom',
                                      color: 'danger',
                                      icon: closeOutline
                                    })
                                  }}
                                  className={
                                    item?.REC_DATA_LOCK != 'Y'
                                      ? 'voter'
                                      : 'voter-lock'
                                  }
                                >
                                  <b>{item?.VOTERNO} </b>
                                </span>
                              ) : (
                                // <Link to={`/entrythrough-ed/${item?.VOTERNO}`}><span className={item?.REC_DATA_LOCK != "Y" ? 'voter' : 'voter-lock'}><b>{item?.VOTERNO} </b></span></Link>
                                <Link
                                  to={{
                                    pathname: '/entrythrough',
                                    state: { id: item?.VOTERNO }
                                  }}
                                >
                                  <span
                                    className={
                                      item?.REC_DATA_LOCK != 'Y'
                                        ? 'voter'
                                        : 'voter-lock'
                                    }
                                  >
                                    <b>{item?.VOTERNO}</b>
                                  </span>
                                </Link>
                              )}
                            </IonCol>
                            <IonCol size='3'></IonCol>
                            <IonCol size='3'>
                              {item?.REC_DATA_LOCK === 'Y' ? (
                                <IonIcon src={lockClosedOutline} />
                              ) : (
                                <IonIcon src={lockOpenOutline} />
                              )}
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                        <IonGrid className='rowborder'>
                          <IonRow>
                            <IonCol size='5' className='booth'>
                              <b>
                                {t('lan.lblLangAssembly')}: {item?.AC_NO}
                              </b>
                            </IonCol>
                            <IonCol size='7' className='booth'>
                              <span>
                                {t('lan.lblLangBoothNo')}:{item?.BOOTH}{' '}
                              </span>
                              <span>
                                {' '}
                                {t('lan.lblLangPageNo')}:{item?.PAGENO}
                              </span>
                              <span>
                                {' '}
                                {t('lan.lblLangNo')}:{item?.SERIAL}{' '}
                              </span>
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
                              <IonLabel>{item?.ENG_FULLNAME}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangAddress')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.ADDRESS}</IonLabel>
                            </IonCol>
                          </IonRow>

                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangAge')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='2'>
                              <IonLabel>{item?.AGE}</IonLabel>
                            </IonCol>
                            <IonCol size='2'>
                              <IonLabel>
                                <b>{t('lan.lblLangGender')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='4'>
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
                              <IonLabel>{item?.BLOOD_GROUP}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangbirthdate')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.BIRTHDATE}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangDOA')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.ANNIVERSARY}</IonLabel>
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
                                {item?.MOBNO === 0 ? '' : item?.MOBNO}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                          {item?.MOBNO != 0 && item?.MOBNO !== null ? (
                            <IonRow>
                              <IonCol size='4'></IonCol>
                              <IonCol size='2'>
                                {DeviceInfo !== null ? (
                                  <IonIcon
                                    style={{ color: 'black' }}
                                    src={callOutline}
                                    onClick={() => call(item?.MOBNO)}
                                  />
                                ) : (
                                  <a href={`tel:${item?.MOBNO}`}>
                                    <IonIcon
                                      style={{ color: 'black' }}
                                      src={callOutline}
                                    />
                                  </a>
                                )}
                              </IonCol>
                              <IonCol size='2'>
                                <IonIcon
                                  style={{ color: 'black' }}
                                  src={chatbubbleEllipsesOutline}
                                  onClick={() =>
                                    smsShort(item?.MOBNO, item?.SSD)
                                  }
                                />
                              </IonCol>
                              <IonCol size='2'>
                                <IonIcon
                                  style={{ color: 'black' }}
                                  src={chatbubblesOutline}
                                  onClick={() =>
                                    smsLong(item?.MOBNO, item?.LSD)
                                  }
                                />
                              </IonCol>
                              <IonCol size='2'>
                                <a href={`https://wa.me/91${item?.MOBNO}`}>
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
                                <b>{t('lan.lblLangMobile2')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.ALTERNATE_MOBILE}</IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangAadharNo')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.AADHAR_NO}</IonLabel>
                            </IonCol>
                          </IonRow>

                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.lblLangPartyAffiliation')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>{item?.MIND_SET}</IonLabel>
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
                              <IonLabel>{item?.DESIGNATION}</IonLabel>
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
                                {item?.EMAIL_ID !== null ? item?.EMAIL_ID : '-'}
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
                              <IonLabel>
                                {item?.WHATSAPP_NO !== null
                                  ? item?.WHATSAPP_NO
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
                                {item?.FACEBOOK_ID !== null
                                  ? item?.FACEBOOK_ID
                                  : '-'}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size='4'>
                              <IonLabel>
                                <b>{t('lan.MenuTwitter')}</b>
                              </IonLabel>
                            </IonCol>
                            <IonCol size='8'>
                              <IonLabel>
                                {item?.TWITTER_ID !== null
                                  ? item?.TWITTER_ID
                                  : '-'}
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                        <IonGrid>
                          {item?.VOTER_PROFILE !== null ? (
                            <IonRow>
                              <IonCol size='4'>
                                <IonImg src={item?.VOTER_PROFILE} />
                              </IonCol>
                            </IonRow>
                          ) : (
                            ''
                          )}
                        </IonGrid>
                      </IonCardContent>
                    </IonCard>
                  </div>
                </IonModal>
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

export default VoterList
