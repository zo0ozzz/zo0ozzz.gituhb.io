import "./SortingSelector.scss";
import { useState, useEffect } from "react";
import Label1 from "../label/Label1";
import Select1 from "../select1/Select1";

export default function SortingSelector({
  sortName,
  setSortName,
  sortingMedthodData,
}) {
  const [selectValue, setSelectValue] = useState("");
  const selectId = "select";

  const sortingSelectorData = {
    label: { name: "정렬:", htmlFor: selectId },
    select: {
      value: selectValue,
      onChange: handleChangeSelect,
      id: selectId,
      option: sortingMedthodData,
    },
  };

  function handleChangeSelect(e) {
    const sortName = e.target.value;

    setSortName(sortName);
  }

  useEffect(() => {
    setSelectValue(sortName);
  }, [sortName]);

  return (
    <span className="sortingSelector">
      <Label1 data={sortingSelectorData.label} />
      <Select1 data={sortingSelectorData.select} />
    </span>
  );
}