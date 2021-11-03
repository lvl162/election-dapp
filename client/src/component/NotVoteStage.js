import React from 'react';

const NotVoteStage = ({ message }) => {
  return (
    <div className='container-item info'>
      <center>
        <h3>{message}</h3>
        <p>Please Wait..</p>
      </center>
    </div>
  );
};

export default NotVoteStage;
