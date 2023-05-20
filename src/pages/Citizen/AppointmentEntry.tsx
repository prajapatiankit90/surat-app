import React, { useState } from 'react';
import { IonIcon, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButton, IonGrid, IonRow, IonCol, IonInput, useIonToast, IonTextarea } from '@ionic/react';
import { Link, useHistory } from 'react-router-dom';
import axiosApi from '../../axiosApi';
import moment from "moment";
import { arrowBackOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

interface AppointmentGreetingProps {
    name: string,
    mobile: string,
    appfDate: Date,
    appToDate: Date,
    appDesc: string
}

const AppointmentEntry: React.FC<AppointmentGreetingProps> = () => {
    const [present] = useIonToast();
    const history = useHistory();
    const { t } = useTranslation();
    const defaultState = {
        name: '',
        mobile: '',
        appfDate: moment(new Date).format("yyyy-MM-DD"),
        appToDate: moment(new Date).format("yyyy-MM-DD"),
        appDesc: ''

    }
    const [add, setAdd] = useState(false);
    const [data, setData] = useState(defaultState);
    const [values, setValues] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const [assembly, setAssembly] = useState<any>([])
    const deviceId = localStorage.getItem("DeviceRegisterId")
    const LognUsrRole = localStorage.getItem('loginas')
    const LognUsrMob = localStorage.getItem('loginUserMblNo')
    const LognUsrNm = localStorage.getItem('loginUserName')


    const changeEvent = (e: any) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const clearDate = () => {
        setData({ ...defaultState })
    }


    const getData = () => {
        setLoad(!load)
        setValues([])

    }

    const Save = async () => {
        if (data?.mobile !== "") {
            if (data?.mobile.length > 10 || data?.mobile.length < 10) {
                present("Please Enter 10 Digit Mobile No..", 3000)
                return
            }
        }
        await axiosApi.get("/RequestForMPAppointment?pName=" + data.name + "&pMobileNo=" + data.mobile + "&pPurpose=" + data.appDesc + "&pFromDate=" + moment(data.appfDate).format("DD-MM-yyyy") + "&pToDate=" + moment(data.appToDate).format("DD-MM-yyyy") + "&pDeviceRegId=" + deviceId + "&pLoginUserMobNo=" + LognUsrMob + "&pAddedBy=" + LognUsrNm + "&pLoginUserRole=" + LognUsrRole)
            .then((res) => {
                const Resp = res.data
                if (Resp?.Msg_Code === 1) {
                    present(Resp?.Msg_Value , 3000);
                    clearData()
                    history.push("/citizen")
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
        setData({ ...defaultState })
    }
    const Close = () => {
        history.push("/citizen")
        clearData()
        setAdd(false)
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonGrid  >
                        <IonRow>
                            <IonCol size='1'><Link to="/citizen" onClick={clearDate} className='back-button'><IonIcon src={arrowBackOutline} /></Link></IonCol>
                            <IonCol size='11'><IonTitle>{t('lan.MenuBookAppointment')}</IonTitle></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid >
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangName')}</IonLabel></IonCol>
                        <IonCol size='9'><IonInput value={data.name} name="name" onIonChange={changeEvent} /></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangMobile')}</IonLabel></IonCol>
                        <IonCol size='9'><IonInput minlength={0}  maxlength={10}  type='number' value={data.mobile} name="mobile" onIonChange={changeEvent} /></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangProgDesc')}</IonLabel></IonCol>
                        <IonCol size='9'><IonTextarea name='appDesc' value={data.appDesc} onIonChange={changeEvent} /></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangFromDate')}</IonLabel></IonCol>
                        <IonCol size='9'><IonInput type='date' name='appfDate' value={data.appfDate} min={disabledDates()} onIonChange={changeEvent} /></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangToDate')}</IonLabel></IonCol>
                        <IonCol size='9'><IonInput type='date' name='appToDate' value={data.appToDate} min={disabledDates()} onIonChange={changeEvent} /></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='6'>
                            <IonButton onClick={Save}>{t('lan.btnSave')}</IonButton>
                        </IonCol>
                        <IonCol size='6'>
                            <IonButton onClick={() => Close()}>{t('lan.lblLangClose')}</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

            </IonContent>
        </IonPage>
    )
}

export default AppointmentEntry