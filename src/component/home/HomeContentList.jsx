import "./HomeContentList.scss";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios/axios.js";

export default function HomeContentList({ sortName, setSortName }) {
  const [posts, setPosts] = useState([]);
  // const sortingName = useRef('최신순');

  console.log(sortName);
  const postsList = posts.map((post, index) => {
    return (
      <Link to={"/posts/" + post._id} className="link" key={index}>
        <section className="contentList">
          <h2 className="subject">{post.title}</h2>
          <time className="date">{post.date}</time>
        </section>
      </Link>
    );
  });

  async function getAllPosts() {
    try {
      const response = await api.get("/post");
      const status = response.status;
      let posts = response.data;

      if (status === 200) {
        if (sortName === "오래된 순") {
          const sortedPosts = [...posts].sort((a, b) => a.number - b.number);

          setPosts(sortedPosts);

          return;
        }

        const sortedPosts = posts.sort((a, b) => b.number - a.number);

        setPosts(sortedPosts);
      } else {
        console.log("get, /post 요청 실패", "status: ", status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function sortPosts() {
    if (sortName === "최신순") {
      const sortedPosts = [...posts].sort((a, b) => b.number - a.number);

      setPosts(sortedPosts);

      return;
    }

    if (sortName === "오래된 순") {
      const sortedPosts = [...posts].sort((a, b) => a.number - b.number);

      setPosts(sortedPosts);

      return;
    }
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    sortPosts();
  }, [sortName]);

  return (
    <>
      <main className="home-contentList_container">{postsList}</main>
    </>
  );
}
