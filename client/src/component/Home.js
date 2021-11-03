// Node modules
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// Components
import Navbar from './Navbar/Navigation';
import NavbarAdmin from './Navbar/NavigationAdmin';
import UserHome from './UserHome';

import { ElectionContext } from '../hooks/context';

// CSS
import './Home.css';
import AdminHome from './AdminHome';

// const buttonRef = React.createRef();

const Home = () => {
  const { election, account } = useContext(ElectionContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [elStarted, setElStarted] = useState(false);
  const [elEnded, setElEnded] = useState(false);
  const [votingStarted, setVotingStarted] = useState(false);
  const [elDetails, setElDetails] = useState({});

  useEffect(() => {
    const getAllState = async () => {
      const admin = await election.methods.getAdmin().call();
      setIsAdmin(account === admin);
      const votingStarted = await election.methods.getVoting().call();
      setVotingStarted(votingStarted);
      const start = await election.methods.getStart().call();
      setElStarted(start);
      const end = await election.methods.getEnd().call();
      setElEnded(end);
      // Getting election details from the contract
      const adminName = await election.methods.getAdminName().call();
      const adminEmail = await election.methods.getAdminEmail().call();
      const adminTitle = await election.methods.getAdminTitle().call();
      const electionTitle = await election.methods.getElectionTitle().call();
      const organizationTitle = await election.methods
        .getOrganizationTitle()
        .call();

      setElDetails({
        adminName: adminName,
        adminEmail: adminEmail,
        adminTitle: adminTitle,
        electionTitle: electionTitle,
        organizationTitle: organizationTitle,
      });
      console.log(admin, votingStarted, start, end);
    };
    if (election) {
      getAllState();
    }
    return () => {
      console.log('clean');
    };
  }, [election]);
  const endElection = async () => {
    if (election) {
      await election.methods
        .endElection()
        .send({ from: account, gas: 1000000 });
      window.location.reload();
    }
  };
  const startVotingElection = async () => {
    if (election) {
      await election.methods
        .startVotingElection()
        .send({ from: account, gas: 1000000 });
      window.location.reload();
    }
  };
  // register and start election
  const registerElection = async (data) => {
    if (election) {
      console.log('registering a election');
      await election.methods
        .setElectionDetails(
          data.adminFName.toLowerCase() + ' ' + data.adminLName.toLowerCase(),
          data.adminEmail.toLowerCase(),
          data.adminTitle.toLowerCase(),
          data.electionTitle.toLowerCase(),
          data.organizationTitle.toLowerCase()
        )
        .send({ from: account, gas: 1000000 });
      window.location.reload();
    }
  };

  return (
    <>
      {!election && (
        <>
          <Navbar />
          <center>Loading Web3, accounts, and contract...</center>
        </>
      )}
      {election && (
        <>
          {isAdmin ? <NavbarAdmin /> : <Navbar />}

          <div className='container-main'>
            <div className='container-item center-items info'>
              Your Account: {account}
            </div>
          </div>
          {isAdmin ? (
            <>
              <AdminHome
                elStarted={elStarted}
                elEnded={elEnded}
                elDetails={elDetails}
                votingStarted={votingStarted}
                endElection={endElection}
                startVotingElection={startVotingElection}
                registerElection={registerElection}
              />
            </>
          ) : elStarted ? (
            <>
              <UserHome el={elDetails} />
            </>
          ) : !elStarted && elEnded ? (
            <>
              <div className='container-item attention'>
                <center>
                  <h3>The Election ended.</h3>
                  <br />
                  <Link
                    to='/Results'
                    style={{ color: 'black', textDecoration: 'underline' }}
                  >
                    See results
                  </Link>
                </center>
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );
};
export default Home;
