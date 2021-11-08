import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { players } from '../../data/players';
import { ElectionContext } from '../../hooks/context';
import Navbar from '../Navbar/Navigation';
import NavbarAdmin from '../Navbar/NavigationAdmin';
import NotVoteStage from '../NotVoteStage';
import './styles.css';
const VoteForm = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { election, account } = useContext(ElectionContext);

  const [value1, setValue1] = useState('1');
  const [value2, setValue2] = useState('1');
  const [value3, setValue3] = useState('1');

  const [elStarted, setElStarted] = useState(false);
  const [elEnded, setElEnded] = useState(false);
  const [votingStarted, setVotingStarted] = useState(false);

  const [currentVoter, setCurrentVoter] = useState(null);

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
      const voter = await election.methods.voterDetails(account).call();
      setCurrentVoter({
        address: voter.voterAddress,
        hasVoted: voter.hasVoted,
        isRegistered: voter.isRegistered,
      });
    };
    if (election) getAllState();
    return () => {
      console.log('clean up');
    };
  }, [election]);
  const voteToCandidates = async (ids, points) => {
    console.log(ids, points);
    if (election) {
      await election.methods
        .vote(ids, points)
        .send({ from: account, gas: 1000000 })
        .on('receipt', (res) => {
          setTimeout(() => window.location.reload(), 100);
          console.log(res);
        })
        .on('error', (err) => {
          // setLoading(false);
          setTimeout(() => window.location.reload(), 2000);
          console.log(err);
        });
    }
  };
  useEffect(() => {
    const getAllState = async () => {
      const admin = await election.methods.getAdmin().call();
      setIsAdmin(account === admin);
    };
    if (election) {
      getAllState();
    }
    return () => {
      console.log('clean');
    };
  }, [election]);

  const handleSubmit = (e) => {
    console.log('object');
    console.log(value1, value2, value3);

    voteToCandidates(
      [
        Number.parseInt(value1),
        Number.parseInt(value2),
        Number.parseInt(value3),
      ],
      [4, 2, 1]
    );
  };
  const handleChange1 = (event) => {
    setValue1(event.target.value);
  };
  const handleChange2 = (event) => {
    setValue2(event.target.value);
  };
  const handleChange3 = (event) => {
    setValue3(event.target.value);
  };

  //   const handleSubmit = (event) => {
  //     alert('Your favorite flavor is: ' + this.state.value);
  //     event.preventDefault();
  //   };
  return (
    <>
      {!election && (
        <>
          <Navbar />
          <center>Loading Web3, accounts, and contract...</center>
        </>
      )}
      <>
        {isAdmin ? <NavbarAdmin /> : <Navbar />}
        <div>
          {!votingStarted && !elEnded ? (
            <NotVoteStage
              message={'The election has not been started for voting.'}
            />
          ) : votingStarted && !elEnded ? (
            <>
              {currentVoter && currentVoter.isRegistered ? (
                currentVoter.hasVoted ? (
                  <div className='container-item success'>
                    <div>
                      <strong>You've casted your vote.</strong>
                      <p />
                      <center>
                        <Link
                          to='/Results'
                          style={{
                            color: 'black',
                            textDecoration: 'underline',
                          }}
                        >
                          See Results
                        </Link>
                      </center>
                    </div>
                  </div>
                ) : (
                  <div className='container-item info'>
                    <center>Go ahead and cast your vote.</center>
                  </div>
                )
              ) : (
                <>
                  <div className='container-item attention'>
                    <center>
                      <p>You're not registered. Please register first.</p>
                      <br />
                      <Link
                        to='/Registration'
                        style={{ color: 'black', textDecoration: 'underline' }}
                      >
                        Registration Page
                      </Link>
                    </center>
                  </div>
                </>
              )}
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
        </div>
        {!elEnded &&
          votingStarted &&
          currentVoter &&
          currentVoter.isRegistered &&
          !currentVoter.hasVoted && (
            <div className='list-vote'>
              <div className='voting-box'>
                <h2 className='voting_header'>1st</h2>
                <select
                  name='1st'
                  id='1st'
                  value={value1}
                  onChange={handleChange1}
                >
                  {players.map((p) => (
                    <option value={p.id}>
                      {p.name} - {p.club}
                    </option>
                  ))}
                </select>
                <h2 className='voting_header'>2nd</h2>
                <select
                  name='2nd'
                  id='2nd'
                  value={value2}
                  onChange={handleChange2}
                >
                  {players.map((p) => (
                    <option value={p.id}>
                      {p.name} - {p.club}
                    </option>
                  ))}
                </select>
                <h2 className='voting_header'>3rd</h2>
                <select
                  name='3rd'
                  id='3rd'
                  value={value3}
                  onChange={handleChange3}
                >
                  {players.map((p) => (
                    <option value={p.id}>
                      {p.name} - {p.club}
                    </option>
                  ))}
                </select>
              </div>
              <button className='submit-btn' onClick={handleSubmit}>
                submit
              </button>
            </div>
          )}
      </>
    </>
  );
};

export default VoteForm;
