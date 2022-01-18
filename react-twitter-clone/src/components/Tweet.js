import React, { useState } from 'react';
import Moment from 'react-moment';
import { dbService, storageService } from '../config/firebase-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [editTweet, setEditTweet] = useState(tweetObj.tweet);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this tweet?');
    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      if (tweetObj.imageUrl) {
        await storageService.refFromURL(tweetObj.imageUrl).delete();
      }
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onChange = (event) => {
    const { value } = event.target;
    setEditTweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (tweetObj.tweet === editTweet) {
      //console.log('수정내용없음');
      setEditing(false);
      return;
    }
    await dbService.doc(`tweets/${tweetObj.id}`).update({
      tweet: editTweet,
    });
    setEditing(false);
  };

  return (
    <div className="tweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container tweetEdit">
            <input
              type="text"
              value={editTweet}
              onChange={onChange}
              placeholder="Edit your tweet"
              required
              autoFocus
            />
            <input type="submit" value="Update Tweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <p className="tweet__creatorName">
            {tweetObj.creatorName ?? 'noname'}{' '}
            <span className="tweet__createdAt">
              <Moment format="YYYY-MM-DD">
                {tweetObj.createdAt}
              </Moment>
            </span>
          </p>
          <h4>{tweetObj.tweet}</h4>
          {tweetObj.imageUrl && (
            <img src={tweetObj.imageUrl} alt="uploadedImage" />
          )}
          {isOwner && (
            <div className="tweet__actions">
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
