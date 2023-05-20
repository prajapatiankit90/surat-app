import React, { useEffect, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar, useIonToast, IonPopover } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import axiosApi from '../../axiosApi';
import { arrowBackOutline, addCircleOutline, searchOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';

const CastWiseVoters:React.FC =() =>{
    const { t } = useTranslation();
    const defaultState = {
        assem:'',
        booth:'',
        vState:'',
        cast:'',
        category: '',
        completed:'',
        notCompleted:''
    }

    const [present] = useIonToast()
    const [prevent] = useIonToast();
    const [assembly, setAssembly] = useState([]);
    const [booth, setBooth] = useState<any>([]);
    const [data, setData] = useState(defaultState);
    const [value, setValue] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const [nativeState, setNativeState]=useState<any>([]);
    const [cast, setCast]=useState<any>([]);
    const [addCaste, setAddCaste] = useState(false);
    //const [completed, setCompleted] = useState<any>([]);

    const Name = localStorage.getItem('loginas');
    const Num = localStorage.getItem('loginUserMblNo');
    const user = localStorage.getItem("loginUserName");

    useEffect(() => {
        getCaste()
      },[])

    useEffect(() => {
        axiosApi.get("/getAdminsAssemblyList?pLoginAs=" + Name + "&voterId=" + Num + "&pwd=" + Num)
        .then((res)=>{
                setAssembly(res.data);
        })
    },[])

    const changeEventBooth = (e:any) =>{
      setData({...data, assem:e.target.value});
      setBooth([]);
      setValue([]);
      setData({ ...data, assem: e.target.value, booth: ""});
      axiosApi.get("/GetBoothPRBoothList?pAsmList=" + e.target.value + " &pFlag=" + Name + "&pMobile=" + Num + "pWardId=")
        .then((res) => {
            const Data = JSON.parse(res.data)
            setBooth(Data);
        })
    }

    const changeEvent = (e: any) => {       
        setData({ ...data, booth: e.target.value });        
        setValue([])
    }

    const getData = () => {
        setValue([])
        axiosApi.get("/getCasteWiseVotersList2?pAssembly="+ data.assem + "&pBooth="+ data.booth + "&pSection=" +' '+ "&pLastName=")
        .then((res) => {
            const Data=JSON.parse(res.data)            

            setNativeState(Data.filter((item : any) => item.flag === "STATE"))            
            setCast(Data.filter((item : any) => item.flag === "CASTE"))
            
                
            const CastWiseArray = Data.filter((item : any) => item.flag === "CASTEWISELIST")
            
            if(CastWiseArray !== ""){
                // const NativeStateCntArry =Data.filter((item : any) => item.flag === "CASTEWISELIST"  && item.NATIVESTATE !== null);
                //  const NotCom=CastWiseArray.length - NativeStateCntArry.length;
              //   setCompleted(NativeStateCntArry.length)
                setValue(CastWiseArray);
                //console.log(CastWiseArray)
                
                for(let i =0; i < nativeState.length ; i++) {
                    setData({...data, vState: nativeState[i].NATIVESTATE} )
                }

                const StateCAte = Data.filter((item : any) => item.flag ==='STATE' || item.flag === 'CASTEWISELIST')

                 
                

                console.log("State",StateCAte)
                //  setData({ ...data, vState : Data[].NATIVESTATE completed: NativeStateCntArry.length });
                // const Data = JSON.parse(res.data);
                    const max = value.length + 10;
                    const min = max - 10;
                    const newData: any = []
                    for (let i = min; i < max; i++) {
                        newData.push(CastWiseArray[i]);
                    }
                    setValue([...value, ...newData]);
                    setLoad(false)                
                }
                else {
                    prevent("No data found!!",3000)
                  }
                  })
                  .catch((error) => {
                    prevent(error.message, 3000)
                  })           
            setLoad(load);
       // })        
    }

    console.log(nativeState)
        
    const openAddCastePopup = () => {
        setAddCaste(true);        
      }
    
      const changeEventCaste =(e:any)=>{
        const {name, value} = e.target
        setData({ ...data, [name]: value })
     }

    const AddNewCaste = () => {
        const vNewCast=data.cast;
        if(vNewCast === ""){
            prevent("Please Enter Caste Name",3000)
            return false;
        }
        // console.log(vNewCast)
        axiosApi.get("/AddNewCaste?pNewCaste="+ vNewCast )
        .then((res) => {
            if(res.data.DML_FLAG === 'SUCCESS'){
                present(res.data.MESSAGE, 3000)
                setAddCaste(false);
                getCaste();
                getData();
               
              }
            else if(res.data.DML_FLAG === 'ERROR'){
                present(res.data.MESSAGE, 3000)
            }
        })
    }

    const getCaste = () => {
        axiosApi.post("/getCasteList")
        .then((res) => {
          const Data = JSON.parse(res.data)       
          setCast(Data)
        })
      }

      const copyDetails = () =>{
        //   console.log(data.vState)
      }

    const clearData = () => {
        setData({ ...defaultState })
        setValue([])
    }

    return(
        <IonPage>
              <IonHeader>
                <IonToolbar>
                    <IonGrid  >
                        <IonRow>
                        <IonCol size='1'><Link to="/Utility" onClick={() =>clearData()} className='back-button'><IonIcon src={arrowBackOutline} /></Link></IonCol>
                            <IonCol size='11'><IonTitle>{t('lan.MenuCasteWiseVoters2')}</IonTitle></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader> 
            <IonContent fullscreen>
                <IonGrid>    
                    <IonRow>
                        <IonCol size="3"><IonLabel>{t('lan.lblLangAssembly')}</IonLabel></IonCol>
                        <IonCol size="9">
                          <IonSelect interface='popover' name='assem' value={data.assem} onIonChange={changeEventBooth}>
                            {Array.isArray(assembly) && assembly.length > 0 ?
                              assembly.map((item:any, key:any) =>{
                                    return(
                                        <IonSelectOption key={key} value={item.AS_SEAT_ID}>{item.AS_SEAT_NM}</IonSelectOption>
                                    )
                              }) : "No Data"
                            }
                          </IonSelect>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="3"><IonLabel>{t('lan.lblLangBoothNo')}</IonLabel></IonCol>
                        <IonCol size="9">
                            <IonSelect interface='popover' name='booth' value={data.booth} onIonChange={(e) => changeEvent(e)}>
                            {Array.isArray(booth) && booth.length > 0 ?
                              booth.map((item:any, key:any) => {
                                  return(
                                      <IonSelectOption key={key} value={item.BOOTH_NO}>{item.BOOTH_NO}-{item.BOOTH_NAME}</IonSelectOption>
                                  )
                              }) : "No Data" 
                          }
                          </IonSelect>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="4"><IonButton onClick={getData}><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton></IonCol>
                </IonRow>
                   {
                       value.length > 0 ? (
                        <IonRow>
                        <IonCol size="6" className='voter'><b> {t('lan.lblLangTotalHouse')} : {Array.isArray(value) && value.length}</b></IonCol>
                        <IonCol size="6" className='voter'><b> {t('lan.lblLangCompleted')} : {data.completed}</b></IonCol>
                        <IonCol size="6" className='voter'><b> {t('lan.lblLangNotCompleted')} : ''</b></IonCol>
                        </IonRow>                       
                       ) : ""                      
                   }              
                </IonGrid>               
                {load ? (<IonSpinner name='bubbles' />) : Array.isArray(value) && value.length > 0 ?
                     value.map((item: any, key: any) => {
                         return(
                            <div  key={key}>
                                <IonCard key={key}>
                                    {key}
                                    <IonCardContent className='complaint-card'>
                                        <IonGrid className='rowborder'>
                                           <IonRow>
                                               <IonCol size='4'><IonLabel><b>{t('lan.lblLangSection')}</b>: {item.SECTION_NO}</IonLabel></IonCol>
                                               <IonCol size='8'><IonLabel><b>{t('lan.lblHouseNo')}</b>: {item.HOUSE_NO}</IonLabel></IonCol>
                                           </IonRow>
                                           <IonRow>
                                               <IonCol size='4'><IonLabel><b>{t('lan.lblLangAddress')}</b></IonLabel></IonCol>
                                                <IonCol size='8'><IonLabel>{item.ADDRESS}</IonLabel></IonCol>
                                           </IonRow>
                                           <IonRow>
                                                <IonCol size='4'><IonLabel><b>{t('lan.lblLangLastName')}</b></IonLabel></IonCol>
                                                <IonCol size='8'><IonLabel>{item.SURNAME}</IonLabel></IonCol>
                                           </IonRow>
                                           <IonRow>
                                               <IonCol><IonLabel><b>{t('lan.lblLangTotalMatdar')}</b>: {item.CNT}</IonLabel></IonCol>
                                          </IonRow>
                                          <IonRow> 
                                              <IonCol size='4'><IonLabel><b>{t('lan.lblLangNativeState')}</b></IonLabel></IonCol>
                                              <IonCol size='8'>
                                              <IonSelect interface='popover'name='vState' value={data?.vState}>
                                                { Array.isArray(nativeState) && nativeState.length > 0 ? 
                                                    nativeState.map((item:any, key:any) => {
                                                        return (
                                                            <IonSelectOption key={key} value={item.ADDRESS}>{item.ADDRESS}</IonSelectOption>
                                                        )
                                                    }) :"No Data"
                                                }
                                              </IonSelect></IonCol>                                              
                                         </IonRow>                                         
                                         <IonRow>
                                            <IonCol size='9'><IonLabel position="floating" ><b>{t('lan.lblLangCaste')}</b></IonLabel>
                                            <IonIcon src={addCircleOutline} onClick={openAddCastePopup} />
                                                <IonSelect interface='popover' name='cast' value={data?.cast}>
                                                    {Array.isArray(cast) && cast.length > 0 ?
                                                      cast.map((item:any, key:any) =>{
                                                        return (
                                                            <IonSelectOption key={key} value={item.ADDRESS}>{item.ADDRESS}</IonSelectOption>
                                                        )
                                                     }) : "No Data"
                                                    }
                                               </IonSelect>
                                               
                                           </IonCol>
                                           <IonCol size='3'>
                                              <IonButton onClick={copyDetails}>{t('lan.lblLangCopy')}</IonButton>
                                           </IonCol>
                                         </IonRow>
                                         <IonRow>
                                            <IonCol size='9'>
                                                <IonLabel>{t('lan.lblLangCategory')}</IonLabel>
                                                      <IonSelect interface='popover' value={data?.category} name="category" onIonChange={changeEvent} >
                                                              <IonSelectOption value="Select">Select</IonSelectOption>
                                                              <IonSelectOption value="General">General</IonSelectOption>
                                                              <IonSelectOption value="OBC">ST</IonSelectOption>
                                                              <IonSelectOption value="SC">SC</IonSelectOption>
                                                              <IonSelectOption value="OBC">OBC</IonSelectOption>
                                                      </IonSelect>
                                          </IonCol>
                                          <IonCol size='3'>
                                              <IonButton>{t('lan.lblLangPaste')}</IonButton>
                                           </IonCol>
                                         </IonRow>
                                          {/* Add Designation && Caste Popup */}
                                         <IonPopover trigger="top-center" isOpen={addCaste} side='top' alignment='center' onDidDismiss={() => setAddCaste(false)}>
                                            <IonHeader>
                                               <IonToolbar  >
                                                  <IonCol size='10'><IonTitle>{t('lan.lblLangAddCaste')}</IonTitle></IonCol>
                                               </IonToolbar>
                                           </IonHeader>
                                           <IonContent>
                                               <IonGrid>
                                                   <IonRow>
                                                        <IonCol size='12'>
                                                        <IonInput name="cast" value={data.cast} onIonChange={changeEventCaste}/>
                                                        </IonCol>
                                                   </IonRow>
                                                   <IonRow>
                                                       <IonButton onClick={AddNewCaste}>{t('lan.lblLangSave')}</IonButton>
                                                       <IonButton onClick={() => setAddCaste(false)}>{t('lan.lblLangClose')}</IonButton>
                                                   </IonRow>
                                               </IonGrid>
                                           </IonContent>
                                          </IonPopover>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>
                            </div>
                         )
                     }) :""
                }
                  {value.length > 0 ? (
                     <IonButton onClick={getData}>Load More...</IonButton>
                    ) : ""}  
            </IonContent> 
        </IonPage>
    )
}

export default CastWiseVoters;