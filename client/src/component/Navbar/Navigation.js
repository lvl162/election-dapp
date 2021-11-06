import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ElectionContext } from '../../hooks/context';

import './Navbar.css';

import { players, juries } from '../../data/players';

export default function Navbar() {
  const { election, account } = useContext(ElectionContext);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');

  useEffect(() => {
    if (account) {
      const juryName = juries.filter((j) => j.key === account);
      console.log(juryName);
      setName(juryName[0].name);
      return () => {
        console.log('unmounting...');
      };
    }
  }, [account]);

  return (
    <nav>
      <NavLink to='/' className='header'>
        <i className='fab fa-hive'></i> Home
      </NavLink>
      <ul
        className='navbar-links'
        style={{ width: '35%', transform: open ? 'translateX(0px)' : '' }}
      >
        <li>
          <NavLink to='/players' activeClassName='nav-active'>
            <i className='far fa-registered' /> Players
          </NavLink>
        </li>
        <li>
          <NavLink to='/Registration' activeClassName='nav-active'>
            <i className='far fa-registered' /> Registration
          </NavLink>
        </li>
        <li>
          <NavLink to='/Voting' activeClassName='nav-active'>
            <i className='fas fa-vote-yea' /> Voting
          </NavLink>
        </li>
        <li>
          <NavLink to='/Results' activeClassName='nav-active'>
            <i className='fas fa-poll-h' /> Results
          </NavLink>
        </li>
        <li>
          <>Hello , {name}</>
        </li>
      </ul>
      <i onClick={() => setOpen(!open)} className='fas fa-bars burger-menu'></i>
    </nav>
  );
}
