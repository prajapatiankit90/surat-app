import React, { useState, useEffect } from 'react';
import { IonHeader, IonTitle, IonToolbar, IonLabel, IonButton, IonGrid, IonRow, IonCol, IonPage, IonContent, IonCard, IonCardHeader, useIonToast, IonIcon, IonLoading } from '@ionic/react';
import axiosApi from '../../axiosApi';
import axios from 'axios';
import { Chart } from "react-google-charts";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { arrowBackOutline, searchOutline } from 'ionicons/icons';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Load';

interface GraphProps {
  type: string
  year: any
}

const ElectionResultGraph: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const defaultState = {
    type: "",
    year: ""
  }

  const [year, setYear] = useState([]);
  const [value, setValue] = useState<GraphProps>(defaultState);
  const [users, setUser] = useState([]);
  const [load, setLoad] = useState(false);
  const [perPage] = useState(100);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<any>([]);

  const Name = localStorage.getItem('loginas');
  const Num = localStorage.getItem('loginUserMblNo');

  useEffect(() => {
    setLoad(true)
    const getYear = () => {
      axiosApi.get("/getElecYearType")
        .then((res) => {

          if (res.data !== "") {
            const Resp = JSON.parse(res.data)
            const Data = JSON.parse(Resp?.data)
            console.log(Data)
            if (Resp?.error === false) {
              setYear(Data);
              setLoad(false);
            } else {
              present(Resp?.msg, 3000)
              setLoad(false);
            }
          } else {
            setLoad(false)
          }
        })
        .catch(err => { present(err.message, 3000) })
    }
    getYear()
  }, [])

  const handleChangeEvent = (e: any) => {
    const { name, value } = e.target
    setValue({ ...value, [name]: value })
  }

  const spl = value.year.split("-")
  const electionYear = spl[0]
  const electionType = spl[1]


  const submit = async () => {
    if (value.year !== '') {
      setUser([])
      setLoad(true)
      await axios.get(process.env.REACT_APP_API_URL + 'getChartDetailsForIonicApp?Election_Year=' + electionYear + '&Election_Type=' + electionType + '&UserLevel=' + Name + '&UserMob=' + Num)
        .then((res) => {

          const Resp = JSON.parse(res.data)
          const Data = JSON.parse(Resp?.data);
          console.log(Data)
          if (res.data !== "") {
            if (Resp?.error === false) {
              setPagination(Data)
              const data = Data.slice(0, 100);
              setPageCount(Math.ceil(Data.length / perPage));
              setUser(data)
              setLoad(false)
            } else {
              present(Resp?.msg, 3000)
              setLoad(false)
            }
          } else {
            present("No Data Found..!", 3000)
            setLoad(false)
          }
        })
        .catch((error) => {
          present(error.message, 3000)
          setLoad(false)
        });
    }
    else {
      present("Please Select Year..!", 3000)
      setLoad(false)
    }
  }
  const clearData = () => {
    setValue({ ...defaultState })
    setUser([])
  }
  const handlePageClick = (selected: any) => {
    const pagesVisited = selected.selected * perPage;
    const lastSetData = pagesVisited + perPage;
    setUser(pagination.slice(pagesVisited, lastSetData));
    window.scroll(0, 0)
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid  >
            <IonRow>
              <IonCol size='1'><Link to="/election" className='back-button'><IonIcon onClick={clearData} src={arrowBackOutline} /></Link></IonCol>
              <IonCol size='11'><IonTitle>{t('lan.MenuCharts')}</IonTitle></IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size='3'><IonLabel>{t('lan.lblLangYear')}</IonLabel></IonCol>
            <IonCol size='9'>
              <select className='form-control' name='year' value={value?.year} onChange={handleChangeEvent}>
                <option value=''>{t('lan.lblAll')}</option>
                {Array.isArray(year) && year.length > 0 ?
                  year.map((item: any, key: any) => {
                    return (
                      <option key={key} value={item.ELECTION_YEAR_TYPE}>{item.ELECTION_YEAR_TYPE
                      }</option>
                    )
                  }) : ""
                }
              </select>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton shape="round" fill="outline" onClick={submit}><IonIcon src={searchOutline} className='button-icon' />{t('lan.lblLangLoad')}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />
        {Array.isArray(users) && users.length > 0 ?
          users.map((usersdt: any, key: any) => {

            return (
              <IonCard key={key} className="card">
                <IonCardHeader>
                  <IonLabel>{usersdt.GROUPNM}</IonLabel>
                </IonCardHeader>
                <Chart
                  chartType="PieChart"
                  data={[
                    ["Task", usersdt.GROUPNM],
                    ["CONGRESS", usersdt.CONG_PER],
                    ["BJP", usersdt.BJP_PER],
                    ["OTHER", usersdt.OTHER_PER],
                    ["NOTA", usersdt.NOTA_PER],
                  ]}
                  width={"400px"}
                  height={"200px"}
                />
              </IonCard>

            )
          }) : ""
        }
        {users.length >= 10 ? (
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

export default ElectionResultGraph;



