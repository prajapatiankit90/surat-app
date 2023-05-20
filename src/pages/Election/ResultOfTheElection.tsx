import React, { useEffect, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonLabel, IonPage, IonRow, IonSpinner, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import axiosApi from '../../axiosApi';
import { arrowBackOutline, searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAssembly } from '../../slice/assembly.slice';
import Select from '../../components/Select';

interface ResultProps {
    asse: any,
    booth: any,
    AcNo: any,
    BoothNo: any,
    RoundNo: any,
    TotalVotes: any,
    CountVotes: any,
    BjpVotes: any,
    CongresVotes: any,
    Others: any,
    Lead: any
}

const ResultOfTheElection: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const defaultState = {
        asse: '',
        booth: '',
        AcNo: '',
        BoothNo: '',
        RoundNo: '',
        TotalVotes: '',
        CountVotes: '',
        BjpVotes: '',
        CongresVotes: '',
        Others: '',
        Lead: ''
    }

    const [present] = useIonToast()
    const [data, setData] = useState<any>(defaultState);
    const [value, setValue] = useState<any>([]);
    const [booth, setBooth] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const Name = localStorage.getItem('loginas');
    const Num = localStorage.getItem('loginUserMblNo');

    const dispatch = useDispatch<any>()
    const { assemblyList } = useSelector((state: any) => state.assembly) // Get Assembly value from redux
    useEffect(() => {
        dispatch(getAssembly())
    }, [dispatch])      

    const changeEventBooth = (e: any) => {
        setData({ ...data, asse: e.target.value });
        setBooth([]);
        setValue([]);
        setData({ ...data, asse: e.target.value, booth: "" });
        axiosApi.get("/GetBoothListByUserLoginLevel?pUserLevel=" + Name + " &pUserMblNo=" + Num + "&pAcNo=" + e.target.value + "&pWardMasNo=" + '' + "&pShkMasId=" + '')
            .then((res) => {
                const Resp = JSON.parse(res.data);
                const Data = JSON.parse(Resp?.data);
                if(Resp?.error === false){
                    setBooth(Data);
                    setLoad(false)
                } else{
                    present(Resp?.msg,3000)
                    setLoad(false)
                }
            })
            .catch(err => {
                present(err.message, 3000)
                setLoad(false)
            })
    }

    const changeEvent = (e: any) => {
        setData({ ...data, booth: e.target.value });
        setValue([])
    }

    const getData = () => {
        if (data.asse === "") {
            present("Please Select Assembly..!", 3000)
            return false;
        }
        if (data.booth === "") {
            present("Please Select Booth..!", 3000)
            return false;
        }
        setValue([])
        setLoad(!load)
        axiosApi.get("/GetByElectionResults?pAssemblyNo=" + data.asse + "&pBoothNo=" + data.booth)
            .then((res) => {
                const Data = res.data.electionResults2;
                if (Data !== "") {
                    setValue(Data);
                    setLoad(load);
                    setData({
                        ...data,
                        AcNo: Data[0].AC_NO,
                        BoothNo: Data[0].BOOTH_NO,
                        RoundNo: Data[0].ROUND_NO,
                        TotalVotes: Data[0].TOTAL_VOTES,
                        CountVotes: Data[0].COUNT_VOTES,
                        BjpVotes: Data[0].BJP_VOTES,
                        CongresVotes: Data[0].CONGRESS_VOTES,
                        Others: Data[0].OTHERS,
                        Lead: Data[0].LEAD
                    });
                } else {
                    present("No Data Found", 1000)
                    setLoad(load)
                }
            })
            .catch(err => {
                present(err.message, 3000)
                setLoad(false)
            })
    }


    const changeEventValue = (e: any) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const saveData = () => {
        if (data.AcNo === "") {
            present("Please Select Assembly..!", 3000)
            return false;
        }
        if (data.BoothNo === "") {
            present("Please Select Booth No..!", 3000)
            return false;
        }
        if (data.RoundNo === "") {
            present("Please Enter Round No..!", 3000)
            return false;
        }
        if (data.TotalVotes === "") {
            present("Please Enter Total Votes..!", 3000)
            return false;
        }
        if (data.CountVotes === "") {
            present("Please Enter Counted Votes ..!", 3000)
            return false;
        }
        if (data.BjpVotes === "") {
            present("Please Enter BJP Votes..!", 3000)
            return false;
        }
        if (data.CongresVotes === "") {
            present("Please Enter Congress Votes..!", 3000)
            return false;
        }
        if (data.Others === "") {
            present("Please Enter Others Votes..!", 3000)
            return false;
        }

        const postObj = {
            AC_NO: data.AcNo,
            BOOTH_NO: data.BoothNo,
            ROUND_NO: data.RoundNo,
            TOTAL_VOTES: data.TotalVotes,
            COUNT_VOTES: data.CountVotes,
            BJP_VOTES: data.BjpVotes,
            CONGRESS_VOTES: data.CongresVotes,
            OTHERS: data.Others,
            LEAD: data.Lead
        }

        axiosApi.post("/SaveElectionResults", postObj)
            .then((res) => {
                if (res.data === 1) {
                    present("Record Details Successfully Updated..!!", 2000);
                    getData();
                }
            })
            .catch(err => {
                present(err.message, 3000)
                setLoad(false)
            })
    }

    const clearData = () => {
        history.replace("/election")
        setData({ ...defaultState })
        setValue([])
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonGrid  >
                        <IonRow>
                            <IonCol size='1'><IonIcon onClick={() => clearData()} className='back-button' src={arrowBackOutline} /></IonCol>
                            <IonCol size='11'><IonTitle>{t('lan.MenuResultOfElec')}</IonTitle></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangAssembly')}</IonLabel></IonCol>
                        <IonCol size='9'>
                        <Select
                        selectType={t('lan.lblAll')}
                                name='asse'
                                values={data?.asse}
                                changes={changeEventBooth}
                                array={assemblyList}
                                optName="AS_SEAT_NM"
                                optValue="AS_SEAT_ID"
                            />
                            
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="3"><IonLabel>{t('lan.lblLangBoothNo')}</IonLabel></IonCol>
                        <IonCol size='9'>
                        <Select
                            selectType={t('lan.lblAll')}
                                name='booth'
                                values={data?.booth}
                                changes={changeEvent}
                                array={booth}
                                optName="BOOTH_NAME"
                                optValue="BOOTH_NO"
                            />
                            
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol><IonButton onClick={getData}><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
                {load ? (<IonSpinner name='bubbles' />) : Array.isArray(value) && value.length > 0 ?
                    value.map((item: any, key: any) => {
                        return (
                            <div key={key}>
                                <IonCard key={key}>
                                    <IonCardContent className='complaint-card'>
                                        <IonGrid>

                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangRoundNo')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonInput type='number' name="RoundNo" value={data?.RoundNo} onIonChange={changeEventValue} /></IonCol>
                                            </IonRow>

                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangTotalMatdar')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonInput type='number' name="TotalVotes" value={data?.TotalVotes} onIonChange={changeEventValue} /></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangTotalVoting')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonInput type='number' name="CountVotes" value={data?.CountVotes} onIonChange={changeEventValue} /></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangBjp')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonInput type='number' name="BjpVotes" value={data?.BjpVotes} onIonChange={changeEventValue} /></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangCongress')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonInput type='number' name="CongresVotes" value={data?.CongresVotes} onIonChange={changeEventValue} /></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangOther')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonInput type='number' name="Others" value={data?.Others} onIonChange={changeEventValue} /></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangLead')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonInput type='number' disabled name="Lead" value={data?.BjpVotes - data?.CongresVotes} onIonChange={changeEventValue} /></IonCol>
                                            </IonRow>
                                        </IonGrid>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size='4'><IonButton shape="round" fill="outline" onClick={saveData}>{t('lan.lblLangSave')}</IonButton></IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>
                            </div>
                        )

                    }) : ""

                }
            </IonContent>
        </IonPage>

    );

};

export default ResultOfTheElection;