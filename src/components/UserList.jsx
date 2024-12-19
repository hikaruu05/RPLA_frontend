import React from 'react';

const UserList = () => {
  return (
    <div>
        <h1 className='title' style={{ color: 'black' }}>Users</h1>
        <h2 className='subtitle'style={{ color: 'black' }}>List of Users</h2>
        <table className='table is-striped is-fullwidth'>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>
    </div>
  )
}

export default UserList;