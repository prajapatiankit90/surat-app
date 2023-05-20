import React, { useEffect, useState } from 'react'
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonLabel,
  IonPage,
  IonRow,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  useIonToast
} from '@ionic/react'
import { useTranslation } from 'react-i18next'
import { arrowBackOutline } from 'ionicons/icons'
import axiosApi from '../../axiosApi'
import { useHistory } from 'react-router-dom'
import Loader from '../../components/Load'
import { useDispatch, useSelector } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'

const Pagewise: React.FC = () => {
  const { t } = useTranslation()
  const defaultState = {
    asse: '',
    perc3: ''
  }
  const [present] = useIonToast()
  const [data, setData] = useState(defaultState)
  const [value, setValue] = useState<any>([])
  const [count, setCount] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [TotalPage, setTotalPage] = useState(0)
  const [TotalPCEx, setTotalPCEx] = useState(0)
  const [TotalPCCo, setTotalPCCo] = useState(0)
  const [per, setPer] = useState(0)
  const [per3, setPer3] = useState<any>(0)
  const [per4, setPer4] = useState<any>(0)

  const history = useHistory()

  const changeEvent = (e: any) => {
    setValue([])
    setCount([])
    setTotalPCCo(0)
    setTotalPCEx(0)
    setTotalPage(0)
    setPer(0)
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) //Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch, data])

  useEffect(() => {
    const getData = async () => {
      if (data.asse !== '') {
        setLoad(true)
        await axiosApi
          .get('/ASSEMBLY_PP_PC_SUMMARY?pAssembly=' + data.asse + '&pWardId=')
          .then(res => {
            const Resp = JSON.parse(res.data)
            const Data = JSON.parse(Resp?.data)
            setLoad(load)
            setValue(Data)
            if (Data !== '') {
              setPer3(
                ((Data[0].PP_PC_COMPLETED * 100) / (Data[0].PAGES * 3)).toFixed(
                  2
                )
              )
              setPer4(
                ((Data[0].PP_PC_COMPLETED * 100) / (Data[0].PAGES * 4)).toFixed(
                  2
                )
              )
            }
          })
          .catch(err => {
            present(err, 3000)
          })
        await axiosApi
          .get('/PP_PC_DETAIL_ASSM_WISE?pAssembly=' + data.asse + '&pWardId=')
          .then(res => {
            const Resp = JSON.parse(res.data)
            const Data = JSON.parse(Resp?.data)
            setCount(Data)
            setTotalPage(
              Data.map((item: any) => item.TOTAL_PAGES).reduce(
                (prev: any, next: any) => prev + next
              )
            )
            setTotalPCEx(
              Data.map((item: any) => item.PP_PC_EXPECTED).reduce(
                (prev: any, next: any) => prev + next
              )
            )
            setTotalPCCo(
              Data.map((item: any) => item.PP_PC_COMPLETED).reduce(
                (prev: any, next: any) => prev + next
              )
            )
            setPer(
              Data.map((item: any) => parseFloat(item.AVERAGE)).reduce(
                (prev: any, next: any) => prev + next
              )
            )
          })
          .catch(error => {
            present(error.message, 3000)
            setLoad(false)
          })
      }
    }
    getData()
  }, [data])

  const clearData = () => {
    setData({ ...defaultState })
    setValue([])
    history.replace('/Analysis')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <IonIcon src={arrowBackOutline} onClick={() => clearData()} />
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{t('lan.lblLangPPPCSummaryReport')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <select name='asse' value={data.asse} onChange={changeEvent}>
                <option value=''>{t('lan.lblAll')}</option>
                {t('lan.lblAll')}
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
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />

        <div className='table-design'>
          {Array.isArray(value) && value.length >= 0
            ? value.map((item: any, key: any) => {
                return (
                  <IonCard>
                    <IonCardContent className='complaint-card'>
                      <IonGrid>
                        <IonRow>
                          <IonCol size='3'>
                            <IonLabel>{t('lan.MenuAsWardShakti')}</IonLabel>
                          </IonCol>
                          <IonCol size='3'>
                            <IonLabel>{item.BOOTH}</IonLabel>
                          </IonCol>
                          <IonCol size='3'>
                            <IonLabel>{t('lan.lblLangPages')}:</IonLabel>
                          </IonCol>
                          <IonCol size='3'>
                            <IonLabel>{item.PAGES}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='8'>
                            <IonLabel>{t('lan.lblLangPPPCExpected')}:</IonLabel>
                          </IonCol>
                          <IonCol size='4'>
                            <IonLabel>{item.PP_PC_EXPECTED}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='8'>
                            <IonLabel>{t('lan.lblLangPPPCCompletd')}:</IonLabel>
                          </IonCol>
                          <IonCol size='4'>
                            <IonLabel>{item.PP_PC_COMPLETED}</IonLabel>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size='8'>
                            <IonLabel>
                              {t('lan.lblLangPPPCCompletd')}(3%):
                            </IonLabel>
                          </IonCol>
                          <IonCol size='4'>
                            <IonLabel>{per3}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='8'>
                            <IonLabel>
                              {t('lan.lblLangPPPCCompletd')}(4%):
                            </IonLabel>
                          </IonCol>
                          <IonCol size='4'>
                            <IonLabel>{per4}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='8'>
                            <IonLabel>
                              {t('lan.lblLangPPPCCompletd')}(5%):
                            </IonLabel>
                          </IonCol>
                          <IonCol size='4'>
                            <IonLabel>{item.PERCENTAGE}</IonLabel>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                )
              })
            : ''}
        </div>
        {count.length > 0 ? (
          <div className='table-design'>
            <tr>
              <th>{t('lan.lblLangCount')}</th>
              <th>{t('lan.lblLangPages')}</th>
              <th>{t('lan.lblLangPPPCExpected')}</th>
              <th>{t('lan.lblLangPPPCCompletd')}</th>
              <th>{t('lan.lblLangPercentage')}</th>
            </tr>

            {Array.isArray(count) && count.length >= 0
              ? count.map((item: any, key: any) => {
                  return (
                    <tr key={key}>
                      <td>{item.CNT}</td>
                      <td>{item.TOTAL_PAGES}</td>
                      <td>{item.PP_PC_EXPECTED}</td>
                      <td>{item.PP_PC_COMPLETED}</td>
                      <td>{item.AVERAGE}</td>
                    </tr>
                  )
                })
              : ''}
            <tr>
              <td>{t('lan.lblLangGrndTotal')}</td>
              <td>{TotalPage}</td>
              <td>{TotalPCEx}</td>
              <td>{TotalPCCo}</td>
              <td>{per}</td>
            </tr>
          </div>
        ) : (
          ''
        )}
      </IonContent>
    </IonPage>
  )
}

export default Pagewise
