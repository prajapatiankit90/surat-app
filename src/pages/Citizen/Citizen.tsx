import React from 'react';
import { IonContent, IonPage, } from '@ionic/react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import List from '../../components/List';
import { useTranslation } from 'react-i18next';
import find from "../../assets/img/49_mps_program.png";
import single from "../../assets/img/50_complaint.png";
import register from "../../assets/img/51_complaint_status.png";
import goal from "../../assets/img/52_gov_scheme.png";
import poll from "../../assets/img/SVG/35_Birthday_Greeting.svg";
import votingsts from "../../assets/img/SVG/45_Anniversary.svg";
import livevote from "../../assets/img/53_Appointment.svg";
import resultelection from "../../assets/img/54_AppointmentViewer.svg";
import pollreport from "../../assets/img/47_Grant_Details.svg";

const Citizen: React.FC = () => {
  const { t } = useTranslation();
  const Level : any = localStorage.getItem('loginas')
  return (
    <IonPage>
      <Header titleName={t('lan.lblCitizen')} />
      <IonContent fullscreen>
        {Level === 'ASSEMBLY_ADMIN' || Level === 'WARD_PRAMUKH' || Level === 'SHAKTIKENDRA_INCHARGE' || Level === "BOOTH_PR" ? 
        <>
        <Link className='menu' to="/mpprogram"><List name={t('lan.MenuMPsProgram')} src={find} click="" /></Link> 
        <Link className='menu' to="/complain"><List name={t('lan.MenuComplenSug')} click="" src={single} /></Link>
        <Link className='menu' to="/complainstatus"><List name={t('lan.MenuComplenSituation')} click="" src={goal} /></Link>
        <Link className='menu' to="/govment"><List name={t('lan.MenuGovScheme')} click="" src={register} /></Link>
        <Link className='menu' to="/birthday"><List name={t('lan.MenuBirthdayGreet')} src={poll} click="" /></Link>
        <Link className='menu' to="/anniversary"><List name={t('lan.MenuAnniGreet')} src={votingsts} click="" /></Link>
        <Link className='menu' to="/appointment"><List name={t('lan.MenuBookAppointment')} click="" src={livevote} /></Link>
        <Link className='menu' to="/appstatus"><List name={t('lan.MenuAppointmentStatus')} click="" src={resultelection} /></Link>
        <Link className='menu' to="/grantdetail"><List name={t('lan.MenuGrantDetails')} click="" src={pollreport} /></Link>
        </>
       : 
        Level === 'SHUBHECHHAK' ? 
        <>
        <Link className='menu' to="/govment"><List name={t('lan.MenuGovScheme')} click="" src={register} /></Link>
        <Link className='menu' to="/birthday"><List name={t('lan.MenuBirthdayGreet')} src={poll} click="" /></Link>
        <Link className='menu' to="/anniversary"><List name={t('lan.MenuAnniGreet')} src={votingsts} click="" /></Link>
        <Link className='menu' to="/appointment"><List name={t('lan.MenuBookAppointment')} click="" src={livevote} /></Link>
        <Link className='menu' to="/appstatus"><List name={t('lan.MenuAppointmentStatus')} click="" src={resultelection} /></Link>
        <Link className='menu' to="/grantdetail"><List name={t('lan.MenuGrantDetails')} click="" src={pollreport} /></Link>
        </>       
        : 
        Level === 'GUEST' ? 
        <>
        <Link className='menu' to="/complain"><List name={t('lan.MenuComplenSug')} click="" src={single} /></Link>
        <Link className='menu' to="/complainstatus"><List name={t('lan.MenuComplenSituation')} click="" src={goal} /></Link>
        <Link className='menu' to="/govment"><List name={t('lan.MenuGovScheme')} click="" src={register} /></Link>
        <Link className='menu' to="/appointment"><List name={t('lan.MenuBookAppointment')} click="" src={livevote} /></Link>
        <Link className='menu' to="/appstatus"><List name={t('lan.MenuAppointmentStatus')} click="" src={resultelection} /></Link>
        <Link className='menu' to="/grantdetail"><List name={t('lan.MenuGrantDetails')} click="" src={pollreport} /></Link>
        </>
        :
        <>
        <Link className='menu' to="/mpprogram"><List name={t('lan.MenuMPsProgram')} src={find} click="" /></Link> 
        <Link className='menu' to="/complain"><List name={t('lan.MenuComplenSug')} click="" src={single} /></Link>
        <Link className='menu' to="/complainstatus"><List name={t('lan.MenuComplenSituation')} click="" src={goal} /></Link>
        <Link className='menu' to="/govment"><List name={t('lan.MenuGovScheme')} click="" src={register} /></Link>
        <Link className='menu' to="/birthday"><List name={t('lan.MenuBirthdayGreet')} src={poll} click="" /></Link>
        <Link className='menu' to="/anniversary"><List name={t('lan.MenuAnniGreet')} src={votingsts} click="" /></Link>
        <Link className='menu' to="/appointment"><List name={t('lan.MenuBookAppointment')} click="" src={livevote} /></Link>
        <Link className='menu' to="/appstatus"><List name={t('lan.MenuAppointmentStatus')} click="" src={resultelection} /></Link>
        <Link className='menu' to="/grantdetail"><List name={t('lan.MenuGrantDetails')} click="" src={pollreport} /></Link>     
       </>
       }
      </IonContent>
    </IonPage>
  );
};

export default Citizen;
