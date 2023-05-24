import React, { useEffect, useState } from 'react'
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonButton,
  useIonToast
} from '@ionic/react'
import { useTranslation } from 'react-i18next'
import axiosApi from '../../axiosApi'
import { useHistory } from 'react-router-dom'
import { arrowBackOutline, downloadOutline } from 'ionicons/icons'
import ReactPaginate from 'react-paginate'
import useDownLoad from '../../hooks/download.hook'
import Loader from '../../components/Load'
import { useDispatch, useSelector } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'
import { useDeviceInfo } from '../../hooks/useDeviceInfo'

const Asseblywise: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const defaultState = {
    asse: ''
  }

  const [present] = useIonToast()
  const [data, setData] = useState(defaultState)
  const [count, setCount] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [perPage] = useState(300)
  const [pageCount, setPageCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)

  const { downloadFilesFor } = useDownLoad()
  const { DeviceInfo } = useDeviceInfo()

  const changeEvent = (e: any) => {
    setCount([])
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) //Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch, data])

  useEffect(() => {
    getDataAsseblywise()
  }, [data.asse, pageIndex])

  const getDataAsseblywise = async () => {
    setLoad(!load)
    var reqObj = {
      AC_NO: data?.asse,
      WARD_MAS_ID: '',
      PageIndex: pageIndex,
      PageSize: perPage
    }
    await axiosApi
      .post('GetAssemblyWiseVoterSurenameCount_Ionic', reqObj)
      .then(res => {
        const Data = res.data.AssembyWiseSurenamePcList
        const Total = res.data.Total
        if (Data.length != 0) {
          setCount(Data)
          setPageCount(Math.ceil(Total / perPage))
          setLoad(load)
        } else {
          present('No Data Found..!', 3000)
          setLoad(false)
        }
      })
  }

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  }

  const clearData = () => {
    setCount([])
    setData({ ...defaultState })
    history.replace('/analysis')
    setLoad(false)
  }

  const DownloadPPBoothWiseReport = (AcNo: any) => {
    downloadFilesFor(
      process.env.REACT_APP_API_URL +
        `DwnldAssemblyWiseVoterCount/?pAssembly=` +
        AcNo,
      'Assebmywise_Surname.pdf',
      'Assebmywise Surname'
    )
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
                <IonTitle>{t('lan.lblLangAcWiseCaste')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page_content'>
        <Loader loading={load} click={() => setLoad(false)} />
        <IonGrid>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <select name='asse' value={data.asse} onChange={changeEvent}>
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
            {DeviceInfo !== null ? (
              <IonButton onClick={() => DownloadPPBoothWiseReport(data.asse)}>
                <IonIcon
                  src={downloadOutline}
                  style={{
                    fontSize: '18px',
                    color: 'white',
                    marginRight: '10px'
                  }}
                />
                {t('lan.lblLangDownload')}
              </IonButton>
            ) : (
              <a
                href={
                  process.env.REACT_APP_API_URL +
                  `DwnldAssemblyWiseVoterCount/?pAssembly=` +
                  data.asse
                }
              >
                <IonButton>
                  <IonIcon
                    src={downloadOutline}
                    style={{
                      fontSize: '18px',
                      color: 'white',
                      marginRight: '10px'
                    }}
                  />
                  {t('lan.lblLangDownload')}
                </IonButton>
              </a>
            )}
          </IonRow>
        </IonGrid>

        <div className='table-design'>
          <table>
            <tr>
              <th>{t('lan.lblLangLastName')}</th>
              <th>{t('lan.lblLangTotalMatdar')}</th>
              <th>{t('lan.lblLangPercentage')}</th>
            </tr>

            {Array.isArray(count) && count.length >= 0
              ? count.map((item: any, key: any) => {
                  return (
                    <tr key={key}>
                      <td>{item?.SURNAME}</td>
                      <td>{item?.VOTERS}</td>
                      <td>{item?.PERCENTAGE}</td>
                    </tr>
                  )
                })
              : ''}
          </table>
        </div>

        {count.length >= 10 ? (
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

export default Asseblywise
