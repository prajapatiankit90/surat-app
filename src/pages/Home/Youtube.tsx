import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLoading, IonPage, IonRow, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { useHistory } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import axiosApi from '../../axiosApi';
import { arrowBackOutline, heart } from 'ionicons/icons';
import moment from 'moment';
import YouTube from 'react-youtube';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Load';


const Youtube: React.FC = () => {
    const { t } = useTranslation()
    const history = useHistory()
    const [video, setVideo] = useState<any>([]);
    const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
    const [load, setLoad] = useState(false)
    const [present] = useIonToast();
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);

    useEffect(() => {
        pushData()
    }, [pageIndex])

    const pushData = async () => {
        setLoad(!load)
        var ReqObj = {
            PageIndex: pageIndex,
            PageSize: perPage,
        }
        await axiosApi.post("DisplayVideoGallery_Forionic" , ReqObj)
        .then((res) => {
            const Data = res.data.VideoList;
            const Total = res.data.Total;

            if (Data.length !== 0) {
                setPageCount(Math.ceil(Total / perPage));
                setVideo(Data);
                setLoad(false);
            } else {
                present("No Data Found...", 3000);
                setLoad(false);
            }
        })
        // await axiosApi.post("/DisplayVideoGallery")
        //     .then((res) => {
        //         const value = JSON.parse(res.data)
        //         setPagination(value);
        //         const data = value.slice(0, 10);
        //         setPageCount(Math.ceil(value.length / perPage));
        //         setVideo(data)
        //         setLoad(load)
        //     })
            .catch(err => {
                present(err.message, 3000)
                setLoad(false)
            })
    }

    const handlePageClick = (selected: any) => {
       setPageIndex(selected.selected + 1)
    };

    const clearData = () => {
        setVideo([]);
        history.replace("/home");
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonGrid  >
                        <IonRow>
                            <IonCol size='2'><IonIcon onClick={() => clearData()} src={arrowBackOutline} /></IonCol>
                            <IonCol size='10'><IonTitle>{t('lan.MenuVideoGallery')}</IonTitle></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
            <Loader loading={load} click={() => setLoad(false)} />
                {Array.isArray(video) && video.length > 0 ?
                    video.map((item: any, key: any) => {

                        return (
                            <IonCard key={key}>
                                <YouTube
                                    videoId={item?.VIDEO_ID}
                                    className='video'
                                />
                                <IonCardHeader>
                                    <IonCardTitle style={{ fontSize: '15px' }}>{item?.VIDEO_TITLE}</IonCardTitle>
                                </IonCardHeader>

                                <div style={{ paddingLeft: '10px' }}>
                                    <span>Published {moment(item?.PUBLISH_DATE).format("DD/MM/yyyy")}</span><span className='dot'> </span>
                                    <span> {item?.VIDEO_VIEW_COUNT} Views </span> <span className='dot'></span> <span> <IonIcon src={heart} style={{ color: 'red', fontSize: '15px' }} /> {item?.VIDEO_LIKE_COUNT}</span>
                                </div>
                                <br />
                                <IonCardContent className='cardContenct'>
                                    {item?.VIDEO_DESC}
                                </IonCardContent>
                            </IonCard>
                        )
                    }) : ""}
                {video.length >= 10 ? (
                    <ReactPaginate
                        previousLabel={'Prev'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
                ) : ""}
            </IonContent>
        </IonPage>
    );
};

export default Youtube;