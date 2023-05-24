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
  IonInput,
  IonLabel,
  IonLoading,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonToast
} from '@ionic/react'
import { useTranslation } from 'react-i18next'
import axiosApi from '../../axiosApi'
import { arrowBackOutline, saveOutline, searchOutline } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import Loader from '../../components/Load'
import { useDispatch, useSelector } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'
import Select from '../../components/Select'

const VotingStatus: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const defaultState = {
    asse: '',
    ward: ''
  }
  const [present] = useIonToast()
  const [booth, setBooth] = useState<any>([])
  const [data, setData] = useState<any>(defaultState)
  const [value, setValue] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [showagent, setShowAgent] = useState(false)
  const [perPage] = useState(100)
  const [pageCount, setPageCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [total, setTotal] = useState(0)

  const [newData, setNewData] = useState<any>({
    voting: ''
  })

  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')
  const user = localStorage.getItem('loginUserName')

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) // Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch])

  const changeNewData = (e: any) => {
    const { name, value } = e.target
    setNewData({ ...newData, [name]: value })
  }

  const changeEventBooth = async (e: any) => {
    setData({ ...data, asse: e.target.value })
    setPageIndex(1)
    setBooth([])
    setValue([])
    setData({ asse: e.target.value, ward: '' })
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
        const Data = JSON.parse(Resp?.data)
        if (Resp?.error === false) {
          setBooth(Data)
          setLoad(false)
        } else {
          present(Resp?.msg, 3000)
          setLoad(false)
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }
  const changeEvent = (e: any) => {
    setValue([])
    setData({ ...data, ward: e.target.value })
  }

  const getData = async () => {
    setTotal(0)
    setLoad(!load)
    const ReqObj = {
      AC_NO: data?.asse,
      WARD_MAS_ID: data?.ward,
      LOGINUS: Name,
      LOGIN_MOB: Num,
      PageIndex: pageIndex,
      PageSize: perPage
    }
    await axiosApi
      .post('/GetPollingAgentUserMas_ForIonic', ReqObj)
      .then(res => {
        const Data = res.data.VotinStatusDetailsList
        const Total = res.data.Total
        setTotal(Total)
        if (Data.length !== 0) {
          setPageCount(Math.ceil(Total / perPage))
          setValue(Data)
          setLoad(load)
        } else {
          present('No Data Found..!', 3000)
          setLoad(false)
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  const submit = async (acno: any, booth: any) => {
    if (newData.voting !== '') {
      await axiosApi
        .get(
          '/UpdateBoothMasEditTotalVoting?AS_SEAT_ID=' +
            acno +
            '&BOOTH_NO=' +
            booth +
            '&TOTAL_VOTING=' +
            newData.voting
        )
        .then(res => {
          const Resp = res.data
          if (Resp?.Msg_Code === 1) {
            present(Resp?.Msg_Value, 3000)
            setNewData({
              voting: ''
            })
            setShowAgent(false)
            getData()
          }
          if (Resp?.Msg_Code === 0) {
            present(Resp?.Msg_Value, 3000)
            setNewData({
              voting: ''
            })
            setShowAgent(false)
            getData()
          }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    } else {
      present('Please Enter Total Voting...', 3000)
      setLoad(false)
    }
  }

  useEffect(() => {
    getData()
  }, [pageIndex])

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  }

  const clearDate = () => {
    history.replace('/election')
    setValue([])
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <IonIcon
                  onClick={clearDate}
                  className='back-button'
                  src={arrowBackOutline}
                />
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{t('lan.MenuVotingStatus')}</IonTitle>
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
              <Select
                selectType={t('lan.lblAll')}
                name='asse'
                values={data?.asse}
                changes={changeEventBooth}
                array={assemblyList}
                optName='AS_SEAT_NM'
                optValue='AS_SEAT_ID'
              />
              {/* <select name='asse' value={data.asse} onChange={changeEventBooth}>
                                <option value=''>{t('lan.lblAll')}</option>
                                {Array.isArray(assembly) && assembly.length > 0 ?
                                    assembly.map((item: any, key: any) => {
                                        return (
                                            <option key={key} value={item.AS_SEAT_ID}>{item.AS_SEAT_NM}</option>
                                        )
                                    }) : "No Data"
                                }
                            </select> */}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangWardName')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <Select
                selectType={t('lan.lblAll')}
                name='ward'
                values={data?.ward}
                changes={changeEvent}
                array={booth}
                optName='WARD_NAME'
                optValue='WARD_MAS_ID'
              />
              {/* <select name="booth" value={data.ward} onChange={changeEvent}  >
                                <option value=''>{t('lan.lblAll')}</option>
                                {Array.isArray(booth) && booth.length > 0 ?
                                    booth.map((item: any, key: any) => {
                                        return (
                                            <option key={key} value={item.WARD_MAS_ID}>{item.WARD_NAME}</option>
                                        )
                                    }) : "No Data"
                                }
                            </select> */}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton onClick={getData}>
                <IonIcon src={searchOutline} className='button-icon' />
                {t('lan.lblLangLoad')}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />
        <IonLabel color='danger'>
          {t('lan.lblLangTotalRecords')} : {total}
        </IonLabel>
        {Array.isArray(value) && value.length > 0
          ? value.map((item: any, key: any) => {
              return (
                <div key={key}>
                  <IonCard key={key}>
                    <IonCardContent className='complaint-card'>
                      <IonGrid>
                        <IonRow>
                          <IonCol size='3'>
                            <IonLabel>{t('lan.lblLangNo')}</IonLabel>
                          </IonCol>
                          <IonCol size='3'>
                            <IonLabel>{key + 1}</IonLabel>
                          </IonCol>
                          <IonCol size='3'>
                            <IonLabel>{t('lan.lblLangBoothNo')}</IonLabel>
                          </IonCol>
                          <IonCol size='3'>
                            <IonLabel>{item.BOOTH_NO}</IonLabel>
                          </IonCol>
                        </IonRow>
                        {/* <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangBoothNo')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonLabel>{item.BOOTH_NO}</IonLabel></IonCol>
                                            </IonRow> */}
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangBoothVistar')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.BOOTH_NAME}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow
                          onClick={() =>
                            setShowAgent(prev =>
                              prev === key ? undefined : key
                            )
                          }
                        >
                          <IonCol size='4'>
                            <IonLabel
                              color='primary'
                              style={{ textDecoration: 'underline' }}
                            >
                              {t('lan.lblLangTotalVoting')}
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.TOTAL_VOTING}</IonLabel>
                          </IonCol>
                        </IonRow>
                        {showagent === key ? (
                          <>
                            <IonRow>
                              <IonCol size='4'>
                                <IonLabel>
                                  {t('lan.lblLangTotalVoting')}
                                </IonLabel>
                              </IonCol>
                              <IonCol size='8'>
                                <IonInput
                                  type='number'
                                  name='voting'
                                  value={newData.voting}
                                  onIonChange={changeNewData}
                                />
                              </IonCol>
                            </IonRow>
                            <IonRow>
                              <IonCol>
                                <IonButton onClick={() =>
                                    submit(item.AC_NO, item.BOOTH_NO)
                                  }>{t('lan.btnSave')}</IonButton>
                                
                              </IonCol>
                            </IonRow>
                          </>
                        ) : (
                          ''
                        )}
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </div>
              )
            })
          : ''}
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

export default VotingStatus
