import React, { useEffect, useState } from 'react';
import { IonButton, IonCol, IonContent, IonGrid, IonLabel, IonPage, IonRow, IonHeader, IonToolbar, IonTitle, IonIcon, useIonToast, IonLoading, } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { arrowBackOutline, cloudDownloadOutline, searchOutline } from 'ionicons/icons';
import axiosApi from '../../axiosApi';
import { useHistory } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import useDownLoad from '../../hooks/download.hook';
import Loader from '../../components/Load';
import { useDispatch, useSelector } from 'react-redux';
import { getAssembly } from '../../slice/assembly.slice';
import { useDeviceInfo } from "../../hooks/useDeviceInfo"

const Boothwise: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const defaultState = {
        asse: '',
        booth: ''
    }
    const [present] = useIonToast();
    const [filter, setFilter] = useState('');
    const [assembly, setAssembly] = useState([]);
    const [booth, setBooth] = useState([]);
    const [data, setData] = useState(defaultState);
    const [value, setValue] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const [filterValue, setFilterValue] = useState<any>([])
    const [perPage] = useState(100);
    const [pageCount, setPageCount] = useState(0);
    const [total, setTotal] = useState<any>(0);
    const [pageIndex, setPageIndex] = useState(1);

    const Name = localStorage.getItem('loginas');
    const Num = localStorage.getItem('loginUserMblNo');

    const { downloadFilesFor } = useDownLoad()
    const { DeviceInfo } = useDeviceInfo()

    useEffect(() => {
        setLoad(true)
        getData()
        return
    }, [pageIndex])

    const dispatch = useDispatch<any>()
    const { assemblyList } = useSelector((state: any) => state.assembly) //Get Assembly value from redux
    useEffect(() => {
        dispatch(getAssembly())
    }, [dispatch, data])

    const changeBooth = async (e: any) => {
        setData({ ...data, asse: e.target.value });
        setPageIndex(1)
        setBooth([]);
        setValue([]);
        setData({ asse: e.target.value, booth: "" });
        setLoad(true)
        await axiosApi.get("/GetBoothPRBoothList?pAsmList=" + e.target.value + " &pFlag=" + Name + "&pMobile=" + Num + "&pWardId=" + '')
            .then((res) => {
                const Resp = JSON.parse(res.data)
                const Data = JSON.parse(Resp?.data);
                if(Resp?.error === false){
                    setBooth(Data);
                    setLoad(false)
                } else {
                    present(Resp?.msg, 3000)
                    setLoad(false)
                }
            })
        setFilter('')
    }
    const changeEvent = (e: any) => {
        setData({ ...data, booth: e.target.value });
        setValue([])
    }

    const getData = async () => {
        setTotal(0)
        setLoad(true)
        var ReqObj = {
            AC_NO: data?.asse,
            WARD_MAS_ID: '',
            BOOTH_NO: data?.booth,
            PageIndex: pageIndex,
            PageSize: perPage
        }
        await axiosApi.post("PP_PC_DETAILS_ASSM_BOOTH_WISE_ForIonic", ReqObj)
            .then((res) => {
                const Data = res.data.BoothWisePpPcList
                const Total = res.data.Total
                console.log(Data)
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
            .catch((error) => {
                present(error.message, 3000)
                setLoad(false)
            });
    }

    const handlePageClick = (selected: any) => {
        setPageIndex(selected.selected + 1)
    };

    useEffect(() => {
        if (filter === 'Pending') {
            setFilterValue(value.filter((item: any) => item.PERCENTAGE_5 == 0))
        } else if (filter === 'Partial') {
            setFilterValue(value.filter((item: any) => item.PERCENTAGE_5 <= 50 && item.PERCENTAGE_5 != 0))
        } else if (filter === 'Complete') {
            setFilterValue(value.filter((item: any) => item.PERCENTAGE_5 > 50))
        }
    }, [filter])

    const DownloadPPBoothWiseReport = (AcNo: any, BoothNo: any) => {
        downloadFilesFor(process.env.REACT_APP_API_URL + `DownloadPPBoothWiseReport?Vidhansabha=` + AcNo + `&BoothNo=` + BoothNo, 'BoothWise.pdf', "Booth Wise")
    }

    const clearData = () => {
        history.replace("/analysis")
        setData({ ...defaultState })
        setValue([])
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="1"><IonIcon src={arrowBackOutline} onClick={() => clearData()} className='back-button' /></IonCol>
                            <IonCol size='11'><IonTitle>{t('lan.lblLangBoothPPPCReport')}</IonTitle></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <Loader loading={load} click={() => setLoad(false)} />
                <IonGrid>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangAssembly')}</IonLabel></IonCol>
                        <IonCol size='9'><select name='asse' value={data.asse} onChange={changeBooth}>
                            <option value=''>{t('lan.lblAll')}</option>
                            {Array.isArray(assemblyList) && assemblyList.length > 0 ?
                                assemblyList.map((item: any, key: any) => {
                                    return (
                                        <option key={key} value={item.AS_SEAT_ID}>{item.AS_SEAT_NM}</option>
                                    )
                                }) : "No Data"
                            }
                        </select></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangBoothNo')}</IonLabel></IonCol>
                        <IonCol size='9'>
                            <select name="booth" value={data.booth} onChange={(e) => changeEvent(e)}  >
                                <option value=''>{t('lan.lblAll')}</option>
                                {Array.isArray(booth) && booth.length > 0 ?
                                    booth.map((item: any, key: any) => {
                                        return (
                                            <option key={key} value={item.BOOTH_NO}>{item.BOOTH_NO}-{item.BOOTH_NAME}</option>
                                        )
                                    }) : "No Data"
                                }
                            </select>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton onClick={getData}><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangFilter')}</IonLabel></IonCol>
                        <IonCol size='9'>
                            <select name="filter" value={filter} onChange={(e) => setFilter(e.target.value)}  >
                                <option defaultValue='' value=''>All</option>
                                <option value='Pending'>Pending</option>
                                <option value='Partial'>Partial</option>
                                <option value='Complete'>Completed</option>
                            </select>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonLabel> {t('lan.lblLangTotalRecords')}: {filter !== "" ? filterValue.length : total}</IonLabel>
                <div className='table-design'>
                    <tr>
                        <th>{t('lan.lblLangBoothNo')}</th>
                        <th>{t('lan.lblLangPageNo')}</th>
                        <th>{t('lan.lblLangPdf')}</th>
                        <th>{t('lan.lblLangPPPCCompletd')} 5(%)</th>
                        <th>{t('lan.lblLangPPPCCompletd')} 4(%)</th>
                        <th>{t('lan.lblLangPPPCCompletd')} 3(%)</th>
                        <th>{t('lan.lblLangPPPCExpected')} 5</th>
                        <th>{t('lan.lblLangPPPCCompletd')}</th>
                    </tr>
                    {filter === "" && Array.isArray(value) && value.length >= 0 ? value.map((item: any, key: any) => {
                        return (
                            <tr key={key}>
                                <td>{item.BOOTH_NO}</td>
                                <td>{item.MAXPG}</td>
                                <td>
                                    {DeviceInfo !== null ? (
                                    <IonIcon style={{color: 'black'}} src={cloudDownloadOutline} onClick={() => DownloadPPBoothWiseReport(item.AC_NO, item.BOOTH_NO)}></IonIcon>
                                    ) : <a href={process.env.REACT_APP_API_URL + `DownloadPPBoothWiseReport?Vidhansabha=` + item.AC_NO + `&BoothNo=` + item.BOOTH_NO}><IonIcon style={{color: 'black'}} src={cloudDownloadOutline} /></a> }
                                </td>
                                <td><IonLabel className='analysis-label'>{item.PERCENTAGE_5}</IonLabel></td>
                                <td><IonLabel className='analysis-label'>{item.PERCENTAGE_4}</IonLabel></td>
                                <td><IonLabel className='analysis-label'>{item.PERCENTAGE_3}</IonLabel></td>
                                <td>{item.PP_PC_EXPECTED}</td>
                                <td>{item.PP_PC_COMPLETED}</td>
                            </tr>
                        )
                    }) : filterValue.map((item: any, key: any) => {
                        return (
                            <tr key={key}>
                                <td>{item.BOOTH_NO}</td>
                                <td>{item.MAXPG}</td>
                                <td>
                                    {DeviceInfo !== null ? (
                                    <IonIcon style={{color: 'black'}} src={cloudDownloadOutline} onClick={() => DownloadPPBoothWiseReport(item.AC_NO, item.BOOTH_NO)}></IonIcon>
                                    ) : <a href={process.env.REACT_APP_API_URL + `DownloadPPBoothWiseReport?Vidhansabha=` + item.AC_NO + `&BoothNo=` + item.BOOTH_NO}><IonIcon style={{color: 'black'}} src={cloudDownloadOutline} /></a> }
                                </td>
                                <td><IonLabel className='analysis-label'>{item.PERCENTAGE_5}</IonLabel></td>
                                <td><IonLabel className='analysis-label'>{item.PERCENTAGE_4}</IonLabel></td>
                                <td><IonLabel className='analysis-label'>{item.PERCENTAGE_3}</IonLabel></td>
                                <td>{item.PP_PC_EXPECTED}</td>
                                <td>{item.PP_PC_COMPLETED}</td>
                            </tr>
                        )
                    })}
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

export default Boothwise;
