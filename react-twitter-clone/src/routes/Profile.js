import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { authService, dbService } from '../config/firebase-config';

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(userObj.displayName ?? '');

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onChange = (event) => {
    const { value } = event.target;
    setEditNickname(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== editNickname) {
      await userObj.updateProfile({
        displayName: editNickname,
      });
    }
    setEditing(false);
    refreshUser();
  };
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };

  return (
    <div className="profileContainer">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="profileForm">
            <input
              type="text"
              value={editNickname}
              onChange={onChange}
              placeholder="Your Nickname"
              className="formInput"
            />
            <input
              type="submit"
              value="Update Nickname"
              className="formBtn"
              style={{ marginTop: 10 }}
            />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span>
        </>
      ) : (
        <>
          <span onClick={toggleEditing} className="formBtn">Edit Profile</span>
          <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
            Log Out
          </span>
        </>
      )}
    </div>
  );
};

export default Profile;
