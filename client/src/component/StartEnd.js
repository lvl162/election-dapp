import React from 'react';
import { Link } from 'react-router-dom';

const StartEnd = (props) => {
  const { votingStarted, startVotingElFn } = props;
  console.log(votingStarted);
  const btn = {
    display: 'block',
    padding: '21px',
    margin: '7px',
    minWidth: 'max-content',
    textAlign: 'center',
    width: '333px',
    alignSelf: 'center',
  };
  return (
    <div
      className='container-main'
      style={{ borderTop: '1px solid', marginTop: '0px' }}
    >
      {!props.elStarted ? (
        <>
          {/* edit here to display start election Again button */}
          {!props.elEnded ? (
            <>
              <div
                className='container-item attention'
                style={{ display: 'block' }}
              >
                <h2>Do not forget to add candidates.</h2>
                <p>
                  Go to{' '}
                  <Link
                    title='Add a new '
                    to='/addCandidate'
                    style={{
                      color: 'black',
                      textDecoration: 'underline',
                    }}
                  >
                    add candidates
                  </Link>{' '}
                  page.
                </p>
              </div>
              <div className='container-item'>
                <button type='submit' style={btn}>
                  Start Election {props.elEnded ? 'Again' : null}
                </button>
              </div>
            </>
          ) : (
            <div className='container-item'>
              <center>
                <p>Re-deploy the contract to start election again.</p>
              </center>
            </div>
          )}
        </>
      ) : votingStarted ? (
        !props.elEnded ? (
          <>
            <div className='container-item'>
              <center>
                <p>The election started voting.</p>
              </center>
            </div>
            <div className='container-item'>
              <button
                type='button'
                // onClick={this.endElection}
                onClick={props.endElFn}
                style={btn}
              >
                End election
              </button>
            </div>
          </>
        ) : (
          <div className='container-item'>
            <center>
              <p>The election ended.</p>
            </center>
          </div>
        )
      ) : (
        <>
          <div className='container-item'>
            <center>
              <p>The election started for registration.</p>
            </center>
          </div>
          <div className='container-item'>
            <button
              type='button'
              // onClick={this.endElection}
              onClick={startVotingElFn}
              style={btn}
            >
              Start Voting Stage
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StartEnd;
