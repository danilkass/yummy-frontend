import React, { useState } from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { Link, useNavigate } from "react-router-dom";
import {
  MAIN_ROUTE,
  POST_ROUTE,
  REDACTOR_ROUTE,
  SERVER_URL,
  STATICFILES_ROUTE,
} from "../../utils/const";
import { useDispatch } from "react-redux";
import { fetchPost, fetchRemovePost } from "../../redux/slices/posts";

const Post = ({
  id,
  title,
  subtitle,
  createdAt,
  image,
  user,
  viewsCount,
  commentsCount,
  youtubeUrl,
  ingredients,
  //   tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(true);
  const navigate = useNavigate();
  //   const [avatarLoaded, setAvatarLoaded] = useState(true);
  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = async () => {
    if (window.confirm("Ви дійсно бажаєте видалити статтю?")) {
      await dispatch(fetchRemovePost(id)).then(() => {
        //   dispatch(fetchPost());
      });
      navigate(MAIN_ROUTE);
    }
  };

  // Функция для обработки ошибок при загрузке изображения
  const handleImageError = () => {
    setImageLoaded(false); // Устанавливаем состояние в false, если возникает ошибка при загрузке изображения
  };
  //   const handleAvatarError = () => {
  // 	setAvatarLoaded(false); // Устанавливаем состояние в false, если возникает ошибка при загрузке изображения
  //  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {(isEditable || (isFullPost && isEditable)) && (
        <div className={styles.editButtons}>
          <Link to={`${POST_ROUTE}/${id}${REDACTOR_ROUTE}`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="red">
            <DeleteIcon />
          </IconButton>
        </div>
      )}

      <div className={isFullPost ? undefined : styles.gridContainer}>
        {isFullPost && (
          <>
            <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>{title}</h2>
            <div className={clsx(styles.subtitle, { [styles.titleFull]: isFullPost })}>
              {subtitle}
            </div>
          </>
        )}
        {/* {image && (
          <img
            className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
            src={image}
            alt={title}
          />
        )} */}
        {imageLoaded ? (
          <img
            className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
            src={image}
            alt={title}
            onError={handleImageError} // Обработка ошибки загрузки изображения
          />
        ) : (
          <img
            className={styles.image}
            src={`${SERVER_URL}${STATICFILES_ROUTE}/noresult.png`} // Путь к вашей заглушке
            alt={title}
          />
        )}

        <div className={styles.wrapper}>
          <div className={styles.indention}>
            <div>
              {!isFullPost && (
                <>
                  <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
                    <Link to={POST_ROUTE + "/" + id}>{title}</Link>
                  </h2>
                  <div className={styles.subtitle}>{subtitle}</div>
                </>
              )}

              {isFullPost && ingredients && (
                <div className={clsx(styles.ingredientsWrapper)}>
                  <div className={styles.ingredientsTitle}>Інгредієнти</div>
                  <div className={styles.ingredientsList}>
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className={styles.ingredientsItem}>
                        <div className={styles.ingredientsLabel}>
                          <span> {ingredient.name}</span>
                        </div>
                        <div className={styles.ingredientsValue}>{ingredient.quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.youtubeUrl}>
                {isFullPost && youtubeUrl && (
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${youtubeUrl.split("v=")[1]}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              {/* <ul className={styles.tags}>
                {tags.map((name) => (
                  <li key={name}>
                    <a href={`/tag/${name}`}>#{name}</a>
                  </li>
                ))}
              </ul> */}
            </div>

            {children && <div className={styles.content}>{children}</div>}

            <div className={styles.inner}>
              <UserInfo {...user} additionalText={createdAt} />
              <ul className={styles.postDetails}>
                <li>
                  <EyeIcon />
                  <span>{viewsCount}</span>
                </li>
                {/* <li>
                  <CommentIcon />
                  <span>{commentsCount}</span>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
