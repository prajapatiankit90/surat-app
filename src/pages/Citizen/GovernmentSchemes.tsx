import React, { useState, useEffect } from 'react'
import { IonIcon, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonGrid, IonRow, IonCol, useIonToast, IonImg, IonLoading, IonLabel } from '@ionic/react';
import { arrowBackOutline, caretDownOutline, caretUpOutline, downloadOutline, shareSocialOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import axiosApi from '../../axiosApi';
import { useTranslation } from 'react-i18next';
import useDownLoad from '../../hooks/download.hook';
import Loader from '../../components/Load';
import ReactPaginate from 'react-paginate';


const GovermentSchemes: React.FC = () => {

  const [data, setData] = useState([])
  const [load, setLoad] = useState(false)
  const [show, setShow] = useState(false)
  const [present] = useIonToast();
  const { t } = useTranslation();
  const [perPage] = useState(50);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);

  const { downloadFilesFor , socialShare} = useDownLoad()

  const langs = localStorage.getItem('SelectedLang')
  const history = useHistory()
  
  useEffect(() => {
    const fetData = async () => {
      setLoad(!load)
      const ReqObj = {
        Lang: langs,
        PageIndex: pageIndex,
        PageSize: perPage,
      }

      await axiosApi.post("getSarkariYojanaLangWise_ForIonic", ReqObj)
        .then((res) => {          
          const Data = res.data.SarkariYojanaList;
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
      // await axiosApi.get("/getSarkariYojanaLangWise?pLang=" + langs)
      //   .then((res) => {

      //     if (res.data !== "") {
      //       setTimeout(() => {
      //         const Data = JSON.parse(res.data);
      //         setData(Data)
      //         setLoad(load)
      //       }, 1000)
      //     }
      //     else {
      //       present("No Data Found", 3000)
      //       setLoad(load)
      //     }
      //   })
    }
    fetData()
  }, [langs, pageIndex])

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  };

  const clearData = () => {
    history.replace("/citizen")
    setData([])
  }

  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='1'><IonIcon src={arrowBackOutline} onClick={clearData} /></IonCol>
              <IonCol size='11'><IonTitle>{t('lan.MenuGovScheme')}</IonTitle></IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page_content'>
      <Loader loading={load} click={() => setLoad(false)} />
        {Array.isArray(data) && data.length > 0 ?
          data.map((item: any, key: any) => {
            return (
              <IonCard key={key}>
                <IonGrid>
                  <IonRow>
                    <IonCol onClick={() => setShow(prev => prev === key ? undefined : key)}>
                      <IonLabel> {item.img_nm}</IonLabel>
                      {(show !== key) ? (
                        <IonIcon src={caretDownOutline} className='icon-goverment' />
                      ) : (
                        <>
                          <IonCol>
                            <IonImg src={process.env.REACT_APP_API_IMAGE+ `yojana/${item.img_pic}`} />
                          </IonCol>
                          <IonIcon src={caretUpOutline} className='icon-goverment' />
                        </>
                      )}

                    </IonCol>
                  </IonRow>
                </IonGrid>
                {(show === key) ? (

                  <IonGrid className='header'  >
                    <IonRow style={{ textAlign: 'center' }}>
                      <IonCol size='6'><IonIcon src={shareSocialOutline} onClick={() => socialShare(item.img_nm, '' , process.env.REACT_APP_API_IMAGE+ `yojana/${item.img_pic}`)} /></IonCol>
                      <IonCol size='6'><IonIcon src={downloadOutline} onClick={() => downloadFilesFor( process.env.REACT_APP_API_IMAGE+`yojana/${item.img_pic}`,item.img_pic, 'Goverment schemes')} /></IonCol>
                    </IonRow>
                  </IonGrid>
                ) : ""}
              </IonCard>
            )
          }) : ""
        }
        {data.length >= 10 ? (
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
  )
}

export default GovermentSchemes;