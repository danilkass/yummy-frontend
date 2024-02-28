import Post from "../../components/Post/Post";
// import AddComment from "../../components/AddComment/AddComment";
// import CommentsBlock from "../../components/CommentsBlock";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../axios";
import {
  MAIN_ROUTE,
  POSTFILES_ROUTE,
  POST_ROUTE,
  SERVER_URL,
  USERFILES_ROUTE,
} from "../../utils/const";
import ReactMarkdown from "react-markdown";
import formatDateUkr from "../../utils/dateFormatter";
import { useSelector } from "react-redux";

function PostPage() {
  const userData = useSelector((state) => state.auth.data);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(POST_ROUTE + "/" + id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.warn(err);
        alert("При отримані поста сталася помилка");
        navigate(MAIN_ROUTE);
      });
  }, [id]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <div style={{ paddingBottom: "40px" }}>
      <Post
        id={data.post._id}
        title={data.post.title}
        subtitle={data.post.subtitle}
        image={`${SERVER_URL}${POSTFILES_ROUTE}/${data.post.img}`}
        user={{
          avatarUrl: `${SERVER_URL}${USERFILES_ROUTE}/${data.user[0].avatar}`,
          fullName: data.user[0].name,
        }}
        youtubeUrl={data.post.youtubeUrl}
        createdAt={formatDateUkr(data.post.createdAt)}
        viewsCount={data.post.viewsCount}
        commentsCount={3}
        ingredients={data.ingredients}
        //   tags={["react", "fun", "typescript"]}
        isFullPost
        isEditable={userData?.user?._id === data.post.userId} // isEditable={userData?.user?._id === item.user[0]._id}
      >
        <ReactMarkdown children={data.post.text} />
      </Post>
      {/* <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <AddComment />
      </CommentsBlock> */}
    </div>
  );
}

export default PostPage;
