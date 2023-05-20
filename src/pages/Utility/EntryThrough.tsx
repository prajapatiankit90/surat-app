import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import {
  useIonToast,
  IonLabel,
  IonInput,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonCardContent,
  IonImg,
  IonModal,
  IonTextarea,
  IonActionSheet,
  IonButtons,
  IonLoading,
  IonDatetimeButton,
  IonDatetime
} from '@ionic/react'
import axiosApi from '../../axiosApi'
import {
  imageOutline,
  pencilOutline,
  closeCircleOutline,
  arrowBackOutline,
  cameraReverseOutline,
  saveOutline,
  lockClosedOutline,
  lockOpenOutline,
  cloudDownloadOutline,
  trashBinOutline,
  searchOutline,
  folderOutline
} from 'ionicons/icons'
import moment from 'moment'
import axios from 'axios'
import { Crop } from '@ionic-native/crop'
import { Camera, CameraOptions } from '@ionic-native/camera'
import { File } from '@ionic-native/file'
import { useTranslation } from 'react-i18next'
import AddFamily from './AddFamily'
import ViewActivity from './ViewActivity'
import useDownLoad from '../../hooks/download.hook'
import { useDeviceInfo } from '../../hooks/useDeviceInfo'
import Loader from '../../components/Load'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

interface MyParams {
  id: string
}

interface StateProps {
  designation: any
  caste: any
  mobileNo: any
  whatsappNo: any
  address: any
  party: any
  birthday: any
  anniverasary: any
  post: any
  email: any
  voterid: any
  acno: any
  boothNo: any
  pageNo: any
  srNo: any
  adharNo: any
  bloodGroup: any
  facebook: any
  instagram: any
  category: any
  lock: any
}

const EntryThohghVoterId: React.FC<RouteComponentProps<MyParams>> = props => {
  // let id = props.match.params.id

  const location: any = props.history.location.state
  let id = location === undefined ? undefined : location.id

  const { t } = useTranslation()
  const history = useHistory()

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
    category: '',
    lock: ''
  }
  const [present] = useIonToast()
  const [value, setvalue] = useState([])
  const [data, setData] = useState<any>(defaultState)
  const [showModal, setShowModal] = useState(false)
  const [showFamily, setShowFamily] = useState(false)
  const [family, setFamily] = useState<any>([])
  const [photo, setPhoto] = useState<any>('PATH_DEFAULT_IMAGE')
  const [load, setLoad] = useState(false)
  const [error, setError] = useState(defaultState)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [bloodGrp, setBloodGrp] = useState<any>([])
  const [flag, setFlag] = useState<string>()
  const [mobile, setMobile] = useState<any>([])
  const [newData, setnewData] = useState<any>({
    newMobile: ''
  })
  const [selected, setSelected] = useState(false)
  const [fileSelected, setFileSelected] = useState<any>()
  const [base64, setBase64] = useState<any>('')
  const [cropModel, setCropModel] = useState<boolean>(false)
  const [cropData, setCropData] = useState('#')
  const [cropper, setCropper] = useState<Cropper>()
  const imageRef = useRef<HTMLImageElement>(null)

  const Role = localStorage.getItem('loginas')
  const Number = localStorage.getItem('loginUserMblNo')
  const userName = localStorage.getItem('loginUserName')

  const { createPDFDownload } = useDownLoad()
  const { DeviceInfo } = useDeviceInfo()

 
  const dataid = id !== undefined ? id : data.voterid

  let croppedImagepath: any = ''

  const modal = useRef<HTMLIonModalElement>(null)
  function dismiss () {
    modal.current?.dismiss()
  }

  const pickImage = (sourceType: any) => {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.PNG,
      mediaType: Camera.MediaType.PICTURE
    }
    Camera.getPicture(options).then(
      imageData => {
        cropImage(imageData)
      },
      err => {}
    )
  }
  const cropImage = (fileUrl: any) => {
    Crop.crop(fileUrl, { quality: 100 }).then(
      newPath => {
        showCroppedImage(newPath.split('?')[0])
      }
      // error => {
      //   alert('Error cropping image' + JSON.stringify(error));
      // }
    )
  }
  const showCroppedImage = (ImagePath: any) => {
    var copyPath = ImagePath
    var splitPath = copyPath.split('/')
    var imageName = splitPath[splitPath.length - 1]
    var filePath = ImagePath.split(imageName)[0]
    File.readAsDataURL(filePath, imageName).then(
      base64 => {
        croppedImagepath = base64
        setPhoto(imageName)
        // setFileSelected(croppedImagepath.base64)
        const reqObj = {
          VOTERNO: id !== undefined ? id : data.voterid,
          AC_NO: data.acno,
          REC_UPDATED_BY_NAME: userName,
          REC_UPDATED_BY_MOB: Number,
          VOTER_PROFILE: croppedImagepath
        }
        setLoad(true)
        axios
          .post(
            process.env.REACT_APP_API_URL + 'SaveVoterProfileImage2',
            reqObj
          )
          .then(res => {
            const Resp = res.data
            if (Resp?.Msg_Code === 1) {
              setTimeout(() => {
                present(Resp?.Msg_Value, 3000)
                getData()
                setLoad(false)
              }, 3000)
            }
          })
          .catch(err => {
            present(err.message, 3000)
            setLoad(false)
          })
      },
      error => {
        alert('Error in showing image' + error)
      }
    )
  }
  useEffect(() => {
    if (id !== undefined) {
      getData()
    }
  }, [id])

  const changeEvent = (e: any) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
    setnewData({ ...newData, [name]: value })
  }

  const clearData = () => {
    setvalue([])
    setData({ ...defaultState })
    setFamily([])
    history.replace('/voterlist')
  }
  const clearDate = () => {
    setvalue([])
    setData({ ...defaultState })
    setFamily([])
    history.replace('/utility')
  }

  function dateString2Date (dateString: any) {
    const dt = dateString.split(/\-|\s/)
    return new Date(dt.slice(0, 3).reverse().join('-') + ' ' + dt[3])
  }

  // Get Data from Voter list
  const getData = async () => {
    if (id === undefined && data.voterid === '') {
      present('Please Enter Voter No..!', 3000)
    } else {
      setLoad(true)
      await axiosApi
        .get('LoadVoterDetailsByVoterId?pVtrVoterId=' + dataid)
        .then(res => {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp.data)

          if (Resp.error === false) {
            setvalue(Data)
            setData({
              ...data,
              designation:
                Data[0].DESIGNATION === 'null' ? '' : Data[0].DESIGNATION,
              caste: Data[0].CASTE === 'null' ? '' : Data[0].CASTE,
              mobileNo: Data[0].ALTR_MOBNO === 'null' ? '' : Data[0].ALTR_MOBNO,
              whatsappNo:
                Data[0].WHATSAPP_NO === 'null' || Data[0].WHATSAPP_NO === null
                  ? ''
                  : Data[0].WHATSAPP_NO,
              address:
                Data[0].ENG_ADDRESS === 'null' ? '' : Data[0].ENG_ADDRESS,
              party: Data[0].MIND_SET === 'null' ? '' : Data[0].MIND_SET,
              birthday:
                Data[0].BIRTHDATE == null || Data[0].BIRTHDATE == ''
                  ? ''
                  : Data[0].BIRTHDATE,
              anniverasary:
                Data[0].ANNIVERSARY == null || Data[0].ANNIVERSARY == ''
                  ? ''
                  : Data[0].ANNIVERSARY,
              post: Data[0].POST_IN_BJP === 'null' ? '' : Data[0].POST_IN_BJP,
              email: Data[0].EMAIL_ID === 'null' ? '' : Data[0].EMAIL_ID,
              acno: Data[0].AC_NO,
              boothNo: Data[0].BOOTH_NO,
              pageNo: Data[0].PAGE_NO,
              srNo: Data[0].SERIAL,
              adharNo:
                Data[0].AADHAR_NO === 'null' || Data[0].AADHAR_NO === null
                  ? ''
                  : Data[0].AADHAR_NO,
              bloodGroup:
                Data[0].BLOOD_GROUP === 'null' ? '' : Data[0].BLOOD_GROUP,
              category: Data[0].CATEGORY === 'null' ? '' : Data[0].CATEGORY,
              facebook:
                Data[0].FACEBOOK_ID === 'null' ? '' : Data[0].FACEBOOK_ID,
              instagram:
                Data[0].INSTAGRAM_ID === 'null' ? '' : Data[0].INSTAGRAM_ID,
              lock: Data[0].REC_DATA_LOCK
            })
            setLoad(false)
          } else {
            present(Data.msg, 3000)
            setLoad(false)
          }
        })
        .catch(err => {
          present('LoadVoter' + err.message, 3000)
          setLoad(false)
        })
    }
  }

  //  Save Data from Voter List
  const saveData = () => {
    if (data.adharNo !== '' && data.adharNo !== null) {
      if (data.adharNo.length > 12 || data.adharNo.length < 12) {
        present('Please Enter 12 Digit Adhar Card No', 3000)
        return
      }
    }
    if (data.mobileNo === '' || data.mobileNo === null) {
      present('Please Enter Mobile No.', 3000)
      return
    }
    if (data?.mobileNo.length > 10 || data.mobileNo?.length < 10) {
      present('Please Enter 10 Digit Mo.', 3000)
      return
    }
    if (data.whatsappNo !== null && data.whatsappNo !== '') {
      if (data.whatsappNo.length > 10 || data.whatsappNo.length < 10) {
        present('Please Enter 10 Digit Whatsapp No.', 3000)
        return
      }
    }

    setLoad(true)
    axiosApi
      .get(
        '/SaveVotersDetailsWithEntrySerialNo?pAssembly=' +
          data?.acno +
          '&pBooth=' +
          data?.boothNo +
          '&pPageNo=' +
          data?.pageNo +
          '&pSerial=' +
          data?.srNo +
          '&pAltMob=' +
          data?.mobileNo +
          '&pAadharNo=' +
          data?.adharNo +
          '&pBdate=' +
          data?.birthday +
          '&pAnniversary=' +
          data?.anniverasary +
          '&pBloodGrp=' +
          data?.bloodGroup +
          '&pVoterNo=' +
          dataid +
          '&pVtrDesgnation=' +
          data?.designation +
          '&pLoginAs=' +
          userName +
          '&pLoginMob=' +
          Number +
          '&pLoginUserRole=' +
          Role +
          '&pCaste=' +
          data?.caste +
          '&pMindSet=' +
          data?.party +
          '&pPostInParty=' +
          data?.post +
          '&pEmail=' +
          data?.email +
          '&pWhatsappNo=' +
          data?.whatsappNo +
          '&pAddress=' +
          data?.address +
          '&pVtrCategory=' +
          data?.category +
          '&pFacebook=' +
          data?.facebook +
          '&pInsta=' +
          data?.instagram
      )
      .then(res => {
        const Data = res.data
        if (Data.Msg_Code === 1) {
          present(Data.Msg_Value, 3000)
          setLoad(false)
          setShowModal(false)
          getData()
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  const getFamily = async (id: any) => {
    setLoad(true)
    await axiosApi
      .get('/getFamilyDet?pVtrNo=' + id)
      .then(res => {
        if (res.data === '') {
          present('No Data found...', 3000)
          setShowFamily(false)
          setLoad(false)
        } else {
          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp?.data)
          if (Resp?.error === false) {
            setShowFamily(true)
            setFamily(Data)
            setLoad(false)
          } else {
            present(Resp.msg, 3000)
            setLoad(false)
          }
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  useEffect(() => {
    if (showFamily === true) {
      getFamily(dataid)
    }
  }, [family.length])

  useEffect(() => {
    axiosApi
      .get('/GetBloodGroupMas')
      .then(res => {
        if (res.data !== '') {
          const Resp = JSON.parse(res.data)
          const Data = Resp?.data
          if (Resp?.error === false) {
            setBloodGrp(Data)
          } else {
            present(Resp?.msg, 3000)
          }
        }
      })
      .catch(err => {
        present('BloodGroup' + err.message, 3000)
        setLoad(false)
      })
  }, [])

  const removeMembers = (mVoter: any) => {
    axiosApi
      .get(
        '/RemoveVtrFromFamilyGroup?pFmlyGrpHeadVtrNo=' +
          dataid +
          '&pFmlyGrpMemVtrNo=' +
          mVoter
      )
      .then(res => {
        const Resp = res.data
        if (Resp.Msg_Code === 1) {
          present(Resp.Msg_Value, 3000)
          getFamily(dataid)
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  // Add mobile Family
  const AddMobile = (voter: any) => {
    if (newData.newMobile === '') {
      present('Please Enter Mobile No..', 3000)
    } else if (newData.newMobile.length < 10 || newData.newMobile.length > 10) {
      present('Enter 10 Digit Mobile No...', 3000)
    } else {
      axiosApi
        .get(
          '/SaveFamilyGroupMblNo?pFmlyVtrId=' +
            voter +
            '&pFmlyVtrMobile=' +
            newData.newMobile +
            '&pLoginAs=' +
            userName +
            '&pFmlyVtrRelation=' +
            '' +
            '&pLoginMob=' +
            Number +
            '&pLoginRole=' +
            Role
        )
        .then(res => {
          const Resp = res.data
          if (Resp.Msg_Code === 1) {
            present(Resp.Msg_Value, 3000)
            setMobile(false)
            getFamily(dataid)
            setnewData({ newMobile: '' })
          }
        })
        .catch(err => {
          present(err.message, 3000)
          setLoad(false)
        })
    }
  }
  const closeFamily = () => {
    setFamily([])
    setShowFamily(false)
  }

  const removephoto = (voter: any, acno: any) => {
    const data = {
      VOTERNO: voter,
      AC_NO: acno
    }
    axiosApi
      .post('/RemoveVoterPhoto', data)
      .then(res => {
        const Resp = res.data
        if (Resp?.Msg_Code === 1) {
          present(Resp?.Msg_Value, 3000)
          getData()
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  // For WEB

  const getBase64 = (file: any) => {
    return new Promise(resolve => {
      let baseURL: any = ''
      // Make new FileReader
      let reader = new FileReader()

      // Convert the file to base64 text
      reader.readAsDataURL(file)

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result
        resolve(baseURL)
      }
    })
  }

  const _handleImageChange = (e: any) => {
    const fileList = e.target.files
    if (!fileList) return
    setFileSelected(fileList[0])
    setSelected(true)
    setCropModel(true)

    let file: any = e.target.files[0]

    getBase64(file)
      .then(result => {
        file['base64'] = result
        setBase64(result)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas().toDataURL())
    }
  }

  const imageUpload = async () => {
    const reqObj = {
      VOTERNO: id !== undefined ? id : data.voterid,
      AC_NO: data.acno,
      REC_UPDATED_BY_NAME: userName,
      REC_UPDATED_BY_MOB: Number,
      VOTER_PROFILE: cropData
    }
    setLoad(true)
    await axios
      .post(process.env.REACT_APP_API_URL + 'SaveVoterProfileImage2', reqObj)
      .then(res => {
        present('Please Wait....', 2000)
        if (res.data.Msg_Code === 1) {
          setTimeout(() => {
            present(res.data.Msg_Value, 3000)
            getData()
            setCropModel(false)
            setCropData('')
            setLoad(false)
          }, 3000)
        }
      })
      .catch(err => {
        present(err, 3000)
        setLoad(false)
      })
  }

  const closeCropModel = () => {
    setCropModel(false)
    setCropData('')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              {id === undefined ? (
                <IonCol size='1'>
                  <IonIcon onClick={clearDate} src={arrowBackOutline} />
                </IonCol>
              ) : (
                ''
              )}
              <IonCol size='11'>
                <IonTitle>{t('lan.MenuSingleVoterList')}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {id === undefined ? (
          <IonGrid>
            <IonRow>
              <IonCol size='3'>
                <IonLabel>{t('lan.lblLangVoterId')}</IonLabel>
              </IonCol>
              <IonCol size='9'>
                <IonInput
                  placeholder='Enter Voter Id'
                  name='voterid'
                  onIonChange={changeEvent}
                  value={data.voterid}
                ></IonInput>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton shape='round' fill='outline' onClick={getData}>
                  <IonIcon src={searchOutline} className='button-icon' />
                  {t('lan.lblLangLoad')}
                </IonButton>{' '}
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          <IonGrid style={{ textAlign: 'right' }}>
            <IonRow>
              <IonCol size='4'></IonCol>
              <IonCol size='4'></IonCol>
              <IonCol size='4'>
                <IonButton onClick={clearData}>
                  {t('lan.lblLangBack')}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
        <Loader loading={load} click={() => setLoad(false)} />
        {Array.isArray(value)
          ? value.map((item: any, key: any) => {
              return (
                <IonCard key={key} className='card'>
                  <IonCardContent className='complaint-card'>
                    <IonGrid>
                      <IonRow>
                        <IonCol size='6'>
                          {item.REC_DATA_LOCK === 'Y' ? (
                            <IonIcon src={lockClosedOutline} />
                          ) : (
                            <IonIcon src={lockOpenOutline} />
                          )}
                        </IonCol>
                        <IonCol size='6'>
                          <span className='voter'>
                            <b>{item.VOTERNO}</b>
                          </span>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                    <IonGrid className='rowborder'>
                      <IonRow>
                        <IonCol size='4' className='booth'>
                          <b>
                            {t('lan.lblLangAssembly')}:{item.AC_NO}
                          </b>
                        </IonCol>
                        <IonCol size='8' className='booth'>
                          <span>
                            {' '}
                            {t('lan.lblLangBoothNo')}:{item.BOOTH_NO}{' '}
                          </span>
                          <span>
                            {' '}
                            {t('lan.lblLangPageNo')}:{item.PAGE_NO}
                          </span>
                          <span>
                            {' '}
                            {t('lan.lblLangNo')}:{item.SERIAL}{' '}
                          </span>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                    {/* Enter Voter Id Display Data */}
                    <IonGrid className='rowborder'>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangName')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>{item.ENG_FULLNAME}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangAddress')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>{item.ADDRESS}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangAge')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='2'>{item.AGE}</IonCol>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangGender')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='2'>{item.SEX}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangBloodGroup')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='2'>
                          {item.BLOOD_GROUP !== 'null' ? item?.BLOOD_GROUP : ''}
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangbirthdate')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                          {item?.BIRTHDATE !== null
                            ? moment(item.BIRTHDATE).format('DD-MM-YYYY')
                            : ''}
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>{t('lan.lblLangDOA')}</IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                          {item?.ANNIVERSARY !== null
                            ? moment(item.ANNIVERSARY).format('DD-MM-YYYY')
                            : ''}
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangMobile1')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>{item.MOBNO}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangMobile2')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>{item.ALTR_MOBNO}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangAadharNo')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>{item.AADHAR_NO}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonLabel>
                            <b>{t('lan.lblLangPartyAffiliation')}</b>
                          </IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                          {item.MIND_SET !== 'null' ? item.MIND_SET : ''}
                        </IonCol>
                      </IonRow>
                    </IonGrid>

                    <IonGrid
                      className='rowborder header'
                      style={{ textAlign: 'center' }}
                    >
                      <IonRow>
                        <IonCol size='6'>
                          <IonIcon
                            src={pencilOutline}
                            onClick={() => setShowModal(true)}
                          />
                        </IonCol>
                        {item.REC_DATA_LOCK != 'Y' ? (
                          <IonCol size='6'>
                            {DeviceInfo !== null ? (
                              <IonIcon
                                src={imageOutline}
                                onClick={() => setShowActionSheet(true)}
                              />
                            ) : (
                              <label htmlFor='files'>
                                <input
                                  type='File'
                                  id='files'
                                  name='files'
                                  multiple={false}
                                  style={{ display: 'none' }}
                                  accept='image/*'
                                  value={''}
                                  onChange={_handleImageChange}
                                />
                                <IonIcon src={folderOutline} />
                              </label>
                            )}
                          </IonCol>
                        ) : (
                          ''
                        )}
                      </IonRow>
                      <IonModal
                        isOpen={cropModel}
                        onDidDismiss={closeCropModel}
                      >
                        <IonHeader>
                          <IonToolbar>
                            <IonGrid>
                              <IonRow>
                                <IonCol size='10'>
                                  <IonTitle>Crop Image</IonTitle>
                                </IonCol>
                                <IonCol size='2'>
                                  <IonIcon
                                    src={closeCircleOutline}
                                    onClick={() => setCropModel(false)}
                                  />
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </IonToolbar>
                        </IonHeader>
                        <IonContent>
                          <Cropper
                            style={{ height: 400, width: '100%' }}
                            initialAspectRatio={1}
                            preview='.img-preview'
                            src={base64}
                            ref={imageRef}
                            viewMode={1}
                            guides={true}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            background={false}
                            responsive={true}
                            checkOrientation={false}
                            onInitialized={instance => {
                              setCropper(instance)
                            }}
                          />
                          <h1>
                            <IonGrid>
                              <IonRow>
                                <IonCol>
                                  <span>Crop</span>
                                </IonCol>
                                <IonCol>
                                  <IonButton
                                    style={{ float: 'right' }}
                                    onClick={getCropData}
                                  >
                                    Crop Image
                                  </IonButton>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </h1>
                          <img
                            style={{ width: '100%' }}
                            src={cropData}
                            alt='cropped'
                          />
                          {cropData !== null ? (
                            <IonGrid>
                              <IonRow>
                                <IonCol>
                                  <IonButton onClick={closeCropModel}>
                                    Close
                                  </IonButton>
                                </IonCol>
                                <IonCol>
                                  <IonButton
                                    disabled={cropData === ''}
                                    onClick={imageUpload}
                                  >
                                    Save Changes
                                  </IonButton>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          ) : (
                            ''
                          )}
                        </IonContent>
                      </IonModal>
                    </IonGrid>
                    {/* View Activity */}
                    <ViewActivity
                      vid={id !== undefined ? id : data.voterid}
                      islock={data.lock}
                    />

                    <IonGrid>
                      <IonRow>
                        {item.REC_DATA_LOCK != 'Y' ? (
                          <IonCol size='6'>
                            <AddFamily
                              vid={id !== undefined ? id : data.voterid}
                            />
                          </IonCol>
                        ) : (
                          ''
                        )}
                        <IonCol size='6'>
                          <IonButton
                            color='primary'
                            onClick={() => getFamily(item.VOTERNO)}
                          >
                            {t('lan.lblLanViewFmly')}
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>

                    {/* Display Family Details   */}
                    <IonModal isOpen={showFamily}>
                      <IonHeader>
                        <IonToolbar>
                          <IonTitle>{t('lan.lblLanViewFmly')}</IonTitle>
                          <IonButtons slot='end'>
                            <IonIcon
                              src={closeCircleOutline}
                              onClick={closeFamily}
                            />
                          </IonButtons>
                        </IonToolbar>
                      </IonHeader>
                      <IonContent>
                        {Array.isArray(family) && family.length > 0
                          ? family.map((items: any, key: any) => {
                              return (
                                <IonCard key={key}>
                                  <IonCardContent className='complaint-card'>
                                    <IonGrid>
                                      {item.REC_DATA_LOCK != 'Y' ? (
                                        <IonRow>
                                          <IonCol size='4'>
                                            <IonLabel>
                                              {t('lan.lblLangNo')}
                                            </IonLabel>
                                          </IonCol>
                                          <IonCol size='5'>{key + 1}</IonCol>
                                          <IonCol size='3'>
                                            <IonIcon
                                              color='danger'
                                              onClick={() =>
                                                removeMembers(items.VOTERNO)
                                              }
                                              src={trashBinOutline}
                                            />
                                          </IonCol>
                                        </IonRow>
                                      ) : (
                                        ''
                                      )}

                                      <IonRow>
                                        <IonCol size='4'>
                                          <IonLabel>
                                            {t('lan.lblLangName')}
                                          </IonLabel>
                                        </IonCol>
                                        <IonCol size='8'>
                                          {items.ENG_F_NAME}
                                          {items.ENG_M_NAME}
                                          {items.ENG_SURNAME}
                                        </IonCol>
                                      </IonRow>
                                      {/* <IonRow>
                                  <IonCol size='4'><IonLabel>{t('lan.lblLangRelName')}</IonLabel></IonCol>
                                  <IonCol size='8'>{items.RELATION_SURNAME}</IonCol>
                                </IonRow> */}
                                      <IonRow>
                                        <IonCol size='4'>
                                          <IonLabel>
                                            {t('lan.lblLangVoterId')}
                                          </IonLabel>
                                        </IonCol>
                                        <IonCol size='8'>
                                          {items.VOTERNO}
                                        </IonCol>
                                      </IonRow>
                                      <IonRow>
                                        <IonCol size='4'>
                                          <IonLabel
                                            color='primary'
                                            style={{
                                              textDecoration: 'underline'
                                            }}
                                            onClick={() =>
                                              setMobile((prev: any) =>
                                                prev === key ? undefined : key
                                              )
                                            }
                                          >
                                            {t('lan.lblLangMobile')}
                                          </IonLabel>
                                        </IonCol>
                                        <IonCol size='8'>
                                          {items.ALTR_MOBNO}
                                        </IonCol>
                                      </IonRow>
                                      {mobile === key ? (
                                        <>
                                          <IonRow>
                                            <IonCol size='4'></IonCol>
                                            <IonCol size='8'>
                                              <IonInput
                                                type='number'
                                                name='newMobile'
                                                value={newData.newMobile}
                                                onIonChange={changeEvent}
                                              />
                                            </IonCol>
                                          </IonRow>

                                          <IonIcon
                                            className='showpassnew'
                                            style={{ top: '57%' }}
                                            src={saveOutline}
                                            onClick={() =>
                                              AddMobile(items.VOTERNO)
                                            }
                                          />
                                        </>
                                      ) : (
                                        ''
                                      )}
                                    </IonGrid>
                                  </IonCardContent>
                                </IonCard>
                              )
                            })
                          : ''}
                      </IonContent>
                    </IonModal>

                    <IonGrid className='rowborder'>
                      {item.VOTER_PROFILE !== null ? (
                        <IonRow>
                          <IonCol size='4'>
                            <IonImg src={item.VOTER_PROFILE} />
                          </IonCol>
                          <IonCol size='8'>
                            {/* <IonButton shape="round" fill="outline"
                            onClick={() => createPDFDownload(process.env.REACT_APP_API_URL + "DwnldIDCardSingle2?pAssembly=" + data.acno + "&pVoterNo=" + dataid, "Single_VoterCard.pdf", 'Single Voter Card')}
                          ><IonIcon className='button-icon' src={cloudDownloadOutline} />{t('lan.lblLangDownload')}</IonButton> */}
                            <IonButton
                              shape='round'
                              fill='outline'
                              onClick={() =>
                                removephoto(item.VOTERNO, item.AC_NO)
                              }
                            >
                              <IonIcon
                                className='button-icon'
                                src={trashBinOutline}
                              />
                              {t('lan.lblRemove')}
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      ) : (
                        ''
                      )}
                    </IonGrid>
                  </IonCardContent>
                  {/* Change/Edit Voter Details */}
                  <IonModal
                    isOpen={showModal}
                    onDidDismiss={() => setShowModal(false)}
                  >
                    <IonHeader>
                      <IonToolbar>
                        <IonGrid>
                          <IonRow>
                            <IonCol size='10'>
                              <IonTitle>{t('lan.lblChangeVoter')}</IonTitle>
                            </IonCol>
                            <IonCol size='2'>
                              <IonIcon
                                src={closeCircleOutline}
                                onClick={() => setShowModal(false)}
                              />
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonToolbar>
                    </IonHeader>
                    <IonGrid className='grid-scroll'>
                      <IonRow className='rowborder'>
                        <IonCol size='6'>
                          <span className='voter'>
                            <b>{item.VOTERNO}</b>
                          </span>
                        </IonCol>
                        <IonCol size='6' className='booth'>
                          <b>AcNo: {item.AC_NO}</b>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        {/* Designation */}
                        <IonCol>
                          <IonLabel>{t('lan.lblLangDesignation')}</IonLabel>
                          <select
                            value={data?.designation}
                            name='designation'
                            onChange={changeEvent}
                          >
                            <option value=''>Select</option>
                            <option value='PP'>PP</option>
                            <option value='PC'>PC</option>
                          </select>
                        </IonCol>

                        <IonCol>
                          {/* Category */}
                          <IonLabel>{t('lan.lblLangCategory')}</IonLabel>
                          <select
                            value={data?.category}
                            name='category'
                            onChange={changeEvent}
                          >
                            <option value=''>Select</option>
                            <option value='General'>General</option>
                            <option value='ST'>ST</option>
                            <option value='SC'>SC</option>
                            <option value='OBC'>OBC</option>
                          </select>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='6'>
                          <IonLabel>{t('lan.lblLangAadharNo')}</IonLabel>
                          <IonInput
                            type='number'
                            name='adharNo'
                            value={data?.adharNo}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                        <IonCol size='6'>
                          <IonLabel>{t('lan.lblLangCaste')}</IonLabel>
                          <IonInput
                            name='caste'
                            value={data?.caste}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='6'>
                          <IonLabel>{t('lan.lblLangMobile')}</IonLabel>
                          <IonInput
                            type='number'
                            name='mobileNo'
                            value={data?.mobileNo}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                        <IonCol size='6'>
                          <IonLabel>{t('lan.lblLangWhatsApp')}</IonLabel>
                          <IonInput
                            type='number'
                            name='whatsappNo'
                            value={data?.whatsappNo}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='12'>
                          <IonLabel>{t('lan.lblLangPrsntAddress')}</IonLabel>
                          <IonTextarea
                            name='address'
                            value={data?.address}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size='6'>
                          <IonLabel> {t('lan.lblLangDOB')}</IonLabel>

                          <IonInput
                            name='birthday'
                            type='date'
                            value={data?.birthday}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                        <IonCol size='6'>
                          <IonLabel>{t('lan.lblLangDOA')}</IonLabel>

                          <IonInput
                            name='anniverasary'
                            type='date'
                            value={data?.anniverasary}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='6'>
                          <IonLabel position='floating'>
                            {t('lan.lblLangPostInBjp')}
                          </IonLabel>
                          <IonInput
                            name='post'
                            value={data?.post}
                            onIonChange={changeEvent}
                          />
                        </IonCol>

                        {/* Party Affiliation */}
                        <IonCol size='6'>
                          <IonLabel position='floating'>
                            {' '}
                            {t('lan.lblLangPartyAffiliation')}
                          </IonLabel>
                          <select
                            name='party'
                            value={data?.party}
                            onChange={changeEvent}
                          >
                            <option value=''>Select</option>
                            <option value='BJP'>BJP</option>
                            <option value='SHIV-SENA'>SHIV-SENA</option>
                            <option value='NEUTRAL'>NEUTRAL</option>
                            <option value='Other'>OTHER</option>
                          </select>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        {/* Blood Group */}
                        <IonCol size='6'>
                          <IonLabel>{t('lan.lblLangBloodGroup')}</IonLabel>
                          <IonCol size='9'>
                            <select
                              name='bloodGroup'
                              value={data?.bloodGroup}
                              onChange={changeEvent}
                            >
                              <option value=''>Select</option>
                              {Array.isArray(bloodGrp) && bloodGrp.length > 0
                                ? bloodGrp.map((item: any, key: any) => {
                                    ;<option value=''>Select</option>
                                    return (
                                      <option
                                        key={key}
                                        value={item.BLOOD_GROUP_NAME}
                                      >
                                        {item.BLOOD_GROUP_NAME}
                                      </option>
                                    )
                                  })
                                : 'No Data'}
                            </select>
                          </IonCol>
                        </IonCol>
                        <IonCol size='6'>
                          <IonLabel>{t('lan.lblLangFB')}</IonLabel>
                          <IonInput
                            name='facebook'
                            value={data?.facebook}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='6'>
                          <IonLabel>{t('lan.lblLangEmail')}</IonLabel>
                          <IonInput
                            name='email'
                            value={data?.email}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                        <IonCol size='6'>
                          <IonLabel>{t('lan.lblLangInstagram')}</IonLabel>
                          <IonInput
                            name='instagram'
                            value={data?.instagram}
                            onIonChange={changeEvent}
                          />
                        </IonCol>
                      </IonRow>

                      {item.REC_DATA_LOCK != 'Y' ? (
                        <IonRow>
                          <IonCol size='4'>
                            <IonButton
                              shape='round'
                              fill='outline'
                              onClick={saveData}
                            >
                              {flag === 'EDIT' ? 'EDIT' : t('lan.btnSave')}
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      ) : (
                        ''
                      )}
                    </IonGrid>
                  </IonModal>
                </IonCard>
              )
            })
          : ''}

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header='Select Any One'
          cssClass='my-custom-class'
          buttons={[
            {
              text: 'Gallery',
              icon: imageOutline,
              handler: () => {
                pickImage(Camera.PictureSourceType.SAVEDPHOTOALBUM)
              }
            },
            {
              text: 'Camera',
              icon: cameraReverseOutline,
              handler: () => {
                pickImage(Camera.PictureSourceType.CAMERA)
              }
            }
          ]}
        ></IonActionSheet>
      </IonContent>
    </IonPage>
  )
}

export default EntryThohghVoterId
