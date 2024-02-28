import React, { useState } from "react";
import styles from "./UserInfo.module.scss";
import { SERVER_URL, STATICFILES_ROUTE } from "../../utils/const";

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  const [avatarLoaded, setAvatarLoaded] = useState(true);

  const handleImageError = () => {
    setAvatarLoaded(false); // Устанавливаем состояние в false, если возникает ошибка при загрузке изображения
  };

  return (
    <div className={styles.root}>
      <img
        className={styles.avatar}
        src={
          avatarUrl && avatarLoaded
            ? avatarUrl
            : `${SERVER_URL}${STATICFILES_ROUTE}/noavatar.png`
        }
        onError={handleImageError}
        alt={fullName}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
