import React from 'react';
import { IonLabel, IonItem, IonThumbnail, IonImg, IonIcon } from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
interface ContainerProps {
  name: any;
  src: any;
  click : any
}

const List: React.FC<ContainerProps> = ({ name, src, click }) => {
  return (

    <IonItem onClick={click}>
      <IonThumbnail slot="start">
        <IonImg src={src} />
      </IonThumbnail>
      <IonLabel mode='ios'>
        {name}
      </IonLabel>
      <IonIcon src={arrowForward} />
    </IonItem>
  );
};


export default List;