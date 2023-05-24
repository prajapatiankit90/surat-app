import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonIcon, IonToolbar, IonGrid, IonRow, IonCol, useIonToast } from '@ionic/react';
import axiosApi from '../../axiosApi';
import { arrowBackOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Load';
import ReactPaginate from 'react-paginate';

interface PollProps {
  type: string
}

const PollReport: React.FC<PollProps> = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const defaultState = {
    type: ""
  }

  const [data, setData] = useState<PollProps>(defaultState);
  const [value, setValue] = useState([]);
  const [load, setLoad] = useState(false)
  const [totalVoter, setTotalVoter] = useState(0);
  const [voted, setVoted] = useState(0);
  const [bjp, setBjp] = useState(0);
  const [congress, setCongress] = useState(0);
  const [other, setOther] = useState(0);
  const [lead, setLead] = useState(0);
  const [perPage] = useState(100);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);


  const changeEvent = async (e: any) => {
    setValue([])
    setTotalVoter(0)
    setVoted(0)
    setOther(0)
    setLead(0)
    setBjp(0)
    setCongress(0)
    setData({ ...data, type: e.target.value })
  }

  const getData = () => {
    let ReqObj = {
      pFileName: data?.type,
      PageIndex: pageIndex,
      PageSize: perPage,
    }
    axiosApi.post("ElectionReports_Forionic", ReqObj)
      .then((res) => {
        const Data = res.data.ElectionDetailsList;
        const Total = res.data.Total;
        if (Data.length !== 0) {
          setPageCount(Math.ceil(Total / perPage));
          setTotalVoter(Data.map((item: any) => parseInt(item.tot_voters)).reduce((prev: any, next: any) => prev + next));
          setVoted(Data.map((item: any) => parseInt(item.voted)).reduce((prev: any, next: any) => prev + next));
          setBjp(Data.map((item: any) => parseInt(item.bjp)).reduce((prev: any, next: any) => prev + next))
          setCongress(Data.map((item: any) => parseInt(item.congress)).reduce((prev: any, next: any) => prev + next));
          setOther(Data.map((item: any) => parseInt(item.others)).reduce((prev: any, next: any) => prev + next));
          setLead(Data.map((item: any) => parseInt(item.lead)).reduce((prev: any, next: any) => prev + next));
          setValue(Data);
          setLoad(false);
        } else {
          present("No Data Found...", 3000);
          setLoad(false);
        }
      })
      .catch(err => {
        present(err.message, 3000)
        setLoad(false)
      })
  }

  useEffect(() => {
    if (data?.type !== '') {
      getData();
    }
  }, [data, pageIndex])

  const handlePageClick = (selected: any) => {
    setPageIndex(selected.selected + 1)
  }

  const clearData = () => {
    setValue([]);
    setData({ ...defaultState })
    setLoad(load)
  }
  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid  >
            <IonRow>
              <IonCol size='1'><Link to="/election" onClick={clearData} className='back-button'><IonIcon src={arrowBackOutline} /></Link></IonCol>
              <IonCol size='11'><IonTitle>{t('lan.MenuPollReport')}</IonTitle></IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page_content'>
        <IonGrid>
          <IonRow>

            <IonCol size='12'>
              <select name='type' value={data.type} onChange={changeEvent}>
                <option value=''>{t('lan.lblLangSelect')}</option>
                <option value="AYWS">{t('lan.AS_YEAR_WISE_SUMMARY')}</option>
                <option value="AGYR">{t('lan.AS_GRADE_YEAR_REPORT')}</option>
                <option value="WGWR">{t('lan.WARD_GRADE_WISE_REPORT')}</option>
                <option value="WAWR">{t('lan.WARD_AC_WISE_REPORT')}</option>
                <option value="WYWR">{t('lan.WARD_YEAR_WISE_REPORT')}</option>
              </select>
            </IonCol>
          </IonRow>
        </IonGrid>
        <Loader loading={load} click={() => setLoad(false)} />
        {value.length > 0 ?
          <IonGrid >
            <div className='table-design'>
              <table>
                <tr>
                  <th hidden={data.type === 'WGWR' || data.type === 'WYWR' || data.type === 'WAWR'}>{t('lan.lblLangAssembly')}</th>
                  <th hidden={data.type === 'AGYR' || data.type === 'AYWS'}>{t('lan.lblLangWardName')}</th>
                  <th hidden={data.type === 'AYWS' || data.type === 'WYWR'}>{t('lan.lblLangStd')}</th>
                  <th hidden={data.type === 'WGWR'}>{t('lan.lblLangYear')}</th>
                  <th>{t('lan.lblLangBoothNo')}</th>
                  <th>{t('lan.lblLangTotalMatdar')}</th>
                  <th>{t('lan.lblLangPercentage')}</th>
                  <th>{t('lan.lblLangThayelMatdan')}</th>
                  <th>{t('lan.lblLangBjp')}</th>
                  <th>{t('lan.lblLangCongress')}</th>
                  <th>{t('lan.lblLangOther')}</th>
                  <th>{t('lan.lblLangBjp')}(%)</th>
                  <th>{t('lan.lblLangLead')}</th>
                </tr>
                <tr>
                  <td colSpan={data.type === "AGYR" || data.type === "WAWR" ? 4 : 3} style={{ color: 'red', textAlign: 'center' }}>Total :</td>
                  <td style={{ color: 'red', textAlign: 'center' }}> {totalVoter}</td>
                  <td></td>
                  <td style={{ color: 'red', textAlign: 'center' }}>{voted}</td>
                  <td style={{ color: 'red', textAlign: 'center' }}>{bjp}</td>
                  <td style={{ color: 'red', textAlign: 'center' }}> {congress}</td>
                  <td style={{ color: 'red', textAlign: 'center' }}>{other}</td>
                  <td></td>
                  <td style={{ color: 'red', textAlign: 'center' }}>{lead}</td>
                </tr>
                {Array.isArray(value) && value.length > 0 ?
                  value.map((item: any, key: any) => {
                    return (
                      <tr key={key}>
                        <td hidden={data.type === 'WGWR' || data.type === 'WYWR' || data.type === 'WAWR'}><strong>{item.as_seat_nm}</strong></td>
                        <td hidden={data.type === 'AGYR' || data.type === 'AYWS'}><strong><span >{item.ward_id}</span></strong></td>
                        <td hidden={data.type === 'AYWS' || data.type === 'WYWR'}>{item.grade}</td>
                        <td hidden={data.type === 'WGWR'}>{item.year}</td>
                        <td>{item.booth_id}</td>
                        <td>{item.tot_voters}</td>
                        <td>{item.voting_per}</td>
                        <td>{item.voted}</td>
                        <td>{item.bjp}</td>
                        <td>{item.congress}</td>
                        <td>{item.others}</td>
                        <td>{item.bjp_per}</td>
                        <td>{item.lead}</td>
                      </tr>
                    )
                  }) : data.type !== "" ? "No Data Found!" : ""
                }

              </table>
            </div>
          </IonGrid>
          : ""}

        {value.length >= 10 ? (
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

export default PollReport;