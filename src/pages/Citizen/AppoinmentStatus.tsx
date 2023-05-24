import React, { useState, useEffect } from 'react'
import { IonIcon, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonGrid, IonRow, IonCol, useIonToast, IonLabel, IonCardContent,  IonButton, IonInput,  IonItemDivider, IonLoading } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import axiosApi from '../../axiosApi';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Load';

const AppoinmentStatus: React.FC = () => {
  const history = useHistory()

  const defaultState = {
    apdate: moment(new Date).format("yyyy-MM-DD"),
    aptime: moment(new Date).format("HH:mm")
  }
  const [values, setValue] = useState(defaultState)
  const [data, setData] = useState<any>([])
  const [load, setLoad] = useState(false)
  const [show, setShow] = useState(false)
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState(1)


  const [present] = useIonToast();
  const { t } = useTranslation();


  const LognUsrRole = localStorage.getItem('loginas')
  const LognUsrMob = localStorage.getItem('loginUserMblNo')
  const LognUsrNm = localStorage.getItem('loginUserName')

  const changeEvent = (e: any) => {
    const { name, value } = e.target;
    setValue({ ...values, [name]: value })
  }

  const fetData = async () => {
    setLoad(true)
    setLoad(true)
    const ReqObj = {
      pLoginAs: LognUsrRole,
      pUserMobile: LognUsrMob,
      ADDED_BY: LognUsrNm,
      PageIndex: pageIndex,
      PageSize: perPage
  }
     await axiosApi.post("GetMPAppointmentStatusDetailsByUserLoginLevel_ForIonic", ReqObj)
     .then((res) => {
      const Data = res.data.AppoinmentDetailsList;
      const Total = res.data.Total;
      if (Data.length !== 0) {
          setPageCount(Math.ceil(Total / perPage));
          setData(Data);         
          setLoad(false);
      } else {
          present("No Data Found...", 3000);
          setLoad(false);
      }
     })
   
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  useEffect(() => {
    fetData()
  }, [pageIndex])

  const stsUpdate = async (id: any, flag: any, date: any, time: any) => {
    let vDate = '';
    if (flag === "ACCEPTED") {
      vDate = moment(date).format("DD-MM-yyyy");
    }
    else if (flag === "REJECTED") {
      vDate = ''
    }

    //await axiosApi.get("/SaveAppointmentDateTime?pid="+id+"&pFlag="+flag+"&vDate="+moment(date).format("DD-MM-yyyy")+"&time="+time)
    await axiosApi.get("/SaveAppointmentDetails?pid=" + id + "&pFlag=" + flag + "&pDate=" + vDate + "&pTime=" + time + "&pLoginUserNm=" + LognUsrNm + "&pLoginUserMobNo=" + LognUsrMob + "&pLoginUserRole=" + LognUsrRole)
      .then(res => {
        const Resp = res.data
        if (Resp?.Msg_Code === 1) {
          present(Resp?.Msg_Value, 3000)
          fetData()
          setShow(false)
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  const disabledDates = () => {
    let today, dd, mm, yyyy;
    today = new Date();
    dd = today.getDate();
    mm = today.getMonth() + 1
    yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  }

  const clearData = () => {
    history.replace("/citizen")
  }

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'><IonIcon src={arrowBackOutline} onClick={clearData} /></IonCol>
              <IonCol size='11'><IonTitle>{t('lan.MenuAppointmentStatus')}</IonTitle></IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page_content'>
      <Loader loading={load} click={() => setLoad(false)} />
        {Array.isArray(data) && data.length > 0 ?
          data.map((item: any, key: any) => {
            return (
              <div key={key}>
                {/* <IonCard key={key} className={item.DESIGNATION == 'PP' ? 'IsLabharthi' : item.DESIGNATION == 'PC' ? 'IsLabharthi2' : item.DESIGNATION == 'MS' ? 'IsLabharthi3' : ""}> */}
                <IonCard key={key}>
                  <IonCardContent className='complaint-card'>
                    <IonGrid>
                      <IonRow>
                        <IonCol size='4'><IonLabel><b>{t('lan.lblLangName')}</b></IonLabel></IonCol>
                        <IonCol size='8'><IonLabel>{item.NAME}</IonLabel></IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel><b>{t('lan.lblLangMobile')}</b></IonLabel></IonCol>
                        <IonCol size='8'><IonLabel>{item.MOBILE}</IonLabel></IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel><b>{t('lan.lblLangFromDate')}</b></IonLabel></IonCol>
                        <IonCol size='8'><IonLabel>{item.FROM_DATE}</IonLabel></IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel><b>{t('lan.lblLangToDate')}</b></IonLabel></IonCol>
                        <IonCol size='8'><IonLabel>{item.TO_DATE}</IonLabel></IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel><b>{t('lan.lblLangPurpose')}</b></IonLabel></IonCol>
                        <IonCol size='8'><IonLabel>{item.PURPOSE}</IonLabel></IonCol>
                      </IonRow>
                      {/* <IonRow>
                        <IonCol size='2'><IonLabel><b>{t('lan.lblLangAddedBy')}</b></IonLabel></IonCol>
                        <IonCol  size='4'><IonLabel>{item.ADDED_BY}</IonLabel></IonCol>
                        <IonCol size='2'><IonLabel><b>{t('lan.lblLangUser')}</b></IonLabel></IonCol>
                        <IonCol size='4'><IonLabel>{item.LOGIN_USER}</IonLabel></IonCol>
                      </IonRow> */}
                      <IonRow>
                        <IonCol size='4'><IonLabel><b>{t('lan.lblLangAddedBy')}</b></IonLabel>  </IonCol>
                        <IonCol size='8'> {item.ADDED_BY} ( {item.LOGIN_USER_ROLE} )</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel><b>{t('lan.lblLangAddedDate')}</b></IonLabel></IonCol>
                        <IonCol size='8'><IonLabel>{item.ADDED_DATE}</IonLabel></IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='5'><IonLabel><b>{t('lan.lblLangStatus')}</b></IonLabel></IonCol>
                        <IonCol size='7'><IonLabel style={{ color: item?.STATUS === "PENDING" ? 'Blue' : item?.STATUS === "ACCEPTED" ? 'Green' : 'orange' ? 'red' : 'red' }}>{item.STATUS}</IonLabel></IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="12">
                          <IonLabel><b>{t('lan.lblLangAppointmentDateTime')}</b></IonLabel> : <IonLabel color="success">{item.APPOINTMENT_DATE}-{item.APPOINTMENT_TIME}</IonLabel>
                        </IonCol>
                      </IonRow>

                      {/* <IonCardHeader>
                        <IonGrid>
                          <IonRow className='rowborder'>
                            <IonCol size='12'> <IonCardTitle>{t('lan.lblLangOfficeSection')}</IonCardTitle></IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonCardHeader> */}
                    </IonGrid>
                    {LognUsrRole === 'LOKSABHA'  ?
                      (
                        <IonGrid>
                          <IonItemDivider >
                            <IonLabel>{t('lan.lblLangOfficeSection')}</IonLabel>
                          </IonItemDivider>
                          <IonRow>
                            <IonCol size='6'><IonButton onClick={() => setShow(prev => prev === key ? undefined : key)}>{t('lan.lblAccept')}</IonButton></IonCol>
                            <IonCol size='6'><IonButton onClick={() => stsUpdate(item.ID, 'REJECTED', '', '')}>{t('lan.lblReject')}</IonButton></IonCol>
                          </IonRow>
                          {show === key ? (
                            <>
                              <IonRow>
                                <IonCol size='5'><IonLabel><b>{t('lan.lblLangDate')}</b></IonLabel></IonCol>
                                <IonCol size='7'><IonInput type='date' name="apdate" value={values.apdate} min={disabledDates()} onIonChange={changeEvent} /></IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol size='5'><IonLabel><b>{t('lan.lblLangTime')}</b></IonLabel></IonCol>
                                <IonCol size='7'><IonInput type='time' name="aptime" value={values.aptime} onIonChange={changeEvent} />
                                  {/* <IonCol size='7'><IonDatetime presentation='time'  name="aptime" value={values.aptime} onIonChange={changeEvent} /> */}
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol size='5'><IonButton onClick={() => stsUpdate(item.ID, 'ACCEPTED', values.apdate, values.aptime)} >{t('lan.btnSave')}</IonButton></IonCol>
                              </IonRow>
                            </>
                          ) : ""}
                        </IonGrid>
                      ) : ""}
                  </IonCardContent>
                </IonCard>
              </div>
            )
          }) : ""}

        {data.length >= 10 ? (
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
        ) : ""}
      </IonContent>
    </IonPage>
  )
}

export default AppoinmentStatus;