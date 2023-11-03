import { useEffect } from "react";
import "./Category.scss";
import { Link, useNavigate } from "react-router-dom";

export default function ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  // const navigate = useNavigate();

  const categoryList = categories.map((category, index) => {
    return (
      <li
        key={index}
        onClick={() => {
          setSelectedCategory(category);
        }}
      >
        {category}(0)
      </li>
    );
  });

  return (
    <div className="category">
      <ul>
        분류:
        <li
          onClick={() => {
            setSelectedCategory("");
          }}
        >
          전체(0)
        </li>
        {categoryList}
      </ul>
    </div>
  );
}
