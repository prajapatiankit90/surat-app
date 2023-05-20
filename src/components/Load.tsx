import { IonLabel, IonLoading } from "@ionic/react";
import { useTranslation } from 'react-i18next';

interface LoaderProps {
    loading: boolean
    click: any
}


const Loader: React.FC<LoaderProps> = ({loading, click}) => {
    const { t } = useTranslation();
    return (
        <IonLoading
            isOpen={loading}
            backdropDismiss={click}
            // message={t('lan.lblPleaseWait')}
            message={'Please Wait'}
            spinner='circles'
            
        />)
}

export default Loader;