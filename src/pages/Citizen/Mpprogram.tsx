import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonCard, IonIcon, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonSelect, IonSelectOption, IonButton, IonGrid, IonRow, IonCol, IonCardContent, IonInput, useIonToast, IonModal, IonTextarea, useIonAlert, IonDatetimeButton, IonDatetime } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axiosApi from '../../axiosApi';
import moment from "moment";
import { arrowBackOutline, closeCircleOutline, downloadOutline, searchOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Load';
import ReactPaginate from 'react-paginate';
import useDownLoad from '../../hooks/download.hook';
import { getAssembly } from '../../slice/assembly.slice';
import Select from '../../components/Select';

const MpProgram: React.FC = () => {
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const { t } = useTranslation();
    const history = useHistory()
    const defaultState = {
        fdate: moment(new Date).startOf('month').format("YYYY-MM-DD"),
        tdate: moment(new Date).format("YYYY-MM-DD"),
        address: "",
        assme: "",
        booth: "",
        progDate: new Date(),
        progTime: moment(new Date).format("HH:mm"),
        progTotime: moment(new Date).format("HH:mm"),
        inviteby: "",
        progDes: "",
        progOrg: "",
        progId: ""

    }

    const { downloadFilesFor } = useDownLoad();

    const [add, setAdd] = useState(false);
    const [data, setData] = useState<any>(defaultState);
    const [values, setValues] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const [assembly, setAssembly] = useState<any>([])
    const [flag, setFlag] = useState<string>();
    const [selected, setSelected] = useState(false);
    const [fileSelected, setFileSelected] = useState<File>();
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const Role: any = localStorage.getItem('loginas')
    const Name: any = localStorage.getItem('loginUserName')
    const Num: any = localStorage.getItem('loginUserMblNo')

    const changeEvent = (e: any) => {
        setValues([])
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const dispatch = useDispatch<any>()
    const { assemblyList } = useSelector((state: any) => state.assembly)
    useEffect(() => {
        dispatch(getAssembly())
    }, [dispatch])


    const clearDate = () => {
        setData({
            fdate: moment(new Date).startOf('month').format("YYYY-MM-DD"),
            tdate: moment(new Date).format("YYYY-MM-DD"),
            address: "",
            assme: "",
            booth: "",
            progDate: moment(new Date).format("YYYY-MM-DD"),
            progTime: moment(new Date).format("HH:mm"),
            progTotime: moment(new Date).format("HH:mm"),
            inviteby: "",
            progDes: "",
            progOrg: "",
            progId: ""
        })
        setValues([]);
    }
    useEffect(() => {
        axiosApi.get("/getAdminsAssemblyList?pLoginAs=" + Role + "&voterId=" + Num + "&pwd=" + Num)
            .then((res) => {
                const Data = res.data;
                setAssembly(Data);
            })
            .catch(err => {
                console.error(err.message)
            })
    }, [])

    const _handleImageChange = (e: any) => {
        const fileList = e.target.files;
        if (!fileList) return;
        setFileSelected(fileList[0]);
        setSelected(true);
    };

    // useEffect(() => {
    //     getData()
    // }, [pageIndex])

    // Get MP Program LIST
    const getData = async () => {
        setLoad(!load)
        let ReqObj = {
            PageIndex: pageIndex,
            PageSize: perPage,
            From_Date: moment(data?.fdate).format("DD-MM-YYYY"),
            ToDate: moment(data?.tdate).format("DD-MM-YYYY")
        }
        await axiosApi.post("MpProgramList_ForIonic", ReqObj)
            .then((res) => {
                const Data = res.data.MpProgrammsList;
                const Total = res.data.Total;
                if (Data.length !== 0) {
                    setPageCount(Math.ceil(Total / perPage));
                    setValues(Data);
                    setLoad(false);
                } else {
                    presentToast("No Data Found...", 3000);
                    setLoad(false);
                }
            })
    }

    const handlePageClick = (selected: any) => {
        setPageIndex(selected.selected + 1)
    };



    // Save MP Program
    const Save = async (flag: any, item: any) => {
        if (data.address === "" && flag !== "DELETE") {
            presentToast('Address is required', 3000);
        }
        else if (data.assme === "" && flag !== "DELETE") {
            presentToast('Assembly is required', 2000);
        }
        else if (data.booth === "" && flag !== "DELETE") {
            presentToast('Booth is required', 2000);
        }
        else if (data.progDate === "" && flag !== "DELETE") {
            presentToast('Please Enter Programme Date..!', 2000);
        }
        else if (data.progTime === "" && flag !== "DELETE") {
            presentToast('Please Enter Programme Time (Starting Time)..!', 2000);
        }
        else if (data.progTotime === "" && flag !== "DELETE") {
            presentToast('Please Enter Programme Time (End Time)..!', 2000);
        }
        else if (data.inviteby === "" && flag !== "DELETE") {
            presentToast('Invited By is required..!', 2000);
        }
        else if (data.progOrg === "" && flag !== "DELETE") {
            presentToast('Please Enter Programme Organization Details.!', 2000);
        }
        else if (data.progDes === "" && flag !== "DELETE") {
            presentToast('Please Enter Programme Description Details.!', 2000);
        }
        else {
            const formData = new FormData();

            if (fileSelected) {
                formData.append("PROGRAMM_ATTACHED_FILE", fileSelected, fileSelected.name);
            }
            formData.append("PROGRAMM_FLAG", flag);
            formData.append("PROGRAMM_ID", flag === 'UPDATE' ? data.progId : flag === 'DELETE' ? item?.PROGRAMM_ID : '');
            formData.append("PROGRAMM_AC_NO", data?.assme);
            formData.append("PROGRAMM_BOOTH", data?.booth);
            formData.append("PROGRAMM_DATE", moment(data.progDate).format("DD-MM-YYYY"));
            formData.append("PROGRAMM_TO_TIME", data?.progTotime);
            formData.append("PROGRAMM_FROM_TIME", data?.progTime);
            formData.append("PROGRAMM_INVITED_BY", data?.inviteby);
            formData.append("PROGRAMM_ORGANIZED", data?.progOrg);
            formData.append("PROGRAMM_ADDRESS", data?.address);
            formData.append("PROGRAMM_DETAILS", data?.progDes);
            formData.append("ADDED_BY", Name);
            formData.append("ADDED_MOB", Num);

            await axiosApi.post("/SaveMpProgramms", formData, {})
                .then((res) => {
                    const Resp = res.data
                    if (Resp?.Msg_Code === 1) {
                        presentToast(Resp?.Msg_Value, 2000);
                        Close();
                    }                     
                })
                .catch(err => {
                    presentToast(err.message, 3000)
                    setLoad(false)
                })
            clearDate()
        }
    }

    const Close = () => {
        clearDate()
        setFlag('')
        setAdd(false)
        getData()
    }
    const CloseModel = () => {
        clearDate()
        setFlag('')
        setAdd(false)
        getData()
    }

    function dateString2Date(dateString: any) {
        const dt = dateString.split(/\-|\s/);
        return new Date(dt.slice(0, 3).reverse().join('-') + ' ' + dt[3]);
    }

    // Get Data and set values in data state for update program
    const edit = (item: any) => {
        const Dateformate = dateString2Date(item.PROG_DATE)

        
        
        setFlag('EDIT');
        setAdd(true)
        setData({
            ...data,
            address: item?.PROG_ADDRESS,
            assme: item?.PROG_ACNO,
            booth: item?.PROG_BOOTH,
            progDate: moment(flag !== 'EDIT' ? item.PROG_DATE : new Date()).format("YYYY-MM-DD"),
            progTime: item?.PROG_FROM_TIME,
            progTotime: item?.PROG_TO_TIME,
            inviteby: item?.PROG_INVITEBY,
            progOrg: item?.PROG_ORGBY,
            progDes: item?.PROG_DESC,
            progId: item?.MP_PROG_ID
        })
    }
    // Remove Mp Program by particular Id
    const DeleteProgram = async (prog_id: any) => {
        await axiosApi.get("DeleteMpPrograms?pMpprogramId=" + prog_id)
            .then((res) => {
                const Resp = res.data
                if (Resp.Msg_Code === 1) {
                    presentToast(Resp.Msg_Value, 3000)
                    getData()
                }
            })
            .catch((err) => {
                presentToast(err.message, 3000)

            })
    }


    const AddProram = () => {
        setAdd(true);
        clearDate();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonGrid  >
                        <IonRow>
                            <IonCol size='1'><IonIcon src={arrowBackOutline} onClick={() => history.replace("/citizen")} /></IonCol>
                            <IonCol size='11'><IonTitle>{t('lan.MenuMPsProgram')}</IonTitle></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangFromDate')}</IonLabel></IonCol>
                        <IonCol size='9'>                          
                            <IonDatetimeButton className='dtpBtn' datetime="fdatetime"></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                                <IonDatetime
                                    color="warning"
                                    id="fdatetime"
                                    value={data?.fdate}
                                    doneText="done"
                                    name="fdate"
                                    presentation='date'
                                    showDefaultTitle={true}
                                    onIonChange={changeEvent}
                                ></IonDatetime>
                            </IonModal>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangToDate')}</IonLabel></IonCol>
                        <IonCol size='9'>                          
                            <IonDatetimeButton className='dtpBtn' datetime="tdatetime"></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                                <IonDatetime
                                    color="warning"
                                    id="tdatetime"
                                    value={data?.tdate}
                                    doneText="done"
                                    name="tdate"
                                    presentation='date'
                                    showDefaultTitle={true}
                                    onIonChange={changeEvent}
                                ></IonDatetime>
                            </IonModal>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='6'><IonButton shape="round" fill="outline" onClick={() => getData()}><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton></IonCol>
                        <IonCol size='6'><IonButton shape="round" fill="outline" color='danger' onClick={() => AddProram()} >{t('lan.lblLangAdd')}</IonButton></IonCol>
                    </IonRow>

                </IonGrid>
                <IonModal isOpen={add} backdropDismiss={false} >
                    <IonHeader>
                        <IonToolbar  >
                            <IonGrid>
                                <IonRow>
                                    <IonCol size='11'><IonTitle>{flag === 'EDIT' ? t('lan.lblEditMpProgram') : t('lan.lblheaderSetProgramme')} { }</IonTitle></IonCol>
                                    <IonCol size='1'><IonIcon src={closeCircleOutline} onClick={() => CloseModel()} /></IonCol>
                                </IonRow>
                            </IonGrid>

                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonGrid >
                            <IonRow>
                                <IonCol size='4'><IonLabel>{t('lan.lblLangAddress')}</IonLabel> </IonCol>
                                <IonCol size='8'><IonTextarea name='address' value={data.address} onIonChange={changeEvent} /></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4' ><IonLabel>{t('lan.lblLangAssembly')}</IonLabel></IonCol>
                                <IonCol size="8">                                    
                                    <select name='assme' value={data.assme} onChange={changeEvent}>
                                        <option value=''>{t('lan.lblLangSelect')}</option>
                                        {Array.isArray(assemblyList) && assemblyList.length > 0 ?
                                            assemblyList.map((item: any, key: any) => {
                                                return (
                                                    <option key={key} value={item.AS_SEAT_ID}>{item.AS_SEAT_NM}</option>
                                                )
                                            }) : "No Data"
                                        }
                                    </select>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4'><IonLabel>{t('lan.lblLangBoothNo')}</IonLabel></IonCol>
                                <IonCol size='8'><IonInput placeholder="For multi booth type like 12,15" value={data.booth} name="booth" onIonChange={changeEvent} /></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4'><IonLabel>{t('lan.lblLangDate')}</IonLabel></IonCol>
                                <IonCol size='8'>
                                    <IonDatetimeButton className='dtpBtn' datetime='datetime'></IonDatetimeButton>
                                    <IonModal keepContentsMounted={true}>
                                        <IonDatetime
                                            color="tertiary"
                                            id='datetime'
                                            value={data?.progDate}
                                            doneText="done"
                                            name='progDate'
                                            presentation='date'
                                            showDefaultTitle={true}
                                            onIonChange={changeEvent}
                                        ></IonDatetime>
                                    </IonModal>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4'><IonLabel>{t('lan.lblLangFromTime')}</IonLabel></IonCol>
                                <IonCol size='8'>
                                    <IonInput type='time' name='progTime' value={data.progTime} onIonChange={changeEvent} />
                                    {/* <Datetime id='pfDateTime' change={changeEvent} names="progTime" values={data?.progTime} present='time' /> */}
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4'><IonLabel>{t('lan.lblLangToTime')}</IonLabel></IonCol>
                                <IonCol size='8'><IonInput type='time' name='progTotime' value={data.progTotime} onIonChange={changeEvent} /></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4'><IonLabel>{t('lan.lblLangInvitedBy')}</IonLabel></IonCol>
                                <IonCol size='8'><IonInput name='inviteby' value={data.inviteby} onIonChange={changeEvent} /></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4'><IonLabel>{t('lan.lblLangOrganization')}</IonLabel></IonCol>
                                <IonCol size='8'><IonInput name='progOrg' value={data.progOrg} onIonChange={changeEvent} /></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4'><IonLabel>{t('lan.lblLangProgDesc')}</IonLabel></IonCol>
                                <IonCol size='8'><IonTextarea name='progDes' value={data.progDes} onIonChange={changeEvent} /></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='3'><IonLabel>{t('lan.lblLangFileUpload')}</IonLabel></IonCol>
                                <IonCol size='9'><input type='File' name='files' multiple={false} value={""} onChange={_handleImageChange} /></IonCol>
                                {selected ? (
                                    <span>File Name :{fileSelected?.name}</span>
                                ) : ""}
                            </IonRow>

                            <IonRow>
                                <IonCol size="4">
                                    <IonButton fill='outline' onClick={() => flag === 'EDIT' ? Save('UPDATE', data) : Save('SAVE', '')}> {flag === 'EDIT' ? t('lan.lblLangEdit') : t('lan.btnSave')}</IonButton>
                                </IonCol>
                                <IonCol size="4">
                                    <IonButton color="danger" onClick={CloseModel}>{t('lan.lblLangClose')}</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonContent>
                </IonModal>
                <Loader loading={load} click={() => setLoad(false)} />
                {Array.isArray(values) && values.length > 0 ?
                    values.map((item: any, key: any) => {
                        return (
                            <IonCard key={key} className="card">
                                <IonCardContent className='complaint-card'>
                                    <IonGrid className='rowborder'>
                                        <IonRow>
                                            <IonCol size='2'>
                                                <span className='numberCircle'><b>{key + 1}</b></span></IonCol>
                                            <IonCol size="2"><IonLabel><b>{t('lan.lblLangDate')}</b> </IonLabel></IonCol>
                                            <IonCol size='7'>
                                                <IonLabel>: { moment(item?.PROG_DATE).format("DD-MM-YYYY")}   </IonLabel>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size="2"></IonCol>
                                            <IonCol size="2"><IonLabel><b>{t('lan.lblLangTime')}</b></IonLabel></IonCol>
                                            <IonCol size="7"><IonLabel>{item?.PROG_FROM_TIME} - {item?.PROG_TO_TIME}</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                    <IonGrid className='rowborder'>
                                        <IonRow>
                                            <IonCol size='4'><IonLabel><b>{t('lan.lblLangPlace')}</b></IonLabel></IonCol>
                                            <IonCol size='8'><IonLabel>{item?.PROG_ADDRESS}</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size='4'><IonLabel><b>{t('lan.lblLangInvitedBy')}</b></IonLabel></IonCol>
                                            <IonCol size='8'><IonLabel>{item?.PROG_INVITEBY}</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size='4'><IonLabel><b>{t('lan.lblLangOrganization')}</b></IonLabel></IonCol>
                                            <IonCol size='8'><IonLabel>{item?.PROG_ORGBY}</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size='4'><IonLabel><b>{t('lan.lblLangDescription')}</b></IonLabel></IonCol>
                                            <IonCol size='8'><IonLabel>{item?.PROG_DESC}</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size='4'><IonLabel><b>{t('lan.lblLangAssembly')}</b></IonLabel></IonCol>
                                            <IonCol size='8'><IonLabel>{item?.PROG_ACNO}</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size='4'><IonLabel><b>{t('lan.lblLangBoothNo')}</b></IonLabel></IonCol>
                                            <IonCol size='8'><IonLabel>{item?.PROG_BOOTH}</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size='4'><IonLabel>{t('lan.lblLangAttacfFile_Img')}</IonLabel></IonCol>
                                            <IonCol size='8'><IonIcon src={downloadOutline} onClick={() => downloadFilesFor(process.env.REACT_APP_API_IMAGE + `/MpAttachedFiles/${item?.PROG_DOCUMENT}`, item?.PROG_DOCUMENT, 'MP PROGRAM')} color="primary" /></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                    <IonGrid className='rowborder'>
                                        <IonRow>
                                            <IonCol size='6'><IonButton shape="round" fill="outline" onClick={() => edit(item)}>{t('lan.lblLangEdit')}</IonButton></IonCol>
                                            {/* <IonCol size='6'><IonButton shape="round" fill="outline" color='danger' onClick={() => Save('DELETE',item)} >{t('lan.lblRemove')}</IonButton></IonCol> */}
                                            <IonCol size='6'><IonButton shape="round" fill="outline" color='danger' onClick={() =>
                                                presentAlert({
                                                    header: 'Are You Sure You Want To Delete This Record..?',
                                                    cssClass: 'custom-alert',
                                                    buttons: [
                                                        {
                                                            text: 'No',
                                                            cssClass: 'alert-button-cancel',
                                                        },
                                                        {
                                                            text: 'Yes',
                                                            role: 'confirm',
                                                            cssClass: 'alert-button-confirm',
                                                            handler: () => {
                                                                DeleteProgram(item?.MP_PROG_ID)
                                                            }
                                                        },
                                                    ],
                                                })
                                            } >{t('lan.lblRemove')}

                                            </IonButton></IonCol>
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

export default MpProgram