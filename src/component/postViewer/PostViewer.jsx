import "./PostViewer.scss";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios/axios.js";
import { POST_API, POST_EDIT_PAGE } from "../../URL";
import Button1List from "../button1List/Button1List";
import QuillEditor from "../../lib/Quill/Quill.jsx";
import Button2 from "../button2/Button2.jsx";
import PostToolBar from "../postToolBar/PostToolBar.jsx";
import PostTitle from "../postTitle/PostTitle.jsx";

export default function PostViewer({ _id, setCategoryData, isGod, mode }) {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });
  const viewerRef = useRef(null);

  // mount function
  async function handleClickDeletePostButton() {
    const answer = prompt("게시물을 삭제하시겠습니까?");

    if (answer === null) {
      return;
    }

    try {
      const response = await api.delete(POST_API(_id));
      const status = response.status;
      const newCategoryData = response.data;

      if (status === 200) {
        alert("삭제 완료");
        setCategoryData(newCategoryData);
        navigate("/");
      } else {
        console.log(status);
      }
    } catch (error) {
      alert("삭제 실패(통신 오류)");

      console.log(error);
    }
  }

  async function getPost() {
    try {
      const response = await api.get(POST_API(_id));
      const status = response.status;
      const post = response.data;

      if (status === 200) {
        setPost(post);
      } else {
        console.log("get, /post:id 요청 실패", "status: ", status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // handler function
  const setPostContent = (newPostContent) =>
    setPost((prevPost) => ({ ...prevPost, content: newPostContent }));

  function handleClickEditPostButton() {
    navigate(POST_EDIT_PAGE(_id));
  }

  // useEffect
  useEffect(() => {
    getPost();
  }, []);

  const postViewerData = {
    value: post.content,
    onChange: setPostContent,
    readOnly: true,
  };

  return (
    <>
      <div className="postViewer">
        <div className="postViewer__postToolbar">
          <PostToolBar
            mode={mode}
            _id={_id}
            setCategoryData={setCategoryData}
            isGod={isGod}
          />
        </div>
        <div className="postViewer__postTitle">
          <PostTitle mode={mode} title={post.title} />
          <div className="postTitle">
            <p className="postTitle__title">{post.title}</p>
          </div>
        </div>
        <div className="postViewer__categoryInfo">
          <div className="categoryInfo">
            <div className="categoryInfo__labelAndCategoryNameWrapper">
              <p className="categoryInfo__label">분류: </p>
              <p className="categoryInfo__categoryName">{post.category}</p>
            </div>
          </div>
        </div>
        <div className="postViewer__viewer">
          <QuillEditor data={postViewerData} ref={viewerRef} />
        </div>
      </div>
    </>
  );
}
