import React, { useContext, useEffect, useState } from 'react';

import Navbar from '../../Navbar/Navigation';
import NavbarAdmin from '../../Navbar/NavigationAdmin';

import AdminOnly from '../../AdminOnly';

import './AddCandidate.css';
import { ElectionContext } from '../../../hooks/context';
import { players } from '../../../data/players';

export default function AddCandidate() {
  const { election, account } = useContext(ElectionContext);
  const [candidates, setCandidates] = useState([]);
  const [candidateCount, setCandidateCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [header, setHeader] = useState('');
  const [slogan, setSlogan] = useState('');

  const updateHeader = (event) => {
    setHeader(event.target.value);
  };
  const updateSlogan = (event) => {
    setSlogan(event.target.value);
  };
  const addCandidate = async (e) => {
    e.preventDefault();
    console.log('show');
    if (election) {
      await election.methods
        .addCandidate(header, slogan)
        .send({ from: account, gas: 1000000 })
        .on('receipt', (res) => {
          window.location.reload();
        })
        .on('error', (err) => {
          // setLoading(false);
        });
    }
  };

  const addAll = async (e) => {
    let headers = [];
    let slogans = [];
    let headers2 = [];
    let slogans2 = [];
    players.forEach(async (player) => {
      if (player.id < 15) {
        headers.push(player.name);
        slogans.push(player.club);
      } else {
        headers2.push(player.name);
        slogans2.push(player.club);
      }
    });

    await election.methods
      .addCandidate(headers, slogans)
      .send({ from: account, gas: 2000000 })
      .on('receipt', (res) => {
        // window.location.reload();
      })
      .on('error', (err) => {
        // setLoading(false);
        console.log(err.message);
      });
    await election.methods
      .addCandidate(headers2, slogans2)
      .send({ from: account, gas: 2000000 })
      .on('receipt', (res) => {
        window.location.reload();
      })
      .on('error', (err) => {
        // setLoading(false);
        console.log(err.message);
      });
  };

  useEffect(() => {
    const getAllState = async () => {
      if (election) {
        const admin = await election.methods.getAdmin().call();
        setIsAdmin(account === admin);
        const candidateCount = await election.methods
          .getTotalCandidate()
          .call();

        setCandidateCount(candidateCount);
        const candidatesPromises = [];
        // for (let i = 0; i < candidateCount; i++) {
        //   const candidate = await election.methods.candidateDetails(i).call();

        //   candidatesGet.push(candidate);
        // }
        for (let i = 0; i < candidateCount; i++) {
          const candidate = election.methods.candidateDetails(i).call();

          candidatesPromises.push(candidate);
        }
        Promise.all(candidatesPromises)
          .then((res) => {
            setCandidates(res);
          })
          .catch((err) => console.log(err));
        // setCandidates(candidatesGet);

        // console.log(candidateCount, candidates);
      }
    };
    if (election) {
      getAllState();
    }
    return () => {};
  }, [election, candidateCount]);

  const renderAdded = (candidate) => {
    return (
      <>
        <div className='container-list success' key={candidate.candidateId}>
          <div
            style={{
              maxHeight: '21px',
              overflow: 'auto',
            }}
          >
            {candidate.candidateId}. <strong>{candidate.header}</strong>:{' '}
            {candidate.slogan}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      {!election && (
        <>
          <center>Loading Web3, accounts, and contract...</center>
        </>
      )}
      {!isAdmin && (
        <>
          <Navbar />
          <AdminOnly page='Add Candidate Page.' />
        </>
      )}
      <NavbarAdmin />
      <div className='container-main'>
        <h2>Add a new candidate</h2>
        <small>Total candidates: {candidateCount}</small>
        {/* <div className='container-item'>
          <form className='form'>
            <label className={'label-ac'}>
              Header
              <input
                className={'input-ac'}
                type='text'
                placeholder='eg. Marcus'
                value={header}
                onChange={updateHeader}
              />
            </label>
            <label className={'label-ac'}>
              Slogan
              <input
                className={'input-ac'}
                type='text'
                placeholder='eg. It is what it is'
                value={slogan}
                onChange={updateSlogan}
              />
            </label>
            <button
              className='btn-add'
              disabled={header.length < 3 || header.length > 21}
              onClick={addCandidate}
            >
              Add
            </button>
          </form>
        </div> */}
      </div>
      <div className='container-main' style={{ borderTop: '1px solid' }}>
        <div className='container-item info'>
          <center>Candidates List</center>
        </div>
        {candidates.length < 1 ? (
          <div className='container-item alert'>
            <center>No candidates added.</center>
          </div>
        ) : (
          <div
            className='container-item'
            style={{
              display: 'block',
              backgroundColor: '#DDFFFF',
            }}
          >
            {candidates.map(renderAdded)}
          </div>
        )}
      </div>
    </>
  );
}
