import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Post from "../../components/Post/Post";
import { useSelector } from "react-redux";
import { SERVER_URL, USERFILES_ROUTE, POSTFILES_ROUTE } from "../../utils/const";
import formatDateUkr from "../../utils/dateFormatter";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

function Main() {
  const userData = useSelector((state) => state.auth.data);
  const searchQuery = useSelector((state) => state.searchQuery);
  console.log("USERDATA: ", userData);
  const { posts } = useSelector((state) => state.posts);

  const isPostLoading = posts.status === "loading";

  const [isSearching, setSearching] = useState(false);

  const [tab, setTab] = useState(0);

  const sortPosts = (postA, postB) => {
    if (tab === 0) {
      return new Date(postB.post.createdAt) - new Date(postA.post.createdAt);
    } else if (tab === 1) {
      return postB.post.viewsCount - postA.post.viewsCount;
    }
  };

  useEffect(() => {
    const searchQueries = searchQuery.searchQuery
      .toLowerCase()
      .split(",")
      .map((query) => query.trim())
      .filter((query) => query);

    searchQueries.length > 0 ? setTab(false) : setTab(0);
    setSearching(searchQueries.length > 0);
  }, [searchQuery]);

  let filteredPosts = posts.items;

  if (isSearching) {
    filteredPosts = filteredPosts
      .map((item) => {
        const post = item;
        const searchQueries = searchQuery.searchQuery
          .toLowerCase()
          .split(",")
          .map((query) => query.trim())
          .filter((query) => query);

        let matchCount = 0;

        if (searchQueries.length === 0) {
          return { ...post, matchCount };
        }

        if (searchQueries.some((query) => post.post.title.toLowerCase().includes(query))) {
          matchCount++;
        }

        if (searchQueries.some((query) => post.post.subtitle.toLowerCase().includes(query))) {
          matchCount++;
        }

        if (
          post.ingredients.length > 0 &&
          post.ingredients.some((ingredient) =>
            searchQueries.some((query) => ingredient.name.toLowerCase().includes(query))
          )
        ) {
          matchCount++;
        }

        return { ...post, matchCount };
      })
      .filter((post) => post.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
  } else {
    filteredPosts = filteredPosts.toSorted(sortPosts);
  }

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={tab} aria-label="basic tabs example">
        <Tab
          disabled={isSearching}
          onClick={() => {
            setTab(0);
          }}
          label="Нові"
        />
        <Tab
          disabled={isSearching}
          onClick={() => {
            setTab(1);
          }}
          label="Популярні"
        />
        {/* <Tab label="Підписки" /> */}
      </Tabs>

      {isPostLoading ? (
        [...Array(5)].map((item, index) => <Post key={index} isLoading={true} />)
      ) : filteredPosts.length === 0 ? (
        <Typography>Постів не знайдено</Typography>
      ) : (
        filteredPosts.map((item, index) => (
          <Post
            key={index}
            id={item.post._id}
            title={item.post.title}
            subtitle={item.post.subtitle}
            image={`${SERVER_URL}${POSTFILES_ROUTE}/${item.post.img}`}
            user={{
              avatarUrl: `${SERVER_URL}${USERFILES_ROUTE}/${item.user[0].avatar}`,
              fullName: item.user[0].name,
            }}
            createdAt={formatDateUkr(item.post.createdAt)}
            viewsCount={item.post.viewsCount}
            commentsCount={3}
            isEditable={userData?.user?._id === item.user[0]._id}
          />
        ))
      )}
    </>
  );
}

export default Main;
