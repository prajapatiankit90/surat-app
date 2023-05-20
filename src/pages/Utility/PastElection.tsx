import React, { useEffect, useState } from 'react'
import {
  IonButton,
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
  useIonToast
} from '@ionic/react'
import { useTranslation } from 'react-i18next'
import axiosApi from '../../axiosApi'
import { Link, useHistory } from 'react-router-dom'
import { arrowBackOutline } from 'ionicons/icons'
import ReactPaginate from 'react-paginate'
import useDownLoad from '../../hooks/download.hook'
import Loader from '../../components/Load'
import { useSelector, useDispatch } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'
import { useDeviceInfo } from '../../hooks/useDeviceInfo'

const Pastelection: React.FC = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const defaultState = {
    asse: ''
  }
  const [data, setData] = useState(defaultState)
  const [value, setValue] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [perPage] = useState(100)
  const [pageCount, setPageCount] = useState(0)
  const [pagination, setPagination] = useState<any>([])
  const [present] = useIonToast()
  const { DeviceInfo } = useDeviceInfo()
  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')

  const { downloadFilesFor } = useDownLoad() // DownLoad file form Custom hook

  const changeEvent = (e: any) => {
    setValue([])
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) // Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch, data])

  useEffect(() => {
    if (data.asse !== '') {
      setLoad(!load)
      axiosApi
        .get(
          '/GetPastResultPageUserWise?pAssembly=' +
            data.asse +
            '&pLoginAs=' +
            Name +
            '&pUserMobile=' +
            Num +
            ''
        )
        .then(res => {
          if (res.data !== '') {
            const Resp = JSON.parse(res.data)
            const Data = JSON.parse(Resp?.data)
            if (Resp.error === false) {
              setPagination(Data)
              const data = Data.slice(0, 100)
              setPageCount(Math.ceil(Data.length / perPage))
              setValue(data)
              setLoad(load)
            } else {
              present(Resp.msg, 3000)
            }
          } else {
            setLoad(load)
            present('No Data Found..', 3000)
          }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    }
  }, [data])

  const handlePageClick = (selected: any) => {
    const pagesVisited = selected.selected * perPage
    const lastSetData = pagesVisited + perPage
    setValue(pagination.slice(pagesVisited, lastSetData))
  }

  const clearData = () => {
    setData({ ...defaultState })
    setValue([])
    history.replace('/utility')
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
                <IonTitle>{t('lan.MenuPastElectionResult')}</IonTitle>
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
            <IonCol>
              {DeviceInfo !== null ? (
                <IonButton
                  disabled={data.asse === ''}
                  onClick={() =>
                    downloadFilesFor(
                      process.env.REACT_APP_API_URL +
                        `DwnldPastResult?pAssembly=` +
                        data.asse,
                      'Pastelection.pdf',
                      'Past Election'
                    )
                  }
                >
                  {t('lan.lblLangDownload')}
                </IonButton>
              ) : (
                <a
                  href={
                    process.env.REACT_APP_API_URL +
                    `DwnldPastResult?pAssembly=` +
                    data.asse
                  }
                >
                  <IonButton disabled={data.asse === ''} > {t('lan.lblLangDownload')}
                </IonButton>
                </a>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />
        {value.length > 0 ? (
          <div className='table-design'>
            <tr>
              <th>{t('lan.lblLangBoothNo')}</th>
              <th>{t('lan.lblLangYear')}</th>
              <th>{t('lan.lblLangTotalVoter')}</th>
              <th>{t('lan.lblLangTotalVoting')}</th>
              <th>{t('lan.lblLangThayelMatdan')}</th>
              <th>{t('lan.lblLangBjp')}</th>
              <th>{t('lan.lblLangCongress')}</th>
              <th>{t('lan.lblLangOther')}</th>
              <th>{t('lan.lblLangLead')}</th>
              <th>{t('lan.lblLangNoTa')}</th>
              <th>{t('lan.lblLangBjpPer')}</th>
              <th>{t('lan.lblLanGrade')}</th>
            </tr>
            {Array.isArray(value) && value.length >= 0
              ? value.map((item: any, key: any) => {
                  return (
                    <tr key={key}>
                      <td>{item.NEW_BOOTH}</td>
                      <td>{item.Year}</td>
                      <td>{item.TotalVoters}</td>
                      <td>{item.VOTING_PER}</td>
                      <td>{item.TotalVoted}</td>
                      <td>{item.BJP}</td>
                      <td>{item.INC}</td>
                      <td>{item.Others}</td>
                      <td>{item.Lead}</td>
                      <td>{item.NOTA}</td>
                      <td>{item.Bjp_Per}</td>
                      <td>{item.GRAD}</td>
                    </tr>
                  )
                })
              : ''}
          </div>
        ) : (
          ''
        )}
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

export default Pastelection
