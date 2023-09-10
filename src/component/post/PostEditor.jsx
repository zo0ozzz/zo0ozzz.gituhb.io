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
  // const [isResizeBox2, setIsResizeBox2] = useState(false);
  // const resizeBox2Ref = useRef(null);

  // set state func
  const setPostTitle = useCallback(
    (newPostTitle) =>
      setPost((prevPost) => ({ ...prevPost, title: newPostTitle })),
    []
  );

  const setPostContent = useCallback((newPostContent) =>
    setPost((prevPost) => ({ ...prevPost, content: newPostContent }), [])
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
    // const editorBody = document.querySelector(".ql-editor");
    // 1. 이미지가 클릭되면 해당 이미지가 셀렉션 되게
    // 2. 사이즈 조정 박스가 보이게
    let count = 0;

    editorBody.addEventListener("click", (e) => {
      const target = e.target;

      // const imageResizePrompt = document.querySelector(".imageResizePrompt");

      // if (target.class !== "imageResizerPrompt") {
      //   imageResizePrompt.classList.add("hidden");
      // }

      if (target.tagName !== "IMG") {
        const imageResizePrompt = document.querySelector(".imageResizePrompt");

        if (imageResizePrompt) {
          count--;
          imageResizePrompt.remove();
        } else {
          return;
        }
      }

      if (target.tagName === "IMG") {
        console.log("count", count);
        if (count === 0) {
          const div = document.createElement("div");
          div.style.border = "1px solid";
          div.style.padding = "2px";
          div.classList.add("imageResizePrompt");
          // div.classList.add("hidden");

          const sizeInput = document.createElement("input");
          sizeInput.setAttribute("type", "text");
          sizeInput.setAttribute("placeholder", "신사답게 입력해.");
          // sizeInput.addEventListener("focusout", () => {
          //   console.log("블러");

          //   div.classList.add("hidden");
          // });
          // 포커스아웃이나 블러는 키다운 이벤트라 키업 이벤트인 click보다 먼저 실행돼버림.
          // 그래서 버튼을 눌러도 해당 버튼의 기능이 실행되지 않았던 것.

          const button1 = document.createElement("input");
          button1.setAttribute("type", "button");
          button1.setAttribute("value", "변경");
          button1.id = "button1";

          const button2 = document.createElement("input");
          button2.setAttribute("type", "button");
          button2.setAttribute("value", "300");
          // button2.addEventListener("click", () => {
          //   div.classList.add("hidden");
          //   handleClickImageResizer300Button();
          // });

          const button3 = document.createElement("input");
          button3.setAttribute("type", "button");
          button3.setAttribute("value", "500");
          // button3.addEventListener("click", () => {
          //   div.classList.add("hidden");
          //   handleClickImageResizer500Button();
          // });

          div.insertAdjacentElement("beforeend", sizeInput);
          div.insertAdjacentElement("beforeend", button1);
          div.insertAdjacentElement("beforeend", button2);
          div.insertAdjacentElement("beforeend", button3);

          quillInstance.addContainer(div);
          count++;
        }

        const imageResizePrompt = document.querySelector(".imageResizePrompt");

        const findedByDOM = Quill.find(target, false);
        const index = quillInstance.getIndex(findedByDOM);
        const range = { index: index, length: 1 };

        const position = quillInstance.getBounds(index, 1);
        imageResizePrompt.style.top = position.bottom + 10 + "px";
        // imageResizePrompt.classList.toggle("hidden");

        const sizeInput = document.querySelector(
          ".imageResizePrompt > input[type='text']"
        );

        const submitButton = document.querySelector("#button1");

        function handleClickSubmitButton() {
          const inputValue = sizeInput.value + "px";
          const src = target.src;

          quillInstance.deleteText(range);
          quillInstance.insertEmbed(
            range.index,
            "image",
            { src: src, size: inputValue },
            Quill.sources.USER
          );
          quillInstance.setSelection(range.index + 1, Quill.sources.SILENT);

          // imageResizePrompt.classList.add("hidden");

          submitButton.removeEventListener("click", handleClickSubmitButton);
        }

        submitButton.addEventListener("click", handleClickSubmitButton);

        sizeInput.focus();
      }
    });
  }, []);

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
          {/* <div
            className="resizeBox2"
            ref={resizeBox2Ref}
            style={{ display: isResizeBox2 ? "" : "none" }}
          >
            <input type="text" />
            <button>변경</button>
          </div> */}
          <QuillEditor
            postContent={post.content}
            setPostContent={setPostContent}
            ref={editorRef}
          />
        </div>
      </div>
    </>
  );
}
