import React, { useState, useLayoutEffect, useEffect } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonLoading,
  useIonToast
} from '@ionic/react'
import { Link, useHistory } from 'react-router-dom'
import axiosApi from '../../axiosApi'
import { arrowBackOutline, searchOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import Loader from '../../components/Load'
import { useDispatch, useSelector } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'
import Select from '../../components/Select'
import useDownLoad from '../../hooks/download.hook'

interface WardProps {
  assembly: string
  booth: string
}

const SingleVoter: React.FC = () => {
  const [present] = useIonToast()
  const history = useHistory()
  const { t } = useTranslation()
  const defaultState = {
    assembly: '',
    booth: ''
  }
  const [data, setData] = useState<WardProps>(defaultState)
  const [booth, setBooth] = useState<any>([])
  const [value, setValue] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [total, setTotal] = useState(0)
  const [perPage] = useState(100)
  const [pageCount, setPageCount] = useState(0)
  const [PageIndex, setPageIndex] = useState(1)

  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')

  const clear = () => {
    setValue([])
    history.replace('/election')
  }

  const { call } = useDownLoad()
  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) // Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch])

  const changeEventBooth = async (e: any) => {
    setData({ ...data, assembly: e.target.value })
    setBooth([])
    setValue([])
    setData({ assembly: e.target.value, booth: '' })
    setLoad(true)
    await axiosApi
      .get(
        '/GetBoothListByUserLoginLevel?pUserLevel=' +
          Name +
          ' &pUserMblNo=' +
          Num +
          '&pAcNo=' +
          e.target.value +
          '&pWardMasNo=' +
          '' +
          '&pShkMasId=' +
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
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  const changeEventData = (e: any) => {
    setValue([])
    const { value } = e.target
    setData({ ...data, booth: value })
  }

  const getData = async () => {
    setLoad(true)
    setTotal(0)
    const reqobj = {
      AC_NO: data.assembly,
      BOOTH_NO: data.booth,
      PageIndex: PageIndex,
      PageSize: perPage
    }
    axiosApi
      .post('/GetSingleVotersList', reqobj)
      .then(res => {
        if (res.data !== '') {
          const Data = res.data.SingleVotersList
          const Total = res.data.Total
          console.log(Data)
          setTotal(Total)
          setPageCount(Math.ceil(Total / perPage))
          setValue(Data)
          setLoad(load)
        } else {
          present('No Data Found..!', 3000)
          setLoad(false)
        }
      })
      .catch(er => {
        present(er.message, 3000)
        setLoad(false)
      })
  }

  useEffect(() => {
    getData()
  }, [PageIndex])

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <IonIcon
                  onClick={clear}
                  className='back-button'
                  src={arrowBackOutline}
                />
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{t('lan.MenuSingleVoters')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size='3'>
              {' '}
              <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <Select
                selectType={t('lan.lblAll')}
                name='assembly'
                values={data?.assembly}
                changes={changeEventBooth}
                array={assemblyList}
                optName='AS_SEAT_NM'
                optValue='AS_SEAT_ID'
              />
              {/* <select name='assembly' value={data.assembly} onChange={changeEventBooth}>
                                <option value=''>{t('lan.lblAll')}</option>
                                {Array.isArray(assemblyList) && assemblyList.length > 0 ?
                                    assemblyList.map((item: any, key: any) => {
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
              {' '}
              <IonLabel>{t('lan.lblLangBoothNo')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <Select
                selectType={t('lan.lblAll')}
                name='booth'
                values={data?.booth}
                changes={changeEventData}
                array={booth}
                optName='BOOTH_NAME'
                optValue='BOOTH_NO'
              />
              {/* <select name='booth' value={data.booth} onChange={changeEventData}>
                            <option value=''>{t('lan.lblAll')}</option>
                            {Array.isArray(booth) && booth.length > 0 ?
                                booth.map((item: any, key: any) => {
                                    return (
                                        <option key={key} value={item.BOOTH_NO}>{item.BOOTH_NO}-{item.BOOTH_NAME}</option>
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
                  <IonCard
                    key={key}
                    className={
                      item.DESIGNATION == 'PP'
                        ? 'IsLabharthi'
                        : item.DESIGNATION == 'PC'
                        ? 'IsLabharthi2'
                        : item.DESIGNATION == 'MS'
                        ? 'IsLabharthi3'
                        : ''
                    }
                  >
                    <IonCardContent className='complaint-card'>
                      <IonGrid className='rowborder'>
                        <IonRow>
                          <IonCol size='6' style={{ float: 'right' }}>
                            <span className='numberCircle'>
                              <b>{key + 1}</b>
                            </span>
                            <Link
                              to={{
                                pathname: '/entrythrough',
                                state: { id: item?.VOTERNO }
                              }}
                            >
                              {' '}
                              <span className='voter'>
                                <b>{item.VOTERNO}</b>
                              </span>
                            </Link>
                          </IonCol>
                          <IonCol
                            size='6'
                            style={{ textAlign: 'end' }}
                            className='booth'
                          >
                            <b>AcNo: {item.AC_NO}</b>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4' className='booth'>
                            <span> Booth:{item.BOOTH_NO} </span>
                          </IonCol>
                          <IonCol
                            size='4'
                            style={{ textAlign: 'center' }}
                            className='booth'
                          >
                            <span> Page:{item.PAGE_NO} </span>
                          </IonCol>
                          <IonCol
                            size='4'
                            style={{ textAlign: 'end' }}
                            className='booth'
                          >
                            <span> Sr:{item.SERIAL} </span>
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
                            <IonLabel>{item.ADDRESS}</IonLabel>
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
                          <IonCol size='2'>
                            <IonLabel>
                              <b>{t('lan.lblLangGender')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='4'>
                            <IonLabel>
                              {item.SEX === 'M' ? 'MALE' : 'FEMALE'}
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
                            <IonLabel>{item.BLOOD_GROUP}</IonLabel>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangMobile')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel onClick={() => call(item.MOBNO)}>
                              {item.MOBNO === '0' ||
                              item.MOBNO === 0 ||
                              item.MOBNO === null
                                ? ''
                                : item.MOBNO}
                            </IonLabel>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangbirthdate')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.BIRTHDATE}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangDOA')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.ANNIVERSARY}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangAltrMobile')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.ALTERNATE_MOBILE}</IonLabel>
                          </IonCol>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangAadharNo')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.AADHAR_NO}</IonLabel>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>
                              <b>{t('lan.lblLangPartyAffiliation')}</b>
                            </IonLabel>
                          </IonCol>
                          <IonCol size='8'>
                            <IonLabel>{item.MIND_SET}</IonLabel>
                          </IonCol>
                        </IonRow>
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

export default SingleVoter
