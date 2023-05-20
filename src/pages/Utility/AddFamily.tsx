import { IonButtons, IonButton, IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonPage, IonLabel, IonGrid, IonRow, IonCol, IonInput, IonIcon, IonCard, IonCardContent, useIonToast, IonLoading } from '@ionic/react';
import { useRef, useState } from 'react';
import { addCircleOutline, saveOutline, searchOutline } from 'ionicons/icons';
import axiosApi from '../../axiosApi';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Load';

interface ContainerProps {
    vid: any
}

const AddFamily: React.FC<ContainerProps> = (vid) => {
    const { t } = useTranslation();
    const defaultState = {
        acno: "",
        srno: "",
        boothNo: "",
        voterNo: "",
        fname: "",
        lname: "",
        relName: "",
        relLastName: ""
    }
    const modal = useRef<HTMLIonModalElement>(null);
    const [present] = useIonToast();
    const [showDetail, setShowDetail] = useState(false);
    const [data, setData] = useState(defaultState)
    const [value, setValue] = useState<any>([])
    const [load, setLoad] = useState(false);
    const [select, setSelect] = useState<any>({})
    const [chk, setChk] = useState<any>([])
    const [mobile, setMobile] = useState(false)
    const [newData, setnewData] = useState<any>({
        newMobile: ''
    })
    const [perPage] = useState(50);
    const [pageCount, setPageCount] = useState(0);
    const [pagination, setPagination] = useState<any>([]);

    const Role = localStorage.getItem('loginas')
    const Number = localStorage.getItem('loginUserMblNo')
    const userName = localStorage.getItem('loginUserName');

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
        setnewData({ ...newData, [name]: value })
    }

    function dismiss() {
        modal.current?.dismiss();
    }
    const searchDetails = async () => {
        setLoad(true)
        await axiosApi.get("/SearchVoterListForFamilyGroup?pAcNo=" + data.acno + "&pBoothNo=" + data.boothNo + "&pSerial=" + data.srno + "&pFname=" + data.fname + "&pMname=" + '' + "&pLname=" + data.lname + "&pVtrNo=" + data.voterNo + "&pvR_name=" + data.relName + "&pvR_Lname=" + data.relLastName + "")
            .then((res) => {
                const Resp = JSON.parse(res.data);
                const Data = JSON.parse(Resp?.data);


                if (res.data === "") {
                    present("No Data found", 3000)
                    setLoad(false)
                } else {
                    setPagination(Data)
                    const data = Data.slice(0, 50);
                    setPageCount(Math.ceil(Data.length / perPage));
                    setValue(data);
                    setLoad(false)
                    setShowDetail(true)
                    dismiss()
                }
            })
            .catch(err => {
                present(err.message, 3000)
                setLoad(false)
            })
    }

    const addMembers = (mVoter: any) => {
        setLoad(true)
        if (mVoter.length !== 0) {
            axiosApi.get("/AddVoterInFamilyGroup?pFmlyGrpHeadVtrId=" + vid.vid + "&pFmlyMmbrVtrId=" + mVoter)
                .then((res) => {
                    const Resp = res.data;
                    if (Resp.Msg_Code === 1) {
                        present(Resp?.Msg_Value, 3000)
                        setShowDetail(false)
                        setChk([])
                        setValue([])
                        setLoad(false)
                    }
                })
                .catch(err => {
                    present(err.message, 3000)
                    setLoad(false)
                })
        } else {
            present("Please Select any Member", 3000)
            setLoad(false)
        }
    }

    const addMultiple = (e: any, Voter: any) => {
        const { value, checked } = e.target
        setSelect({ ...select, [value]: checked });
        if (e.target.checked === true) {
            chk.push(Voter)
        } else {
            chk.pop(Voter)
        }
    }

    const AddMobile = (voter: any) => {
        if (newData.newMobile === "") {
            present("Please Enter Mobile No..", 3000)
        } else if (newData.newMobile.length < 10 || newData.newMobile.length > 10) {
            present("Enter 10 Digit Mobile No...", 3000)
        }
        else {
            axiosApi.get("/SaveFamilyGroupMblNo?pFmlyVtrId=" + voter + "&pFmlyVtrMobile=" + newData.newMobile + "&pFmlyVtrRelation=" + '' + "&pLoginAs=" + userName + "&pLoginMob=" + Number + "&pLoginRole=" + Role)
                .then((res) => {
                    const Resp = res.data
                    if (Resp.Msg_Code === 1) {
                        present(Resp?.Msg_Value, 3000)
                        setnewData({ newMobile: '' })
                        setMobile(false)
                        searchDetails()
                    }
                })
                .catch(err => {
                    present(err.message, 3000)
                    setLoad(false)
                })
        }
    }

    const handlePageClick = (selected: any) => {
        const pagesVisited = selected.selected * perPage;
        const lastSetData = pagesVisited + perPage;
        setValue(pagination.slice(pagesVisited, lastSetData));
        window.scroll(0, 0)
    };

    return (
        <div>
            <IonButton color="success" id="open-modal" >{t('lan.lblLanAddFmly')}<IonIcon color='success' src={addCircleOutline} /> </IonButton>
            <IonModal id="example-modal" ref={modal} trigger="open-modal">
                <IonContent>
                    <IonToolbar>
                        <IonTitle>{t('lan.lblLanAddFmly')}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton color="light" onClick={() => dismiss()}>
                                {t('lan.lblLangClose')}
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>

                    <IonGrid>
                        <IonRow>
                            <IonCol size='4'>
                                <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
                                <IonInput value={data.acno} name="acno" onIonChange={handleChange} />
                            </IonCol>
                            <IonCol size='4'>
                                <IonLabel>{t('lan.lblLangBoothNo')}</IonLabel>
                                <IonInput value={data.boothNo} name="boothNo" onIonChange={handleChange} />
                            </IonCol>
                            <IonCol size='4'>
                                <IonLabel>{t('lan.lblLangVoterSl')}</IonLabel>
                                <IonInput value={data.srno} name="srno" onIonChange={handleChange} />
                            </IonCol>
                        </IonRow>
                        <h4><span><IonLabel>{t('lan.lblLangOr')}</IonLabel></span></h4>
                        <IonRow>
                            <IonCol>
                                <IonLabel>{t('lan.lblLangVoterId')}</IonLabel>
                                <IonInput value={data.voterNo} name="voterNo" onIonChange={handleChange} />
                            </IonCol>
                        </IonRow>
                        <h4><span><IonLabel>{t('lan.lblLangOr')}</IonLabel></span></h4>
                        <IonRow>
                            <IonCol size='6'>
                                <IonLabel>{t('lan.lblLangFirstName')}</IonLabel>
                                <IonInput value={data.fname} name="fname" onIonChange={handleChange} />
                            </IonCol>
                            <IonCol size='6'>
                                <IonLabel>{t('lan.lblLangLastName')}</IonLabel>
                                <IonInput value={data.lname} name="lname" onIonChange={handleChange} />
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size='6'>
                                <IonLabel>{t('lan.lblLangRelName')}</IonLabel>
                                <IonInput value={data.relName} name="relName" onIonChange={handleChange} />
                            </IonCol>
                            <IonCol size='6'>
                                <IonLabel>{t('lan.lblLangRelSurName')}</IonLabel>
                                <IonInput value={data.relLastName} name="relLastName" onIonChange={handleChange} />
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonButton onClick={searchDetails}><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonModal>
            <Loader loading={load} click={() => setLoad(false)} />

            <IonModal isOpen={showDetail}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{t('lan.lblLangMemDet')}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowDetail(false)}>{t('lan.lblLangClose')}</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonButton onClick={() => addMembers(chk)}>{t('lan.lblLangAddSel')}</IonButton>
                    {Array.isArray(value) && value.length > 0 ? value.map((item: any, key: any) => {
                        return (
                            <IonCard key={key}>
                                <IonCardContent className='complaint-card'>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol size="3"><IonLabel>{t('lan.lblLangNo')}</IonLabel></IonCol>
                                            <IonCol size='3'> {key + 1}</IonCol>
                                            <IonCol size="3"><IonLabel>{t('lan.lblAll')}</IonLabel></IonCol>
                                            <IonCol size='3'><input type='checkbox' name='item.VOTERNO' value={item.VOTERNO} onChange={(e) => addMultiple(e, item.VOTERNO)} /></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size="3"><IonLabel>{t('lan.lblLangName')}</IonLabel></IonCol>
                                            <IonCol size='9'> {item.ENG_FULLNAME}</IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size="3"><IonLabel>{t('lan.lblLangRelName')}</IonLabel></IonCol>
                                            <IonCol size='9'> {item.REL_NAME} {item.REL_SURNAME}</IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size="3"><IonLabel>{t('lan.lblLangVoterId')}</IonLabel></IonCol>
                                            <IonCol size='9'> {item.VOTERNO}</IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size="3"><IonLabel color="primary" style={{ textDecoration: 'underline' }} onClick={() => setMobile(prev => prev === key ? undefined : key)}>{t('lan.lblLangMobile')}</IonLabel></IonCol>
                                            <IonCol size='9'>{item.MOBNO}</IonCol>
                                        </IonRow>
                                        {mobile === key ? (
                                            <>
                                                <IonRow>
                                                    <IonCol size='4'></IonCol>
                                                    <IonCol size='8'><IonInput type='number' name='newMobile' value={newData.newMobile} onIonChange={handleChange} /></IonCol>
                                                </IonRow>
                                                <IonIcon className='showpassnew' style={{ top: '65%' }} src={saveOutline} onClick={() => AddMobile(item.VOTERNO)} />
                                            </>
                                        ) : ""}
                                        <IonRow>
                                            <IonButton onClick={() => addMembers(item.VOTERNO)}>{t('lan.lblLangAddMem')}</IonButton>
                                        </IonRow>
                                    </IonGrid>
                                </IonCardContent>
                            </IonCard>)
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
            </IonModal>
        </div>
    );
};

export default AddFamily;
