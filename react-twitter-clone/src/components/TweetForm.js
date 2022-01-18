import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from '../config/firebase-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [imageFile, setImageFile] = useState('');
  const imageInputRef = React.useRef();

  const onChange = (event) => {
    const { value } = event.target;
    setTweet(value);
  };
  const onFileChange = (event) => {
    const { files } = event.target;
    const imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageFile(event.target.result);
    };
    reader.readAsDataURL(imageFile);
  };
  const onClearImageFile = () => {
    imageInputRef.current.value = '';
    setImageFile('');
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (tweet.trim() === '') {
      setTweet('');
      return;
    }
    let uploadFileUrl = '';
    if (imageFile) {
      const uploadFileRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await uploadFileRef.putString(imageFile, 'data_url');
      uploadFileUrl = await response.ref.getDownloadURL();
    }

    const newTweet = {
      creatorId: userObj.uid,
      creatorName: userObj.displayName,
      tweet: tweet,
      imageUrl: uploadFileUrl,
      createdAt: Date.now(),
    };
    await dbService.collection('tweets').add(newTweet);
    setTweet('');
    onClearImageFile();
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          type="text"
          value={tweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
          className="factoryInput__input"
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={imageInputRef}
        id="attach-file"
        style={{ opacity: 0 }}
      />
      {imageFile && (
        <div className="factoryForm__attachment">
          <img
            src={imageFile}
            alt="attachedImage"
            style={{ backgroundImage: imageFile }}
          />
          <div className="factoryForm__clear" onClick={onClearImageFile}>
            <span>Clear Image File</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
