import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import { profilePictureUplaodAsync } from "../../../signin/signinSlice";
import { uploadProfilePicture } from "../../profileAPI";
import styles from "./profilePicture.module.css";

interface ProfilePictureProps {
  userID: number;
  userName: string;
  profilePicture: string;
}

export function ProfilePicture(props: ProfilePictureProps) {
  let editLabel;
  const uploadRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return;
    }

    const file = e.target.files[0];
    if (file) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        return;
      }
    }

    var form = new FormData();
    form.append("userpic", e.target.files[0]);
    await dispatch(
      profilePictureUplaodAsync({
        form: form,
        uid: props.userID,
        username: props.userName,
      })
    );
  };

  if (props.profilePicture) {
    editLabel = (
      <div className={styles.profile_circle}>
        <label className={styles.edit_label}>
          <input
            onChange={onImageChange}
            ref={uploadRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
          />
          <img
            className={styles.image}
            src={`${props.profilePicture}?${new Date().getTime()}`}
          />
        </label>
      </div>
    );
  } else {
    editLabel = (
      <div className={styles.profile_circle}>
        <label
          onClick={() => uploadRef.current?.click()}
          className={styles.edit_label}
        >
          Edit Profile Picture
          <input
            onChange={onImageChange}
            ref={uploadRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
          />
        </label>
      </div>
    );
  }

  return editLabel;
}
