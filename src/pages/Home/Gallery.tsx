import React, { useState, useEffect } from 'react';
import { IonCard, IonContent, IonImg, IonCardContent, IonHeader, IonPage, IonIcon, IonTitle, IonToolbar, IonModal, IonGrid, IonRow, IonCol, IonInput, IonLabel, useIonToast, IonText } from '@ionic/react';
import { arrowBackOutline, downloadOutline, shareSocialOutline } from 'ionicons/icons';
import axiosApi from '../../axiosApi';
import List from '../../components/List';
import { closeCircleOutline } from 'ionicons/icons'
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ReactPaginate from 'react-paginate';
import useDownLoad from '../../hooks/download.hook';
import Loader from '../../components/Load';
import {useDeviceInfo} from '../../hooks/useDeviceInfo'


interface GalleryProps {
  gallery: any
}

const Gallery: React.FC<GalleryProps> = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const history = useHistory()
  const [data, setData] = useState<any>([])
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState([])
  const [searchvalue, setSearchValue] = useState([])
  const [search, setSearch] = useState({
    gallery: ""
  })
  const [load, setLoad] = useState(false)
  const [perPage] = useState(100);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState(1)

  const { downloadFilesFor, socialShare } = useDownLoad();
  const {DeviceInfo} = useDeviceInfo()
  useEffect(() => {
    getAlbumCat()
  }, [pageIndex])

  const getAlbumCat = async () => {
    setLoad(true)

    var ReqObj = {
      PageIndex: pageIndex,
      PageSize: perPage,
    }
    await axiosApi.post("retieveAlbumCat_ForIonic", ReqObj)
    .then((res) => {
      const Data = res.data.AlbumGallaryList;
      const Total = res.data.Total;
      if (Data.length !== 0) {
          setPageCount(Math.ceil(Total / perPage));
          setData(Data);
          setLoad(false);
      } else {
          present("No Data Found...", 3000);
          setLoad(false);
      }

    })
    // await axiosApi.post("/retieveAlbumCat")
    //   .then((res) => {
    //     const resp = JSON.parse(res.data)
    //     setPagination(resp);
    //     const data = resp.slice(0, 10);
    //     setPageCount(Math.ceil(resp.length / perPage));
    //     setData(data)
    //     setLoad(false)
    //   })
  }

 

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  };

  const getData = (id: any) => {
    const Dats = data.filter((ids: any) => ids.ALBUM_CAT_ID === id)
    setValue(Dats)
    setShowModal(true)
  }

  const chnageEvant = (e: any) => {
    const { name, value } = e.target
    setSearch({ ...search, [name]: value })
    const Data = data.filter((entry: any) => Object.values(entry).some(val => typeof val == "string" && val.includes(search.gallery)))
    setSearchValue(Data);
  }


  const clearData = () => {
    setData([])
    setSearch({ gallery: "" })
    history.replace("/home");
  }
  const slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  const ShareImage = async(dataUrl : any) => {
    const blob = await (await fetch(dataUrl)).blob()
    console.log(blob)

  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid  >
            <IonRow>
              <IonCol size='2'><IonIcon onClick={() => clearData()} src={arrowBackOutline} /></IonCol>
              <IonCol size='10'><IonTitle>{t('lan.lbheaderAlbumGalleryDetail')}</IonTitle></IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page_content'>
        <IonGrid>
          <IonRow>
            <IonCol size='3'><IonLabel> {t('lan.lblLangLoad')} </IonLabel></IonCol>
            <IonCol size='9'><IonInput mode='ios' onIonChange={chnageEvant} name="gallery" value={search.gallery} /></IonCol>
          </IonRow>
        </IonGrid>


        {search.gallery === "" ? Array.isArray(data) && data.length > 0 ?
          data.map((item: any, key: any) => {
            return (
              <IonCard key={key}> <List name={item?.ALBUM_NAME + " " + item?.ALBUM_CAT_ADDED_DATETIME} src={process.env.REACT_APP_API_IMAGE + `albums/${item?.IMAGE_NAME}`} click={() => getData(item.ALBUM_CAT_ID)} /></IonCard>
            )
          }) : "" :
          Array.isArray(searchvalue) && searchvalue.length > 0 ?
            searchvalue.map((item: any, key: any) => {
              return (
                <IonCard key={key}> <List name={item?.ALBUM_NAME + " " + item?.ALBUM_CAT_ADDED_DATETIME} src={process.env.REACT_APP_API_IMAGE + `albums/${item?.IMAGE_NAME}`} click={() => getData(item.ALBUM_CAT_ID)} /></IonCard>
              )
            }) : "No Data found"
        }

        <Loader loading={load} click={() => setLoad(false)} />

        {Array.isArray(value) ?
          value.map((item: any, key: any) => {
            return (
              <IonModal key={key} isOpen={showModal}>
                <IonHeader>
                  <IonToolbar>
                    <IonGrid  >
                      <IonRow>
                        <IonCol size='10'><IonTitle>{t('lan.MenuPhotoGallery')} </IonTitle></IonCol>
                        <IonCol size='2'><IonIcon src={closeCircleOutline} onClick={() => setShowModal(false)} /></IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonToolbar>
                </IonHeader>

                <motion.div
                  className="popup-container"
                  layoutId={'card-' + item.ID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <IonCard key={key} className="card cardHome" mode='ios'>
                    <motion.div layoutId={'image-container' + item.ID}>                    
                          <IonImg src={process.env.REACT_APP_API_IMAGE + `albums/${item?.IMAGE_NAME}`} />                    
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, transform: 'translateY(20px)' }}
                      animate={{
                        opacity: 1,
                        transform: 'translateY(0)',
                        transitionDuration: '0.5s',
                        transitionDelay: '0.2s'
                      }}
                    >
                      <IonCardContent className='cardContenct'>
                        <IonLabel>EVENT DATE :-  {item?.ALBUM_CAT_ADDED_DATETIME}</IonLabel>
                        <IonText>
                          <p>
                            {item?.ALBUM_NAME}
                          </p>
                        </IonText>
                      </IonCardContent>
                      <IonGrid className='header'>
                        <IonRow style={{ textAlign: 'center' }}>
                          <IonCol size='6'>
                            {DeviceInfo !== null ? 
                            <IonIcon style={{color : 'white'}} src={shareSocialOutline} onClick={() => socialShare(item.ALBUM_NAME, "", process.env.REACT_APP_API_IMAGE + `albums/${item?.IMAGE_NAME}`)} />
                            
                            :<IonIcon style={{color : 'white'}} src={shareSocialOutline} onClick={() => ShareImage(process.env.REACT_APP_API_IMAGE + `albums/${item?.IMAGE_NAME}`)} /> }
                            </IonCol>
                          <IonCol size='6'>
                            {DeviceInfo !== null ? 
                            <IonIcon style={{color : 'white'}} src={downloadOutline}
                              onClick={() => downloadFilesFor(process.env.REACT_APP_API_IMAGE + `albums/${item?.IMAGE_NAME}`, item.IMAGE_NAME, "Gallery")}
                            /> : 
                            (
                              <a
                                href={
                                  process.env.REACT_APP_API_IMAGE + `albums/${item?.IMAGE_NAME}`
                                }
                                download={true}
                              >
                                <IonIcon style={{color : 'white'}} src={downloadOutline} />{' '}
                              </a>
                            )
                            }
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </motion.div>
                  </IonCard>
                </motion.div>
              </IonModal>

            )
          }) : ""}

        {data.length > 0 ? (
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

export default Gallery;
