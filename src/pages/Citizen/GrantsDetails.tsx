import React, { useEffect, useState } from 'react';
import { IonIcon, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButton, IonGrid, IonRow, IonCol, IonModal, useIonToast, IonLoading } from '@ionic/react';
import { Link } from 'react-router-dom';
import { arrowBackOutline, closeCircleOutline, searchOutline } from 'ionicons/icons';
import axiosApi from '../../axiosApi';
import { useTranslation } from 'react-i18next'
import Loader from '../../components/Load';
import ReactPaginate from 'react-paginate';
import Select from '../../components/Select';
import { useDispatch, useSelector } from 'react-redux';
import { getAssembly } from '../../slice/assembly.slice';

interface WardProps {
    assembly: string;
    year: string,
    mode: string,
    summary: string

}
const GrantsDetails: React.FC = () => {
    const { t } = useTranslation();
    const [present] = useIonToast()
    const defaultState = {
        assembly: '',
        year: '',
        mode: '',
        summary: ''
    }

    const [year, setYear] = useState([]);
    const [data, setData] = useState<WardProps>(defaultState);
    const [value, setValue] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [grant, setGrant] = useState([]);
    const [TotalGrant, setTotalGrant] = useState(0)
    const [load, setLoad] = useState(false)
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageCountSub, setPageCountSub] = useState(0);
    const [pageIndexSub, setPageIndexSub] = useState(1);
    

    const dispatch = useDispatch<any>()
    const { assemblyList } = useSelector((state: any) => state.assembly) // Get Assembly value from redux
    useEffect(() => {
        dispatch(getAssembly())
    }, [dispatch])


    useEffect(() => {       
        const getYear = async () => {
            setLoad(true)
            await axiosApi.get("/getGrantAssessmentYear")
                .then((res) => {
                    const Data = JSON.parse(res.data);
                    setYear(Data)
                    setLoad(false)
                })
                .catch(err => {
                    present(err.message, 3000)
                    setLoad(false)
                })
        }
        getYear();
    }, [])

    const changeEvent = (e: any) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const clearData = () => {
        setValue([])
        setGrant([])
        setTotalGrant(0)
        setData({
            assembly: '',
            year: '',
            mode: '',
            summary: ''
        })
    }

    const getData = async () => {
        if (data.mode === '') {
            present("Please Select Display Mode", 3000)
        } else if (data.summary === '') {
            present("Please Select Summary", 3000)
        } else {
            if (data.mode === "Assembly Wise" || data.mode === "Ward Wise") {
                if (data.mode === "Assembly Wise") {
                    if (data.summary === "Summary") {
                        setTotalGrant(0)
                        setLoad(!load)
                        const ReqObj = {
                            AC_NO: data?.assembly,
                            year: data?.year,
                            Mode: data?.mode,
                            PageIndex: pageIndex,
                            PageSize: perPage
                        }
                        await axiosApi.post("getGrantDetAssm_WardWise_ForIonic", ReqObj)
                            .then((res) => {
                                const Data = res.data.GrantDetailsList;
                                const Total = res.data.Total;
                                if (Data.length !== 0) {
                                    setPageCount(Math.ceil(Total / perPage));
                                    setValue(Data);
                                    setTotalGrant(Data.map((item: any) => Number(item.sum_grant)).reduce((prev: any, next: any) => prev + next))
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
                    else if (data.summary === "Details") {
                        setTotalGrant(0)
                        setLoad(!load)
                        
                        const ReqObj = {
                            AC_NO: data?.assembly,
                            year: data?.year,
                            MODE: data?.mode,
                            PageIndex: pageIndex,
                            PageSize: perPage
                        }
                        await axiosApi.post("getAllGrantDet_ForIonic", ReqObj)
                            .then((res) => {
                                const Data = res.data.GrantDetailsList;
                                const Total = res.data.Total;
                                if (Data.length !== 0) {
                                    setPageCount(Math.ceil(Total / perPage));
                                    setValue(Data);
                                    setLoad(false);
                                    setTotalGrant(Data.map((item: any) => Number(item.GRANT_VALUE)).reduce((prev: any, next: any) => prev + next))
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
                }
                else if (data.mode === "Ward Wise") {
                    if (data.summary === "Summary") {
                        setTotalGrant(0)
                        setLoad(!load)
                        const ReqObj = {
                            AC_NO: data?.assembly,
                            year: data?.year,
                            MODE: data?.mode,
                            PageIndex: pageIndex,
                            PageSize: perPage
                        }
                        await axiosApi.post("getGrantDetAssm_WardWise_ForIonic", ReqObj)
                            .then((res) => {
                                const Data = res.data.GrantDetailsList;
                                const Total = res.data.Total;
                                if (Data.length !== 0) {

                                    setPageCount(Math.ceil(Total / perPage));
                                    setValue(Data);
                                    setTotalGrant(Data.map((item: any) => Number(item.sum_grant)).reduce((prev: any, next: any) => prev + next))
                                    setLoad(false);
                                } else {
                                    present("No Data Found...", 3000);
                                    setLoad(false);
                                }
                            })
                            
                            .catch(err => {
                                present(err.message, 3000)
                                setLoad(load)
                            })
                    }
                    else if (data.summary === "Details") {
                        setTotalGrant(0)
                        setLoad(!load)
                        
                        const ReqObj = {
                            AC_NO: data?.assembly,
                            year: data?.year,
                            Mode: data?.mode,
                            PageIndex: pageIndex,
                            PageSize: perPage
                        }
                        await axiosApi.post("getAllGrantDet_ForIonic", ReqObj)
                            .then((res) => {
                                const Data = res.data.GrantDetailsList;
                                const Total = res.data.Total;
                                if (Data.length !== 0) {
                                    setPageCount(Math.ceil(Total / perPage));
                                    setValue(Data);
                                    setTotalGrant(Data.map((item: any) => Number(item.GRANT_VALUE)).reduce((prev: any, next: any) => prev + next))
                                    setLoad(false);
                                } else {
                                    present("No Data Found...", 3000);
                                    setLoad(false);
                                }
                            })
                            .catch(err => {
                                present(err.message, 3000)
                                setLoad(load)
                            })
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (data?.summary !== '') {
            getData()
        }
    }, [pageIndex])

    const grantsDetails = async (item: any) => {
        setLoad(!load)       

        const Reqobj = {
            AC_NO : data?.assembly,
            year :item?.year,
            MODE : data?.mode,
            PageIndex : pageIndexSub,
            PageSize : pageCountSub

        }


        await axiosApi.post("getMoreGrantDet_ForIonic", Reqobj)
            .then((res) => {
                const Data = res.data.MoreGrantDetailsList
                setLoad(false)

                if (res.data !== "") {
                    setTimeout(() => {                       
                        setGrant(Data)
                        setShowModal(true)
                        setLoad(load)
                    }, 3000);
                } else {
                    present("No Data Found !!", 3000)
                    setLoad(load)
                }
            })
            .catch(err => {
                present(err.message, 3000)
                setLoad(load)
            })
    }

    const handlePageClick = (selected: any) => {
        setPageIndex(selected.selected + 1)
    };

    const handlePageClickSub = (selected :any) => {
        setPageIndexSub(selected.selected + 1)
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonGrid  >
                        <IonRow>
                            <IonCol size='1'><Link to={"citizen"} onClick={clearData} className="back-button"><IonIcon src={arrowBackOutline} /></Link></IonCol>
                            <IonCol size='11'><IonTitle>{t('lan.MenuGrantDetails')}</IonTitle></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol size='3' ><IonLabel>{t('lan.lblLangAssembly')}</IonLabel></IonCol>
                        <IonCol size="9">
                            <Select
                                selectType={t('lan.lblAll')}
                                name='assembly'
                                values={data.assembly}
                                changes={changeEvent}
                                array={assemblyList}
                                optName="AS_SEAT_NM"
                                optValue="AS_SEAT_ID"
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3' ><IonLabel>{t('lan.lblLangYear')}</IonLabel></IonCol>
                        <IonCol size='9'>
                            <select name='year' value={data.year} onChange={changeEvent}>
                            <option value=''>{t('lan.lblAll')}</option>
                            {Array.isArray(year) && year.length > 0 ?
                                year.map((item: any, key: any) => {
                                    return (
                                        <option key={key} value={item.years}>{item.years}</option>
                                    )
                                }) : "No Data"
                            }
                        </select>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3' > <IonLabel>{t('lan.lblLangDisplayMode')}</IonLabel></IonCol>
                        <IonCol size='9'>
                            <select name='mode' value={data.mode} onChange={changeEvent}>
                                <option value=''>{t('lan.lblLangSelect')}</option>
                                <option value="Assembly Wise">Assembly Wise</option>
                                <option value="Ward Wise">WardWise</option>
                            </select>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3' ><IonLabel>{t('lan.lblLangSummaryDetails')}</IonLabel></IonCol>
                        <IonCol size='9'>
                            <select name='summary' value={data.summary} onChange={changeEvent}>
                                <option value=''>{t('lan.lblLangSelect')}</option>
                                <option value="Summary">Summary</option>
                                <option value="Details">Details</option>
                            </select>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton shape="round" fill="outline" onClick={getData}><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <Loader loading={load} click={() => setLoad(false)} />
                {/* Assembly Wise && Summary */}
                {data.mode === "Assembly Wise" && data.summary === "Summary" ? (
                    <IonGrid >
                        <div className='table-design'>
                            <tr>
                                <th>{t('lan.lblLangAssembly')}</th>
                                <th>{t('lan.lblLangYear')}</th>
                                <th>{t('lan.lblLangGrndTotal')}</th>
                                <th>{t('lan.lblLangViewDetails')}</th>
                                <th>{t('lan.lblLangTotalRecords')}</th>
                            </tr>
                            <tr>
                                <td style={{ color: 'red' }}><b> Total:  {TotalGrant}</b></td>
                            </tr>
                            {Array.isArray(value) && value.length >= 0 ? value.map((GrantList: any, key: any) => {
                                return (
                                    <tr key={key}>

                                        <td>{GrantList.Assm_ward}</td>
                                        <td>{GrantList.year}</td>
                                        <td>{GrantList.sum_grant}</td>
                                        <td onClick={() => grantsDetails(GrantList)}><IonLabel color='primary' style={{ textDecoration: 'underline' }}>Show</IonLabel></td>
                                        <td>{GrantList.summary_cnt}</td>
                                    </tr>
                                )
                            }) : "No Data Found"
                            }
                        </div>
                    </IonGrid>
                ) : ""}
                {/* Ward wise && Summary */}

                {data.mode === "Ward Wise" && data.summary === "Summary" ? (
                    <IonGrid >
                        <div className='table-design'>
                            <tr>
                                <th>{t('lan.lblLangMandal')}</th>
                                <th>{t('lan.lblLangYear')}</th>
                                <th>{t('lan.lblLangGrndTotal')}</th>
                                <th>{t('lan.lblLangViewDetails')}</th>
                                <th>{t('lan.lblLangTotalRecords')}</th>
                            </tr>
                            <tr>
                                <td style={{ color: 'red' }}><b> Total:  {TotalGrant}</b></td>
                            </tr>
                            {Array.isArray(value) && value.length >= 0 ? value.map((GrantList: any, key: any) => {
                                return (
                                    <tr key={key}>
                                        <td>{GrantList.Assm_ward}</td>
                                        <td>{GrantList.year}</td>
                                        <td>{GrantList.sum_grant}</td>
                                        <td onClick={() => grantsDetails(GrantList)}><IonLabel color='primary' style={{ textDecoration: 'underline' }}>Show</IonLabel></td>
                                        <td>{GrantList.summary_cnt}</td>
                                    </tr>
                                )
                            }) : "No Data Found"}
                        </div>
                    </IonGrid>
                ) : ""}

                {/* Assambly && Details */}
                {data.mode === "Assembly Wise" && data.summary === "Details" ?
                    (
                        <IonGrid >
                            <div className='table-design'>
                                <tr>
                                    <th>{t('lan.lblLangAssembly')}</th>
                                    <th>{t('lan.lblLangYear')}</th>
                                    <th>{t('lan.lblLangGrndTotal')}</th>
                                    <th>{t('lan.lblLangYojana')}</th>
                                    <th>{t('lan.lblLangWork')}</th>
                                    <th>{t('lan.lblLangDist')}</th>
                                    <th>{t('lan.lblLangVlgWard')}</th>
                                    <th>{t('lan.lblLangAddress')}</th>
                                    <th>{t('lan.lblLangStatus')}</th>
                                    <th>{t('lan.lblLangMobile')}</th>
                                    <th>{t('lan.lblLangName')}</th>
                                </tr>
                                <tr>
                                    <td style={{ color: 'red' }}><b> Total:  {TotalGrant}</b></td>
                                </tr>
                                {Array.isArray(value) && value.length >= 0 ? value.map((GrantList: any, key: any) => {
                                    return (
                                        <tr key={key}>
                                            <td>{GrantList.AC_NAME}</td>
                                            <td>{GrantList.year}</td>
                                            <td>{GrantList.GRANT_VALUE}</td>
                                            <td>{GrantList.SUBJECT_YOJANA}</td>
                                            <td>{GrantList.WORK_TYPE_CODE}</td>
                                            <td>{GrantList.DISTRICT}</td>
                                            <td>{GrantList.VILLAGE_WARD}</td>
                                            <td>{GrantList.ADDRESS}</td>
                                            <td>{GrantList.STATUS}</td>
                                            <td>{GrantList.MOBNO}</td>
                                            <td>{GrantList.FULL_NAME}</td>
                                        </tr>
                                    )
                                }) : "No Data Found"}
                            </div>
                        </IonGrid>
                    ) : ""
                }
                {/* Ward wis && Details */}

                {data.mode === "Ward Wise" && data.summary === "Details" ?
                    (
                        <IonGrid >
                            <div className='table-design'>
                                <tr>
                                    <th>{t('lan.lblLangVlgWard')}</th>
                                    <th>{t('lan.lblLangYear')}</th>
                                    <th>{t('lan.lblLangGrndTotal')}</th>
                                    <th>{t('lan.lblLangYojana')}</th>
                                    <th>{t('lan.lblLangWork')}</th>
                                    <th>{t('lan.lblLangDist')}</th>
                                    <th>{t('lan.lblLangAddress')}</th>
                                    <th>{t('lan.lblLangStatus')}</th>
                                    <th>{t('lan.lblLangMobile')}</th>
                                    <th>{t('lan.lblLangName')}</th>
                                </tr>
                                <tr>
                                    <td style={{ color: 'red' }}><b> Total:  {TotalGrant}</b></td>
                                </tr>
                                {Array.isArray(value) && value.length >= 0 ? value.map((GrantList: any, key: any) => {
                                    return (
                                        <tr key={key}>
                                            <td>{GrantList.Village_Ward}</td>
                                            <td>{GrantList.Grant_Assessment_year}</td>
                                            <td>{GrantList.GRANT_VALUE}</td>
                                            <td>{GrantList.Subject_Yojana}</td>
                                            <td>{GrantList.Work_Type_Code}</td>
                                            <td>{GrantList.District}</td>
                                            <td>{GrantList.Address}</td>
                                            <td>{GrantList.Status}</td>
                                            <td>{GrantList.Mobile}</td>
                                            <td>{GrantList.FullName}</td>
                                        </tr>
                                    )
                                }) : "No Data Found"}
                            </div>
                        </IonGrid>
                    ) : ""
                }
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
                ) : ""}

                <IonModal isOpen={showModal}>
                    <IonHeader>
                        <IonToolbar>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size='10'><IonTitle> Grant Details </IonTitle></IonCol>
                                    <IonCol size='2'><IonIcon src={closeCircleOutline} onClick={() => setShowModal(false)} /></IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonToolbar>
                    </IonHeader>


                    <div className='table-design'>

                        <tr>
                            <th>{t('lan.lblLangAssembly')}</th>
                            <th>{t('lan.lblLangYear')}</th>
                            <th>{t('lan.lblLangGrndTotal')}</th>
                            <th>{t('lan.lblLangYojana')}</th>
                            <th>{t('lan.lblLangWork')}</th>
                            <th>{t('lan.lblLangDist')}</th>
                            <th>{t('lan.lblLangVlgWard')}</th>
                            <th>{t('lan.lblLangAddress')}</th>
                            <th>{t('lan.lblLangStatus')}</th>
                            <th>{t('lan.lblLangMobile')}</th>
                            <th>{t('lan.lblLangName')}</th>
                        </tr>
                        <tr>
                            <td> Total:  {TotalGrant}</td>
                        </tr>
                        {/* <tr>
                            <th colspan="2" style="color:red;">Total Grant</th>
                            <th colspan="9" style="color:red;">{{lblLangGrndTotal}}</th>
                        </tr> */}

                        {Array.isArray(grant) && grant.length >= 0 ? grant.map((GrantList: any, key: any) =>
                        (
                            <tr key={key}>
                                <td>{GrantList.AC_NO}</td>
                                <td>{GrantList.year}</td>
                                <td>{GrantList.GRANT_VALUE}</td>
                                <td>{GrantList.SUBJECT_YOJANA}</td>
                                <td>{GrantList.WORK_TYPE_CODE}</td>
                                <td>{GrantList.DISTRICT}</td>
                                <td>{GrantList.VILLAGE_WARD}</td>
                                <td>{GrantList.ADDRESS}</td>
                                <td>{GrantList.STATUS}</td>
                                <td>{GrantList.MOBNO}</td>
                                <td>{GrantList.FULL_NAME}</td>
                            </tr>
                        )) : ""
                        }

                        {grant.length > 0 ? (
                            <ReactPaginate
                                previousLabel={'Prev'}
                                nextLabel={'Next'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={pageCountSub}
                                onPageChange={handlePageClickSub}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        ) : ""}

                    </div>
                </IonModal >

            </IonContent>
        </IonPage>
    )
}
export default GrantsDetails;