import React from 'react';
import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import Tabs from './Tabs';

interface HeaderProps {
    titleName: string
}

const Header: React.FC<HeaderProps> = ({ titleName }) => {
    const { t } = useTranslation();

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>{titleName}</IonTitle>
                </IonToolbar>
            <Tabs />
            </IonHeader>
        </>
    );
};

export default Header;