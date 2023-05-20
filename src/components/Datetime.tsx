import { IonDatetime, IonDatetimeButton, IonModal } from "@ionic/react";


interface DateProps {
    id: string,
    values: any,
    names: string,
    present: any,
    change: any
}


const Datetime: React.FC<DateProps> = ({ id, values, names, present, change }) => {

    return (
        <>
            <IonDatetimeButton className='dtpBtn' datetime={id}></IonDatetimeButton>
            <IonModal keepContentsMounted={true}>
                <IonDatetime
                    color="warning"
                    id={id}
                    value={values}
                    doneText="done"
                    name={names}
                    presentation={present}
                    showDefaultTitle={true}
                    onIonChange={change}
                ></IonDatetime>
            </IonModal>
        </>
    )
}

export default Datetime;