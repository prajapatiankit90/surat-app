import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import {
  IonIcon,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { imagesOutline, logoFacebook, logoInstagram, logoTwitter, logoYoutube, people } from 'ionicons/icons';


import { Link, useHistory } from 'react-router-dom';

const Footer: React.FC = () => {
  const history = useHistory()
  const options: InAppBrowserOptions = {
    location: 'no',
    zoom: 'no',
    hideurlbar: 'yes',
    toolbar: 'yes',
    toolbarposition: 'top'
  }

  const openBrowser = (url: string) => {
    const browser = InAppBrowser.create(url, '_target', options);
    // browser.executeScript(your script) // Docs aren't clear to me and i haven't tested
    browser.show()
  }



  return (
    <>
      <IonCard className='footer-card'>
        <IonGrid>
          <IonRow>
          <IonCol className="tab-menu-col" ><IonIcon style={{ color: '#4267B2' }} src={logoFacebook} onClick={() => openBrowser("https://www.facebook.com/CRPatilMP/")} /></IonCol>
            <IonCol className="tab-menu-col"><IonIcon style={{ color: '#00acee' }} src={logoTwitter} onClick={() => openBrowser('https://twitter.com/CRPaatil')} /></IonCol>
            <IonCol className="tab-menu-col" ><IonIcon style={{ color: '#8a3ab9' }} src={logoInstagram} onClick={() => openBrowser('https://www.instagram.com/crpaatil/?hl=en')} /></IonCol>
            <IonCol className="tab-menu-col"><Link to="/video"><IonIcon style={{ color: '#FF0000' }} src={logoYoutube} /></Link></IonCol>
            <IonCol className="tab-menu-col" ><IonIcon style={{ color: '#00acee' }} onClick={() => history.replace("/gallery")} src={imagesOutline} /></IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
    </>
  )
}

export default Footer;