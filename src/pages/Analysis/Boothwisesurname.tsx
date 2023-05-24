import React, { useEffect, useState } from 'react'
import {
  IonCol,
  IonContent,
  IonGrid,
  IonLabel,
  IonPage,
  IonRow,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonButton,
  useIonToast
} from '@ionic/react'
import { useTranslation } from 'react-i18next'
import axiosApi from '../../axiosApi'
import { useHistory } from 'react-router-dom'
import {
  arrowBackOutline,
  downloadOutline,
  searchOutline
} from 'ionicons/icons'
import ReactPaginate from 'react-paginate'
import useDownLoad from '../../hooks/download.hook'
import Loader from '../../components/Load'
import { useDispatch, useSelector } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'
import { useDeviceInfo } from '../../hooks/useDeviceInfo'

const Boothwisesurname: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const defaultState = {
    asse: '',
    booth: ''
  }

  const [present] = useIonToast()
  const [assembly, setAssembly] = useState([])
  const [data, setData] = useState(defaultState)
  const [count, setCount] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [booth, setBooth] = useState([])
  const [value, setValue] = useState<any>([])
  const [perPage] = useState(500)
  const [pageCount, setPageCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const { downloadFilesFor } = useDownLoad()
  const { DeviceInfo } = useDeviceInfo()

  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')

  const changeEvent = (e: any) => {
    setCount([])
    setData({ ...data, booth: e.target.value })
  }

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) //Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch, data])

  const changeBooth = async (e: any) => {
    setData({ ...data, asse: e.target.value })
    setPageIndex(1)
    setBooth([])
    setData({ asse: e.target.value, booth: '' })
    setLoad(true)
    setCount([])
    await axiosApi
      .get(
        '/GetBoothPRBoothList?pAsmList=' +
          e.target.value +
          ' &pFlag=' +
          Name +
          '&pMobile=' +
          Num +
          '&pWardId=' +
          ''
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
      .catch(error => {
        present(error.message, 3000)
        setLoad(false)
      })
  }

  const getData = async () => {
    setLoad(!load)
    var ReqObj = {
      AC_NO: data?.asse,
      BOOTH: data?.booth,
      pLoginAs: Name,
      pUserMobile: Num,
      PageIndex: pageIndex,
      PageSize: perPage
    }

    await axiosApi
      .post('GetBoothWiseVoterCountUserWise_Forionic', ReqObj)
      .then(res => {
        const Data = res.data.BoothWiseSurenameList
        const Total = res.data.Total
        if (Data.length !== 0) {
          setPageCount(Math.ceil(Total / perPage))
          setCount(Data)
          setLoad(load)
          setLoad(false)
        } else {
          present('No Data Found...', 3000)
          setLoad(false)
        }
      })
      .catch(error => {
        present(error.message, 3000)
        setLoad(false)
      })
  }

  useEffect(() => {
    getData()
  }, [data, pageIndex])

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  }

  const DwnldBoothWiseVoterCount = (AcNo: any, Booth: any) => {
    if (AcNo === '') {
      present('Please Select Assembly..!', 3000)
      return false
    } else if (AcNo !== '') {
      downloadFilesFor(
        process.env.REACT_APP_API_URL +
          `DwnldAssemblyBoothWiseVoterCount/?pAssembly=` +
          AcNo +
          `&pBoothNo=` +
          Booth,
        'BoothWiseSurname.pdf',
        'Boothwise Surname'
      )
    }
  }

  const clearData = () => {
    setData({ ...defaultState })
    setValue([])
    history.replace('/analysis')
  }

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
                ></IonIcon>
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{t('lan.lblLangBoothWiseCaste')} </IonTitle>
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
              <select name='asse' value={data.asse} onChange={changeBooth}>
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
              <IonLabel>{t('lan.lblLangBoothNo')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <select
                name='booth'
                value={data.booth}
                onChange={e => changeEvent(e)}
              >
                <option value=''>{t('lan.lblAll')}</option>
                {Array.isArray(booth) && booth.length > 0
                  ? booth.map((item: any, key: any) => {
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
            <IonCol size='6'>
              <IonButton onClick={getData}>
                <IonIcon src={searchOutline} className='button-icon' />
                {t('lan.lblLangLoad')}
              </IonButton>
            </IonCol>
            <IonCol size='6'>
              {DeviceInfo !== null ? (
                <IonButton
                  disabled={data.asse === '' || data.booth === ''}
                  onClick={() =>
                    DwnldBoothWiseVoterCount(data.asse, data.booth)
                  }
                >
                  <IonIcon src={downloadOutline} className='button-icon' />
                  {t('lan.lblLangDownload')}
                </IonButton>
              ) : (
                <a
                  href={
                    process.env.REACT_APP_API_URL +
                    `DwnldAssemblyBoothWiseVoterCount/?pAssembly=` +
                    data.asse +
                    `&pBoothNo=` +
                    data.booth
                  }
                >
                  <IonButton disabled={data.asse === '' && data.booth === ''}>
                    <IonIcon src={downloadOutline} className='button-icon' />
                    {t('lan.lblLangDownload')}
                  </IonButton>
                </a>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>

        <div className='table-design'>
          <tr>
            <th>{t('lan.lblLangBoothNo')}</th>
            <th>{t('lan.lblLangLastName')}</th>
            <th>{t('lan.lblLangTotalMatdar')}</th>
            <th>{t('lan.lblLangPercentage')}</th>
          </tr>
          {Array.isArray(count) && count.length >= 0
            ? count.map((item: any, key: any) => {
                return (
                  <tr key={key}>
                    <td>{item?.BOOTH}</td>
                    <td>{item?.SURNAME}</td>
                    <td>{item?.VOTERS}</td>
                    <td>{item?.PERCENTAGE}</td>
                  </tr>
                )
              })
            : ''}
        </div>
        {count.length > 0 ? (
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

        {/* {count.length > 0 && count.length !== value.length ? (
                    <IonButton onClick={loadData}>Load More...</IonButton>
                ) : ""} */}
      </IonContent>
    </IonPage>
  )
}
export default Boothwisesurname
