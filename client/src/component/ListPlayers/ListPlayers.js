import React from 'react';

import { players } from '../../data/players';

// {
//     id: 1,
//     img: 'https://img.uefa.com/imgml/TP/players/1/2022/324x324/103827.jpg',
//     name: 'Cesar Azpilicueta',
//     position: 'Goalkeeper',
//     nationality: 'Spain',
//     club: 'Chelsea',
//   },
const ListPlayers = () => {
  return (
    <div>
      {players.map((p) => (
        <div>
          <p>{p.id}</p>
          <img src={p.img} alt={p.name} />
          <p>{p.name}</p>
          <p>{p.position}</p>
          <p>{p.club}</p>
        </div>
      ))}
    </div>
  );
};

export default ListPlayers;
