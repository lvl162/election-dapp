import { useForm } from 'react-hook-form';
import ElectionStatus from './ElectionStatus';
import StartEnd from './StartEnd';
import UserHome from './UserHome';
import React from 'react';

const EMsg = (props) => {
  return <span style={{ color: 'tomato' }}>{props.msg}</span>;
};
const AdminHome = (props) => {
  // Contains of Home page for the Admin
  const {
    elStarted,
    elEnded,
    elDetails,
    votingStarted,
    endElection,
    startVotingElection,
    registerElection,
  } = props;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    registerElection(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!elStarted & !elEnded ? (
          <div className='container-main'>
            {/* about-admin */}
            <div className='about-admin'>
              <h3>About Admin</h3>
              <div className='container-item center-items'>
                <div>
                  <label className='label-home'>
                    Full Name {errors.adminFName && <EMsg msg='*required' />}
                    <input
                      className='input-home'
                      type='text'
                      placeholder='First Name'
                      {...register('adminFName', {
                        required: true,
                      })}
                    />
                    <input
                      className='input-home'
                      type='text'
                      placeholder='Last Name'
                      {...register('adminLName')}
                    />
                  </label>

                  <label className='label-home'>
                    Email{' '}
                    {errors.adminEmail && (
                      <EMsg msg={errors.adminEmail.message} />
                    )}
                    <input
                      className='input-home'
                      placeholder='eg. you@example.com'
                      name='adminEmail'
                      {...register('adminEmail', {
                        required: '*Required',
                        pattern: {
                          value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // email validation using RegExp
                          message: '*Invalid',
                        },
                      })}
                    />
                  </label>

                  <label className='label-home'>
                    Job Title or Position{' '}
                    {errors.adminTitle && <EMsg msg='*required' />}
                    <input
                      className='input-home'
                      type='text'
                      placeholder='eg. HR Head '
                      {...register('adminTitle', {
                        required: true,
                      })}
                    />
                  </label>
                </div>
              </div>
            </div>
            {/* about-election */}
            <div className='about-election'>
              <h3>About Election</h3>
              <div className='container-item center-items'>
                <div>
                  <label className='label-home'>
                    Election Title{' '}
                    {errors.electionTitle && <EMsg msg='*required' />}
                    <input
                      className='input-home'
                      type='text'
                      placeholder='eg. School Election'
                      {...register('electionTitle', {
                        required: true,
                      })}
                    />
                  </label>
                  <label className='label-home'>
                    Organization Name{' '}
                    {errors.organizationName && <EMsg msg='*required' />}
                    <input
                      className='input-home'
                      type='text'
                      placeholder='eg. Lifeline Academy'
                      {...register('organizationTitle', {
                        required: true,
                      })}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : elStarted ? (
          <UserHome el={elDetails} />
        ) : null}
        <StartEnd
          votingStarted={votingStarted}
          elStarted={elStarted}
          elEnded={elEnded}
          endElFn={endElection}
          startVotingElFn={startVotingElection}
        />
        <ElectionStatus
          elStarted={elStarted}
          elEnded={elEnded}
          elVotingStarted={votingStarted}
        />
      </form>
    </div>
  );
};

export default AdminHome;
