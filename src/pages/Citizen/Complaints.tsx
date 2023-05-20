import {
  IonInput,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonIcon,
  IonTextarea,
  IonGrid,
  IonCol,
  IonRow,
  useIonToast
} from '@ionic/react'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { arrowBackOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import axiosApi from '../../axiosApi'
import { useDispatch, useSelector } from 'react-redux'
import { getAssembly } from '../../slice/assembly.slice'
import Select from '../../components/Select'

interface ComplaintsProp {
  name: any
  address: any
  panchayatsmithi: any
  assembly: any
  grampanchayat: any
  mobile: any
  type: any
  description: any
  pincode: any
}

const Complaints: React.FC<ComplaintsProp> = () => {
  const { t } = useTranslation()
  const Name: any = localStorage.getItem('loginUserName')
  const Lok: any = localStorage.getItem('loginas')
  const Num: any = localStorage.getItem('loginUserMblNo')
  const deviceId: any = localStorage.getItem('DeviceRegisterId')

  if (Lok === 'SHUBHECHHAK' && Lok === 'GUEST') {
  }
  const defaultState = {
    name: Lok === 'GUEST' ? Name : '',
    address: '',
    panchayatsmithi: '',
    assembly: '',
    grampanchayat: '',
    mobile: Lok === 'GUEST' ? Num : '',
    type: '',
    description: '',
    pincode: ''
  }

  const [data, setData] = useState<ComplaintsProp>(defaultState)
  const [selected, setSelected] = useState(false)
  const [fileSelected, setFileSelected] = useState<File>()
  const [gram, setGram] = useState<any>([])
  const [presentToast] = useIonToast()

  const dispatch = useDispatch<any>()
  const { assemblyList } = useSelector((state: any) => state.assembly) // Get Assembly value from redux
  useEffect(() => {
    dispatch(getAssembly())
  }, [dispatch])

  const changeAssembly = (e: any) => {
    setData({ ...data, assembly: e.target.value })
  }

  useEffect(() => {
    const getGramPanchayat = async () => {
      axiosApi
        .get('/getGramPanchayatList?pAsSeatId=' + data.assembly)
        .then(res => {
          const Data = res.data
          if (Data === '') {
            setData({ ...data, grampanchayat: 'other' })
          } else {
            setGram(JSON.parse(Data))
          }
        })
        .catch(err => {
          presentToast(err.message, 3000)
        })
    }
    getGramPanchayat()
  }, [data.assembly])

  const changeEvent = (e: any) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const _handleImageChange = (e: any) => {
    const fileList = e.target.files
    if (!fileList) return
    setFileSelected(fileList[0])
    setSelected(true)
  }

  const submitData = async () => {
    debugger
    if (data?.name === '') {
      presentToast('Please Enter Name!!', 3000)
    } else if (data?.address === '') {
      presentToast('Please Enter Address!!', 3000)
    } else if (data?.mobile === '') {
      presentToast('Please Enter Mobile!!', 3000)
    } else if (data?.mobile.length > 10 || data?.mobile.length < 10) {
      presentToast('Please Enter Mobile 10 digit Mobile', 3000)
    } else if (Lok !== 'GUEST' && data?.assembly === '') {
      presentToast('Please Select Assamebly!', 3000)
    } else if (data?.pincode === '') {
      presentToast('Please Enter Pincode!!', 3000)
    } else if (data?.pincode.length > 6 || data?.pincode.length < 6) {
      presentToast('Please Enter 6 Digite', 3000)
    } else if (data?.panchayatsmithi === '') {
      presentToast('Please Panchayat Samithi!!', 3000)
    } else if (data?.type === '') {
      presentToast('Please Select Type!!', 3000)
    } else if (data?.description === '') {
      presentToast('Please Enter Description!!', 3000)
    } else if (selected === false) {
      presentToast('Please Select any File', 3000)
    } else {
      const formData = new FormData()
      if (fileSelected) {
        formData.append('ComplimageUploadForm', fileSelected, fileSelected.name)
      }
      formData.append('pName', data?.name)
      formData.append('pPanchayatSamiti', data?.panchayatsmithi)
      formData.append('pGramPanchayat', data?.grampanchayat)
      formData.append('pPincode', data?.pincode)
      formData.append('pAddress', data?.address)
      formData.append('pMobile', data?.mobile)
      formData.append('pType', data?.type)
      formData.append('pDesc', data?.description)
      formData.append('pUser', Lok)
      formData.append('pUserName', Name)
      formData.append('pDeviceRegId', deviceId)
      formData.append('pAssembly', data?.assembly)

      await axiosApi
        .post(
          process.env.REACT_APP_API_URL + 'ComplaintSuggestionImage5',
          formData,
          {}
        )
        .then(res => {
          if (res.data === 1) {
            presentToast('Save Successfully', 3000)
            setData({
              name: Lok === 'GUEST' ? Name : '',
              address: '',
              panchayatsmithi: '',
              assembly: '',
              grampanchayat: '',
              mobile: Lok === 'GUEST' ? Num : '',
              type: '',
              description: '',
              pincode: ''
            })
            setSelected(false)
          } else {
            presentToast(
              'There much be gap of 7 days between previous and current complaint.',
              3000
            )
            setData({
              name: Lok === 'GUEST' ? Name : '',
              address: '',
              panchayatsmithi: '',
              assembly: '',
              grampanchayat: '',
              mobile: Lok === 'GUEST' ? Num : '',
              type: '',
              description: '',
              pincode: ''
            })
            setSelected(false)
          }
        })
        .catch(err => {
          presentToast(err.message, 3000)
        })
    }
  }
  const clearData = () => {
    setData({
      name: '',
      address: '',
      panchayatsmithi: '',
      assembly: '',
      grampanchayat: '',
      mobile: '',
      type: '',
      description: '',
      pincode: ''
    })
    setSelected(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <Link
                  to='/citizen'
                  onClick={() => clearData()}
                  className='back-button'
                >
                  <IonIcon src={arrowBackOutline} />
                </Link>
              </IonCol>
              <IonCol size='11'>
                <IonTitle>{t('lan.MenuComplenSug')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangName')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonInput
                name='name'
                disabled={Lok === 'GUEST' ? true : false}
                value={data.name}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangMobile')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonInput
                disabled={Lok === 'GUEST' ? true : false}
                type='number'
                name='mobile'
                value={data.mobile}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangAddress')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonTextarea
                name='address'
                value={data.address}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangPanchayatSamiti')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonInput
                name='panchayatsmithi'
                value={data.panchayatsmithi}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangAssembly')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <Select
                selectType={t('lan.lblLangSelect')}
                name='assembly'
                values={data.assembly}
                changes={changeAssembly}
                array={assemblyList}
                optName='AS_SEAT_NM'
                optValue='AS_SEAT_ID'
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangGramPanchayat')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <select
                name='grampanchayat'
                value={data?.grampanchayat}
                onChange={changeEvent}
              >
                {Array.isArray(gram) && gram.length > 0 ? (
                  gram.map((item: any, key: any) => {
                    return (
                      <option key={key} value={item.AS_SEAT_ID}>
                        {gram.length > 0 ? item.AS_SEAT_NM : 'other'}
                      </option>
                    )
                  })
                ) : (
                  <option value=''>Other</option>
                )}
              </select>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangPincode')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonInput
                type='number'
                name='pincode'
                value={data.pincode}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangType')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <select name='type' value={data.type} onChange={changeEvent}>
                <option value=''>Select One</option>
                <option value='COMPLAINT'>Complaint</option>
                <option value='SUGGESTION'>Suggestion</option>
              </select>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangDescription')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <IonTextarea
                name='description'
                value={data.description}
                onIonChange={changeEvent}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size='3'>
              <IonLabel>{t('lan.lblLangFileUpload')}</IonLabel>
            </IonCol>
            <IonCol size='9'>
              <input
                type='File'
                name='files'
                multiple={true}
                value={''}
                onChange={_handleImageChange}
              />
            </IonCol>
            {selected ? <span>File Name :{fileSelected?.name}</span> : ''}
          </IonRow>
          <IonRow>
            <IonButton
              shape='round'
              fill='outline'
              onClick={() => submitData()}
            >
              {t('lan.btnSave')}
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default Complaints
