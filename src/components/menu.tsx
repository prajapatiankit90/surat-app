import { IonContent, IonHeader, IonIcon,  IonItem, IonLabel, IonList, IonMenu,  IonMenuToggle,  IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { briefcaseOutline, cogOutline, discOutline, homeOutline, idCardOutline, layersOutline, linkOutline, listCircleOutline, powerOutline, readerOutline } from 'ionicons/icons';
import { App } from '@capacitor/app';
import { useEffect, useState } from 'react';


interface HeaderProps {
    titleName: string
}

const Menu: React.FC<HeaderProps> = ({ titleName }) => {
    const { t } = useTranslation();
    const [presentAlert] = useIonAlert();
    const [level , setLevel] = useState<any>()
    const history = useHistory();
    

    useEffect(() => {
        const Level: any = localStorage.getItem('loginas')
        setLevel(Level)
    },[level])

    const logout = () => {
        history.replace("/")
        localStorage.clear();
        App.exitApp();
    }

    return (
        <IonMenu contentId={titleName}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle> {t('lan.lblLangMenu')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonMenuToggle autoHide={false}>
                    <IonList>

                        {level === 'GUEST' ?
                            <>
                                <NavLink className="menu" to={"/home"}><IonItem detail>
                                    <IonIcon style={{ color: 'black', marginRight: '15px' }} src={homeOutline} />
                                    <IonLabel>{t('lan.MenuHome')}</IonLabel></IonItem>
                                </NavLink>
                                <NavLink className="menu" to={"/citizen"}>
                                    <IonItem detail >
                                        <IonIcon src={idCardOutline} style={{ color: 'black', marginRight: '15px' }} />
                                        <IonLabel>{t('lan.lblCitizen')}</IonLabel>
                                    </IonItem>
                                </NavLink>

                            </>
                            :

                            level === 'SHUBHECHHAK' ?
                                <>
                                    <NavLink className="menu" to={"/home"}><IonItem detail>
                                        <IonIcon style={{ color: 'black', marginRight: '15px' }} src={homeOutline} />
                                        <IonLabel>{t('lan.MenuHome')}</IonLabel></IonItem>
                                    </NavLink>

                                    <NavLink className="menu" to={"/election"}>
                                        <IonItem detail >
                                            <IonIcon style={{ color: 'black', marginRight: '15px' }} src={discOutline} />
                                            <IonLabel>{t('lan.lblElection')}</IonLabel></IonItem>
                                    </NavLink>
                                    <NavLink className="menu" to={"/citizen"}>
                                        <IonItem detail >
                                            <IonIcon src={idCardOutline} style={{ color: 'black', marginRight: '15px' }} />
                                            <IonLabel>{t('lan.lblCitizen')}</IonLabel>
                                        </IonItem>
                                    </NavLink>
                                </>
                                :
                                <>
                                    <NavLink className="menu" to={"/home"}><IonItem detail>
                                        <IonIcon style={{ color: 'black', marginRight: '15px' }} src={homeOutline} />
                                        <IonLabel>{t('lan.MenuHome')}</IonLabel></IonItem>
                                    </NavLink>
                                    <NavLink className="menu" to={"/party"}>
                                        <IonItem detail >
                                            <IonIcon style={{ color: 'black', marginRight: '15px' }} src={listCircleOutline} />
                                            <IonLabel>{t('lan.lblParty')}</IonLabel>
                                        </IonItem>
                                    </NavLink>
                                    <NavLink className="menu" to={"/election"}>
                                        <IonItem detail >
                                            <IonIcon style={{ color: 'black', marginRight: '15px' }} src={discOutline} />
                                            <IonLabel>{t('lan.lblElection')}</IonLabel></IonItem></NavLink>
                                    <NavLink className="menu" to={"/utility"}>
                                        <IonItem detail >
                                            <IonIcon style={{ color: 'black', marginRight: '15px' }} src={cogOutline} />
                                            <IonLabel>{t('lan.lblUtility')}</IonLabel></IonItem></NavLink>

                                    <NavLink className="menu" to={"/analysis"}>
                                        <IonItem detail >
                                            <IonIcon style={{ color: 'black', marginRight: '15px' }} src={layersOutline} />
                                            <IonLabel>{t('lan.lblAnalysis')}</IonLabel>
                                        </IonItem></NavLink>
                                    <NavLink className="menu" to={"/citizen"}>
                                        <IonItem detail >
                                            <IonIcon src={idCardOutline} style={{ color: 'black', marginRight: '15px' }} />
                                            <IonLabel>{t('lan.lblCitizen')}</IonLabel>
                                        </IonItem>
                                    </NavLink>
                                    <NavLink className="menu" to={"/influencer"}>
                                        <IonItem detail >
                                            <IonIcon src={readerOutline} style={{ color: 'black', marginRight: '15px' }} />
                                            <IonLabel>
                                                {t('lan.lblInfluencerMenu')}</IonLabel></IonItem></NavLink>

                                    <NavLink className="menu" to={"/beneficiary"}>
                                        <IonItem detail >
                                            <IonIcon src={briefcaseOutline} style={{ color: 'black', marginRight: '15px' }} />
                                            <IonLabel>{t('lan.MenuBeneficiary')}</IonLabel>
                                        </IonItem>
                                    </NavLink>

                                    <NavLink className="menu" to={"/link"}>
                                        <IonItem detail >
                                            <IonIcon style={{ color: 'black', marginRight: '15px' }} src={linkOutline} />
                                            <IonLabel >{t('lan.lblQuickLinksMenu')}</IonLabel>
                                        </IonItem>
                                    </NavLink>
                                </>
                        }




                        <IonItem detail className='menu' onClick={() =>
                            presentAlert({
                                header: 'Are you sure exit?',
                                cssClass: 'custom-alert',
                                buttons: [
                                    {
                                        text: 'No',
                                        role: 'cancel',
                                        cssClass: 'alert-button-cancel',

                                    },
                                    {
                                        text: 'Yes',
                                        role: 'confirm',
                                        cssClass: 'alert-button-confirm',
                                        handler: () => {
                                            logout()
                                        },
                                    },
                                ],
                            })
                        }><IonIcon style={{ color: 'black', marginRight: '15px' }} src={powerOutline} />
                            <IonLabel>{t('lan.MenuLogOut')}</IonLabel></IonItem>
                    </IonList>
                </IonMenuToggle>

            </IonContent>
        </IonMenu>
    );
};

export default Menu;
