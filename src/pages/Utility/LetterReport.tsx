import React, { useState, useEffect } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonCardTitle,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  useIonToast,
  IonLoading,
  IonModal,
  IonCard,
  IonCardContent,
  IonPopover,
  IonDatetimeButton,
  IonDatetime,
  IonItemDivider,
  IonButtons
} from '@ionic/react'
import { useHistory } from 'react-router-dom'
import axiosApi from '../../axiosApi'
import {
  arrowBackOutline,
  callOutline,
  closeCircleOutline,
  codeDownloadOutline,
  documentAttachOutline,
  downloadOutline,
  logoWhatsapp,
  searchOutline
} from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import useDownLoad from '../../hooks/download.hook'
import Loader from '../../components/Load'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'
import { useDeviceInfo } from '../../hooks/useDeviceInfo'
import axios from 'axios'

const LetterReport: React.FC = () => {
  const [prevent] = useIonToast()
  const history = useHistory()
  const { t } = useTranslation()
  const defaultState = {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().endOf('month').format('YYYY-MM-DD')
  }

  const filterState = {
    fDate: '',
    tDate: '',
    priority: '',
    status: '',
    asse_filter: '',
    ward_filter: ''
  }
  const [filterData, setFilterData] = useState<any>(filterState)
  const [data, setData] = useState<any>(defaultState)
  const [letterData, setLetterData] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [totalVisitor, setTotalVisitor] = useState<any>()
  const [totalInward, setTotalInward] = useState<any>()
  const [totalOutward, setTotalOutward] = useState<any>()
  const [subData, setSubData] = useState<any>([])
  const [modelTitle, setModelTitle] = useState()
  const [subHeading, setSubHeading] = useState()
  const [showPopup, setShowPopup] = useState(false)
  const [reasonData, setReasonData] = useState([])
  const [totaldetailVisitor, setTotalDetailVisitor] = useState()
  const [totaldetailInward, setTotalDetailInward] = useState()
  const [totaldetailOutward, setTotalDetailOutward] = useState()
  const [showCount, setShowCount] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [profileData, setProfileData] = useState([])
  const [perPage] = useState(50)
  const [pageCount, setPageCount] = useState(0)
  const [pagination, setPagination] = useState<any>([])
  const [booth, setBooth] = useState<any>([])
  const [reasonId, setReasonId] = useState()
  const [filterFlag, setFilterFlag] = useState()
  const [flag, setFlag] = useState(false)
  const [statusData, setStatusData] = useState([])
  const [outwardModel, setoutwardModel] = useState(false) // Outward Model Open/close
  const [outwardData, setoutwardData] = useState([]) // Outward Data Store in Array

  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')

  const { createPDFDownload, downloadFilesFor, call } = useDownLoad()
  const { DeviceInfo } = useDeviceInfo()

  const changeEvent = (e: any) => {
    const { name } = e.target
    setData({ ...data, [name]: e.detail.value })
  }

  const changeEventFilter = (e: any) => {
    const { name, value } = e.target
    setFilterData({ ...filterData, [name]: value })
  }

  // Load Letter Data Date wise
  const getLetterData = async () => {
    setLetterData([])
    setTotalVisitor(0)
    setTotalInward(0)
    setTotalOutward(0)
    setLoad(true)
    await axiosApi
      .get(
        'GetAllInWardOutWardEntryDetailsByReasonGroups?pRole=ADMIN&pflag=IN-OUT&pfromdate=' +
          moment(data?.fromDate).format('DD-MM-YYYY') +
          '&pToDate=' +
          moment(data?.toDate).format('DD-MM-YYYY')
      )
      .then(res => {
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp.data)
          if (Resp.error === false) {
            setLetterData(Data)
            setTotalVisitor(Data[0].TOTAL_VISITOR_COUNT)
            setTotalInward(Data[0].TOTAL_IN_LETTER_COUNT)
            setTotalOutward(Data[0].TOTAL_OUT_LETTER_COUNT)
            setLoad(false)
          } else {
            prevent(Resp.msg, 3000)
            setLoad(false)
          }
        } else {
          prevent('No Data Found...', 3000)
          setLoad(false)
        }
      })
      .catch(err => {
        prevent(err.message, 3000)
        setLoad(false)
      })
  }

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly)
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch])

  const changeEventBooth = async (e: any) => {
    setFilterData({
      ...filterData,
      asse_filter: e.target.value,
      ward_filter: ''
    })
    setBooth([])
    // setFilterData({ asse_filter: e.target.value, ward_filter: '' });
    setLoad(true)
    await axiosApi
      .get(
        '/GetAssemblyWiseWardByUserLoginLevel?pUserLevel=' +
          Name +
          ' &pUserMblNo=' +
          Num +
          '&pAcNo=' +
          e.target.value
      )
      .then(res => {
        const Resp = JSON.parse(res.data)
        const Data = JSON.parse(Resp.data)
        if (res.data !== '') {
          if (Resp.error === false) {
            setBooth(Data)
          } else {
            prevent(Resp.msg, 3000)
          }
        }

        setLoad(false)
      })
      .catch(err => {
        prevent(err.message, 3000)
        setLoad(false)
      })
  }

  useEffect(() => {
    getLetterData()
    axiosApi
      .get('GetWorkStatusDetails?pStatus=')
      .then(res => {
        const Resp = JSON.parse(res.data)
        const Data = JSON.parse(Resp.data)
        if (res.data !== '') {
          if (Resp.error === false) {
            setStatusData(Data)
          } else {
            prevent(Resp.msg, 3000)
          }
        } else {
          prevent('Status not found', 3000)
        }
      })
      .catch(err => {
        prevent(err.message, 3000)
      })
  }, [])

  // Get Visitor Data from sub data
  const getVisitor = async (item: any, type: any, heading: any) => {
    setLoad(true)
    setFilterFlag(type)
    setModelTitle(item.REASON_GROUP === undefined ? type : item.REASON_GROUP)
    setSubHeading(heading)
    setReasonId(item.REASON_GROUP_ID === undefined ? '' : item.REASON_GROUP_ID)
    setFlag(true)
    await axiosApi
      .get(
        'OpenVisitorInOutDetailsList?pRole=ADMIN&pflag=' +
          type +
          '&pReason=' +
          item.REASON_GROUP_ID +
          '&pfromdate=' +
          moment(data.fromDate).format('DD-MM-YYYY') +
          '&pToDate=' +
          moment(data.toDate).format('DD-MM-YYYY') +
          '&pPriority=' +
          filterData?.priority +
          '&pWorkStatus=' +
          filterData?.status +
          '&pWorkAssembly=' +
          filterData?.asse_filter +
          '&pWorkWard=' +
          filterData?.ward_filter +
          '&pSortby='
      )
      .then(res => {
        const Resp = JSON.parse(res.data)
        const Data = JSON.parse(Resp.data)
        if (res.data !== '') {
          if (Resp.error === false) {
            setPagination(Data)
            const data = Data.slice(0, 50)
            setPageCount(Math.ceil(Data.length / perPage))
            setShowCount(true)
            setSubData(data)
            setLoad(false)
          } else {
            prevent(Resp.msg, 3000)
            setLoad(false)
          }
        } else {
          prevent('No Data Found...', 3000)
          setLoad(false)
        }
      })
      .catch(err => {
        prevent(err.message, 3000)
        setLoad(false)
      })
  }
  const handlePageClick = (selected: any) => {
    const pagesVisited = selected.selected * perPage
    const lastSetData = pagesVisited + perPage
    setSubData(pagination.slice(pagesVisited, lastSetData))
  }
  // get Data From reason name
  const getDetailsReason = async (reasonName: any) => {
    setLoad(true)
    setModelTitle(reasonName)
    await axiosApi
      .get(
        'showReasonGroupWiseReasonDeatils?pReasongNm=' +
          reasonName +
          '&pflag=&pfromdate=' +
          moment(data?.fromDate).format('DD-MM-YYYY') +
          '&pToDate=' +
          moment(data?.toDate).format('DD-MM-YYYY')
      )
      .then(res => {
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp.data)
          if (Resp.error === false) {
            setReasonData(Data)
            setTotalDetailVisitor(Data[0].TOTAL_VISITOR_COUNT)
            setTotalDetailInward(Data[0].TOTAL_IN_LETTER_COUNT)
            setTotalDetailOutward(Data[0].TOTAL_OUT_LETTER_COUNT)
            setShowPopup(true)
            setLoad(false)
          } else {
            prevent(Resp.msg, 3000)
            setLoad(false)
          }
        } else {
          prevent('No Data Found...', 3000)
          setLoad(false)
        }
      })
      .catch(err => {
        prevent(err.message, 3000)
        setLoad(false)
      })
  }

  // get Details Count From reason name
  const getDetailsCount = async (item: any, type: any) => {
    setLoad(true)
    setFilterFlag(type)
    setSubHeading(item.REASON_NAME === undefined ? type : item?.REASON_NAME)
    setReasonId(item.REASON_MAS_ID)
    setFlag(false)
    await axiosApi
      .get(
        'GetIn_OutwardLetterDetailsSummury?pRole=ADMIN&pflag=' +
          type +
          '&pReason=' +
          item.REASON_MAS_ID +
          '&pfromdate=' +
          moment(data.fromDate).format('DD-MM-YYYY') +
          '&pToDate=' +
          moment(data.toDate).format('DD-MM-YYYY') +
          '&pPriority=' +
          filterData?.priority +
          '&pWorkStatus=' +
          filterData?.status +
          '&pWorkAssembly=' +
          filterData?.asse_filter +
          '&pWorkWard=' +
          filterData?.ward_filter +
          '&pSortby='
      )
      .then(res => {
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp.data)
          if (Resp.error === false) {
            setSubData(Data)
            setShowCount(true)
            setLoad(false)
          } else {
            prevent(Resp.msg, 3000)
            setLoad(false)
          }
        } else {
          prevent('No Data Found...', 3000)
          setLoad(false)
        }
      })
      .catch(err => {
        prevent(err.message, 3000)
        setLoad(false)
      })
  }

  const getFilterData = async () => {
    setSubData([])
    setLoad(true)
    if (flag === false) {
      await axiosApi
        .get(
          'GetIn_OutwardLetterDetailsSummury?pRole=&pflag=' +
            filterFlag +
            '&pReason=' +
            reasonId +
            '&pfromdate=' +
            moment(data.fromDate).format('DD-MM-YYYY') +
            '&pToDate=' +
            moment(data.toDate).format('DD-MM-YYYY') +
            '&pPriority=' +
            filterData?.priority +
            '&pWorkStatus=' +
            filterData?.status +
            '&pWorkAssembly=' +
            filterData?.asse_filter +
            '&pWorkWard=' +
            filterData?.ward_filter +
            '&pSortby='
        )
        .then(res => {
          if (res.data !== '') {
            const Resp = JSON.parse(res.data)
            const Data = JSON.parse(Resp.data)
            if (Resp.error === false) {
              setSubData(Data)
              setShowCount(true)
              setLoad(false)
            } else {
              prevent(Resp.msg, 3000)
              setLoad(false)
            }
          } else {
            prevent('No Data Found...', 3000)
            setLoad(false)
          }
        })
        .catch(err => {
          prevent(err.message, 3000)
          setLoad(false)
        })
    } else {
      await axiosApi
        .get(
          'OpenVisitorInOutDetailsList?pRole=&pflag=' +
            filterFlag +
            '&pReason=' +
            reasonId +
            '&pfromdate=' +
            moment(data.fromDate).format('DD-MM-YYYY') +
            '&pToDate=' +
            moment(data.toDate).format('DD-MM-YYYY') +
            '&pPriority=' +
            filterData?.priority +
            '&pWorkStatus=' +
            filterData?.status +
            '&pWorkAssembly=' +
            filterData?.asse_filter +
            '&pWorkWard=' +
            filterData?.ward_filter +
            '&pSortby='
        )
        .then(res => {
          if (res.data !== '') {
            const Resp = JSON.parse(res.data)
            const Data = JSON.parse(Resp.data)
            if (Resp?.error === false) {
              setSubData(Data)
              setLoad(false)
            } else {
              prevent(Resp.msg, 3000)
              setLoad(false)
            }
          } else {
            prevent('No Data Found...', 3000)
            setLoad(false)
          }
        })
        .catch(err => {
          prevent(err.message, 3000)
          setLoad(false)
        })
    }
  }

  const getProfile = async (voter: any) => {
    await axiosApi
      .get('OpenVisitorPriofileDetails?pVoterId=' + voter + '&pFlag=')
      .then(res => {
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp.data)
          if (Resp?.error === false) {
            setShowProfile(true)
            setProfileData(Data)
          } else {
            prevent(Resp.msg, 3000)
          }
        }
      })
      .catch(err => {
        prevent(err.message, 3000)
      })
  }

  const clearData = () => {
    setSubData([])
    setLetterData([])
    history.replace('/utility')
  }

  const close = () => {
    setFilterData(filterState)
    setShowCount(false)
  }

  // Outward Data

  const getOutwardData = (item: any) => {
    setoutwardModel(true)
    setLoad(true)
    axios
      .get(
        process.env.REACT_APP_API_WEB +
          '/GetVisitorOutWardDocumentDetails?pVisSrNo=' +
          item.VIS_SRNO +
          '&pVisInWardNo=' +
          item.VIS_INWARD_LETTER_NO
      )
      .then(res => {
        const reason = JSON.parse(res.data)
        const Data = JSON.parse(reason.data)
        if (res.status === 200) {
          setoutwardData(Data)
          setLoad(false)
        }
      })    
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <IonIcon src={arrowBackOutline} onClick={clearData} />
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{t('lan.lblLetterReport')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page_content'>
        <IonGrid>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangFromDate')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              {/* <IonInput type='date' name='fromDate' value={data?.fromDate} onIonChange={changeEvent} /> */}
              <IonDatetimeButton datetime='fdatetime'></IonDatetimeButton>

              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  color='warning'
                  id='fdatetime'
                  value={data?.fromDate}
                  name='fromDate'
                  presentation='date'
                  showDefaultTitle={true}
                  onIonChange={changeEvent}
                ></IonDatetime>
              </IonModal>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangToDate')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              {/* <IonInput type='date' name='toDate' value={data?.toDate} onIonChange={changeEvent} /> */}
              <IonDatetimeButton
                className='dtpBtn'
                datetime='tdatetime'
              ></IonDatetimeButton>

              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  color='warning'
                  id='tdatetime'
                  value={data?.toDate}
                  name='toDate'
                  presentation='date'
                  showDefaultTitle={true}
                  onIonChange={changeEvent}
                ></IonDatetime>
              </IonModal>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='6'>
              <IonButton
                shape='round'
                expand='block'
                fill='outline'
                onClick={getLetterData}
              >
                <IonIcon src={searchOutline} className='button-icon' />
                {t('lan.lblLangLoad')}
              </IonButton>
            </IonCol>
            <IonCol size='6'>
              {DeviceInfo !== null ? (
                <IonButton
                  shape='round'
                  expand='block'
                  fill='outline'
                  onClick={() =>
                    createPDFDownload(
                      process.env.REACT_APP_API_URL +
                        'ExportInWardOutWardEntryDetails?ExType=Pdf&pfromdate=' +
                        moment(data?.fromDate).format('DD-MM-YYYY') +
                        '&pToDate=' +
                        moment(data?.toDate).format('DD-MM-YYYY'),
                      'Letter_Report.pdf',
                      'Letter Report'
                    )
                  }
                >
                  Export PDF
                </IonButton>
              ) : (
                <a
                  href={
                    process.env.REACT_APP_API_URL +
                    'ExportInWardOutWardEntryDetails?ExType=Pdf&pfromdate=' +
                    moment(data?.fromDate).format('DD-MM-YYYY') +
                    '&pToDate=' +
                    moment(data?.toDate).format('DD-MM-YYYY')
                  }
                  download={true}
                >
                  <IonButton shape='round' expand='block' fill='outline'>
                    Export PDF
                  </IonButton>
                </a>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />

        {/* Display Total count Date wise */}
        <IonCard>
          <IonCardContent className='complaint-card'>
            <IonGrid>
              <IonRow>
                <IonCol
                  size='4'
                  style={{
                    textAlign: 'center',
                    color: '#263238',
                    fontWeight: '600'
                  }}
                >
                  {t('lan.lblVisitor')}
                </IonCol>
                <IonCol
                  size='4'
                  style={{
                    textAlign: 'center',
                    color: '#263238',
                    fontWeight: '600'
                  }}
                >
                  {t('lan.lblInward')}
                </IonCol>
                <IonCol
                  size='4'
                  style={{
                    textAlign: 'center',
                    color: '#263238',
                    fontWeight: '600'
                  }}
                >
                  {t('lan.lblOutward')}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol
                  size='4'
                  style={{
                    textAlign: 'center',
                    color: 'red',
                    textDecoration: 'underline'
                  }}
                  onClick={() =>
                    totalVisitor !== 0
                      ? getVisitor('', 'TOTAL_VISITOR', 'Visitor Details')
                      : ''
                  }
                >
                  {totalVisitor}
                </IonCol>
                <IonCol
                  size='4'
                  style={{
                    textAlign: 'center',
                    color: 'red',
                    textDecoration: 'underline'
                  }}
                  onClick={() =>
                    totalInward !== 0
                      ? getVisitor('', 'TOTAL_INWARD', 'Inward Details')
                      : ''
                  }
                >
                  {totalInward}
                </IonCol>
                <IonCol
                  size='4'
                  style={{
                    textAlign: 'center',
                    color: 'red',
                    textDecoration: 'underline'
                  }}
                  onClick={() =>
                    totalOutward !== 0
                      ? getVisitor('', 'TOTAL_OUTWARD', 'Outward Details')
                      : ''
                  }
                >
                  {totalOutward}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Display Data for Date wise */}
        {Array.isArray(letterData) && letterData.length >= 0
          ? letterData.map((item: any, key: any) => {
              return (
                <>
                  <IonCard key={key}>
                    <IonCardContent className='complaint-card'>
                      <IonGrid>
                        <IonRow>
                          <IonCol size='2'>
                            <span className='numberCircle'>
                              <b>{key + 1}</b>
                            </span>
                          </IonCol>
                          <IonCol size='10'>
                            <IonLabel
                              style={{
                                textAlign: 'center',
                                textDecoration: 'underline',
                                color: 'blue',
                                fontSize: '15px'
                              }}
                              onClick={() =>
                                getDetailsReason(item.REASON_GROUP)
                              }
                            >
                              {item.REASON_GROUP}
                            </IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonCardTitle className='letter-card-title'></IonCardTitle>
                        <IonRow>
                          <IonCol size='4' style={{ textAlign: 'center' }}>
                            <IonLabel>{t('lan.lblVisitor')}</IonLabel>
                          </IonCol>
                          <IonCol size='4' style={{ textAlign: 'center' }}>
                            <IonLabel>{t('lan.lblInward')}</IonLabel>
                          </IonCol>
                          <IonCol size='4' style={{ textAlign: 'center' }}>
                            <IonLabel>{t('lan.lblOutward')}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol
                            size='4'
                            style={{
                              textAlign: 'center',
                              textDecoration: 'underline',
                              color: 'blue',
                              fontWeight: 600
                            }}
                            onClick={() =>
                              item.VISITOR_COUNT !== null
                                ? getVisitor(item, 'VISITOR', 'Visitor Details')
                                : ''
                            }
                          >
                            {item.VISITOR_COUNT}
                          </IonCol>
                          <IonCol
                            size='4'
                            style={{
                              textAlign: 'center',
                              textDecoration: 'underline',
                              color: 'blue',
                              fontWeight: 600
                            }}
                            onClick={() =>
                              item.INWARD_LTR_COUNT !== null
                                ? getVisitor(item, 'LETTER', 'Inward Details')
                                : ''
                            }
                          >
                            {item.IN_LETTER_COUNT}
                          </IonCol>
                          <IonCol
                            size='4'
                            style={{
                              textAlign: 'center',
                              textDecoration: 'underline',
                              color: 'blue',
                              fontWeight: 600
                            }}
                            onClick={() =>
                              item.OUTWARD_LTR_COUNT !== null
                                ? getVisitor(item, 'OUTWARD', 'Outward Details')
                                : ''
                            }
                          >
                            {item.OUT_LETTER_COUNT}
                          </IonCol>
                        </IonRow>
                        <IonRow></IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </>
              )
            })
          : ''}

        {/* Profile Data Show */}

        <IonModal
          isOpen={showProfile}
          onDidDismiss={() => setShowProfile(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonGrid>
                <IonRow>
                  <IonCol size='11'>
                    <IonTitle>{t('lan.lblProfileDetials')}</IonTitle>
                  </IonCol>
                  <IonCol size='1'>
                    <IonIcon
                      src={closeCircleOutline}
                      onClick={() => setShowProfile(false)}
                    />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {Array.isArray(profileData) && profileData.length >= 0
              ? profileData.map((item: any, key: any) => (
                  <IonCard>
                    <IonCardContent className='complaint-card'>
                      <IonItemDivider>
                        <IonLabel>{t('lan.lblPersonalinformation')}</IonLabel>
                      </IonItemDivider>
                      <IonGrid>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangName')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item?.FULLNAME_ENG}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangAddress')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item?.ADDRESS_ENG}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangMobile')}</IonLabel>
                          </IonCol>
                          <IonCol size='8' onClick={() => call(item?.MOBNO)}>
                            {DeviceInfo !== null ? (
                              <IonIcon
                                src={callOutline}
                                style={{ fontSize: '20px', color: 'black' }}
                                onClick={() => call(item?.MOBNO)}
                              />
                            ) : (
                              <a href={`tel:${item?.MOBNO}`}>
                                <IonIcon
                                  src={callOutline}
                                  style={{ fontSize: '20px', color: 'black' }}
                                />
                              </a>
                            )}
                            {item?.MOBNO}
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangDesignation')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item?.DESIGNATION}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangbirthdate')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item?.BIRTHDATE}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangDOA')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item?.ANNIVERSARY}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item?.AS_SEAT_NM}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangBoothNo')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item?.BOOTH_NAME}</IonCol>
                        </IonRow>
                        <IonItemDivider>
                          <IonLabel>{t('lan.lblSocial')}</IonLabel>
                        </IonItemDivider>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangEmail')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item?.EMAIL_ID}</IonLabel>
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
                              <a href={`https://wa.me/91${item?.WHATSAPP_NO}`}>
                                {item?.WHATSAPP_NO !== '' ? (
                                  <IonIcon
                                    style={{ fontSize: '20px', color: 'green' }}
                                    src={logoWhatsapp}
                                  />
                                ) : (
                                  ''
                                )}
                              </a>
                              {item?.WHATSAPP_NO}
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
                            <IonLabel>{item?.FACEBOOK_ID}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.MenuTwitter')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item?.TWITTER_ID}</IonLabel>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                ))
              : ''}
          </IonContent>
        </IonModal>

        {/* Display count sub Data */}
        <IonModal isOpen={showCount} onDidDismiss={() => setShowCount(false)}>
          <IonHeader>
            <IonToolbar>
              <IonGrid>
                <IonRow>
                  <IonCol size='11'>
                    <IonTitle>
                      {modelTitle}{' '}
                      <span style={{ fontSize: '14px' }}>({subHeading})</span>
                    </IonTitle>
                  </IonCol>
                  <IonCol size='1'>
                    <IonIcon src={closeCircleOutline} onClick={close} />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
              <IonRow>
                <IonCol size='4'>
                  <IonLabel>
                    {t('lan.lblLangFromDate')}
                    <IonDatetimeButton
                      className='dtpBtn'
                      datetime='fdatetime'
                    ></IonDatetimeButton>

                    <IonModal keepContentsMounted={true}>
                      <IonDatetime
                        color='warning'
                        id='fdatetime'
                        value={data?.fromDate}
                        doneText='done'
                        name='fromDate'
                        presentation='date'
                        showDefaultTitle={true}
                        onIonChange={changeEvent}
                      ></IonDatetime>
                    </IonModal>
                  </IonLabel>
                </IonCol>

                <IonCol size='4'>
                  <IonLabel>
                    {t('lan.lblLangToDate')}
                    <IonDatetimeButton
                      className='dtpBtn'
                      datetime='tdatetime'
                    ></IonDatetimeButton>

                    <IonModal keepContentsMounted={true}>
                      <IonDatetime
                        color='warning'
                        id='tdatetime'
                        value={data?.toDate}
                        doneText='done'
                        name='toDate'
                        presentation='date'
                        showDefaultTitle={true}
                        onIonChange={changeEvent}
                      ></IonDatetime>
                    </IonModal>
                  </IonLabel>
                </IonCol>

                <IonCol size='4'>
                  <IonLabel>{t('lan.lblPriority')}</IonLabel>
                  <select
                    name='priority'
                    value={filterData?.priority}
                    onChange={changeEventFilter}
                  >
                    <option value=''>ALL</option>
                    <option value='HIGH'>HIGH</option>
                    <option value='MEDIUM'>MEDIUM</option>
                    <option value='LOW'>LOW</option>
                  </select>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size='4'>
                  <IonLabel>{t('lan.lblWorkStatus')}</IonLabel>
                  <select
                    name='status'
                    value={filterData?.status}
                    onChange={changeEventFilter}
                  >
                    <option value=''>ALL</option>
                    {Array.isArray(statusData) && statusData.length > 0
                      ? statusData.map((item: any, key: any) => {
                          return (
                            <option key={key} value={item?.STATUS_NAME}>
                              {item?.STATUS_NAME}
                            </option>
                          )
                        })
                      : 'No Data'}
                  </select>
                </IonCol>

                <IonCol size='4'>
                  <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
                  <select
                    name='asse_filter'
                    value={filterData?.asse_filter}
                    onChange={changeEventBooth}
                  >
                    <option value=''>ALL</option>
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

                <IonCol size='4'>
                  <IonLabel>{t('lan.lblLangBoothNo')}</IonLabel>
                  <select
                    name='ward_filter'
                    value={filterData?.ward_filter}
                    onChange={changeEventFilter}
                  >
                    <option value=''>ALL</option>
                    {Array.isArray(booth) && booth.length > 0
                      ? booth.map((item: any, key: any) => {
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
                <IonButton onClick={getFilterData}>Search</IonButton>
              </IonRow>
            </IonGrid>

            {Array.isArray(subData) && subData.length >= 0
              ? subData.map((item: any, key: any) => {
                  return (
                    <>
                      <IonCard key={key}>
                        <IonCardContent className='complaint-card'>
                          <IonGrid>
                            <IonRow>
                              <IonCol size='1'>{key + 1}</IonCol>
                              <IonCol
                                size='8'
                                id='top-center'
                                onClick={() => getProfile(item?.VIS_VOTERNO)}
                              >
                                <IonLabel color='primary'>
                                  {item?.VIS_NAME}
                                </IonLabel>
                              </IonCol>
                              <IonCol size='3' style={{ textAlign: 'right' }}>
                                {moment(item?.VDATE).format('DD-MM-YYYY')}
                              </IonCol>
                            </IonRow>
                            <IonRow>
                              <IonCol size='0.5'></IonCol>
                              {DeviceInfo !== null ? (
                                <IonCol size='4'>
                                  <IonIcon
                                    style={{ fontSize: '15px', color: 'black' }}
                                    src={callOutline}
                                    onClick={() => call(item?.VIS_MOBNO)}
                                  />
                                  {item?.VIS_MOBNO}
                                </IonCol>
                              ) : (
                                <a href={`tel:${item?.VIS_MOBNO}`}>
                                  <IonIcon
                                    style={{ fontSize: '15px', color: 'black' }}
                                    src={callOutline}
                                  />
                                  {item?.VIS_MOBNO}
                                </a>
                              )}
                              <IonCol
                                size='4'
                                style={{
                                  textAlign: 'center',
                                  padding: '0px',
                                  marginTop: '5px'
                                }}
                              >
                                Entry:{item?.VIS_ADDED_BY}
                              </IonCol>
                              <IonCol
                                size='3.5'
                                style={{
                                  textAlign: 'right',
                                  padding: '0px',
                                  marginTop: '5px'
                                }}
                              >
                                <IonLabel
                                  style={{
                                    color:
                                      item?.VIS_WORK_STATUS == 'Complete'
                                        ? 'Green'
                                        : 'red'
                                  }}
                                >
                                  {item?.VIS_WORK_STATUS}
                                </IonLabel>
                              </IonCol>
                            </IonRow>
                            <IonRow>
                              <IonCol size='0.5'></IonCol>
                              <IonCol
                                size='5'
                                style={{ padding: '0px', marginTop: '5px' }}
                              >
                                Inward:{item?.VIS_INWARD_LETTER_NO}{' '}
                                {item?.DOCUMENT !== null ? (
                                  DeviceInfo !== null ? (
                                    <IonIcon
                                      style={{
                                        fontSize: '20px',
                                        color: 'black'
                                      }}
                                      src={documentAttachOutline}
                                      onClick={() =>
                                        downloadFilesFor(
                                          item?.DOCUMENT,
                                          item?.DOCUMENT,
                                          'Document'
                                        )
                                      }
                                    />
                                  ) : (
                                    <a href={item?.VISITOR_DOCUMENT}>
                                      <IonIcon
                                        style={{
                                          fontSize: '20px',
                                          color: 'black'
                                        }}
                                        src={documentAttachOutline}
                                      />
                                    </a>
                                  )
                                ) : (
                                  ''
                                )}
                              </IonCol>
                              <IonCol size='6'>
                                Outward:{' '}
                                <IonLabel
                                  color='primary'
                                  onClick={() => getOutwardData(item)}
                                >
                                  {' '}
                                  {item?.VIS_OUTWARD_LETTERNO}{' '}
                                </IonLabel>
                                {item?.VISITOR_DOCUMENT !== null ? (
                                  DeviceInfo !== null ? (
                                    <IonIcon
                                      style={{
                                        fontSize: '20px',
                                        color: 'black'
                                      }}
                                      src={documentAttachOutline}
                                      onClick={() =>
                                        downloadFilesFor(
                                          item?.VISITOR_DOCUMENT,
                                          item?.VISITOR_DOCUMENT,
                                          'Document'
                                        )
                                      }
                                    />
                                  ) : (
                                    <a href={item?.VISITOR_DOCUMENT}>
                                      <IonIcon
                                        style={{
                                          fontSize: '20px',
                                          color: 'black'
                                        }}
                                        src={documentAttachOutline}
                                      />
                                    </a>
                                  )
                                ) : (
                                  ''
                                )}
                              </IonCol>
                            </IonRow>
                            {modelTitle === 'TOTAL_VISITOR' ||
                            modelTitle === 'TOTAL_INWARD' ||
                            modelTitle === 'TOTAL_OUTWARD' ? (
                              <IonRow>
                                <IonCol size='0.5'></IonCol>
                                <IonCol size='11.5'>
                                  <IonLabel
                                    style={{ fontSize: '12px' }}
                                    color='tertiary'
                                  >
                                    {' '}
                                    {item?.REASON_GROUP_NAME} -{' '}
                                    {item?.REASONNAME}{' '}
                                  </IonLabel>{' '}
                                </IonCol>
                              </IonRow>
                            ) : (
                              ''
                            )}
                          </IonGrid>
                        </IonCardContent>
                      </IonCard>

                      {/* OUTWARD MODEL DISPLAY */}
                      <IonModal isOpen={outwardModel}>
                        <IonHeader>
                          <IonToolbar>
                            <IonTitle>{t('lan.lblOutwardDocDetails')}</IonTitle>
                            <IonButtons slot='end'>
                              <IonIcon src={closeCircleOutline} onClick={() => setoutwardModel(false)} />
                            </IonButtons>
                          </IonToolbar>
                        </IonHeader>
                        <IonContent>
                          <IonGrid>
                            <IonRow>
                              <IonLabel>
                                {t('lan.lblLangName')} :
                              </IonLabel>
                                 {item.VIS_NAME}
                            </IonRow>
                            <IonRow>
                              <IonLabel>
                                {t('lan.lblInwardNo')} : {item?.VIS_INWARD_LETTER_NO}
                              </IonLabel>
                            </IonRow>
                          </IonGrid>
                          {Array.isArray(outwardData) && outwardData.length >= 0
                            ? outwardData.map((ele: any, key: any) => {
                                return (
                                  <>
                                    <IonCard>
                                      <IonCardContent className='complaint-card'>
                                        <IonGrid>
                                          <IonRow>
                                            <IonCol size='2'>
                                             <IonLabel>{t('lan.lblLangNo')}</IonLabel>
                                            </IonCol>
                                            <IonCol size='2'>
                                              {key + 1}
                                            </IonCol>
                                            <IonCol size='6'>
                                              <IonLabel>{t('lan.lblOutwardDocument')}</IonLabel>
                                              </IonCol>
                                              <IonCol size='2'>
                                               {DeviceInfo !== null ?
                                                  <IonIcon src={downloadOutline} onClick={() => downloadFilesFor(process.env.REACT_APP_API_IMAGE + "VIS_OUTWARD_DOCUMENT/" +ele?.VIS_OUTWARD_DOC,'','')} />
                                                : 
                                                <a href={process.env.REACT_APP_API_IMAGE+ "VIS_OUTWARD_DOCUMENT/" + ele.VIS_OUTWARD_DOC } download={true}>
                                                  <IonIcon src={downloadOutline} />
                                                </a>
                                                }  
                                              </IonCol>
                                          </IonRow>

                                          <IonRow>
                                            <IonCol size='2'>
                                              <IonLabel>{t('lan.lblLangNote')}</IonLabel> </IonCol>
                                            <IonCol>{ele?.VIS_OUTWARD_NOTES}</IonCol>  
                                          </IonRow> 
                                          <IonRow>
                                            <IonCol size='2'>
                                              <IonLabel>{t('lan.lblLangStatus')}</IonLabel> </IonCol>
                                            <IonCol>{ele?.VIS_OUTWARD_STATUS}</IonCol>  
                                          </IonRow> 

                                          <IonRow  className='rowborder'>
                                            <IonCol size='3'>
                                              <IonLabel>{t('lan.lblLangAddedBy')}</IonLabel> </IonCol>
                                            <IonCol>{ele?.VIS_OUTWARD_UPDATED_USERNAME}</IonCol>  
                                         
                                            <IonCol size='2'>
                                              <IonLabel>{t('lan.lblDateTime')}</IonLabel> </IonCol>
                                            <IonCol>{ele?.VIS_OUTWARD_UPDATED_DATETIME}</IonCol>  
                                          </IonRow>

                                          <IonRow>
                                            <IonCol size='4'>
                                              <IonLabel>{t('lan.lblReplayDocument')}</IonLabel> </IonCol>
                                            <IonCol size='4'>
                                            {ele?.OUTWARD_REPLY_DOC !== null ?   DeviceInfo !== null ?
                                                  <IonIcon src={downloadOutline} onClick={() => downloadFilesFor(process.env.REACT_APP_API_IMAGE + "VIS_OUTWARD_DOCUMENT/" +ele?.OUTWARD_REPLY_DOC,'','')} />
                                                : 
                                                <a href={process.env.REACT_APP_API_IMAGE+ "VIS_OUTWARD_DOCUMENT/" + ele?.OUTWARD_REPLY_DOC
                                                } download={true}>
                                                  <IonIcon src={downloadOutline} />
                                                </a>
                                                : "" }
                                            </IonCol>  
                                          </IonRow> 
                                          <IonRow>
                                            <IonCol size='4'>
                                              <IonLabel>{t('lan.lblReplayNotes')}</IonLabel> </IonCol>
                                            <IonCol>{ele?.OUTWARD_REPLY_DOCNOTES}</IonCol>  
                                          </IonRow>
                                          <IonRow  >
                                            <IonCol size='3'>
                                              <IonLabel>{t('lan.lblReplayNotes')}</IonLabel> </IonCol>
                                            <IonCol>{ele?.REPLY_DOC_UPDATED_USERNAME}</IonCol>  
                                         
                                            <IonCol size='2'>
                                              <IonLabel>{t('lan.lblDateTime')}</IonLabel> </IonCol>
                                            <IonCol>{ele?.REPLY_DOC_UPDATED_DATETIME}</IonCol>  
                                          </IonRow>
                                        </IonGrid>                                       
                                      </IonCardContent>
                                    </IonCard>
                                  </>
                                )
                              })
                            : ''}
                        </IonContent>
                      </IonModal>
                    </>
                  )
                })
              : ''}
          </IonContent>

          {subData.length > 0 ? (
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
        </IonModal>

        {/* Reason wise Popup display */}

        <IonPopover
          isOpen={showPopup}
          onDidDismiss={() => setShowPopup(false)}
          side='top'
        >
          <IonContent>
            <IonGrid>
              <IonRow>
                <IonCol size='10'>
                  <IonLabel>{modelTitle}</IonLabel>
                </IonCol>
              </IonRow>
              <IonCardTitle className='letter-card-title'></IonCardTitle>
              <IonRow>
                <IonCol size='3'>
                  <IonLabel>LETTER</IonLabel>
                </IonCol>
                <IonCol size='3'>
                  <IonLabel>{t('lan.lblVisitor')}</IonLabel>
                </IonCol>
                <IonCol size='3'>
                  <IonLabel>{t('lan.lblInward')}</IonLabel>
                </IonCol>
                <IonCol size='3'>
                  <IonLabel>{t('lan.lblOutward')}</IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size='4' style={{ color: 'red', fontWeight: 600 }}>
                  TOTAL
                </IonCol>
                <IonCol size='2' style={{ color: 'red', fontWeight: 600 }}>
                  {totaldetailVisitor}
                </IonCol>
                <IonCol size='3' style={{ color: 'red', fontWeight: 600 }}>
                  {totaldetailInward}
                </IonCol>
                <IonCol size='3' style={{ color: 'red', fontWeight: 600 }}>
                  {totaldetailOutward}
                </IonCol>
              </IonRow>
              {Array.isArray(reasonData) && reasonData.length >= 0
                ? reasonData.map((item: any, key: any) => {
                    return (
                      <div key={key}>
                        <IonRow>
                          <IonCol
                            size='4'
                            style={{ color: 'blue', fontSize: '12px' }}
                          >
                            {item.REASONNAME}
                          </IonCol>
                          <IonCol
                            size='2'
                            style={{
                              textDecoration: 'underline',
                              color: 'blue',
                              fontSize: '12px'
                            }}
                            onClick={() =>
                              item.VISITOR_COUNT !== null
                                ? getDetailsCount(item, 'VISITOR')
                                : ''
                            }
                          >
                            {item.VISITOR_COUNT}
                          </IonCol>
                          <IonCol
                            size='3'
                            style={{
                              textDecoration: 'underline',
                              color: 'blue',
                              fontSize: '12px'
                            }}
                            onClick={() =>
                              item.INWARD_LTR_COUNT !== null
                                ? getDetailsCount(item, 'LETTER')
                                : ''
                            }
                          >
                            {item.IN_LETTER_COUNT}
                          </IonCol>
                          <IonCol
                            size='3'
                            style={{
                              textDecoration: 'underline',
                              color: 'blue',
                              fontSize: '12px'
                            }}
                            onClick={() =>
                              item.OUTWARD_LTR_COUNT !== null
                                ? getDetailsCount(item, 'OUTWARD')
                                : ''
                            }
                          >
                            {item.OUT_LETTER_COUNT}
                          </IonCol>
                        </IonRow>
                      </div>
                    )
                  })
                : ''}
            </IonGrid>
          </IonContent>
        </IonPopover>
      </IonContent>
    </IonPage>
  )
}

export default LetterReport
