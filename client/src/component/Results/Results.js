// Node modules
import React, { useContext, useEffect, useState } from 'react';

// Components
import Navbar from '../Navbar/Navigation';
import NavbarAdmin from '../Navbar/NavigationAdmin';
import NotInit from '../NotInit';

// CSS
import './Results.css';
import { ElectionContext } from '../../hooks/context';
import NotVoteStage from '../NotVoteStage';

export default function Result() {
  const { election, account } = useContext(ElectionContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidateCount, setCandidateCount] = useState(0);
  const [elStarted, setElStarted] = useState(false);
  const [elEnded, setElEnded] = useState(false);
  const [votingStarted, setVotingStarted] = useState(false);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const getAllState = async () => {
      election.events.votedToCandidate().on('data', (event) => {
        console.log(event);
        window.location.reload();
      });
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

      const candidatesPromises = [];
      for (let i = 0; i < candidateCount; i++) {
        const candidate = election.methods.candidateDetails(i).call();

        candidatesPromises.push(candidate);
      }
      Promise.all(candidatesPromises)
        .then((res) => {
          setCandidates(res);
        })
        .catch((err) => console.log(err));
    };
    if (election) getAllState();
    return () => {
      console.log('clean up');
    };
  }, [election, candidateCount]);

  return (
    <>
      {isAdmin ? <NavbarAdmin /> : <Navbar />}
      <div>
        {!elStarted && !elEnded && <NotInit />}
        {!votingStarted && !elEnded && (
          <NotVoteStage
            message={'The election has not been started for voting.'}
          />
        )}
        {votingStarted && !elEnded && (
          <>
            <div className='container-main' style={{ borderTop: '1px solid' }}>
              <h2>Current Results</h2>
              <small>Total candidates: {candidates.length}</small>
              {candidates.length < 1 ? (
                <div className='container-item attention'>
                  <center>Loading...</center>
                </div>
              ) : (
                <>
                  <div className='container-item'>
                    <table>
                      <tr>
                        <th>ID</th>
                        <th>Candidate</th>
                        <th>Total Points</th>
                      </tr>
                      {candidates
                        .sort((p1, p2) => p2.totalPoint - p1.totalPoint)
                        .map((candidate) => (
                          <tr>
                            <td>{candidate.candidateId}</td>
                            <td>{candidate.header}</td>
                            <td>{candidate.totalPoint}</td>
                          </tr>
                        ))}
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        )}
        {elEnded && displayResults(candidates)}
      </div>
    </>
  );
}

function displayWinner(candidates) {
  const getWinner = (candidates) => {
    // Returns an object having maxium vote count
    let maxVoteRecived = 0;
    let winnerCandidate = [];
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i].totalPoint > maxVoteRecived) {
        maxVoteRecived = candidates[i].totalPoint;
        winnerCandidate = [candidates[i]];
      } else if (candidates[i].totalPoint === maxVoteRecived) {
        winnerCandidate.push(candidates[i]);
      }
    }
    return winnerCandidate;
  };
  const renderWinner = (winner) => {
    return (
      <div className='container-winner'>
        <div className='winner-info'>
          <p className='winner-tag'>Winner!</p>
          <h2> {winner.header}</h2>
          <p className='winner-slogan'>{winner.slogan}</p>
        </div>
        <div className='winner-votes'>
          <div className='votes-tag'>Total Points: </div>
          <div className='vote-count'>{winner.totalPoint}</div>
        </div>
      </div>
    );
  };
  const winnerCandidate = getWinner(candidates);
  return <>{winnerCandidate.map(renderWinner)}</>;
}

export function displayResults(candidates) {
  const renderResults = (candidate) => {
    return (
      <tr>
        <td>{candidate.candidateId}</td>
        <td>{candidate.header}</td>
        <td>{candidate.totalPoint}</td>
      </tr>
    );
  };
  return (
    <>
      {candidates.length > 0 ? (
        <div className='container-main'>{displayWinner(candidates)}</div>
      ) : null}
      <div className='container-main' style={{ borderTop: '1px solid' }}>
        <h2>Final Results</h2>
        <small>Total candidates: {candidates.length}</small>
        {candidates.length < 1 ? (
          <div className='container-item attention'>
            <center>Loading...</center>
          </div>
        ) : (
          <>
            <div className='container-item'>
              <table>
                <tr>
                  <th>ID</th>
                  <th>Candidate</th>
                  <th>Total Points</th>
                </tr>
                {candidates
                  .sort((p1, p2) => p2.totalPoint - p1.totalPoint)
                  .map(renderResults)}
              </table>
            </div>
            {/* <div
              className='container-item'
              style={{ border: '1px solid black' }}
            >
              <center>That is all.</center>
            </div> */}
          </>
        )}
      </div>
    </>
  );
}
