import { Route } from 'react-router-dom';
import {
    IonApp,
    IonRouterOutlet,
    setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
 import "../App.css";
import React from 'react';
import Login from '../pages/Login/Login';
import Menu from '../components/menu';
import Home from '../pages/Home/Home';
import Analysis from '../pages/Analysis/Analysis';
import Beneficiary from '../pages/Beneficiary/Beneficiary';
import Citizen from '../pages/Citizen/Citizen';
import Election from '../pages/Election/Election';
import Influncer from '../pages/Influencer/Influencer';
import Links from '../pages/Links/Links';
import Party from '../pages/Party/Party';
import Utility from '../pages/Utility/Utility';
import PartySubMenu from '../pages/Party/PartySubMenu';
import Youtube from '../pages/Home/Youtube';
import Gallery from '../pages/Home/Gallery';
import Complaints from '../pages/Citizen/Complaints';
import ComplaintsStatus from '../pages/Citizen/ComplaintsStatus';
import Beneficiarysub from '../pages/Beneficiary/Beneficiarysub';
import GovermentSchemes from '../pages/Citizen/GovernmentSchemes';
import BirthdayGreeting from '../pages/Citizen/BirthdatGreetings';
import AnniversaryGreeting from '../pages/Citizen/AnniversaryGreeting';
import GrantsDetails from '../pages/Citizen/GrantsDetails';
import MpProgram from '../pages/Citizen/Mpprogram';
import AppoinmentStatus from '../pages/Citizen/AppoinmentStatus';
import AppointmentEntry from '../pages/Citizen/AppointmentEntry';
import Pagewise from '../pages/Analysis/Pagewise';
import Boothwise from '../pages/Analysis/Boothwise';
import Asseblywise from '../pages/Analysis/Asseblywise';
import Boothwisesurname from '../pages/Analysis/Boothwisesurname';
import Agewise from '../pages/Analysis/Agewise';
import Pastelection from '../pages/Utility/PastElection';
import VoterList from '../pages/Utility/VoterList';
import SingleVoter from '../pages/Election/SingleVoter';
import PollingAgent from '../pages/Election/PollingAgent';
import Influencersub from '../pages/Influencer/Influencersub';
import VotingStatus from '../pages/Election/VotingStaus';
import Livevoting from '../pages/Election/Livevoting';
import EntryThohghVoterId from '../pages/Utility/EntryThrough';
import RegisterWellWisher from '../pages/Election/Registerwellwisher';
import PollReport from '../pages/Election/Pollreport';
import GoalOfwellWisher from '../pages/Election/Gollofwellwisher';
import FindVoter from '../pages/Election/FindVoter';
import ResultOfTheElection from '../pages/Election/ResultOfTheElection';
import CastWiseVoters from '../pages/Utility/CastWiseVoters';
import ElectionResultGraph from '../pages/Election/ElectionResultGraph';
import LetterReport from '../pages/Utility/LetterReport';


setupIonicReact();

const Routes: React.FC = () => {

    const value = localStorage.getItem('loginas')

    return (
        <IonApp>
            <IonReactRouter >
                
                {/* <Menu titleName='main' /> */}
                <IonRouterOutlet id='main' >
                    <Route exact path="/" component={Login} />
                    {/* <Route  path="/home" component={Home} /> */}
                    <Route path="/Home" component={Home} />                    
                    <Route path="/analysis" component={Analysis} />
                    <Route path="/beneficiary" component={Beneficiary} />
                    <Route path="/citizen" component={Citizen} />
                    <Route path="/election" component={Election} />
                    <Route path="/influencer" component={Influncer} />
                    <Route path="/link" component={Links} />
                    <Route path="/party" component={Party} />
                    <Route path="/utility" component={Utility} />
                    {/* <Route path="/partysub/:menu/:sub" component={PartySubMenu} /> */}
                    <Route path="/partysub" component={PartySubMenu} />

                    {/* <Route path="/beneficiasrysub/:menu/:sub" component={Beneficiarysub} /> */}
                    <Route path="/beneficiasrysub" component={Beneficiarysub} />

                    {/* <Route path="/influencersub/:menu/:sub" component={Influencersub} /> */}
                    <Route path="/influencersub" component={Influencersub} />

                    <Route path="/video" component={Youtube} />
                    <Route path="/gallery" component={Gallery} />
                    <Route path="/govment" component={GovermentSchemes} />
                    
                    {/* Citizen */}
                    <Route path="/complain" component={Complaints} />
                    <Route path="/complainstatus" component={ComplaintsStatus} />
                    <Route path="/birthday" component={BirthdayGreeting} />
                    <Route path="/anniversary" component={AnniversaryGreeting} />
                    <Route path="/grantdetail" component={GrantsDetails} />
                    <Route path="/mpprogram" component={MpProgram} />
                    <Route path="/appstatus" component={AppoinmentStatus} />
                    <Route path="/appointment" component={AppointmentEntry} />

                    {/* Analysis */}
                    <Route path="/pagewise" component={Pagewise} />
                    <Route path="/boothwise" component={Boothwise} />
                    <Route path="/assemblywise" component={Asseblywise} />
                    <Route path="/boothwisesurname" component={Boothwisesurname}/>
                    <Route path="/agewise" component={Agewise} />

                    {/* Utility */}
                    <Route path="/pastelection" component={Pastelection} />
                    <Route path="/voterlist" component={VoterList} />
                    <Route path="/entrythrough" component={EntryThohghVoterId} />
                    {/* <Route path="/entrythrough-ed/:id" component={EntryThohghVoterId} /> */}
                    <Route path="/entrythrough" component={EntryThohghVoterId} />

                    <Route path="/castewise" component={CastWiseVoters} />
                    <Route path="/letterreport" component={LetterReport} />

                    {/* Election */}
                    <Route path="/singlevoter" component={SingleVoter} />
                    <Route path="/pollingagent" component={PollingAgent} />
                    <Route path="/votingstatus" component={VotingStatus} />
                    <Route path="/livevoting" component={Livevoting} />
                    <Route path="/registerwell" component={RegisterWellWisher} />
                    <Route path="/pollreport" component={PollReport} />
                    <Route path="/gollofwellwisher" component={GoalOfwellWisher} />
                    <Route path="/findvoter" component={FindVoter} />
                    <Route path="/resultofelection" component={ResultOfTheElection} />
                    <Route path="/electiongraph" component={ElectionResultGraph} />
                     

                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>        
    )
}

export default Routes;