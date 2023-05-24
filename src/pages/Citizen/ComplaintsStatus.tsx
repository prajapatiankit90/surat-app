import { IonCard, IonIcon, IonContent, IonHeader, IonGrid, IonRow, IonCol, IonPage, IonTitle, IonToolbar, IonLabel, IonCardContent, IonButton, useIonToast, IonTextarea, IonItemDivider, useIonAlert, IonDatetimeButton, IonModal, IonDatetime } from '@ionic/react';
import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import axiosApi from '../../axiosApi';
import moment from 'moment'
import { arrowBackOutline, downloadOutline, saveOutline, searchOutline } from 'ionicons/icons';
import { useTranslation } from "react-i18next"
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Load';
import useDownLoad from '../../hooks/download.hook';

interface ComplaintsProps {
  startDate: any,
  toDate: any
}

const ComplaintsStatus: React.FC<ComplaintsProps> = () => {
  const { t } = useTranslation();
  const Uname = localStorage.getItem("loginUserName");
  const UMobile = localStorage.getItem("loginUserMblNo");
  const ULoginas = localStorage.getItem("loginas");

  const defaultState = {
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().endOf('month').format('YYYY-MM-DD')
  }
  
  const { downloadFilesFor } = useDownLoad();
  const [data, setData] = useState<any>([]);
  const [values, setValues] = useState(defaultState);
  const [load, setLoad] = useState(false);
  const [statusDe, setStatusDe] = useState(false);
  const [mpRemark, setMpRemark] = useState(false)
  const [finalRemark, setFinalRemark] = useState(false)
  const [selected, setSelected] = useState(false);
  const [fileSelected, setFileSelected] = useState<File>();
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);

  const [newData, setNewData] = useState({
    statusDes: '',
    MRemark: '',
    FRemark: ''
  })

  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();

  const changeEvent = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value })
    setNewData({ ...newData, [name]: value })
  }

  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const scrollToTop = () => {
    contentRef.current && contentRef.current.scrollToTop();
  };

  const clearData = () => {
    setValues({ ...defaultState })
    setData([]);
  }

  const getDate = async () => {
    setLoad(true)
    const ReqObj = {
      FROMDATE: moment(values?.startDate).format("DD-MM-YYYY"),
      TODATE: moment(values?.toDate).format("DD-MM-YYYY"),
      pLoginAs: ULoginas,
      pUserMobile: UMobile,
      PageIndex: pageIndex,
      PageSize: perPage
    }
    await axiosApi.post("GetComplaintList_Forionic", ReqObj)
      .then((res) => {        
        const Data = res.data.ComplaintSuggestionList;
        const Total = res.data.Total;
        console.log(Data)
        if (Data.length !== 0) {
          setPageCount(Math.ceil(Total / perPage));
          setData(Data);
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

  useEffect(() => {
    getDate()
  }, [pageIndex]);

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  };

  const compstsChange = async (item: any, status: any) => {
    await axiosApi.get("/SetComplaintStatus2?pComplaintId=" + item.COMPLAINT_ID + "&pCompStatusType=" + status + "&pName=" + Uname + "&pMobile=" + item.MOBNO + "&pFinalRemark=" + item.FINAL_REMARKS + "&pAsSeatNm=" + item.GRAM_PANCHAYAT)
      .then((res) => {
        const Resp = res.data
        if (Resp?.Msg_Code === 1) {
          getDate();
          present(Resp?.Msg_Value, 1000)
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  const changeStatus = async (comid: any) => {
    await axiosApi.get("/SetStatusNotes2?pComplaintId=" + comid + "&pStatusNotes=" + newData.statusDes + "&pName=" + Uname + "&pMobile=" + UMobile)
      .then(res => {
        const Resp = res.data
        if (Resp?.Msg_Code === 1) {
          getDate();
          setStatusDe(false)
          present(Resp?.Msg_Value, 1000)
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  const changeMP = async (compid: any) => {
    await axiosApi.get("/SetMPRemarks?pComplaintId=" + compid + "&pMPRemarks=" + newData.MRemark + "&pAdedby=" + ULoginas)
      .then(res => {
        const Resp = res.data
        if (Resp?.Msg_Code === 1) {
          getDate();
          setMpRemark(false)
          present(Resp?.Msg_Value, 1000)
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }
  const changeFinal = async (compid: any) => {
    await axiosApi.get("/SetFinalRemarks?pComplaintId=" + compid + "&pFnlRemark=" + newData.FRemark)
      .then(res => {
        const Resp = res.data
        if (Resp?.Msg_Code === 1) {
          getDate();
          setFinalRemark(false)
          present(Resp?.Msg_Value, 1000)
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }
  const _handleImageChange = (e: any) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setFileSelected(fileList[0]);
    setSelected(true);
  };

  const fileUpload = async (comid: any) => {
    const formData = new FormData();

    if (fileSelected) {
      formData.append("StatusComplimageUploadForm", fileSelected, fileSelected.name);
      formData.append("pComplaintId", comid)
      axiosApi.post("/UploadComplaintStatusFiles", formData, {})
        .then((res) => {
          const Resp = res.data
        if (Resp === 1) {
          getDate();
          present("Succesfully Upload Document", 1000)
        }
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
              <IonCol size='1'><Link to="/citizen" onClick={() => clearData()} className='back-button'><IonIcon src={arrowBackOutline} /></Link></IonCol>
              <IonCol size='11'><IonTitle>{t('lan.MenuComplenSituation')}</IonTitle></IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef} scrollEvents={true} className='page_content'>
        <IonGrid>
          <IonRow>
            <IonCol size='3'><IonLabel>{t('lan.lblLangFromDate')}</IonLabel></IonCol>
            <IonCol size='9'>
              {/* <IonInput type='date' name='startDate' value={values.startDate} onIonChange={changeEvent} /> */}
              <IonDatetimeButton className='dtpBtn' datetime='fdatetime'></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  color="tertiary"
                  id='fdatetime'
                  value={values?.startDate}
                  doneText="done"
                  name='startDate'
                  presentation='date'
                  onIonChange={changeEvent}
                ></IonDatetime>
              </IonModal>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'><IonLabel>{t('lan.lblLangToDate')}</IonLabel></IonCol>
            <IonCol size='9'>
              {/* <IonInput type='date' name='toDate' value={values.toDate} onIonChange={changeEvent} /> */}
              <IonDatetimeButton className='dtpBtn' datetime='todatebtn'></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  color="tertiary"
                  id='todatebtn'
                  value={values?.toDate}
                  doneText="done"
                  name='toDate'
                  presentation='date'
                  showDefaultTitle={true}

                  onIonChange={changeEvent}
                ></IonDatetime>
              </IonModal>

            </IonCol>
          </IonRow>
          <IonRow>
            <IonButton shape="round" expand='block' fill="outline" onClick={getDate} ><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton>
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />

        {Array.isArray(data) && data.length > 0 ?
          data.map((item: any, key: any) => {

             const imageArray = item?.COM_DOCUMENTS.split(",")

            return (
              <IonCard key={key}>
                <IonGrid>
                  <IonItemDivider color="primary">
                    <IonLabel><b>{t('lan.lblLangUserSection')}</b></IonLabel>
                  </IonItemDivider>

                  <IonCardContent className='complaint-card'>
                    <IonGrid>
                      <IonRow>
                        {/* <IonCol size='2'><IonLabel><b>{t('lan.lblLangName')}</b></IonLabel></IonCol> */}
                        <IonCol size='4'><IonLabel>{t('lan.lblLangName')}</IonLabel></IonCol>
                        <IonCol size='8'> {item?.NAME}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangComplaintId')}</IonLabel></IonCol>
                        <IonCol size='8'><IonLabel>{item?.COMPLAINT_ID}</IonLabel></IonCol>
                        {/* <IonCol size='1'>{item?.COMPLAINT_ID}</IonCol> */}
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangAssembly')}</IonLabel></IonCol>
                        <IonCol size='8'><IonLabel>{item?.AS_SEAT_NM}</IonLabel></IonCol>
                        {/* <IonCol size='3'>{item?.AS_SEAT_NM}</IonCol> */}
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangGramPanchayat')}</IonLabel></IonCol>
                        <IonCol size='8'>{item?.GRAM_PANCHAYAT}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangAddress')}</IonLabel></IonCol>
                        <IonCol size='8'>{item?.ADDRESS}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangPincode')}</IonLabel></IonCol>
                        <IonCol size='3'>{item?.PINCODE}</IonCol>

                        <IonCol size='2'><IonLabel>{t('lan.lblLangType')}</IonLabel></IonCol>
                        <IonCol size='3'>{item?.COM_TYPE}</IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangMobile')}</IonLabel></IonCol>
                        <IonCol size='8'>{item?.MOBNO}</IonCol>

                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangDescription')}</IonLabel></IonCol>
                        <IonCol size='8'>{item?.COM_DESC}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangAddedDate')}</IonLabel></IonCol>
                        <IonCol size='8'>{item?.COM_ADDED_DATETIME}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangAddedBy')}</IonLabel></IonCol>
                        <IonCol size='8'>{item?.COM_ADDEDBY}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'><IonLabel>{t('lan.lblLangAttachedFiles')}</IonLabel></IonCol>
                        <IonCol size='8'>
                          {imageArray.map((ele: any, key: any) => {
                            return (<IonIcon style={{color: 'black'}} key={key} src={downloadOutline} onClick={() => downloadFilesFor(process.env.REACT_APP_API_IMAGE + `complaint_docs/${ele}`, ele, "Complaint")} />
                            )
                          })}
                        </IonCol>
                      </IonRow>

                      <IonItemDivider color="medium">
                        <IonLabel><b>{t('lan.lblLangOfficeSection')}</b></IonLabel>
                      </IonItemDivider>
                      <IonRow>
                        <IonCol size='5'><IonLabel>{t('lan.lblLangLastUpdates')}</IonLabel></IonCol>
                        <IonCol size='7'>{item?.UPDATE_DATE}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='2'><IonLabel>{t('lan.lblLangStatus')}</IonLabel></IonCol>
                        <IonCol size='3'><IonLabel style={{ color: item?.COM_STATUS === "OPEN" ? 'yellow' ? item?.COM_STATUS === "INPROGRESS" ? 'Green' : 'orange' : 'red' : 'red' }}>{item?.COM_STATUS}</IonLabel></IonCol>
                        <IonCol size='4'><IonLabel color="primary" onClick={() =>
                          presentAlert({
                            header: 'Are you sure Change Status?',
                            cssClass: 'custom-alert',
                            buttons: [
                              {
                                text: 'No',
                                role: 'cancel',
                                cssClass: 'alert-button-cancel',
                              },
                              {
                                text: 'Yes',
                                role: 'confirm',
                                cssClass: 'alert-button-confirm',
                                handler: () => {
                                  compstsChange(item, 'INPROCESS')
                                },
                              },
                            ],
                          })
                        }>INPROCESS</IonLabel></IonCol>
                        <IonCol size='3'><IonLabel color="primary" onClick={() =>
                          presentAlert({
                            header: 'Are you sure Change Status?',
                            cssClass: 'custom-alert',
                            buttons: [
                              {
                                text: 'No',
                                role: 'cancel',
                                cssClass: 'alert-button-cancel',
                              },
                              {
                                text: 'Yes',
                                role: 'confirm',
                                cssClass: 'alert-button-confirm',
                                handler: () => {
                                  compstsChange(item, 'CLOSE')
                                },
                              },
                            ],
                          })
                        }>CLOSE</IonLabel></IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='6'><IonLabel color="primary" onClick={() => setStatusDe(prev => prev === key ? undefined : key)}>{t('lan.lblLangStatusDesc')}</IonLabel></IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="2"></IonCol>
                        <IonCol size='10'>{item?.STATUS_NOTES}</IonCol>
                      </IonRow>
                      {statusDe === key ? (
                        <IonRow>
                          <IonCol size='2'></IonCol>
                          <IonCol size='10'>
                            <>
                              <IonTextarea name="statusDes" value={newData.statusDes} onIonChange={changeEvent} />
                              <IonIcon className='showpass' style={{top:'-20%'}} src={saveOutline} onClick={() => changeStatus(item.COMPLAINT_ID)} />
                            </>
                          </IonCol>

                        </IonRow>
                      ) : ""}
                      <IonRow>
                        <IonCol size='4'><IonLabel color="primary" onClick={() => setMpRemark(prev => prev === key ? undefined : key)}>{t('lan.lblLangMPRemarks')}</IonLabel></IonCol>
                        <IonCol size='8' >{item?.MP_REMARKS}</IonCol>
                      </IonRow>
                      {mpRemark === key ? (
                        <IonRow>
                          <IonCol size='4'></IonCol>
                          <IonCol size='8'>
                            <>
                              <IonTextarea name="MRemark" value={newData.MRemark} onIonChange={changeEvent} />
                              <IonIcon className='showpass' style={{top:'-20%'}} src={saveOutline} onClick={() => changeMP(item.COMPLAINT_ID)} />
                            </>
                          </IonCol>
                        </IonRow>
                      ) : ""}
                      <IonRow>
                        <IonCol size='4'><IonLabel color="primary" onClick={() => setFinalRemark(prev => prev === key ? undefined : key)}>{t('lan.lblLangFinalRemarks')}</IonLabel></IonCol>
                        <IonCol size='8'>{item?.FINAL_REMARKS}</IonCol>
                      </IonRow>
                      {finalRemark === key ? (
                        <IonRow>
                          <IonCol size='4'></IonCol>
                          <IonCol size='8'>
                            <>
                              <IonTextarea name="FRemark" value={newData.FRemark} onIonChange={changeEvent} />
                              <IonIcon className='showpass' style={{top:'-20%'}} src={saveOutline} onClick={() => changeFinal(item.COMPLAINT_ID)} />
                            </>
                          </IonCol>
                        </IonRow>
                      ) : ""}

                      <IonRow>

                        <IonCol size='7'><input type='File' name='files' multiple={false} value={""} onChange={_handleImageChange} /></IonCol>
                        <IonCol size='5'><IonLabel color='primary' onClick={() => fileUpload(item.COMPLAINT_ID)}>{t('lan.lblLangFileUpload')}</IonLabel></IonCol>
                        {selected ? (
                          <span>File Name :{fileSelected?.name}</span>
                        ) : ""}
                      </IonRow>

                      <IonRow>
                        <IonCol size='3'><IonLabel>{t('lan.lblLangAttacfFile_Img')}</IonLabel></IonCol>
                        <IonCol size='9'><IonLabel onClick={() => downloadFilesFor(process.env.REACT_APP_API_IMAGE + `complaint_status_docs/${item?.STATUS_DOCS}`, item?.STATUS_DOCS, "STATUS COMPLAINT")} color="primary">{item.STATUS_DOCS}</IonLabel></IonCol>

                      </IonRow>

                    </IonGrid>
                  </IonCardContent>
                </IonGrid>
              </IonCard>
            )
          }) : ""}
        {data.length >= 10 ? (
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

export default ComplaintsStatus;