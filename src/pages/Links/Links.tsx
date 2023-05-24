import React from 'react';
import { IonContent,IonPage } from '@ionic/react';
import Header from '../../components/Header';
import List from '../../components/List';
import { useTranslation } from 'react-i18next';
import { InAppBrowserOptions } from '@ionic-native/in-app-browser';
import Namo from "../../assets/img/namo.jpg";
import BJP from "../../assets/img/bjp_logo.png";
import Amit from "../../assets/img/AmitShah.jpg";
import JP from "../../assets/img/jpnadda.jpg";


const Links: React.FC = () => {

  const {t} = useTranslation();
  const openBrowser = (url: string) => {
    window.open(url)
  }

  return (
    <IonPage>
    <Header titleName={t('lan.lblQuickLinksMenu')} />
    <IonContent fullscreen className='page_content'>
    <List name={t('lan.lblLangNamoApp')} src={Namo} click={() => openBrowser("https://www.narendramodi.in/downloadapp")} />
        <List name={t('lan.lblLangBJP')} src={BJP} click={() => openBrowser("https://www.bjp.org/")} />
        <List name={t('lan.lblLangAmitShahJi')} src={Amit} click={() => openBrowser("http://amitshah.co.in/")} />
        <List name={t('lan.lblLangJPNaddaJi')} src={JP} click={() => openBrowser("https://jagatprakashnadda.in/")} />
    </IonContent>
  </IonPage>
  );
};

export default Links;
