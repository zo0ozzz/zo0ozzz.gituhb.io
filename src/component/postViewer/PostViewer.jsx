import "./PostViewer.scss";
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios/axios.js";
import URL from "../../URL";
import QuillEditor from "../../lib/Quill/Quill.jsx";
import Button1List from "../button1List/Button1List";

export default function PostViewer({ _id, setCategoryData }) {
  const navigate = useNavigate();

  const [post, setPost] = useState({ title: "", content: "" });
  const barButtonListData = [
    {
      name: "수정",
      onClick: handleClickEditPostButton,
      className: "postViewer-editButton",
    },
    {
      name: "삭제",
      onClick: handleClickDeletePostButton,
      className: "postViewer-deleteButton",
    },
  ];
  const viewerRef = useRef(null);

  useEffect(() => {
    getPost();
  }, []);

  function setPostContent(newPostContent) {
    setPost((prevPost) => ({ ...prevPost, content: newPostContent }));
  }

  // handler function
  function handleClickEditPostButton() {
    navigate(URL.edit(_id));
  }

  async function handleClickDeletePostButton() {
    const answer = prompt("게시물을 삭제하시겠습니까?");

    if (answer === null) {
      return;
    }

    try {
      const response = await api.delete("/post/" + _id);
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

  // useEffect function
  async function getPost() {
    try {
      const response = await api.get("/post/" + _id);
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

  return (
    <>
      <div className="postViewer">
        <div className="postViewer-bar">
          <Button1List data={barButtonListData} />
        </div>
        <div className="postViewer-title">
          <p className="postViewer-titleContent">{post.title}</p>
        </div>
        <div className="postViewer-category">분류: {post.category}</div>
        <QuillEditor
          postContent={post.content}
          setPostContent={setPostContent}
          isViewer={true}
          ref={viewerRef}
        />
      </div>
    </>
  );
}
