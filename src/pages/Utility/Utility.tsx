import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import List from '../../components/List';
import { useTranslation } from 'react-i18next';
import past from "../../assets/img/29_Election_Result.svg";
import single from "../../assets/img/24_Voter_List.png";




const Utility: React.FC = () => {

  const { t } = useTranslation();
  const Level: any = localStorage.getItem('loginas')

  return (
    <IonPage>
      <Header titleName={t('lan.lblUtility')} />
      <IonContent fullscreen>
        <Link to="/pastelection" className='menu'><List name={t('lan.MenuPastElectionResult')} src={past} click="" /></Link>
        <Link to="/voterlist" className='menu'><List name={t('lan.MenuVoterList')} click="" src={single} /></Link>
        <Link to="/entrythrough" className='menu'><List name={t('lan.MenuSingleVoterList')} click="" src={single} /></Link>
        <Link to="/letterreport" className='menu'><List name={t('lan.lblLetterReport')} click="" src={past} /></Link>
        {/* {Level !== 'SHAKTIKENDRA_INCHARGE' && Level !== 'BOOTH_PR' ? 
        <Link to="/castewise" className='menu'><List name={t('lan.MenuCasteWiseVoters2')} click="" src={cast} /></Link>
        : ""} */}



      </IonContent>

    </IonPage>
  );
};

export default Utility;
