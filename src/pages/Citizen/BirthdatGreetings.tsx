import React, { useEffect, useState } from 'react';
import { IonCard, IonIcon, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButton, IonGrid, IonRow, IonCol, IonCardContent, IonInput, IonCheckbox, useIonToast, IonLoading, IonDatetimeButton, IonModal, IonDatetime } from '@ionic/react';
import { Link } from 'react-router-dom';
import axiosApi from '../../axiosApi';
import moment from "moment";
import { arrowBackOutline, searchOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Load';

interface BirthdayGreetingProps {
  bdate: string,
  name: string
}

const BirthdayGreeting: React.FC<BirthdayGreetingProps> = () => {
  const [present] = useIonToast();
  const { t } = useTranslation();
  const defaultState = {
    bdate: moment(new Date).format("yyyy-MM-DD"),
    name: ''
  }
  const [data, setData] = useState(defaultState);
  const [values, setValues] = useState<any>([]);
  const [search, setSearch] = useState([]);
  const [check, setChecked] = useState<any>([]);
  const [sendArray, setSendArray] = useState<any>([])
  const [load, setLoad] = useState(false);
  const [perPage] = useState(100);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1)

  const changeEvent = (e: any) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
    const Data = values.filter((entry: any) => Object.values(entry).some(val => typeof val == "string" && val.includes(value)))
    //const Data = values.filter((enter: any) => enter.V_NAME === value)
    setSearch(Data)
  }

  const select = (e: any, item: any, index: any) => {
    let prev = check;
    let itemIndex = prev.indexOf(index);
    if (itemIndex !== -1) {
      prev.splice(itemIndex, 1);
    } else {
      prev.push(index);
    }
    setChecked([...prev]);
    if (check !== "") {
      const obj: any = { V_NAME: item.V_NAME, MOBNO: item.MOBNO }
      setSendArray((sendArray: any) => [...sendArray, obj])
    }
  }

  const clearDate = () => {
    setValues([]);
    setData({ ...defaultState })
  }

  const getData = async () => {
    setLoad(!load)
    const reqObj = {
      FromDate: moment(data?.bdate).format("DD-MM-YYYY"),
      PageIndex: pageIndex,
      PageSize: perPage
    }
    await axiosApi.post("BirthdayGreeting_ForIonic", reqObj)
      .then((res) => {
        const Data = res.data.BirthDayDetailList;
        const Total = res.data.Total
        if (Data.length !== 0) {
          setPageCount(Math.ceil(Total / perPage))
          setValues(Data)
          setLoad(load)
          setLoad(false)
        } else {
          present("No Data Found...", 3000)
          setLoad(false)
        }
      })
      .catch((err) => {
        present(err.message , 3000)
        setLoad(false)
      })
    
  }

  useEffect(() => {
    getData()
  },[pageIndex])

  const handlePageClick = (selected: any) => {
   setPageIndex(selected.selected + 1)
  };

  const sendSms = async () => {
    if (check.length === 0) {
      present("Plese Select atleast One Record To Send SMS", 3000);
    }
    else {
      let reqObj = {
        BirthdayIds: sendArray,
        pmode: "SEND",
      }

      await axios.post(process.env.REACT_APP_API_URL + "SendBirthdaySMS", reqObj)
        .then((res) => {
          const data = res.data
          if (data) {
            present('Birthday SMS Sent', 3000)
            setChecked([])
          }
          else { present('Birthday SMS Not Sent', 3000) }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid  >
            <IonRow>
              <IonCol size='1'><Link to="/citizen" onClick={clearDate} className='back-button'><IonIcon src={arrowBackOutline} /></Link></IonCol>
              <IonCol size='11'><IonTitle>{t('lan.MenuBirthdayGreet')}</IonTitle></IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size='3'><IonLabel>{t('lan.lblLangbirthdate')}</IonLabel></IonCol>
            <IonCol size='9'>
              {/* <IonInput type='date' name='bdate' value={data.bdate} onIonChange={changeEvent} /> */}
              <IonDatetimeButton className='dtpBtn' datetime="fdatetime"></IonDatetimeButton>

              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  color="warning"
                  id="fdatetime"
                  value={data?.bdate}
                  doneText="done"
                  name="bdate"
                  presentation='date'
                  showDefaultTitle={true}
                  onIonChange={changeEvent}
                ></IonDatetime>
              </IonModal>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='6'><IonButton shape="round" fill="outline" onClick={() => getData()}> <IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton></IonCol>
            {/* <IonCol size='6'><IonButton shape="round" fill="outline" color='danger' onClick={() => sendSms()}>{t('lan.lblLangSendSMS')}</IonButton></IonCol> */}
          </IonRow>
          <IonRow>
            <IonCol size='3'><IonLabel>{t('lan.lblLangName')}</IonLabel></IonCol>
            <IonCol size='9'><IonInput name='name' value={data.name} onIonChange={changeEvent} /></IonCol>
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />
        {data.name === "" ?
          Array.isArray(values) && values.length > 0 ?
            values.map((item: any, key: any) => {
              return (
                <IonCard key={key} color="warning">
                  <IonCardContent className='complaint-card'>
                    <IonGrid>
                      {/* <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangSendTo')}</IonLabel></IonCol>
                        <IonCol size='9'><IonCheckbox name='transno' value={item?.V_SRNO} checked={check.includes(key)} onIonChange={(e) => select(e, item, key)} /></IonCol>
                      </IonRow> */}
                      <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangName')}</IonLabel></IonCol>
                        <IonCol size='9'>{item?.V_NAME === null ? item?.V_G_NAME : item?.V_NAME}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangAddress')}</IonLabel></IonCol>
                        <IonCol size='9'>{item?.V_ADDRESS}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangMobile')}</IonLabel></IonCol>
                        <IonCol size='9'>{item?.MOBNO}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangDOB')}</IonLabel></IonCol>
                        <IonCol size='9'>{item?.V_DOB}</IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              )
            }) : "" :
          Array.isArray(search) && search.length > 0 ?
            search.map((item: any, key: any) => {
              return (
                <IonCard key={key}>
                  <IonCardContent className='complaint-card'>
                  <IonGrid>
                      {/* <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangSendTo')}</IonLabel></IonCol>
                        <IonCol size='9'><IonCheckbox name='transno' value={item?.V_SRNO} checked={check.includes(key)} onIonChange={(e) => select(e, item, key)} /></IonCol>
                      </IonRow> */}
                      <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangName')}</IonLabel></IonCol>
                        <IonCol size='9'>{item?.V_NAME === null ? item?.V_G_NAME : item?.V_NAME}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangAddress')}</IonLabel></IonCol>
                        <IonCol size='9'>{item?.V_ADDRESS}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangMobile')}</IonLabel></IonCol>
                        <IonCol size='9'>{item?.MOBNO}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangDOB')}</IonLabel></IonCol>
                        <IonCol size='9'>{item?.V_DOB}</IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              )
            }) : ""}

        {values.length >= 10 ? (
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

export default BirthdayGreeting