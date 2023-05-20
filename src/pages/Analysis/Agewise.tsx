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
  useIonToast
} from '@ionic/react'
import { useTranslation } from 'react-i18next'
import axiosApi from '../../axiosApi'
import { useHistory } from 'react-router-dom'
import { arrowBackOutline } from 'ionicons/icons'
import ReactPaginate from 'react-paginate'
import Loader from '../../components/Load'
import { getAssembly } from '../../slice/assembly.slice'
import { useDispatch, useSelector } from 'react-redux'

const Agewise: React.FC = () => {
  const { t } = useTranslation()
  const [present] = useIonToast()
  const history = useHistory()
  const defaultState = {
    asse: ''
  }
  const [assembly, setAssembly] = useState([])
  const [data, setData] = useState(defaultState)
  const [count, setCount] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [perPage] = useState(300)
  const [pageCount, setPageCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)

  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')

  const changeEvent = (e: any) => {
    setCount([])
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }
  const { assemblyList } = useSelector((state: any) => state.assembly) //Get Assembly value from redux
  const dispatch = useDispatch<any>()
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch])

  useEffect(() => {
    Search()
  }, [data, pageIndex])

  const Search = async () => {
    setLoad(!load)
    const reqObj = {
      AC_NO: data?.asse,
      pLoginAs: Name,
      pUserMobile: Num,
      PageIndex: pageIndex,
      PageSize: perPage
    }

    await axiosApi
      .post('GetAgeWiseVoterCountUserWise_ForIonic', reqObj)
      .then(res => {
        const Data = res.data.AgeWiseVotersCountList
        const Total = res.data.Total
        console.log(Data)
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
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  }

  const clearData = () => {
    history.replace('/analysis')
    setCount([])
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
                />
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{t('lan.lblLangAgeWiseVoter')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
        </IonGrid>

        <div className='table-design'>
          <tr>
            <th>{t('lan.lblLangBoothNo')}</th>
            <th>{t('lan.lblLangAge')}</th>
            <th>{t('lan.lblLangFemale')}</th>
            <th>{t('lan.lblLangMale')}</th>
            <th>{t('lan.lblLangGrndTotal')}</th>
          </tr>
          {Array.isArray(count) && count.length >= 0
            ? count.map((item: any, key: any) => {
                return (
                  <tr key={key}>
                    <td>{item?.BOOTH_NO}</td>
                    <td>{item?.AGE_SLAB}</td>
                    <td>{item?.F}</td>
                    <td>{item?.M}</td>
                    <td>{item?.FM_TOTAL}</td>
                  </tr>
                )
              })
            : ''}
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

export default Agewise
