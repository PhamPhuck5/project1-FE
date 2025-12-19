import React from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

const DatePicker = ({ value, onChange }) => {
  return (
    <Flatpickr
      value={value}
      onChange={(selectedDates) => {
        const date = selectedDates[0] || null;
        onChange(date);
      }}
      options={{
        dateFormat: "d/m/Y",
        allowInput: true,
        disableMobile: true,
        static: true,
      }}
      className="form-control"
    />
  );
};

export default DatePicker;
