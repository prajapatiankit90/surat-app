import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { Link, useHistory } from 'react-router-dom';
import List from '../../components/List';
import { useTranslation } from 'react-i18next';
import find from "../../assets/img/27_Find_voter.png";
import single from "../../assets/img/24_Voter_List.png";
import register from "../../assets/img/32_Shubhechhak_Mas.png";
import poll from "../../assets/img/30_Polling_agent.png";
import votingsts from "../../assets/img/31_Voting_Status.png";
import livevote from "../../assets/img/40_Live_Voting.png";
import resultelection from "../../assets/img/43_Live_Election_Res.svg";
import pollreport from "../../assets/img/62_Poll_Report.svg";
import graph from "../../assets/img/SVG/60_charts.svg";

const Election: React.FC = () => {
  const { t } = useTranslation()
  const Level: any = localStorage.getItem('loginas')
  const history = useHistory();

  const Electiongraph = () => {
    history.replace("/electiongraph")
  }

  return (
    <IonPage>
      <Header titleName={t('lan.lblElection')} />
      <IonContent fullscreen className='page_content'>       
        {Level === 'SHAKTIKENDRA_INCHARGE' ?
          <>
            <Link to="/findvoter" className='menu'><List name={t('lan.MenuFindVoters')} src={find} click="" /></Link>
            {/* <Link to="/singlevoter" className='menu'><List name={t('lan.MenuSingleVoters')} click="" src={single} /></Link>
            <Link to="/votingstatus" className='menu'><List name={t('lan.MenuVotingStatus')} src={votingsts} click="" /></Link>
            <Link to="/livevoting" className='menu'><List name={t('lan.MenuLiveVoting')} click="" src={livevote} /></Link> */}
          </>
          :
          Level === 'BOOTH_PR' ?
            <>
              {/* <Link to="/singlevoter" className='menu'><List name={t('lan.MenuSingleVoters')} click="" src={single} /></Link>
              <Link to="/votingstatus" className='menu'><List name={t('lan.MenuVotingStatus')} src={votingsts} click="" /></Link>
              <Link to="/livevoting" className='menu'><List name={t('lan.MenuLiveVoting')} click="" src={livevote} /></Link> */}
            </>
            :
            Level === 'SHUBHECHHAK' ?
              <>
                <Link to="/findvoter" className='menu'><List name={t('lan.MenuFindVoters')} src={find} click="" /></Link>
                <Link to="/gollofwellwisher" className='menu'><List name={t('lan.MenuGoalOfGreeter')} click="" src={register} /></Link>
              </>
              :
              <>
                <Link to="/findvoter" className='menu'><List name={t('lan.MenuFindVoters')} src={find} click="" /></Link>
                <Link to="/singlevoter" className='menu'><List name={t('lan.MenuSingleVoters')} click="" src={single} /></Link>
                {/* <Link to="/registerwell" className='menu'><List name={t('lan.MenuGreetings')} click="" src={goal} /></Link> */}
                <Link to="/gollofwellwisher" className='menu'><List name={t('lan.MenuGoalOfGreeter')} click="" src={register} /></Link>
                <Link to="/pollingagent" className='menu'><List name={t('lan.MenuPolingAgent')} src={poll} click="" /></Link>
                <Link to="/resultofelection" className='menu'><List name={t('lan.MenuResultOfElec')} click="" src={resultelection} /></Link>
                <Link to="/pollreport" className='menu'><List name={t('lan.MenuPollReport')} click="" src={pollreport} /></Link>
                <List  name={t('lan.MenuCharts')} src={graph} click={Electiongraph} />
                <Link to="/votingstatus" className='menu'><List name={t('lan.MenuVotingStatus')} src={votingsts} click="" /></Link>
                <Link to="/livevoting" className='menu'><List name={t('lan.MenuLiveVoting')} click="" src={livevote} /></Link>
              </>
        }
      </IonContent>
    </IonPage>
  );
};

export default Election;
