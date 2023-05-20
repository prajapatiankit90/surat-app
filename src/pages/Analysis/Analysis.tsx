import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import List from '../../components/List';
import { useTranslation } from 'react-i18next';
import pagewise from "../../assets/img/35_Page_Pramukh.png";
import boothwise from "../../assets/img/37_Reports.svg";
import assembly from "../../assets/img/3_grid.svg";


const Analysis: React.FC = () => {
    const { t } = useTranslation();
    // 
    const Level: any = localStorage.getItem('loginas')

    return (
        <IonPage>
            <Header titleName={t('lan.lblAnalysis')} />
            <IonContent fullscreen>
                {Level === 'SHAKTIKENDRA_INCHARGE' ?
                    <>
                        <Link to="/boothwise" className='menu'><List name={t('lan.lblLangBoothPPPCReport')} click="" src={boothwise} /></Link>
                        <Link to="/boothwisesurname" className='menu'><List name={t('lan.lblLangBoothWiseCaste')} click="" src={assembly} /></Link>
                        <Link to="/agewise" className='menu'><List name={t('lan.lblLangAgeWiseVoter')} click="" src={assembly} /></Link>
                    </>
                    :
                    Level === 'BOOTH_PR' ?
                        <>
                            <Link to="/pagewise" className='menu'><List name={t('lan.lblLangPPPCSummaryReport')} src={pagewise} click="" /></Link>
                            <Link to="/boothwise" className='menu'><List name={t('lan.lblLangBoothPPPCReport')} click="" src={boothwise} /></Link>
                            <Link to="/boothwisesurname" className='menu'><List name={t('lan.lblLangBoothWiseCaste')} click="" src={assembly} /></Link>
                            <Link to="/agewise" className='menu'><List name={t('lan.lblLangAgeWiseVoter')} click="" src={assembly} /></Link>
                        </>
                        : <>
                            <Link to="/pagewise" className='menu'><List name={t('lan.lblLangPPPCSummaryReport')} src={pagewise} click="" /></Link>
                            <Link to="/assemblywise" className='menu'><List name={t('lan.lblLangAcWiseCaste')} click="" src={assembly} /></Link>
                            <Link to="/boothwise" className='menu'><List name={t('lan.lblLangBoothPPPCReport')} click="" src={boothwise} /></Link>
                            <Link to="/boothwisesurname" className='menu'><List name={t('lan.lblLangBoothWiseCaste')} click="" src={assembly} /></Link>
                            <Link to="/agewise" className='menu'><List name={t('lan.lblLangAgeWiseVoter')} click="" src={assembly} /></Link>
                        </>}
            </IonContent>
        </IonPage>
    );
};

export default Analysis;
