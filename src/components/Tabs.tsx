import {
  IonIcon,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
} from '@ionic/react';
import { home, link, bookmarks, clipboard, people, briefcase, cogOutline, layersOutline, readerOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';

const Tabs: React.FC = () => {
  const { t } = useTranslation();
  const [Menu, setMenu] = useState<any>();

  useEffect(() => {
    const menu = localStorage.getItem("loginas");
    setMenu(menu);
  }, [])

  return (
    <>
      {Menu === 'GUEST' ? (
        <Swiper >
          <SwiperSlide>
            <IonCard className='tab-menu-card'>
              <IonGrid>
                <IonRow>
                  <IonCol className="tab-menu-col" ><Link to="/home"><IonIcon className='tab-menu-icon' src={home} /></Link></IonCol>
                  <IonCol className="tab-menu-col"><Link to="/citizen"><IonIcon className='tab-menu-icon' src={people} /></Link></IonCol>
                  <IonCol className="tab-menu-col"><Link to="/link"><IonIcon className='tab-menu-icon' src={link} /></Link></IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="tab-menu-col" ><Link to="/home"><IonLabel className='tab-menu'>{t('lan.MenuHome')}</IonLabel></Link></IonCol>
                  <IonCol className="tab-menu-col"><Link to="/citizen"><IonLabel className='tab-menu'>{t('lan.lblCitizen')}</IonLabel></Link></IonCol>
                  <IonCol className="tab-menu-col"><Link to="/link"><IonLabel className="tab-menu">{t('lan.lblQuickLinksMenu')}</IonLabel></Link></IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>
          </SwiperSlide>
        </Swiper>
      ) :
        Menu === 'SHUBHECHHAK' ?
          (
            <Swiper scrollbar={true}  >
              <SwiperSlide>
                <IonCard className='tab-menu-card'>
                  <IonGrid>
                    <IonRow>
                      <IonCol className="tab-menu-col" ><Link to="/home"><IonIcon className='tab-menu-icon'  src={home} /></Link></IonCol>
                      <IonCol className="tab-menu-col"><Link to="/election"><IonIcon className='tab-menu-icon'  src={clipboard} /></Link></IonCol>
                      <IonCol className="tab-menu-col"><Link to="/citizen"><IonIcon className='tab-menu-icon' src={people} /></Link></IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol className="tab-menu-col" ><Link to="/home"><IonLabel className='tab-menu'>{t('lan.MenuHome')}</IonLabel></Link></IonCol>
                      <IonCol className="tab-menu-col"><Link to="/election"><IonLabel className='tab-menu'>{t('lan.lblElection')}</IonLabel></Link></IonCol>
                      <IonCol className="tab-menu-col"><Link to="/citizen"><IonLabel className='tab-menu'>{t('lan.lblCitizen')}</IonLabel></Link></IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCard>
              </SwiperSlide>
            </Swiper>
          ) : (
            <>
              <Swiper scrollbar={true}  >
                <SwiperSlide>
                  <IonCard className='tab-menu-card'>

                    <IonGrid>
                      <IonRow>
                        <IonCol className="tab-menu-col" ><Link to="/home"><IonIcon className='tab-menu-icon'  src={home} /></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/party"><IonIcon className='tab-menu-icon' src={bookmarks} /></Link></IonCol >
                        <IonCol className="tab-menu-col"><Link to="/election"><IonIcon className='tab-menu-icon' src={clipboard} /></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/utility"><IonIcon className='tab-menu-icon'  src={cogOutline} /></Link> </IonCol>
                        <IonCol className="tab-menu-col"><Link to="/analysis"><IonIcon className='tab-menu-icon'  src={layersOutline} /></Link> </IonCol>

                      </IonRow>
                      <IonRow>
                        <IonCol className="tab-menu-col" ><Link to="/home"><IonLabel className='tab-menu'>{t('lan.MenuHome')}</IonLabel></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/party"><IonLabel className='tab-menu'>{t('lan.lblParty')}</IonLabel></Link></IonCol >
                        <IonCol className="tab-menu-col"><Link to="/election"><IonLabel className='tab-menu'>{t('lan.lblElection')}</IonLabel></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/utility"><IonLabel className='tab-menu'>{t('lan.lblUtility')}</IonLabel></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/analysis"><IonLabel className='tab-menu'>{t('lan.lblAnalysis')}</IonLabel></Link></IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCard>
                </SwiperSlide>
                <SwiperSlide>
                  <IonCard className='tab-menu-card'>
                    <IonGrid>
                      <IonRow>
                        <IonCol className="tab-menu-col"><Link to="/citizen"><IonIcon className='tab-menu-icon' src={people} /></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/beneficiary"><IonIcon className='tab-menu-icon' src={briefcase} /></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/influencer"><IonIcon className='tab-menu-icon' src={readerOutline} /></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/link"><IonIcon className='tab-menu-icon' src={link} /></Link></IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol className="tab-menu-col"><Link to="/citizen"><IonLabel className='tab-menu'>{t('lan.lblCitizen')}</IonLabel></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/beneficiary"><IonLabel className='tab-menu'>{t('lan.MenuBeneficiary')}</IonLabel></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/influencer"><IonLabel className='tab-menu'> {t('lan.lblInfluencerMenu')}</IonLabel></Link></IonCol>
                        <IonCol className="tab-menu-col"><Link to="/link"><IonLabel className="tab-menu">{t('lan.lblQuickLinksMenu')}</IonLabel></Link></IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCard>
                </SwiperSlide>
              </Swiper>
            </>
          )
      }
    </>
  )
}

export default Tabs;