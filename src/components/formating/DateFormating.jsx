import React from "react";
import moment from "moment";
import { dateFormat } from "../../utils/constant.js";
/** For valid format please see <a href="https://momentjs.com/docs/#/displaying/">Moment format options</a> */

const FormattedDate = ({ format, value, ...otherProps }) => {
  let dFormat = format ? format : dateFormat.SEND_TO_SERVER;
  const formattedValue = value ? moment.utc(value).format(dFormat) : null;
  return <span {...otherProps}>{formattedValue}</span>;
};

export default FormattedDate;
