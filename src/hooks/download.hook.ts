import { useState } from "react";
import { Downloader, DownloadRequest, NotificationVisibility } from "@ionic-native/downloader";
import { useIonToast } from '@ionic/react';
import { FileOpener } from '@ionic-native/file-opener';
import axios from "axios";
import { CallNumber } from "@ionic-native/call-number";
import { SMS } from "@ionic-native/sms";
import { SocialSharing } from "@ionic-native/social-sharing";

const useDownLoad = () => {

    const [load, setLoad] = useState(false)
    const [present] = useIonToast();
    const getMIMEtype = (extn: string) => {
        let ext: any = extn?.toLowerCase();
        let MIMETypes: any = {
            'txt': 'text/plain',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc': 'application/msword',
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'bmp': 'image/bmp',
            'png': 'image/png',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'rtf': 'application/rtf',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        }
        return MIMETypes[ext];
    }

    const createPDFDownload = (url: any, name: any, titleName: any) => {
        setLoad(true)
        present("Please Wait....", 3000)
        axios({
            url: url,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                // Create a Blob from the PDF Stream
                const file = new Blob(
                    [response.data],
                    { type: 'application/pdf' });
                // Build a URL from the file   
                downloadFilesFor(url, name, titleName)
                setLoad(false)
            })
            .catch(err => {
                console.error(err.message);
                setLoad(false)
            })
    }

    const downloadFilesFor = (url: any, name: any, titleName: any) => { 
        alert(url)       
        setLoad(true)
        let fileExtn = name?.split('.').reverse()[0];
        let fileMIMEType = getMIMEtype(fileExtn);
              
               
        let request: DownloadRequest = {
            uri: url,
            title: titleName,
            description: '',
            mimeType: fileMIMEType,
            visibleInDownloadsUi: true,
            notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
            destinationInExternalPublicDir: {
                dirType: 'Download',
                subPath: name?.split('/').reverse()[0]
            },
            
            
        };
        alert(request)

        Downloader.download(request)
            .then((location: string) => {
                present("Download Completed...", 3000)
                alert(location)
                FileOpener.showOpenWithDialog(location, fileMIMEType)
                    .then(() => { })
                    .catch(e => present(e, 3000))
                setLoad(false)
            })
            .catch(err => {
                present(err.message, 3000)
                setLoad(false)
            })
    }

    const call = (number: any) => {
        CallNumber.callNumber(number, true)
    }
    const smsShort = (number: any, short: any) => {
        let options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without opening any other app, require : android.permission.SEND_SMS and android.permission.READ_PHONE_STATE
            }
        };
        SMS.send(number, short, options)
    }
    const smsLong = (number: any, long: any) => {
        let options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without opening any other app, require : android.permission.SEND_SMS and android.permission.READ_PHONE_STATE
            }
        };
        SMS.send(number, long, options)
    }

    const socialShare = async (message: string, title: string, File: string) => {
        await SocialSharing.share(message, title, File);
      }

    return { downloadFilesFor, createPDFDownload, call, smsLong, smsShort, socialShare }
}

export default useDownLoad;