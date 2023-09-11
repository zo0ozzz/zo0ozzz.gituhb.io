import "./PostCommon.scss";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios/axios.js";
import QuillEditor from "../../lib/Quill/Quill.jsx";
import { Quill } from "react-quill";

export default function PostEditor({ _id, mode }) {
  const [post, setPost] = useState({ title: "", content: "" });
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [isHTML, setIsHTML] = useState(false);
  const [isImageSrc, setImageSrc] = useState("");
  const [imageRange, setImageRange] = useState({});
  const [sizeInputValue, setSizeInputValue] = useState("");
  const [location, setLocation] = useState({ x: "", y: "" });
  const sizeInputRef = useRef(null);
  console.log(location);

  const setPostTitle = useCallback(
    (newPostTitle) =>
      setPost((prevPost) => ({ ...prevPost, title: newPostTitle })),
    []
  );

  const setPostContent = useCallback((newPostContent) =>
    setPost((prevPost) => ({ ...prevPost, content: newPostContent }), [])
  );

  const html = (
    <>
      <div
        className="imageResizePrompt"
        style={{ left: `${location.x}px`, top: `${location.y}px` }}
      >
        <span>변경할 너비(px):</span>
        <input
          ref={sizeInputRef}
          type="text"
          placeholder="신사답게 입력해"
          id="sizeInput"
          value={sizeInputValue}
          onChange={(e) => {
            const target = e.target;
            const value = target.value;
            setSizeInputValue(value);
          }}
        />
        <input
          type="button"
          value="변경"
          id="button1"
          onClick={() => {
            const quillInstance = editorRef.current.getEditor();
            quillInstance.deleteText(imageRange);
            quillInstance.insertEmbed(
              imageRange.index,
              "image",
              { src: isImageSrc, size: sizeInputValue + "px" },
              Quill.sources.USER
            );
            quillInstance.setSelection(
              imageRange.index + 1,
              Quill.sources.SILENT
            );

            setIsHTML(false);
          }}
        />
        <input
          type="button"
          value="300"
          id="button2"
          onClick={() => {
            const quillInstance = editorRef.current.getEditor();
            quillInstance.deleteText(imageRange);
            quillInstance.insertEmbed(
              imageRange.index,
              "image",
              { src: isImageSrc, size: 300 + "px" },
              Quill.sources.USER
            );
            quillInstance.setSelection(
              imageRange.index + 1,
              Quill.sources.SILENT
            );

            setIsHTML(false);
          }}
        />
        <input
          type="button"
          value="500"
          id="button3"
          onClick={() => {
            const quillInstance = editorRef.current.getEditor();
            quillInstance.deleteText(imageRange);
            quillInstance.insertEmbed(
              imageRange.index,
              "image",
              { src: isImageSrc, size: 500 + "px" },
              Quill.sources.USER
            );
            quillInstance.setSelection(
              imageRange.index + 1,
              Quill.sources.SILENT
            );

            setIsHTML(false);
          }}
        />
      </div>
    </>
  );

  // event handle func
  async function handleClickCompleteEditButton() {
    try {
      const editedPost = post;

      const response = await api.patch("/post/" + _id, editedPost);
      const status = response.status;

      if (status === 200) {
        navigate("/posts/" + _id);
      } else {
        console.log("status: ", status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleClickCompleteCreateButton() {
    try {
      const newPost = post;

      const response = await api.post("/post", newPost);
      const status = response.status;
      const newPost_id = response.data._id;

      if (status === 200) {
        navigate("/posts/" + newPost_id);
      } else {
        console.log("status: ", status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleChangePostTitleInput(e) {
    const newPostTitle = e.target.value;

    setPostTitle(newPostTitle);
  }

  // mount func
  async function getPost() {
    try {
      const response = await api.get("/post/" + _id);
      const status = response.status;
      const post = response.data;

      if (status === 200) {
        setPostTitle(post.title);
        setPostContent(post.content);
      } else {
        console.log("get, /post:id 요청 실패", "status: ", status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (mode === "create") {
      setPost((prevPost) => ({ ...prevPost, title: "", content: "" }));

      return;
    }

    if (mode === "edit") getPost();
  }, [mode]);

  useEffect(() => {
    const quillInstance = editorRef.current.getEditor();
    const editorBody = editorRef.current.getEditor().root;

    editorBody.addEventListener("click", (e) => {
      const target = e.target;

      if (target.tagName !== "IMG") {
        setIsHTML(false);

        return;
      }

      if (target.tagName === "IMG") {
        const findedByDOM = Quill.find(target, false);
        const index = quillInstance.getIndex(findedByDOM);
        const range = { index: index, length: 1 };
        const x = target.style.left;
        const y = target.style.left;
        const width = target.style.width;
        const src = target.src;
        // const x = window.clientX;
        // const y = window.clientY;

        const dom = target.getBoundingClientRect();
        console.log(dom);
        // const image = event.target;
        // const imageRect = image.getBoundingClientRect();
        // const boxWidth = 100;
        // const boxHeight = 100;
        // const boxX = imageRect.left + (imageRect.width - boxWidth) / 2;
        // const boxY = imageRect.top + (imageRect.height - boxHeight) / 2;

        setImageRange(range);
        setImageSrc(src);
        setLocation({ x: dom.x + dom.left, y: dom.top + window.scrollY });
        setSizeInputValue(width);
        setIsHTML(false);
        setTimeout(() => {
          setIsHTML(true);
        }, 0);
      }
    });
  }, []);

  useEffect(() => {
    if (isHTML === true) {
      sizeInputRef.current.focus();
    }
  }, [isHTML]);

  return (
    <>
      <div className="wrapper-postEditor">
        <div className="bar">
          {mode === "edit" ? (
            <button
              className={"completeEditButton"}
              onClick={handleClickCompleteEditButton}
            >
              수정 완료
            </button>
          ) : mode === "create" ? (
            <button
              className={"completeCreateButton"}
              onClick={handleClickCompleteCreateButton}
            >
              등록
            </button>
          ) : null}
        </div>
        <div className="title">
          <input
            type="text"
            value={post.title}
            onChange={(e) => handleChangePostTitleInput(e)}
          />
        </div>
        <div className="content">
          <QuillEditor
            postContent={post.content}
            setPostContent={setPostContent}
            ref={editorRef}
          />
        </div>
        {isHTML ? html : null}
      </div>
    </>
  );
}
