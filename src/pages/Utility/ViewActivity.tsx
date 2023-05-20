import {
  useIonToast,
  IonLabel,
  IonInput,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonCardContent,
  IonModal,
  IonItemDivider,
  IonLoading
} from '@ionic/react'
import { useEffect, useRef, useState } from 'react'
import { closeCircleOutline } from 'ionicons/icons'
import axiosApi from '../../axiosApi'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import Loader from '../../components/Load'
import { useDispatch, useSelector } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'
import Select from '../../components/Select'

interface ContainerProps {
  vid: any
  islock: any
}

const ViewActivity: React.FC<ContainerProps> = vid => {
  const { t } = useTranslation()
  const defaultState = {
    designation: '',
    caste: '',
    mobileNo: '',
    whatsappNo: '',
    address: '',
    party: '',
    birthday: '',
    anniverasary: '',
    post: '',
    email: '',
    voterid: '',
    acno: '',
    boothNo: '',
    pageNo: '',
    srNo: '',
    adharNo: '',
    bloodGroup: '',
    facebook: '',
    instagram: '',
    categoryName: '',
    assemblyid: '',
    wardid: '',
    village: '',
    shaktiid: '',
    boothid: '',
    itemName: '',
    subItem: '',
    remark: '',
    bene_id: '',
    bene_name: '',
    bene_ac_name: '',
    bene_ward_name: '',
    bene_shakti_name: '',
    bene_booth_name: '',
    votername: '',
    lock: ''
  }
  const [present] = useIonToast()
  const [data, setData] = useState<any>(defaultState)
  const [showEditActivity, setShowEditActivity] = useState(false)
  const [flag, setFlag] = useState<string>()
  const [assembly, setAssembly] = useState<any>([])
  const [boothList, setBoothList] = useState<any>([])
  const [ward, setWard] = useState<any>([])
  const [shakti, setShakti] = useState<any>([])
  const [city, setCity] = useState<any>([])
  const [viewActivity, setViewActivity] = useState<any>([])
  const [category, setCategory] = useState<any>([])
  const [items, setItems] = useState<any>([])
  const [subItem, setSubItem] = useState<any>([])
  const [load, setLoad] = useState(false)

  const Role = localStorage.getItem('loginas')
  const Number = localStorage.getItem('loginUserMblNo')
  const userName = localStorage.getItem('loginUserName')

  const activitymodal = useRef<HTMLIonModalElement>(null)
  const addactivitymodal = useRef<HTMLIonModalElement>(null)

  function dismiss () {
    activitymodal.current?.dismiss()
  }
  const activityDismiss = () => {
    addactivitymodal.current?.dismiss()
    setData({ ...defaultState })
  }

  const EditActivityDismiss = () => {
    setShowEditActivity(false)
    setData({ ...defaultState })
  }
  // 12/12/2022 Kiran bhai change

  const changeAssembly = (e: any) => {
    if (e.target.value !== '') {
      setData({ ...data, assemblyid: e.target.value })
      getWardList(e.target.value)
      getShkList(e.target.value, '')
      getBoothList(e.target.value, '', '', '', 'VILLAGE')
      getBoothList(e.target.value, '', '', '', 'BOOTH')
      setData({
        ...data,
        assemblyid: e.target.value,
        wardid: '',
        shaktiid: '',
        boothid: ''
      })
    } else {
      setWard([])
      setBoothList([])
      setShakti([])
      setData({
        ...data,
        assemblyid: '',
        wardid: '',
        boothid: '',
        shaktiid: ''
      })
    }
  }

  const changeWard = (e: any, AcNo: any) => {
    if (e.target.value !== '') {
      setData({ ...data, assemblyid: AcNo, wardid: e.target.value })
      getWardList(AcNo)
      getShkList(AcNo, e.target.value)
      getBoothList(AcNo, e.target.value, '', '', 'VILLAGE')
      getBoothList(AcNo, e.target.value, '', '', 'BOOTH')
    } else {
      setBoothList([])
      setShakti([])
      setData({ ...data, wardid: '', boothid: '', shaktiid: '' })
    }
  }

  const changeShaktikendra = (e: any, AcNo: any, WardMasNo: any) => {
    if (e.target.value !== '') {
      setData({
        ...data,
        assemblyid: AcNo,
        wardid: WardMasNo,
        shaktiid: e.target.value
      })
      getBoothList(AcNo, WardMasNo, e.target.value, '', 'VILLAGE')
      getBoothList(AcNo, WardMasNo, e.target.value, '', 'BOOTH')
    } else {
      setBoothList([])
      setData({ ...data, boothid: '', shaktiid: '' })
    }
  }

  const changeCity = (e: any, AcNo: any, WardMasNo: any, ShaktiNo: any) => {
    if (e.target.value !== '') {
      setData({
        ...data,
        assemblyid: AcNo,
        wardid: WardMasNo,
        shaktiid: ShaktiNo,
        village: e.target.value
      })

      getBoothList(AcNo, WardMasNo, ShaktiNo, e.target.value, 'BOOTH')
    } else {
      setBoothList([])
      setData({ ...data, boothid: '', village: '' })
    }
  }

  const changeBooth = (e: any) => {
    setData({ ...data, boothid: e.target.value })
  }

  const getWardList = (AcNo: any) => {
    axiosApi
      .get(
        'GetAssemblyWiseWardByUserLoginLevel?pUserLevel=' +
          Role +
          ' &pUserMblNo=' +
          Number +
          '&pAcNo=' +
          AcNo
      )
      .then(res => {
        const Resp = JSON.parse(res.data)
        const Data = JSON.parse(Resp.data)
        if (Resp.error === false) {
          setWard(Data)
        } else {
          present(Resp.msg, 3000)
        }
      })
      .catch(err => {
        present(err.message, 3000)
      })
  }
  const getShkList = (AcNo: any, WardMasNo: any) => {
    axiosApi
      .get(
        'GetShkListByUserLoginLevel?pUserLevel=' +
          Role +
          ' &pUserMblNo=' +
          Number +
          '&pAcNo=' +
          AcNo +
          '&pWardMasNo=' +
          WardMasNo
      )
      .then(res => {
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp.data)
          if (Resp.error === false) {
            setShakti(Data)
          } else {
            present(Resp.msg, 3000)
          }
        }
      })
      .catch(err => {
        present(err.message, 3000)
      })
  }

  const getBoothList = (
    AcNo: any,
    WardMasNo: any,
    ShkMasId: any,
    VlgNm: any,
    flag: any
  ) => {
    axiosApi
      .get(
        'GetVillageBoothListByUserLoginLevel?pUserLevel=' +
          Role +
          ' &pUserMblNo=' +
          Number +
          '&pAcNo=' +
          AcNo +
          '&pWardMasNo=' +
          WardMasNo +
          '&pShkMasId=' +
          ShkMasId +
          '&pVlgNm=' +
          VlgNm +
          '&pFlag=' +
          flag
      )
      .then(res => {
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp?.data)
          if (flag === 'VILLAGE') {
            if (res.data !== '') {
              setCity(Data)
            }
          }
          if (flag === 'BOOTH') {
            setBoothList(Data)
          }

          if (res.data.length === 0) {
            if (flag === 'VILLAGE') {
              // alert('City Details Are Not Available')
            }
            if (flag === 'BOOTH') {
              present('Booth Details Are Not Available', 3000)
            }
          }
        }

        // if (res.data.length > 0) {
        //     if (res.data !== "") {
        //         const Data = JSON.parse(res.data);
        //         if (flag === 'BOOTH') {
        //             setBoothList(Data)
        //         }
        //     }
        // }

        // if (res.data.length === 0) {
        //     if (res.data !== "") {
        //         if (flag === 'BOOTH') {
        //             alert('Booth Details Are Not Available')
        //             setBoothList([])
        //         }
        //     }
        // }
      })
      .catch(err => {
        present(err.message, 3000)
      })
  }

  // Get Assembly
  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly)
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch])

  // get beneficirya Category
  useEffect(() => {
    axiosApi
      .post('/GetBeneficiryCategory')
      .then(res => {
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp.data)
          if (Resp.error === false) {
            setCategory(Data)
          } else {
            present(Resp.msg, 3000)
          }
        }
      })
      .catch(err => {
        present('GetBeneficiryCategory' + err.message, 3000)
      })
  }, [])

  const changeCategory = (e: any, flag: any) => {
    setData({ ...data, categoryName: e.target.value, itemName: '' })
    setItems([])
    setSubItem([])
    getItemList(flag, e.target.value)
  }

  const getItemList = (flag: any, categoryName: any) => {
    axiosApi
      .get(
        '/GetBeneficiryItemDetailsByCategory?pFlag=' +
          flag +
          '&pItemCategory=' +
          categoryName +
          '&pPrntItemType=' +
          '' +
          ''
      )
      .then(res => {
        if (res.data != '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp.data)
          if (Resp.error === false) {
            setItems(Data)
          } else {
            present(Resp.msg, 3000)
          }
        }
      })
      .catch(err => {
        present('ITEM' + err.message, 3000)
      })
  }

  const changeItem = (e: any, flag: any) => {
    setData({ ...data, itemName: e.target.value, subItem: '' })
    setSubItem([])
    getSubItem(flag, e.target.value, data?.categoryName)
  }

  const getSubItem = (flag: any, itemName: any, categoryName: any) => {
    axiosApi
      .get(
        '/GetBeneficiryItemDetailsByCategory?pFlag=' +
          flag +
          '&pItemCategory=' +
          categoryName +
          '&pPrntItemType=' +
          itemName
      )
      .then(res => {
        if (res.data != '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp.data)
          if (Resp.error === false) {
            setSubItem(Data)
          } else {
            present(Resp.msg, 3000)
          }
        }
      })
      .catch(err => {
        present('SubItem' + err.message, 3000)
      })
  }
  // Save Activity
  const SaveActivity = (flag: any, name: any) => {
    if (data.mobileNo === null && flag != 'DELETE') {
      present('Please Enter Mobile No..!', 3000)
      return false
    } 
    if ((flag !== 'DELETE' && data.mobileNo !== null )) {
      if(data?.mobileNo.length < 10 || data?.mobileNo.length > 10) {
      present('Please Enter 10 Digit Mobile No.', 3000)
      return false
    } 
}
    if (data.categoryName === '' && flag != 'DELETE') {
      present('Please Select Category', 3000)
      return false
    } 
    if (data.assemblyid === '' && flag != 'DELETE' && data.itemName !== 'WARD BODY') {
      present('Please Select Assembly', 3000)
      return false
    } 
    if (data.itemName !== 'ASSEMBLY BODY' && data.itemName !== 'BOOTH BODY' && data.itemName !== 'SHAKTIKENDRA BODY' && data.wardid === '' && flag != 'DELETE' ) {
      present('Please Select Ward', 3000)
      return false
    } 
    if (data.itemName !== 'ASSEMBLY BODY' && data.itemName !== 'WARD BODY' && data.itemName !== 'BOOTH BODY' && data.shaktiid === '' && flag !== 'DELETE') { 
      present('Please Select ShaktiKendra', 3000)
      return false
    } 
    if (data.itemName !== 'ASSEMBLY BODY' && data.itemName !== 'WARD BODY' && data.itemName !== 'SHAKTIKENDRA BODY' && data.boothid === '' && flag !== 'DELETE') {
      present('Please Select Booth List', 3000)
      return false
    } 

      const dataid = vid.vid
      const asse_name =
        data.itemName !== 'WARD BODY'
          ? assembly.find((item: any) => item.AS_SEAT_ID == data.assemblyid)
          : ''
      const ward_id =
        data.itemName !== 'ASSEMBLY BODY' &&
        data.itemName !== 'BOOTH BODY' &&
        data.itemName !== 'SHAKTIKENDRA BODY'
          ? ward.find((item: any) => item.WARD_MAS_ID == data.wardid)
          : ''
      const shakti_id =
        data.itemName !== 'ASSEMBLY BODY' &&
        data.itemName !== 'WARD BODY' &&
        data.itemName !== 'BOOTH BODY'
          ? shakti.find(
              (item: any) => item.SHAKTIKENDRA_MAS_ID == data.shaktiid
            )
          : ''
      const booth_id =
        data.itemName !== 'ASSEMBLY BODY' &&
        data.itemName !== 'WARD BODY' &&
        data.itemName !== 'SHAKTIKENDRA BODY'
          ? boothList.find((item: any) => item.BOOTH_NO == data.boothid)
          : ''

      let reqObj = {
        Flag: flag,
        BENF_DETAIL_ID: flag === 'DELETE' ? name.BENF_DETAIL_ID : data.bene_id,
        BENF_CATEGORY:
          flag === 'DELETE' ? name.BENF_CATEGORY : data.categoryName,
        BENF_ITEM_NAME: flag === 'DELETE' ? name.BENF_ITEM_NAME : data.itemName,
        BENF_SUB_ITEM_NAME:
          flag === 'DELETE' ? name.BENF_SUB_ITEM_NAME : data.subItem,
        VOTERNO: dataid,
        BENF_NAME: flag === 'DELETE' ? name.BENF_NAME : data.bene_name,
        BENF_MOBILE: flag === 'DELETE' ? name.BENF_MOBILE : data.mobileNo,
        BENF_ADDRESS: flag === 'DELETE' ? name.BENF_ADDRESS : data.address,
        BENF_DESIGNATION:
          flag === 'DELETE' ? name.BENF_DESIGNATION : data.designation,
        BENF_PARTY_POST: flag === 'DELETE' ? name.BENF_PARTY_POST : data.post,
        BENF_CASTE: flag === 'DELETE' ? name.BENF_CASTE : data.caste,
        BENF_DOB:
          flag === 'DELETE'
            ? moment(name.BENF_DOB).format('MM-DD-yyyy')
            : data.birthday !== ''
            ? moment(data.birthday).format('MM-DD-yyyy')
            : null,
        BENF_DOA:
          flag === 'DELETE'
            ? moment(name.BENF_DOA).format('MM-DD-yyyy')
            : data.anniverasary !== ''
            ? moment(data.anniverasary).format('MM-DD-yyyy')
            : null,
        BENF_BLOOD_GROUP:
          flag === 'DELETE' ? name.BENF_BLOOD_GROUP : data.bloodGroup,
        AC_NO:
          flag === 'DELETE'
            ? name.AC_NO
            : data.itemName !== 'WARD BODY'
            ? data.assemblyid
            : '',
        AC_NAME: flag === 'DELETE' ? name.AC_NAME : asse_name?.AS_SEAT_NM,
        WARD_MAS_ID:
          flag === 'DELETE'
            ? name.WARD_MAS_ID
            : data.itemName !== 'ASSEMBLY BODY' &&
              data.itemName !== 'BOOTH BODY' &&
              data.itemName !== 'SHAKTIKENDRA BODY'
            ? data.wardid
            : '',
        WARD_NAME: flag === 'DELETE' ? name.WARD_NAME : ward_id?.WARD_NAME,
        SHAKTIKENDRA_MAS_ID:
          flag === 'DELETE'
            ? name.SHAKTIKENDRA_MAS_ID
            : data.itemName !== 'ASSEMBLY BODY' &&
              data.itemName !== 'WARD BODY' &&
              data.itemName !== 'BOOTH BODY'
            ? data.shaktiid
            : '',
        SHAKTIKENDRA_NAME:
          flag === 'DELETE'
            ? name.SHAKTIKENDRA_NAME
            : shakti_id?.SHAKTIKENDRA_NAME,
        BOOTH:
          flag === 'DELETE'
            ? name.BOOTH
            : data.itemName !== 'ASSEMBLY BODY' &&
              data.itemName !== 'WARD BODY' &&
              data.itemName !== 'SHAKTIKENDRA BODY'
            ? data.boothid
            : '',
        BOOTH_NAME: flag === 'DELETE' ? name.BOOTH_NAME : booth_id?.BOOTH_NAME,
        BENF_VILLAGE: flag === 'DELETE' ? name.BENF_VILLAGE : data.village,
        BENF_WHATSAPPNO:
          flag === 'DELETE' ? name.BENF_WHATSAPPNO : data.whatsappNo,
        BENF_EMAIL: flag === 'DELETE' ? name.BENF_EMAIL : data.email,
        BENF_FB: flag === 'DELETE' ? name.BENF_FB : data.facebook,
        BENF_INSTAGRAM:
          flag === 'DELETE' ? name.BENF_INSTAGRAM : data.instagram,
        BENF_PARTYAFFIALATION:
          flag === 'DELETE' ? name.BENF_PARTYAFFIALATION : data.party,
        BENF_REMARKS: flag === 'DELETE' ? name.BENF_REMARKS : data.remark,
        BENF_ADDED_BY: userName,
        BENF_ADDED_MOBNO: Number,
        BENF_ENTRY_FROM: 'IONIC_APP',
        BENF_ENTRY_ROLE: Role,
        AADHAR_NO: flag === 'DELETE' ? name.AADHAR_NO : data.adharNo
      }

      axiosApi.post("/AddUpdateVoterActivityDetails", reqObj)
          .then((res) => {
              if (res.data.STATUS === 0) {
                  present(res.data.MESSAGE, 3000)
                  setData({ ...defaultState, assemblyid: '', boothid: '' })
                  activityDismiss()
              } else if (res.data.STATUS === 2) {
                  present(res.data.MESSAGE, 3000)
                  EditActivityDismiss()
                  getActivity();
                  // setData({ ...defaultState })
              } else if (res.data.STATUS === 1) {
                  present(res.data.MESSAGE, 3000)
                  getActivity();
              } else if (res.data.STATUS === -1) {
                  present(res.data.MESSAGE, 3000)
                  getActivity();
              }
          })
          .catch(err => {
              present("SaveActivity"+err.message,3000);
          })
    
  }

  const EditActivity = (item: any) => {
    const wardid = item.WARD_ID === null ? '' : item.WARD_ID
    const shaktiid =
      item.SHAKTIKENDRA_MAS_ID === null ? '' : item.SHAKTIKENDRA_MAS_ID
    if (item.AC_NO !== '') {
      getWardList(item.AC_NO)
      getShkList(item.AC_NO, item.WARD_ID)
      getBoothList(item.AC_NO, wardid, shaktiid, '', 'BOOTH')
    }
    if (item.BENF_CATEGORY !== '') {
      getItemList('PARENTITEM', item.BENF_CATEGORY)
      getSubItem('CHILDITEM', item.BENF_ITEM_NAME, item.BENF_CATEGORY)
    }
    setShowEditActivity(true)
    setFlag('EDIT')
    setData({
      ...data,
      categoryName: item.BENF_CATEGORY,
      itemName: item.BENF_ITEM_NAME,
      subItem: item.BENF_SUB_ITEM_NAME,
      voterid: item.VOTERNO,
      bene_id: item.BENF_DETAIL_ID,
      bene_name: item.BENF_NAME,
      mobileNo: item.BENF_MOBILE,
      address: item.BENF_ADDRESS,
      designation: item.BENF_DESIGNATION,
      post: item.BENF_PARTY_POST,
      caste: item.BENF_CASTE,
      birthday:
        item.BENF_DOB !== null
          ? moment(item.BENF_DOB).format('MM-DD-yyyy')
          : '',
      anniverasary:
        item.BENF_DOA !== null
          ? moment(item.BENF_DOA).format('MM-DD-yyyy')
          : '',
      bloodGroup: item.BENF_BLOOD_GROUP,
      assemblyid: item.AC_NO,
      bene_ac_name: item.AC_NAME,
      wardid: item.WARD_ID,
      bene_ward_name: item.WARD_NAME,
      shaktiid: item.SHAKTIKENDRA_MAS_ID,
      bene_shakti_name: item.SHAKTIKENDRA_NAME,
      boothid: item.BOOTH,
      bene_booth_name: item.BOOTH_NAME,
      village: item.BENF_VILLAGE,
      whatsappNo: item.BENF_WHATSAPPNO,
      email: item.BENF_EMAIL,
      facebook: item.BENF_FB,
      instagram: item.BENF_INSTAGRAM,
      party: item.BENF_PARTYAFFIALATION,
      remark: item.BENF_REMARKS
    })
  }

  const changeEvent = (e: any) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const getActivity = () => {
    const dataid = vid.vid
    axiosApi
      .get('/getActivityDetailsByVoterNo?pVtrNo=' + dataid)
      .then(res => {
        if (res.data != '') {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp?.data)
          if (Resp.error === false) {
            setViewActivity(Data)
          } else {
            present(Resp.msg, 3000)
          }
        } else {
          dismiss()
          setViewActivity([])
          present('No Activity Available...', 3000)
        }
      })
      .catch(err => {
        present('GetActivity' + err.message, 3000)
      })
  }

  const getData = () => {
    const dataid = vid.vid
    setLoad(true)
    axiosApi
      .get('LoadVoterDetailsByVoterId?pVtrVoterId=' + dataid)
      .then(res => {
        const Resp = JSON.parse(res.data)
        const Data = Resp.data

        if (Resp.error === false) {
          setData({
            ...data,
            designation: Data[0].DESIGNATION,
            mobileNo: Data[0].ALTR_MOBNO === 'null' ? '' : Data[0].ALTR_MOBNO,
            whatsappNo:
              Data[0].WHATSAPP_NO === 'null' ? '' : Data[0].WHATSAPP_NO,
            address: Data[0].ENG_ADDRESS === 'null' ? '' : Data[0].ENG_ADDRESS,
            party: Data[0].MIND_SET,
            birthday:
              Data[0].BIRTHDATE !== null
                ? moment(Data[0].BIRTHDATE).format('MM-DD-yyyy')
                : '',
            anniverasary:
              Data[0].BIRTHDATE !== null
                ? moment(Data[0].ANNIVERSARY).format('MM-DD-yyyy')
                : '',
            post: Data[0].POST_IN_BJP === 'null' ? '' : Data[0].POST_IN_BJP,
            email: Data[0].EMAIL_ID === 'null' ? '' : Data[0].EMAIL_ID,
            acno: Data[0].AC_NO,
            boothNo: Data[0].BOOTH,
            pageNo: Data[0].PAGENO,
            srNo: Data[0].SERIAL,
            adharNo: Data[0].AADHAR_NO === 'null' ? '' : Data[0].AADHAR_NO,
            bloodGroup: Data[0].BLOOD_GROUP,
            facebook: Data[0].FACEBOOK_ID === 'null' ? '' : Data[0].FACEBOOK_ID,
            instagram: Data[0].INSTAGRAM === 'null' ? '' : Data[0].INSTAGRAM,
            lock: Data[0].REC_DATA_LOCK,
            bene_name: Data[0].ENG_FULLNAME,
            voterid: Data[0].VOTERNO,
            caste: Data[0].CASTE
          })
          setLoad(false)
        } else {
          present(Data.msg, 3000)
          setLoad(false)
        }
      })
      .catch(err => {
        present('Load Activity' + err.message, 3000)
        setLoad(false)
      })
  }

  useEffect(() => {
    getData()
  }, [vid.vid])

  return (
    <div>
      <IonGrid>
        <IonRow>
          {vid.islock != 'Y' ? (
            <IonCol size='6'>
              <IonButton id='add-activity-modal' onClick={() => getData()}>
                {t('lan.lblLanAddAct')}{' '}
              </IonButton>
            </IonCol>
          ) : (
            ''
          )}

          <IonCol size='6'>
            <IonButton id='activity-modal' onClick={() => getActivity()}>
              {t('lan.lblLanViewAct')}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <Loader loading={load} click={() => setLoad(false)} />
      <IonModal
        className='grid-scroll'
        id='activity-modal'
        ref={activitymodal}
        trigger='activity-modal'
      >
        <IonHeader>
          <IonToolbar>
            <IonGrid>
              <IonRow>
                <IonCol size='10'>
                  <IonTitle>{t('lan.lblLanViewAct')}</IonTitle>
                </IonCol>
                <IonCol size='2'>
                  <IonIcon src={closeCircleOutline} onClick={() => dismiss()} />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <div className='grid-scroll'>
          {Array.isArray(viewActivity) && viewActivity?.length > 0
            ? viewActivity?.map((item: any, key: any) => {
                return (
                  <IonCard key={key}>
                    <IonCardContent className='complaint-card'>
                      <IonGrid>
                        <IonRow>
                          <IonCol size='3'>
                            <IonLabel>{t('lan.lblLangNo')}</IonLabel>
                          </IonCol>
                          <IonCol size='1'>{key + 1}</IonCol>
                          <IonCol size='3'>
                            <IonLabel>{t('lan.lblLangCategory')}</IonLabel>
                          </IonCol>
                          <IonCol size='5'>{item.BENF_CATEGORY}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangName')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item.BENF_NAME}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangMobile')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item.BENF_MOBILE}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangItemNm')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item.BENF_ITEM_NAME}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangSubItmNm')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item.BENF_SUB_ITEM_NAME}</IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonLabel>{t('lan.lblLangDesignation')}</IonLabel>
                          </IonCol>
                          <IonCol size='8'>{item.BENF_DESIGNATION}</IonCol>
                        </IonRow>
                        {vid.islock != 'Y' ? (
                          <IonRow>
                            <IonCol size='6'>
                              <IonButton onClick={() => EditActivity(item)}>
                                {t('lan.lblLangEdit')}
                              </IonButton>
                            </IonCol>
                            <IonCol size='6'>
                              <IonButton
                                fill='outline'
                                color='danger'
                                onClick={() => SaveActivity('DELETE', item)}
                              >
                                {t('lan.lblRemove')}
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        ) : (
                          ''
                        )}
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                )
              })
            : ''}
        </div>
      </IonModal>

      <IonModal
        id='add-activity-modal'
        ref={addactivitymodal}
        trigger='add-activity-modal'
      >
        <IonHeader>
          <IonToolbar>
            <IonGrid>
              <IonRow>
                <IonCol size='10'>
                  <IonTitle>{t('lan.lblLanAddAct')}</IonTitle>
                </IonCol>
                <IonCol size='2'>
                  <IonIcon
                    src={closeCircleOutline}
                    onClick={() => activityDismiss()}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonGrid className='grid-scroll'>
          <IonItemDivider>
            <IonLabel>{t('lan.lblPersonalinformation')}</IonLabel>
          </IonItemDivider>
          <IonRow>
            <IonCol size='3'>
              {' '}
              <IonLabel>{t('lan.lblLangName')}</IonLabel>{' '}
            </IonCol>
            <IonCol size='9'>
              <IonLabel>{data?.bene_name} </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangVoterId')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonLabel>{data?.voterid}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangMobile')}</IonLabel>
            </IonCol>
            <IonCol>
              <IonInput
                type='number'
                name='mobileNo'
                value={data?.mobileNo}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>

          {/* <IonRow>
                        <IonCol size='6'> <IonLabel>{t('lan.lblLangName')}</IonLabel>
                            <IonInput type='text' value={data?.bene_name} disabled /></IonCol>
                        <IonCol size='6'><IonLabel>
                            {t('lan.lblLangVoterId')}</IonLabel><IonInput type='text' value={data?.voterid} disabled /></IonCol>
                    </IonRow> */}

          <IonItemDivider>
            <IonLabel>{t('lan.lblCategoryDetails')}</IonLabel>
          </IonItemDivider>
          <IonRow>
            <IonCol size='6'>
              <IonLabel>{t('lan.lblLangCategory')}</IonLabel>
              <select
                value={data?.categoryName}
                name='categoryName'
                onChange={e => changeCategory(e, 'PARENTITEM')}
              >
                <option value=''>Select</option>
                {Array.isArray(category) && category.length > 0
                  ? category.map((item: any, key: any) => {
                      return (
                        <option key={key} value={item.BENF_CATEGORY}>
                          {item.BENF_CATEGORY}
                        </option>
                      )
                    })
                  : 'No Data'}
              </select>
            </IonCol>

            <IonCol size='6'>
              <IonLabel>{t('lan.lblLangItemNm')}</IonLabel>
              <select
                value={data?.itemName}
                name='itemName'
                onChange={e => changeItem(e, 'CHILDITEM')}
              >
                <option value=''>Select</option>
                {Array.isArray(items) && items.length > 0
                  ? items.map((item: any, key: any) => {
                      return (
                        <option key={key} value={item.BENF_ITEM_NAME}>
                          {item.BENF_ITEM_NAME}
                        </option>
                      )
                    })
                  : 'No Data'}
              </select>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='6'>
              <IonLabel>{t('lan.lblLangSubItmNm')}</IonLabel>
              <select
                value={data?.subItem}
                name='subItem'
                onChange={changeEvent}
              >
                <option value=''>Select</option>
                {Array.isArray(subItem) && subItem.length > 0
                  ? subItem.map((item: any, key: any) => {
                      return (
                        <option key={key} value={item.BENF_SUB_ITEM_NAME}>
                          {item.BENF_SUB_ITEM_NAME}
                        </option>
                      )
                    })
                  : 'No Data'}
              </select>
            </IonCol>
          </IonRow>

          <IonItemDivider>
            <IonLabel>{t('lan.lblBoothDetails')}</IonLabel>
          </IonItemDivider>

          <IonRow>
            {data.itemName !== 'WARD BODY' ? (
              <IonCol size='6'>
                <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
                <select
                  name='assemblyid'
                  value={data?.assemblyid}
                  onChange={e => changeAssembly(e)}
                >
                  <option value=''>Select</option>
                  {Array.isArray(assemblyList) && assemblyList.length > 0
                    ? assemblyList.map((item: any, key: any) => {
                        return (
                          <option
                            key={key}
                            selected={
                              data?.acno == item.AS_SEAT_ID ? true : false
                            }
                            value={item.AS_SEAT_ID}
                          >
                            {item.AS_SEAT_NM}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>
              </IonCol>
            ) : (
              ''
            )}
            {data.itemName !== 'ASSEMBLY BODY' &&
            data.itemName !== 'BOOTH BODY' &&
            data.itemName !== 'SHAKTIKENDRA BODY' ? (
              <IonCol size='6'>
                <IonLabel position='floating'>
                  {t('lan.lblLangWardName')}
                </IonLabel>
                <select
                  name='wardid'
                  value={data?.wardid}
                  onChange={e => changeWard(e, data.assemblyid)}
                >
                  <option value=''>Select</option>
                  {Array.isArray(ward) && ward.length > 0
                    ? ward.map((item: any, key: any) => {
                        return (
                          <option key={key} value={item.WARD_MAS_ID}>
                            {item.WARD_NAME}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>
              </IonCol>
            ) : (
              ''
            )}
          </IonRow>
          <IonRow>
            {data.itemName !== 'ASSEMBLY BODY' &&
            data.itemName !== 'WARD BODY' &&
            data.itemName !== 'BOOTH BODY' ? (
              <IonCol size='6'>
                <IonLabel>{t('lan.MenuLangShk')}</IonLabel>
                <select
                  name='shaktiid'
                  value={data?.shaktiid}
                  onChange={e =>
                    changeShaktikendra(e, data.assemblyid, data.wardid)
                  }
                >
                  <option value=''>Select</option>
                  {Array.isArray(shakti) && shakti.length > 0
                    ? shakti.map((item: any, key: any) => {
                        return (
                          <option key={key} value={item.SHAKTIKENDRA_MAS_ID}>
                            {item.SHAKTIKENDRA_NAME}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>
              </IonCol>
            ) : (
              ''
            )}
            {data.itemName !== 'ASSEMBLY BODY' &&
            data.itemName !== 'WARD BODY' &&
            data.itemName !== 'SHAKTIKENDRA BODY' &&
            data.itemName !== 'BOOTH BODY' ? (
              <IonCol size='6'>
                <IonLabel position='floating'>{t('lan.lblCity')}</IonLabel>
                <Select
                  selectType='Select'
                  name='village'
                  values={data.village}
                  changes={(e: any) =>
                    changeCity(
                      e,
                      data?.assemblyid,
                      data?.wardid,
                      data?.shaktiid
                    )
                  }
                  array={city}
                  optName='VILLAGE'
                  optValue='VILLAGE'
                />
              </IonCol>
            ) : (
              ''
            )}
          </IonRow>
          {data.itemName !== 'ASSEMBLY BODY' &&
          data.itemName !== 'WARD BODY' &&
          data.itemName !== 'SHAKTIKENDRA BODY' ? (
            <IonRow>
              <IonCol size='12'>
                <IonLabel>{t('lan.MenuAsWardShakti')}</IonLabel>
                <select
                  name='boothid'
                  value={data?.boothid}
                  onChange={changeBooth}
                >
                  <option value=''>Select</option>
                  {Array.isArray(boothList) && boothList.length > 0
                    ? boothList.map((item: any, key: any) => {
                        return (
                          <option key={key} value={item.BOOTH_NO}>
                            {item.BOOTH_NO}-{item.BOOTH_NAME}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>
              </IonCol>
            </IonRow>
          ) : (
            ''
          )}
          <IonRow>
            <IonCol>
              <IonLabel>{t('lan.lblLangRemarks')}</IonLabel>
              <select value={data?.remark} name='remark' onChange={changeEvent}>
                <option value=''>Select</option>
                <option value='Specific Issue'>Specific Issue</option>
                <option value='Personality'>Personality</option>
                <option value='Vote Bank Potential'>Vote Bank Potential</option>
                <option value='Should Joint Team or Not'>
                  Should Joint Team or Not
                </option>
              </select>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton
                shape='round'
                fill='outline'
                onClick={() => SaveActivity('SAVE', '')}
              >
                {' '}
                {t('lan.btnSave')}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonModal>

      <IonModal isOpen={showEditActivity}>
        <IonHeader>
          <IonToolbar>
            <IonGrid>
              <IonRow>
                <IonCol size='10'>
                  <IonTitle>{t('lan.lblChangeActivity')}</IonTitle>
                </IonCol>
                <IonCol size='2'>
                  <IonIcon
                    src={closeCircleOutline}
                    onClick={() => EditActivityDismiss()}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonGrid className='grid-scroll'>
          <IonItemDivider>
            <IonLabel>{t('lan.lblPersonalinformation')}</IonLabel>
          </IonItemDivider>
          <IonRow>
            <IonCol size='3'>
              {' '}
              <IonLabel>{t('lan.lblLangName')}</IonLabel>{' '}
            </IonCol>
            <IonCol size='9'>
              <IonLabel>{data?.bene_name} </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangVoterId')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonLabel>{data?.voterid}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangMobile')}</IonLabel>
            </IonCol>
            <IonCol>
              <IonInput
                type='number'
                name='mobileNo'
                value={data?.mobileNo}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>

          <IonItemDivider>
            <IonLabel>{t('lan.lblCategoryDetails')}</IonLabel>
          </IonItemDivider>
          <IonRow>
            <IonCol size='6'>
              <IonLabel>{t('lan.lblLangCategory')}</IonLabel>
              <select
                defaultValue={data?.categoryName}
                value={data?.categoryName}
                name='categoryName'
                onChange={e => changeCategory(e, 'PARENTITEM')}
              >
                <option value=''>Select</option>
                {Array.isArray(category) && category.length > 0
                  ? category.map((item: any, key: any) => {
                      return (
                        <option key={key} value={item.BENF_CATEGORY}>
                          {item.BENF_CATEGORY}
                        </option>
                      )
                    })
                  : 'No Data'}
              </select>
            </IonCol>

            <IonCol size='6'>
              <IonLabel>{t('lan.lblLangItemNm')}</IonLabel>

              <select
                value={data?.itemName}
                name='itemName'
                onChange={e => changeItem(e, 'CHILDITEM')}
              >
                <option value=''>select</option>
                {Array.isArray(items) && items?.length > 0
                  ? items?.map((item: any, key: any) => {
                      return (
                        <option
                          key={key}
                          selected={
                            data?.itemName == item.BENF_ITEM_NAME ? true : false
                          }
                          value={item.BENF_ITEM_NAME}
                        >
                          {item.BENF_ITEM_NAME}
                        </option>
                      )
                    })
                  : 'No Data'}
              </select>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='6'>
              <IonLabel>{t('lan.lblLangSubItmNm')}</IonLabel>

              <select
                value={data?.subItem}
                name='subItem'
                onChange={changeEvent}
              >
                <option value=''>select</option>
                {Array.isArray(subItem) && subItem?.length > 0
                  ? subItem?.map((item: any, key: any) => {
                      return (
                        <option
                          key={key}
                          selected={
                            data?.subItem == item.BENF_SUB_ITEM_NAME
                              ? true
                              : false
                          }
                          value={item.BENF_SUB_ITEM_NAME}
                        >
                          {item.BENF_SUB_ITEM_NAME}
                        </option>
                      )
                    })
                  : 'No Data'}
              </select>
            </IonCol>
          </IonRow>

          <IonItemDivider>
            <IonLabel>{t('lan.lblBoothDetails')}</IonLabel>
          </IonItemDivider>

          <IonRow>
            {data.itemName !== 'WARD BODY' ? (
              <IonCol size='6'>
                <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
                <select
                  name='assemblyid'
                  value={data?.assemblyid}
                  onChange={e => changeAssembly(e)}
                >
                  <option value=''>select</option>
                  {Array.isArray(assemblyList) && assemblyList?.length > 0
                    ? assemblyList?.map((item: any, key: any) => {
                        const id: any = assemblyList.find(
                          (a: any) => a.AS_SEAT_ID == data?.assemblyid
                        )
                        return (
                          <option
                            key={key}
                            selected={
                              data?.assemblyid == item.AS_SEAT_ID ? true : false
                            }
                            value={item.AS_SEAT_ID}
                          >
                            {item.AS_SEAT_NM}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>
              </IonCol>
            ) : (
              ''
            )}
            {data.itemName !== 'ASSEMBLY BODY' &&
            data.itemName !== 'BOOTH BODY' &&
            data.itemName !== 'SHAKTIKENDRA BODY' ? (
              <IonCol size='6'>
                <IonLabel position='floating'>
                  {t('lan.lblLangWardName')}
                </IonLabel>
                <select
                  onLoad={e => changeAssembly(e)}
                  name='wardid'
                  value={data?.wardid}
                  onChange={e => changeWard(e, data.assemblyid)}
                >
                  <option value=''>select</option>
                  {Array.isArray(ward) && ward?.length > 0
                    ? ward?.map((item: any, key: any) => {
                        const id: any = assemblyList.find(
                          (a: any) => a.AS_SEAT_ID == data?.assemblyid
                        )
                        return (
                          <option
                            key={key}
                            selected={
                              data?.wardid == item.WARD_MAS_ID ? true : false
                            }
                            value={item.WARD_MAS_ID}
                          >
                            {item.WARD_NAME}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>
              </IonCol>
            ) : (
              ''
            )}
          </IonRow>
          <IonRow>
            {data.itemName !== 'ASSEMBLY BODY' &&
            data.itemName !== 'WARD BODY' &&
            data.itemName !== 'BOOTH BODY' ? (
              <IonCol size='6'>
                <IonLabel>{t('lan.MenuLangShk')}</IonLabel>
                <select
                  onLoad={e => changeAssembly(e)}
                  name='shaktiid'
                  value={data?.shaktiid}
                  onChange={e =>
                    changeShaktikendra(e, data.assemblyid, data.wardid)
                  }
                >
                  <option value=''>Select</option>
                  {Array.isArray(shakti) && shakti?.length > 0
                    ? shakti?.map((item: any, key: any) => {
                        const id: any = assemblyList.find(
                          (a: any) => a.AS_SEAT_ID == data?.assemblyid
                        )

                        return (
                          <option
                            key={key}
                            selected={
                              data?.shaktiid == item.SHAKTIKENDRA_MAS_ID
                                ? true
                                : false
                            }
                            value={item.SHAKTIKENDRA_MAS_ID}
                          >
                            {item.SHAKTIKENDRA_NAME}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>
              </IonCol>
            ) : (
              ''
            )}
            {data.itemName !== 'ASSEMBLY BODY' &&
            data.itemName !== 'WARD BODY' &&
            data.itemName !== 'SHAKTIKENDRA BODY' &&
            data.itemName !== 'BOOTH BODY' ? (
              <IonCol size='6'>
                <IonLabel position='floating'>{t('lan.lblCity')}</IonLabel>

                <select
                  name='village'
                  value={data?.village}
                  onChange={(e: any) =>
                    changeCity(
                      e,
                      data?.assemblyid,
                      data?.wardid,
                      data?.shaktiid
                    )
                  }
                >
                  <option value=''>select</option>
                  {Array.isArray(city) && city?.length > 0
                    ? city?.map((item: any, key: any) => {
                        return (
                          <option
                            key={key}
                            selected={
                              data?.village == item.VILLAGE ? true : false
                            }
                            value={item.VILLAGE}
                          >
                            {item.VILLAGE}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>

                {/* <IonInput name='village' value={data?.village} onIonChange={changeEvent} /> */}
              </IonCol>
            ) : (
              ''
            )}
          </IonRow>
          <IonRow>
            {data.itemName !== 'ASSEMBLY BODY' &&
            data.itemName !== 'WARD BODY' &&
            data.itemName !== 'SHAKTIKENDRA BODY' ? (
              <IonCol size='12'>
                <IonLabel>{t('lan.MenuAsWardShakti')}</IonLabel>

                <select
                  name='boothid'
                  value={data?.boothid}
                  onChange={changeEvent}
                >
                  <option value=''>select</option>
                  {Array.isArray(boothList) && boothList?.length > 0
                    ? boothList?.map((item: any, key: any) => {
                        const id: any = assemblyList.find(
                          (a: any) => a.AS_SEAT_ID == data?.assemblyid
                        )
                        return (
                          <option
                            key={key}
                            selected={
                              data?.boothid == item.BOOTH_NO ? true : false
                            }
                            value={item.BOOTH_NO}
                          >
                            {item.BOOTH_NO}-{item.BOOTH_NAME}
                          </option>
                        )
                      })
                    : 'No Data'}
                </select>
              </IonCol>
            ) : (
              ''
            )}
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>{t('lan.lblLangRemarks')}</IonLabel>
              <select value={data?.remark} name='remark' onChange={changeEvent}>
                <option value=''>Select</option>
                <option value='Specific Issue'>Specific Issue</option>
                <option value='Personality'>Personality</option>
                <option value='Vote Bank Potential'>Vote Bank Potential</option>
                <option value='Should Joint Team or Not'>
                  Should Joint Team or Not
                </option>
              </select>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                shape='round'
                fill='outline'
                onClick={() => SaveActivity('UPDATE', '')}
              >
                {' '}
                {flag === 'EDIT' ? t('lan.lblLangEdit') : t('lan.btnSave')}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonModal>
    </div>
  )
}

export default ViewActivity
