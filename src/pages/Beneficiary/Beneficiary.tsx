import React, { useEffect, useState } from 'react';
import { IonContent, IonIcon, IonItem, IonLabel, IonPage, IonThumbnail } from '@ionic/react';
import Header from '../../components/Header';
import { useTranslation } from 'react-i18next';
import axiosApi from '../../axiosApi';
import { Link } from 'react-router-dom';
import { arrowForward } from 'ionicons/icons';


const Beneficiary: React.FC = () => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState([]);

  const langs = localStorage.getItem("SelectedLang")
  useEffect(() => {
    axiosApi.get("/GetBeneficiaryMasWithCategory?pLang=" + langs + "&pCategory=BENEFICIARY")
      .then((res) => {
        const Resp = JSON.parse(res.data)
        const Data = JSON.parse(Resp?.data)
        if (Resp.error === false) {
          setMenu(Data)
        }
      })
      .catch(err => {
        console.error(err.message);
      })
  }, [langs])


  return (
    <IonPage>
      <Header titleName={t('lan.MenuBeneficiary')} />
      <IonContent fullscreen className='menu_content page_content'>
        {Array.isArray(menu) && menu.length >= 0 ?
          menu.map((item: any, key: any) => {
            return (
              <Link className='menu'
                to={{
                  pathname: '/beneficiasrysub',
                  state: {
                    menu: item.BENF_ITEM_TYPE,
                    submenu: item.BENF_ITEM_NAME
                  }
                }} key={key}>
                <IonItem key={key}>
                  <IonThumbnail style={{ textAlign: 'center' }} slot="start">
                    <IonLabel className='benificary-lable'>{key + 1}</IonLabel>
                  </IonThumbnail>
                  <IonLabel>
                    {item.BENF_ITEM_NAME}
                  </IonLabel>
                  <IonIcon src={arrowForward} />
                </IonItem>
              </Link>
            )
          }) : ""}

      </IonContent>

    </IonPage>
  );
};

export default Beneficiary;
