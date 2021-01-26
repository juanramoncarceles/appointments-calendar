import React from "react";
import { Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import { dateTimeToTimeString } from "../utils";

import type { AppointmentData } from "../types";

const Root = styled(Box)({
  display: "flex",
  overflowX: "hidden",
  maxWidth: "170%",
  borderRadius: 2,
});

interface IProps {
  data: AppointmentData;
}

const Appointment = ({ data }: IProps) => {
  // TODO if the appointment takes all day because it starts the day
  // before and ends the day after how to show? an "all day" string?

  return (
    <Root id={data.id} className="appointment-identifier" p={0.5}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: "smaller",
          lineHeight: 1,
        }}
      >
        <span>{dateTimeToTimeString(data.startDate)}</span>
        <span>{dateTimeToTimeString(data.endDate)}</span>
      </div>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: 5,
          whiteSpace: "nowrap",
        }}
      >
        {data.title}
      </span>
    </Root>
  );
};

export default Appointment;
