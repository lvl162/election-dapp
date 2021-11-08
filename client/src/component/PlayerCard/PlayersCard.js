import React, { useContext, useEffect, useState } from 'react';
import { players } from '../../data/players';
import { ElectionContext } from '../../hooks/context';
import Navbar from '../Navbar/Navigation';
import NavbarAdmin from '../Navbar/NavigationAdmin';
import './styles.css';
const PlayersCard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { election, account } = useContext(ElectionContext);

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
  return (
    <>
      <>
        {isAdmin ? <NavbarAdmin /> : <Navbar />}
        <div className='list-container'>
          {players.map((p) => (
            <div className='player-card'>
              <div className='player-card__left'>
                <img src={p.img} alt={p.name} className='player-card__img' />
                <p className='player-card__info name'>
                  {('0' + p.id).slice(-2)}. {p.name}
                </p>
              </div>
              <div className='player-card__info right'>
                <div className='position'>{p.position}</div>
                <div className='club'>{p.club}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    </>
  );
};

export default PlayersCard;
