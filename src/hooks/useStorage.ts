import  localforage  from 'localforage';
import { useEffect, useState } from "react";


export function useStorage() {
   const [loginData, setLoginData] = useState<any>([]);

    useEffect(() => {
        const initStorage = async() =>{
            await localforage.getItem('SURAT_APP_LOGIN').then((val: any) => {        
                if (val) {
                    setLoginData(val)
                }           
              })
        }
        initStorage();
    },[]);

    const addLocalforage = async () => {
        const Login_forever = {
            PWD: localStorage.getItem("loginUserMblNo"),
            DEV_REG_ID: localStorage.getItem("DeviceRegisterId"),
            CITY: '',
            VOTERID: localStorage.getItem("loginUserName"),
            LOGIN_AS: localStorage.getItem("loginas"),
            LOGIN_AS_NAME: localStorage.getItem("loginUserName"),
            LOGIN_AS_MOBNO: localStorage.getItem("loginUserMblNo"),
            DATE: '',
            TIME: '',
            DEVICE_ID: localStorage.getItem("Device_UUID"),
            PLATFORM: localStorage.getItem("Device_Platform"),
            MODEL: localStorage.getItem("Device_Model"),
            VERSION: localStorage.getItem("Device_Version"),
            IP: '',
            MP_SEAT_ID: localStorage.getItem("MP_SEAT_ID"),
            TICKET_FLAG: localStorage.getItem("Ticket_Flag"),
            ACCESS_TOKEN: localStorage.getItem("accessToken"),
            TOKEN_TYPE : localStorage.getItem("token_type"),
            APP_TYPE: 'Navsari_App',
            REQ_STATUS: localStorage.getItem("req_status"),
            loginas: localStorage.getItem("loginas"),
            SelectedLang : localStorage.getItem("SelectedLang")
        }

        localforage
        .setItem('SURAT_APP_LOGIN', [Login_forever])
        .then(() => {})
        .catch((reason: any) => {
       
        })
           
    }

   

    const deleteloginDatatatus = async() =>{ 
       localforage.clear()
    }
    
    return {
        loginData,
        addLocalforage,    
        deleteloginDatatatus
    }
}