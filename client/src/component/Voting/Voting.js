// Node modules
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import Navbar from '../Navbar/Navigation';
import NavbarAdmin from '../Navbar/NavigationAdmin';

// CSS
import './Voting.css';
import { ElectionContext } from '../../hooks/context';
import NotVoteStage from '../NotVoteStage';

const Voting = () => {
  const { election, account } = useContext(ElectionContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidateCount, setCandidateCount] = useState(0);
  const [currentVoter, setCurrentVoter] = useState(null);
  const [elStarted, setElStarted] = useState(false);
  const [elEnded, setElEnded] = useState(false);
  const [votingStarted, setVotingStarted] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const voteToCandidates = async (points) => {
    if (election) {
      await election.methods
        .vote(points)
        .send({ from: account, gas: 1000000 })
        .on('receipt', (res) => {
          setTimeout(() => window.location.reload(), 100);
        })
        .on('error', (err) => {
          // setLoading(false);
          setTimeout(() => window.location.reload(), 2000);
        });
    }
  };
  useEffect(() => {
    const getAllState = async () => {
      const admin = await election.methods.getAdmin().call();
      setIsAdmin(account === admin);
      const candidateCount = await election.methods.getTotalCandidate().call();
      setCandidateCount(candidateCount);
      const votingStarted = await election.methods.getVoting().call();
      setVotingStarted(votingStarted);
      const start = await election.methods.getStart().call();
      setElStarted(start);
      const end = await election.methods.getEnd().call();
      setElEnded(end);
      const voter = await election.methods.voterDetails(account).call();
      console.log(voter);
      setCurrentVoter({
        address: voter.voterAddress,
        hasVoted: voter.hasVoted,
        isRegistered: voter.isRegistered,
      });
      const candidatesGet = [];
      for (let i = 0; i < candidateCount; i++) {
        const candidate = await election.methods.candidateDetails(i).call();

        candidatesGet.push(candidate);
      }
      setCandidates(candidatesGet);
      console.log(candidateCount, candidates);
    };
    if (election) getAllState();
    return () => {
      console.log('clean up');
    };
  }, [election, candidateCount]);

  return (
    <>
      {!election && (
        <>
          <Navbar />
          <center>Loading Web3, accounts, and contract...</center>
        </>
      )}
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
            {currentVoter && currentVoter.isRegistered && (
              <div className='container-main'>
                <h2>Candidates</h2>
                <small>Total candidates: {candidates.length}</small>
                {candidates.length < 1 ? (
                  <div className='container-item attention'>
                    <center>Not one to vote for.</center>
                  </div>
                ) : (
                  <CandidatesForm
                    candidates={candidates}
                    voteToCandidates={voteToCandidates}
                    isDisabled={currentVoter.hasVoted}
                  />
                )}
              </div>
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
    </>
  );
};

const CandidatesForm = (props) => {
  const { candidates, voteToCandidates, isDisabled } = props;
  return (
    <>
      <form>
        {candidates.map((candidate) => renderCandidates(candidate, isDisabled))}
        <button
          disabled={isDisabled}
          className='vote-bth'
          onClick={(e) => {
            e.preventDefault();
            const points = [];
            for (let i = 0; i < candidates.length; i++) {
              const point = document.getElementById(`pointfor-${i}`).value;
              if (point !== '') {
                const pointAsNumber = Number.parseInt(point);
                points.push(pointAsNumber);
              }
            }
            if (points.length === candidates.length) {
              var r = window.confirm('Are you sure?');
              if (r === true) {
                voteToCandidates(points);
              }
            } else {
              alert('dien du di');
            }
          }}
        >
          Vote
        </button>
      </form>
    </>
  );
};
const renderCandidates = (candidate, isDisabled) => {
  return (
    <div className='container-item' key={candidate.candidateId}>
      <div className='candidate-info'>
        <h2>
          {candidate.header} <small>#{candidate.candidateId}</small>
        </h2>
        <p className='slogan'>{candidate.slogan}</p>
      </div>
      <div className='vote-btn-container'>
        {isDisabled ? (
          <input
            type='number'
            min='1'
            max='3'
            className='vote-bth'
            placeholder='point'
            id={`pointfor-${candidate.candidateId}`}
            value={candidate.totalPoint}
            disabled={isDisabled}
          ></input>
        ) : (
          <input
            type='number'
            min='1'
            max='3'
            className='vote-bth'
            placeholder='point'
            id={`pointfor-${candidate.candidateId}`}
          ></input>
        )}
      </div>
    </div>
  );
};
export default Voting;
