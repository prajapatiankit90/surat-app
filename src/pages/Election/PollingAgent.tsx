import React, { useEffect, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonLabel, IonLoading, IonPage, IonRow, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import axiosApi from '../../axiosApi';
import { arrowBackOutline, saveOutline, searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Load';
import { useDispatch, useSelector } from 'react-redux';
import { getAssembly } from '../../slice/assembly.slice';
import Select from '../../components/Select';
import { getBooth } from '../../slice/booth.slice';
import { getWard } from '../../slice/ward.slice';

const PollingAgent: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const defaultState = {
        asse: "",
        ward: ""
    }
    const [present] = useIonToast()
    const [booth, setBooth] = useState<any>([]);
    const [data, setData] = useState<any>(defaultState);
    const [value, setValue] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const [showagent, setShowAgent] = useState(false);
    const [newData, setNewData] = useState<any>({
        agentName: '',
        agentMo: '',
        reciName: '',
        reciMo: ''
    });
    const [perPage] = useState(100);
    const [pageCount, setPageCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(1)
    const [total, setTotal] = useState(0)

    const Name = localStorage.getItem('loginas');
    const Num = localStorage.getItem('loginUserMblNo');
    const user = localStorage.getItem("loginUserName");

    const dispatch = useDispatch<any>()
    const { assemblyList } = useSelector((state: any) => state.assembly) // Get Assembly value from redux
    //const { wardList } = useSelector((state: any) => state.ward) // Get booth value from 
    useEffect(() => {
        dispatch(getAssembly())        
    }, [dispatch])
    
    const changeNewData = (e: any) => {
        const { name, value } = e.target;
        setNewData({ ...newData, [name]: value })
    }

    const changeEventBooth = async (e: any) => {
        setData({ ...data, asse: e.target.value });
        setPageIndex(1)
        setBooth([]);
        setValue([]);
        setData({ ...data, asse: e.target.value, ward: "" });
        //dispatch(getWard(e.target.value))
        setLoad(true)
        await axiosApi.get("GetAssemblyWiseWardByUserLoginLevel?pUserLevel=" + Name + " &pUserMblNo=" + Num + "&pAcNo=" + e.target.value)
            .then((res) => {
                const Resp = JSON.parse(res.data);
                const Data = JSON.parse(Resp?.data);
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


    const changeEvent = (e: any) => {
        setValue([]);
        setData({ ...data, ward: e.target.value });
    }

    const getData = async () => {
        setTotal(0)
        setLoad(!load)
        const ReqObj = {
            AC_NO: data?.asse,
            WARD_MAS_ID: data?.ward,
            PageIndex: pageIndex,
            PageSize: perPage
        }
        await axiosApi.post("GetPollingAgent_ForIonic", ReqObj)
            .then((res) => {
                const Data = res.data.PollingagentDetailsList
                const Total = res.data.Total
                setTotal(Total)
                if (Data.length != 0) {
                    setValue(Data)
                    setPageCount(Math.ceil(Total / perPage))
                    setLoad(load)
                }
                else {
                    present("No Data Found..!", 3000)
                    setLoad(false)
                }
            })

            .catch(err => {
                present(err.message, 3000)
                setLoad(false)
            })
    }
    useEffect(() => {
        getData()
    }, [pageIndex])

    const handlePageClick = (selected: any) => {
        setPageIndex(selected.selected + 1);
    };

    const submit = async (booth: any, PolAgent: any, PolAgentMo: any, RecName: any, RecMo: any) => {

        const agent: any = newData.agentName === "" ? PolAgent : newData.agentName
        const agentMo: any = newData.agentMo === "" ? PolAgentMo : newData.agentMo
        const reciName: any = newData.reciName === "" ? RecName : newData.reciName
        const reciMo: any = newData.reciMo === "" ? RecMo : newData.reciMo

        if (newData.agentName === "") {
            present("Please Enter Agent Name..!!", 3000)
        }
        else if (newData.reciName === "") {
            present("Please Enter Reliver Name..!!", 3000)
        }
        else {
            await axiosApi.get("/SavePollReliverAgent?pAssembly=" + data.asse + "&pWard=" + data.ward + "&pBooth=" + booth + "&pPollAgentName=" + agent + "&pPollAgentMobile=" + agentMo + "&pReliverName=" + reciName + "&pReliverMobile=" + reciMo + "")
                .then((res) => {
                    if (res.data === 1) {
                        present("Successfully Changed..!!", 2000)
                        setNewData({
                            agentName: '',
                            agentMo: '',
                            reciName: '',
                            reciMo: ''
                        })
                        setShowAgent(false)
                        getData();
                    }
                    if (res.data === 0) {
                        present({ message: "Details Are Not Updated..!!", duration: 2000, color: 'danger' })
                        setNewData({
                            agentName: '',
                            agentMo: '',
                            reciName: '',
                            reciMo: ''
                        })
                        setShowAgent(false)
                        getData();
                    }
                })
                .catch(err => {
                    present(err.message, 3000)
                    setLoad(false)
                })
        }
    }

    const clearDate = () => {
        history.replace("/election")
        setBooth([])
        setValue([])
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonGrid  >
                        <IonRow>
                            <IonCol size='1'><IonIcon className='back-button' onClick={clearDate} src={arrowBackOutline} /></IonCol>
                            <IonCol size='11'><IonTitle>{t('lan.MenuPolingAgent')}</IonTitle></IonCol>
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
                            {/* <select name='asse' value={data?.asse} onChange={changeEventBooth}>
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
                        <IonCol size='3'><IonLabel>{t('lan.lblLangWardName')}</IonLabel></IonCol>
                        <IonCol size='9'>
                            <Select
                                selectType={t('lan.lblAll')}
                                name='ward'
                                values={data?.ward}
                                changes={changeEvent}
                                array={booth}
                                optName="WARD_NAME"
                                optValue="WARD_MAS_ID"
                            />
                            {/* <select name='ward' value={data?.ward} onChange={changeEvent}  >
                                <option value=''>{t('lan.lblAll')}</option>
                                {Array.isArray(booth) && booth.length > 0 ?
                                    booth.map((item: any, key: any) => {
                                        return (
                                            <option key={key} value={item.WARD_MAS_ID}>{item.WARD_NAME}</option>
                                        )
                                    }) : "No Data"
                                }
                            </select> */}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol><IonButton onClick={getData}><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
                <Loader loading={load} click={() => setLoad(false)} />
                <IonLabel color='danger'>{t('lan.lblLangTotalRecords')} :  {total}</IonLabel>
                {Array.isArray(value) && value.length > 0 ?
                    value.map((item: any, key: any) => {
                        return (
                            <div key={key}>
                                <IonCard key={key}>
                                    <IonCardContent className='complaint-card'>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size='3'><IonLabel>{t('lan.lblLangNo')}</IonLabel></IonCol>
                                                <IonCol size='3'><IonLabel>{key + 1}</IonLabel></IonCol>
                                                <IonCol size='3'><IonLabel>{t('lan.lblLangBoothNo')}</IonLabel></IonCol>
                                                <IonCol size='3'><IonLabel>{item.BOOTH_NO}</IonLabel></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangBoothVistar')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonLabel>{item.BOOTH_NAME}</IonLabel></IonCol>
                                            </IonRow>

                                            <IonRow >
                                                <IonCol size='4'><IonLabel>{t('lan.MenuPolingAgent')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonLabel>{item.POLLING_AGENT_NAME}</IonLabel></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangMobile')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonLabel>{item.POLLING_AGENT_MOBILE}</IonLabel></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangReliever')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonLabel>{item.RELIVER_NAME}</IonLabel></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size='4'><IonLabel>{t('lan.lblLangMobile')}</IonLabel></IonCol>
                                                <IonCol size='8'><IonLabel>{item.RELIVER_MOBILE}</IonLabel></IonCol>
                                            </IonRow>
                                            {/* <IonButton onClick={() => setShowAgent(prev => prev === key ? undefined : key)}><IonIcon className='button-icon' src={createOutline} />{t('lan.lblLangEdit')}</IonButton> */}
                                            {showagent === key ? (
                                                <>
                                                    <IonRow>
                                                        <IonCol size='4'><IonLabel>{t('lan.MenuPolingAgent')}</IonLabel></IonCol>
                                                        <IonCol size='8'><IonInput name='agentName' value={newData.agentName} onIonChange={changeNewData} /></IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonCol size='4'><IonLabel>{t('lan.lblLangMobile')}</IonLabel></IonCol>
                                                        <IonCol size='8'><IonInput type='number' name='agentMo' value={newData.agentMo} onIonChange={changeNewData} /></IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonCol size='4'><IonLabel>{t('lan.lblLangReliever')}</IonLabel></IonCol>
                                                        <IonCol size='8'><IonInput name='reciName' value={newData.reciName} onIonChange={changeNewData} /></IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonCol size='4'><IonLabel>{t('lan.lblLangMobile')}</IonLabel></IonCol>
                                                        <IonCol size='8'><IonInput type='number' name='reciMo' value={newData.reciMo} onIonChange={changeNewData} /></IonCol>
                                                    </IonRow>
                                                    <IonIcon className='showpassnew' src={saveOutline} onClick={() => submit(item.BOOTH_NO, item.POLLING_AGENT_NAME, item.POLLING_AGENT_MOBILE, item.RELIVER_NAME, item.RELIVER_MOBILE)} />
                                                </>
                                            ) : ""}
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>
                            </div>
                        )
                    }) : ""}
                {value.length >= 10 ? (
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
    );
};

export default PollingAgent;
