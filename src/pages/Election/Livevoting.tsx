import React, { useEffect, useState } from 'react';
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonLoading, IonPage, IonRow, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import axiosApi from '../../axiosApi';
import { arrowBackOutline, searchOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Load';
import Select from '../../components/Select';
import { getAssembly } from '../../slice/assembly.slice';
import { getWard } from '../../slice/ward.slice';
import { useSelector, useDispatch } from 'react-redux';

const Livevoting: React.FC = () => {
    const { t } = useTranslation();
    const defaultState = {
        asse: '',
        ward: '',
        type: '2'
    }
    const [present] = useIonToast()
    const [booth, setBooth] = useState<any>([]);
    const [data, setData] = useState(defaultState);
    const [value, setValue] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const [totalVoter, setTotalVoter] = useState(0)
    const [voted, setVoted] = useState(0)
    const [per, setPer] = useState(0)
    const [perPage] = useState(100);
    const [pageCount, setPageCount] = useState(0);
    const [pagination, setPagination] = useState<any>([]);


    const [newData, setNewData] = useState<any>({
        agentName: '',
        agentMo: '',
        reciName: '',
        reciMo: ''
    })

    const Name = localStorage.getItem('loginas');
    const Num = localStorage.getItem('loginUserMblNo');
    const user = localStorage.getItem("loginUserName");

    const dispatch = useDispatch<any>()
    const { assemblyList } = useSelector((state: any) => state.assembly) // Get Assembly value from redux
    useEffect(() => {
        dispatch(getAssembly())
    }, [dispatch])

    const changeEventBooth = async (e: any) => {
        setData({ ...data, asse: e.target.value });
        setBooth([]);
        setValue([]);
        setData({ ...data, asse: e.target.value, ward: "" });
        setTotalVoter(0)
        setVoted(0)
        setPer(0)
        setLoad(!load)
        // dispatch(getBooth())
        await axiosApi.get("/GetAssemblyWiseWardByUserLoginLevel?pUserLevel=" + Name + " &pUserMblNo=" + Num + "&pAcNo=" + e.target.value)
            .then((res) => {
                const Resp = JSON.parse(res.data)
                const Data = JSON.parse(Resp?.data);
                if (Resp?.error === false) {
                    setBooth(Data)
                    setLoad(load)
                } else {
                    setLoad(load)
                    present(Resp?.msg, 3000)
                }
            })
            .catch(err => {
                present(err.message, 3000)
                setLoad(false)
            })

    }
    const changeEvent = (e: any) => {
        setTotalVoter(0)
        setVoted(0)
        setPer(0)
        setValue([])
        setData({ ...data, ward: e.target.value });
    }
    const changeType = (e: any) => {
        setTotalVoter(0)
        setVoted(0)
        setPer(0)
        setValue([])
        setData({ ...data, type: e.target.value })
    }

    const getData = async () => {
        setValue([])
        setLoad(!load)
        setTotalVoter(0)
        setVoted(0)
        setPer(0)
        await axiosApi.get("/GetVotingLiveUserWise?pAssembly=" + data.asse + "&pWardId=" + data.ward + "&pLoginAs=" + Name + "&pUserMobile=" + Num + "&format=" + data.type)
            .then((res) => {
                if (res.data !== "") {
                    const Resp = JSON.parse(res.data);
                    const Data = JSON.parse(Resp?.data);
                    console.log(Data)
                    if (Resp?.error === false) {
                        setTotalVoter(Data.map((item: any) => item.TOTAL_VOTER).reduce((prev: any, next: any) => prev + next));
                        setVoted(Data.map((item: any) => item.TOTAL_VOTING).reduce((prev: any, next: any) => prev + next));
                        setPer(Data.map((item: any) => item.VOTING_PER === null ? 0 : item.VOTING_PER).reduce((prev: any, next: any) => prev + next));
                        setPagination(Data)
                        const data = Data.slice(0, 100);
                        setPageCount(Math.ceil(Data.length / perPage));
                        setValue(data)
                        setLoad(load)
                    } else {
                        present(Resp?.msg,3000)
                        setLoad(load)
                    }
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
    const handlePageClick = (selected: any) => {
        const pagesVisited = selected.selected * perPage;
        const lastSetData = pagesVisited + perPage;
        setValue(pagination.slice(pagesVisited, lastSetData));
        window.scroll(0, 0)
    };



    const clearDate = () => {
        setData({ ...defaultState })
        setValue([])
    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonGrid  >
                        <IonRow>
                            <IonCol size='1'><Link to="/election" onClick={clearDate} className='back-button'><IonIcon src={arrowBackOutline} /></Link></IonCol>
                            <IonCol size='11'><IonTitle>{t('lan.MenuLiveVoting')}</IonTitle></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className='page_content'>
                <IonGrid>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangAssembly')}</IonLabel></IonCol>
                        <IonCol size='9'>
                            <Select
                                selectType={t('lan.lblAll')}
                                name='asse'
                                values={data.asse}
                                changes={changeEventBooth}
                                array={assemblyList}
                                optName="AS_SEAT_NM"
                                optValue="AS_SEAT_ID"
                            />

                            {/* <select name='asse' value={data.asse} onChange={changeEventBooth}>
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
                                values={data.ward}
                                changes={changeEvent}
                                array={booth}
                                optName="WARD_NAME"
                                optValue="WARD_MAS_ID"
                            />
                            {/* <select name="booth" value={data.ward} onChange={changeEvent}  >
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
                        <IonCol size='3'><IonLabel>{t('lan.lblLangType')}</IonLabel></IonCol>
                        <IonCol size='9'>
                            <select name="type" value={data.type} onChange={changeType}  >
                                <option value=''>{t('lan.lblLangSelect')}</option>
                                <option value='2'>SUMMARY</option>
                                <option value='1'>DETAILS</option>
                            </select>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol><IonButton onClick={getData}><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
                <Loader loading={load} click={() => setLoad(false)} />


                <div className='table-design'>
                    <tr>
                        <th>{t('lan.lblLangNo')}</th>
                        <th>{t('lan.lblLangAssembly')}</th>
                        {data.type === '1' ? (<th>{t('lan.lblLangBoothNo')}</th>) : ""}
                        <th>{t('lan.lblLangTotalVoter')}</th>
                        <th>{t('lan.lblLangThayelMatdan')}</th>
                        <th>{t('lan.lblLangPercentage')}</th>
                    </tr>
                    <tr>
                        <td colSpan={data.type !== '1' ? 2 : 3}>{t('lan.lblLangGrndTotal')}:</td>
                        <td>{totalVoter}</td>
                        {/* {data.type === '1' ? (<td>{totalVoter}</td>) :""} */}
                        <td>{voted}</td>
                        <td>{per}</td>
                    </tr>
                    {Array.isArray(value) && value.length >= 0 ? value.map((item: any, key: any) => {
                        return (
                            <>
                                <tr key={key}>
                                    <td>{key + 1}</td>
                                    <td>{item?.as_seat_nm_guj}</td>
                                    {data.type === '1' ? (<td>{item?.BOOTH_NO}</td>) : ""}
                                    <td>{item?.TOTAL_VOTER}</td>
                                    <td>{item?.TOTAL_VOTING === null ? "0" : item?.TOTAL_VOTING}</td>
                                    <td>{item?.VOTING_PER === null ? '0.00%' : item?.VOTING_PER}</td>
                                </tr>
                            </>
                        )
                    }) : ""}
                </div>
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

export default Livevoting;
