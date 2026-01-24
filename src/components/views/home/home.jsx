import React, { useMemo, useState, useEffect, useRef } from "react";
import moment from "moment";
import _ from "lodash";
import axios from "axios";
import api from "../../../axios.js";

import EventPostModal from "../../Modal/postModal.jsx";
import Sidebar from "./sideBar.jsx";
import CreateTaskModal from "../../Modal/addTaskModal.jsx";
import "./home.scss";

const NOON_HOUR = 12;

const processEventsForLayout = (events) => {
  if (!events || events.length === 0) return [];

  const sortedEvents = [...events].sort((a, b) => {
    if (a.startMin !== b.startMin) return a.startMin - b.startMin;
    return b.length - a.length;
  });

  const columns = [];

  const packedEvents = sortedEvents.map((ev) => {
    const start = ev.startMin;

    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (!col.length) {
        col.push(ev);
        ev.colIndex = i;
        placed = true;
        break;
      }

      const lastEvInCol = col[col.length - 1];
      if (lastEvInCol.startMin + lastEvInCol.length <= start) {
        col.push(ev);
        ev.colIndex = i;
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([ev]);
      ev.colIndex = columns.length - 1;
    }

    return ev;
  });

  return packedEvents.map((ev) => {
    const overlaps = packedEvents.filter(
      (other) =>
        other !== ev &&
        !(
          other.startMin + other.length <= ev.startMin ||
          other.startMin >= ev.startMin + ev.length
        )
    );

    let maxCols = ev.colIndex;
    overlaps.forEach((o) => {
      if (o.colIndex > maxCols) maxCols = o.colIndex;
    });

    const totalCols = maxCols + 1;
    const width = 100 / totalCols;
    const left = width * ev.colIndex;

    return {
      ...ev,
      style: {
        top: `${ev.startMin}px`,
        height: `${ev.length}px`,
        left: `${left}%`,
        width: `${width}%`,
      },
    };
  });
};

function splitTaskIfCrossNoon(task) {
  const start = new Date(task.date);
  const end = new Date(start.getTime() + task.length * 60 * 1000);

  const noon = new Date(start);
  noon.setHours(NOON_HOUR, 0, 0, 0);

  if (start >= noon || end <= noon) {
    return [{ ...task, start, end }];
  }

  return [
    {
      ...task,
      start,
      end: noon,
      length: (noon - start) / 60000,
      isSplit: true,
      part: 1,
    },
    {
      ...task,
      start: noon,
      end,
      length: (end - noon) / 60000,
      isSplit: true,
      part: 2,
    },
  ];
}

export default function Home() {
  const [rawEvents, setRawEvents] = useState([]);
  const createTaskModalRef = useRef(null);
  const scrollRef = useRef(null);
  const eventPostModalRef = useRef(null);

  const weekDays = useMemo(() => {
    const today = moment();
    const days = [];
    for (let i = -2; i <= 4; i++) {
      days.push(today.clone().add(i, "days"));
    }
    return days;
  }, []);

  const fetchTasks = async (offset = 0) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 4);

    const formatDate = (d) => {
      const copy = new Date(d);
      copy.setHours(0, 0, 0, 0);
      return copy.toISOString();
    };

    try {
      const res = await api.get(`/api/task/${offset}/tasks`, {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });

      const events = res.data.flatMap((task) => splitTaskIfCrossNoon(task));
      setRawEvents(events);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error(err);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 8 * 60;
    }
    fetchTasks(0);
  }, []);

  const handleOpenCreateModal = () => {
    createTaskModalRef.current?.show();
  };

  const renderTimeSlots = () =>
    Array.from({ length: 24 }, (_, i) => (
      <div key={i} className="hour-line"></div>
    ));

  const renderTimeLabels = () =>
    Array.from({ length: 24 }, (_, i) => (
      <div key={i} className="time-slot-label">
        {i === 0 ? "" : `${i}:00`}
      </div>
    ));

  const renderDayEvents = (dayMoment) => {
    const dayEvents = rawEvents
      .filter((ev) => moment(ev.date).isSame(dayMoment, "day"))
      .map((ev) => ({
        ...ev,
        startMin: moment(ev.date).hours() * 60 + moment(ev.date).minutes(),
      }));

    return processEventsForLayout(dayEvents).map((ev, index) => (
      <div
        key={`${ev.id}-${index}`}
        className="event-card"
        style={ev.style}
        onClick={() => {
          if (ev.connect) eventPostModalRef.current?.show(ev.connect);
        }}
      >
        <div className="event-time">
          {moment(ev.date).format("HH:mm")} -{" "}
          {moment(ev.date).add(ev.length, "minutes").format("HH:mm")}
        </div>
        <div className="event-title">{ev.name}</div>
      </div>
    ));
  };

  return (
    <div className="homepage-wrapper">
      <Sidebar onCreateTask={handleOpenCreateModal} reFetchTask={fetchTasks} />

      <div className="calendar-container">
        <div className="calendar-header">
          {weekDays.map((day, index) => (
            <div key={index} className="day-column-header">
              <div className="day-name">{day.format("ddd")}</div>
              <div className="day-date">{day.format("DD")}</div>
            </div>
          ))}
        </div>

        <div className="calendar-body" ref={scrollRef}>
          <div className="time-axis">{renderTimeLabels()}</div>

          <div className="days-grid">
            <div className="grid-lines">{renderTimeSlots()}</div>
            {weekDays.map((day, index) => (
              <div key={index} className="day-column">
                {renderDayEvents(day)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateTaskModal
        ref={createTaskModalRef}
        onSuccess={() => fetchTasks(0)}
      />
      <EventPostModal ref={eventPostModalRef} />
    </div>
  );
}
