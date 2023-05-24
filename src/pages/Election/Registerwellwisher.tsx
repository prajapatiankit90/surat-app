import React, { useEffect, useState } from 'react';
import { IonGrid, IonInput, IonRow, IonCol, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButton, IonIcon, useIonToast, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axiosApi from '../../axiosApi';
import { arrowBackOutline } from 'ionicons/icons';
import { useTranslation } from "react-i18next";
import Loader from '../../components/Load';

interface RegisterWellWisherProps {
    mobile: number,
    name: any,
    asse: any
}

const RegisterWellWisher: React.FC<RegisterWellWisherProps> = () => {
    const [present] = useIonToast();
    const { t } = useTranslation();
    const history = useHistory();
    const defaultState = {
        mobile: "",
        name: "",
        asse: ""
    }

    const [data, setData] = useState<any>(defaultState)
    const [assembly, setAssembly] = useState([]);
    const [load, setLoad] = useState(false);
    const Name = localStorage.getItem('loginUserName')
    const Lok = localStorage.getItem('loginas');
    const Num = localStorage.getItem('loginUserMblNo')

    const changeEvent = (e: any) => {
        let { name, value } = e.target
        value = value ? value.trimStart() : "";
        setData({ ...data, [name]: value })
    }

    useEffect(() => {
        setLoad(true)
        const getAssembly = async () => {
            axiosApi.get("/getAdminsAssemblyList?pLoginAs=" + Lok + "&voterId=" + Num + "&pwd=" + Num)
                .then((res) => {
                    setAssembly(res.data);
                    setLoad(false)
                })
                .catch(err => {
                    present(err.message, 3000)
                    setLoad(false)
                })
        }
        getAssembly();
        return
    }, [])

    const submit = async () => {
        if (data.asse === '') {
            present("Please Enter Assemblly..!", 3000)
        }
        else if (data.mobile === '') {
            present("Please Enter Mobile..!", 3000)
        }
        else if (data.name === '') {
            present("Please Enter Name..!", 3000)
        }
        else {
            await axiosApi.get("/SaveSubhechhakMasterAssmWise_New?pMobileNo=" + data.mobile + "&pName=" + data.name + "&pAssembly=" + data.asse + "&pAddedByName=" + Name + "&pAddedByMob=" + Num)
                .then((res) => {
                    if (res.data === 0) {
                        present("Successfully Save Data...!", 3000)
                        setData({
                            mobile: null,
                            name: null,
                            asse: null
                        })
                    }
                    else if (res.data === 2) {
                        present("Mobile No is Duplicate..!", 3000)
                    }
                })
                .catch(err => {
                    present(err.message, 3000)
                    setLoad(false)
                })

        }
    }

    const ClearData = () => {
        history.replace("/election")
        setData({
            mobile: null,
            name: null,
            asse: null
        })
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonGrid  >
                        <IonRow>
                            <IonCol size='1'><IonIcon className='back-button' onClick={ClearData} src={arrowBackOutline} /></IonCol>
                            <IonCol size='11'><IonTitle>{t('lan.MenuGreetings')}</IonTitle></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className='page_content'>
                <IonGrid>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangAssembly')}</IonLabel></IonCol>
                        <IonCol size='9'><select name='asse' value={data.asse} onChange={changeEvent}>
                            <option value=''>{t('lan.lblAll')}</option>
                            {Array.isArray(assembly) && assembly.length > 0 ?
                                assembly.map((item: any, key: any) => {
                                    return (
                                        <option key={key} value={item.AS_SEAT_ID}>{item.AS_SEAT_NM}</option>
                                    )
                                }) : "No Data"
                            }
                        </select></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3'>
                            <IonLabel>{t('lan.lblLangMobile')}</IonLabel>
                        </IonCol>
                        <IonCol size='9'>
                            <IonInput type='number' name='mobile' value={data.mobile} onIonChange={changeEvent} />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3'>
                            <IonLabel>{t('lan.lblLangName')}</IonLabel>
                        </IonCol>
                        <IonCol size='9'>
                            <IonInput name='name' value={data.name} onIonChange={changeEvent} />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='6'>
                            <IonButton shape="round" fill="outline" onClick={() => submit()}>{t('lan.btnSave')}</IonButton>
                        </IonCol>
                        <IonCol size='6'>
                            <IonButton color='danger' onClick={() => ClearData()}>{t('lan.lblCancel')}</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <Loader loading={load} click={() => setLoad(false)} />
            </IonContent>
        </IonPage>
    )
}

export default RegisterWellWisher;