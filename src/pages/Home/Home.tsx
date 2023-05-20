import React, { useEffect, useRef, useState } from 'react'
import {
  IonAlert,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonRefresher,
  IonRefresherContent,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  useIonToast,
  IonPage,
  IonPopover,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  RefresherEventDetail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonAlert,
  IonText,
  IonInput,
  IonButton
} from '@ionic/react'
import {
  copyOutline,
  downloadOutline,
  powerOutline,
  shareSocialOutline
} from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { languageOutline } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import { App } from '@capacitor/app'
import axiosApi from '../../axiosApi'
import moment from 'moment'
import Tabs from '../../components/Tabs'
import { Clipboard } from '@ionic-native/clipboard'

import Footer from '../../components/Footer'
import useDownLoad from '../../hooks/download.hook'
import { useStorage } from '../../hooks/useStorage';
import { useDeviceInfo } from '../../hooks/useDeviceInfo'

const Home: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [presentAlert] = useIonAlert()
  const [showLan, setShowLan] = useState(false)
  const [selectLan, setSelectLan] = useState<string>('Eng')
  const [showBackAlert, setShowBackAlert] = useState(false)
  const [value, setValue] = useState<any>([])
  const [load, setLoad] = useState<Boolean>(false)
  const [isReadMore, setIsReadMore] = useState(false)
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false)
  const popover = useRef<HTMLIonPopoverElement>(null)
  localStorage.setItem('SelectedLang', selectLan)

  const { downloadFilesFor, socialShare } = useDownLoad();
  const { deleteloginDatatatus } = useStorage();
  const { DeviceInfo } = useDeviceInfo();

  const nullEntry: any[] = []
  const [notifications, setnotifications] = useState(nullEntry)
  const [showNotification, setShowNotification] = useState<boolean>(false)

  const [present] = useIonToast()

  const language = () => {
    setShowLan(true)
  }

  const handleClick = (lang: any) => {
    i18next.changeLanguage(lang)
    localStorage.setItem('SelectedLang', lang)
    setSelectLan(lang)
    setShowLan(false)
  }
  const logout = () => {
    localStorage.clear();
    deleteloginDatatatus() // Clear Value from Localforage
    history.replace('/');    
    App.exitApp();      
  }

  useEffect(() => {
    pushData()
  }, [])

  const pushData = () => {
    
    // get data for News Feed
    axiosApi
      .get('/retieveMediaAlbumCat')
      .then(res => {
        const Data = JSON.parse(res.data)
        if (Data.error === false) {
          const res = JSON.parse(Data.data)
          setValue(res)
        } else {
          present(Data.msg, 3000)
        }
      })
      .catch(err => {
        present(err.message, 3000)
      })
  }

  useEffect(() => {
    document.addEventListener('ionBackButton', (ev: any) => {
      ev.detail.register(-1, () => {
        // when you are in your home(last) page
        if (history.location.pathname === '/home') {
          // calling alert box
          setShowBackAlert(true)
        }
      })
    })
  }, [])

  const loadData = (ev: any) => {
    setTimeout(() => {
      pushData()
      ev.target.complete()
    }, 1000)
  }

  useIonViewWillEnter(() => {
    pushData()
  })

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    pushData()
    setTimeout(() => {
      event.detail.complete()
    }, 5000)
  }

  const copyToLink = (link: string) => {
    {
      DeviceInfo !== null
        ? Clipboard.copy(link)
        : navigator.clipboard.writeText(link)
    }
    present(link === '' ? 'Link not availabel' : 'Link Copied!', 3000)
  }

  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='4'>
                <IonIcon src={languageOutline} onClick={() => language()} />
              </IonCol>
              <IonCol size='4'>
                <IonTitle>{t('lan.MenuHome')}</IonTitle>
              </IonCol>
              <IonCol size='4'>
                <IonIcon
                  src={powerOutline}
                  onClick={() =>
                    presentAlert({
                      header: 'Are you sure exit?',
                      cssClass: 'custom-alert',
                      buttons: [
                        {
                          text: 'No',
                          role: 'cancel',
                          cssClass: 'alert-button-cancel'
                        },
                        {
                          text: 'Yes',
                          role: 'confirm',
                          cssClass: 'alert-button-confirm',
                          handler: () => {
                            logout()
                          }
                        }
                      ]
                    })
                  }
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
        <Tabs />
      </IonHeader>

      <IonContent fullscreen>
        <Footer />

        <IonPopover
          isOpen={showLan}
          arrow={false}
          onDidDismiss={() => setShowLan(false)}
        >
          <IonContent>
            <IonList>
              <IonRadioGroup
                value={selectLan}
                onIonChange={e => setSelectLan(e.detail.value)}
              >
                <IonListHeader>
                  <IonLabel>{t('lan.lblLangSelction')}</IonLabel>
                </IonListHeader>
                <IonItem>
                  <IonLabel>English</IonLabel>
                  <IonRadio
                    value='Eng'
                    onClick={() => handleClick('Eng')}
                  ></IonRadio>
                </IonItem>

                <IonItem>
                  <IonLabel>हिंदी</IonLabel>
                  <IonRadio
                    value='Hi'
                    onClick={() => handleClick('Hi')}
                  ></IonRadio>
                </IonItem>

                <IonItem>
                  <IonLabel>Gujarati</IonLabel>
                  <IonRadio
                    value='Gu'
                    onClick={() => handleClick('Gu')}
                  ></IonRadio>
                </IonItem>
              </IonRadioGroup>
            </IonList>
          </IonContent>
        </IonPopover>

        <IonAlert
          isOpen={showBackAlert}
          header={'Please Confirm!'}
          message={'Do you really want to exit our App?'}
          buttons={[
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {}
            },
            {
              text: 'Yes',
              handler: () => {
                App.exitApp()
              }
            }
          ]}
          onDidDismiss={() => setShowBackAlert(false)}
          cssClass='my-custom-class'
        />

        <IonRefresher slot='fixed' onIonRefresh={doRefresh}>
          <IonRefresherContent color='primary'></IonRefresherContent>
        </IonRefresher>

        {load ? (
          <IonSpinner name='bubbles' />
        ) : Array.isArray(value) && value.length > 0 ? (
          value.map((item: any, key: any) => {
            return (
              <div key={key}>
                <IonCard key={key} className='card cardHome'>
                  <IonCardHeader>
                    <IonCardTitle
                      className='rowborder'
                      style={{ textAlign: 'center' }}
                    >
                      <b style={{ textAlign: 'center', color: 'black' }}>
                        {item.NEWS_HEADING}
                      </b>
                    </IonCardTitle>
                    <span style={{ fontWeight: '700', color: 'red' }}>
                      {item.NEWS_PAPER} :{' '}
                      {moment(item?.NEWS_DATE).format('DD-MM-yyyy')}
                    </span>
                    <IonImg
                      src={
                        process.env.REACT_APP_API_IMAGE +
                        `NewsFeedsGallery/${item?.NEWS_ATTACHMENTS}`
                      }
                    />
                  </IonCardHeader>

                  <IonCardContent className='cardContenct'>
                    {isReadMore === key
                      ? item.NEWS_CONTENTS
                      : item.NEWS_CONTENTS.substring(0, 100)}
                    {item.NEWS_CONTENTS.length < 100 ? (
                      ''
                    ) : (
                      <IonLabel
                        style={{ color: '#263238' }}
                        onClick={() =>
                          setIsReadMore(prev =>
                            prev === key ? undefined : key
                          )
                        }
                      >
                        {isReadMore === key
                          ? t('lan.lblReadless')
                          : t('lan.lblReadMore')}
                      </IonLabel>
                    )}
                  </IonCardContent>
                  <IonGrid className='header'>
                    <IonRow style={{ textAlign: 'center' }}>
                      <IonCol size='4'>
                        <IonIcon
                          src={shareSocialOutline}
                          style={{color : 'white'}}
                          onClick={() =>
                            socialShare(
                              item.NEWS_CONTENTS,
                              item.NEWS_HEADING,
                              process.env.REACT_APP_API_IMAGE +
                                `NewsFeedsGallery/${item.NEWS_ATTACHMENTS}`
                            )
                          }
                        />
                      </IonCol>
                      <IonCol size='4'>
                        <IonIcon
                          src={copyOutline}
                          style={{color : 'white'}}
                          onClick={() => copyToLink(item.NEWS_LINK)}
                        />
                      </IonCol>
                      <IonCol size='4'>
                        {DeviceInfo !== null ? (
                          <IonIcon
                            src={downloadOutline}
                            style={{color : 'white'}}
                            onClick={() =>
                              downloadFilesFor(
                                process.env.REACT_APP_API_IMAGE +
                                  `NewsFeedsGallery/${item.NEWS_ATTACHMENTS}`,
                                item.NEWS_ATTACHMENTS,
                                'News Feeds'
                              )
                            }
                          />
                        ) : (
                          <a
                            href={
                              process.env.REACT_APP_API_IMAGE +
                              `NewsFeedsGallery/${item.NEWS_ATTACHMENTS}`
                            }
                            download={true}
                          >
                            <IonIcon style={{color : 'white'}} src={downloadOutline} />{' '}
                          </a>
                        )}
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCard>
              </div>
            )
          })
        ) : (
          'No Data'
        )}

        

        {notifications.length !== 0 &&
          notifications.map((notif: any) => (
            <>
              <IonPopover
                side='top'
                alignment='center'
                key={notif.id}
                ref={popover}
                isOpen={showNotification}
                onDidDismiss={() => setShowNotification(false)}
              >
                <IonContent className='ion-padding'>
                  <IonText>
                    <h6 className='notif-title'>{notif.title}</h6>
                  </IonText>
                  <p>{notif.body}</p>
                </IonContent>
              </IonPopover>
              {/* <IonItem >
                  <IonLabel>
                    <p></p>
                    {notif.type === 'foreground' && <p>This data was received in foreground</p>}
                    {notif.type === 'action' && <p>This data was received on tap</p>}
                  </IonLabel>
                </IonItem> */}
            </>
          ))}

        <IonInfiniteScroll
          onIonInfinite={loadData}
          threshold='100px'
          disabled={isInfiniteDisabled}
        >
          <IonInfiniteScrollContent
            loadingSpinner='bubbles'
            loadingText='Loading more data...'
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  )
}

export default Home
