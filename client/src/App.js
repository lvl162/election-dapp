import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './component/Home';

import Voting from './component/Voting/Voting';
import Results from './component/Results/Results';
import Registration from './component/Registration/Registration';

import AddCandidate from './component/Admin/AddCandidate/AddCandidate';
import Verification from './component/Admin/Verification/Verification';
import test from './component/test';
// import StartEnd from "./component/Admin/StartEnd/StartEnd";

import Footer from './component/Footer/Footer';

import './App.css';
import { useElectionContract } from './hooks/contractHook';
import { ElectionContext } from './hooks/context';
import PlayersCard from './component/PlayerCard/PlayersCard';
import VoteForm from './component/VoteForm/VoteForm';

const App = () => {
  const { election, account } = useElectionContract();
  return (
    <ElectionContext.Provider value={{ election, account }}>
      <div className='App'>
        <Router>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/players' component={PlayersCard} />
            <Route exact path='/Candidates' component={AddCandidate} />
            <Route exact path='/Voting' component={VoteForm} />
            <Route exact path='/Results' component={Results} />
            <Route exact path='/Registration' component={Registration} />
            <Route exact path='/Verification' component={Verification} />
            <Route exact path='/test' component={test} />
            <Route exact path='*' component={NotFound} />
          </Switch>
        </Router>
        <Footer />
      </div>
    </ElectionContext.Provider>
  );
};
class NotFound extends Component {
  render() {
    return (
      <>
        <h1>404 NOT FOUND!</h1>
        <center>
          <p>
            The page your are looking for doesn't exist.
            <br />
            Go to{' '}
            <Link
              to='/'
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              Home
            </Link>
          </p>
        </center>
      </>
    );
  }
}
export default App;
