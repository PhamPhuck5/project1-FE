import React, { useMemo, useState, useEffect, useRef } from "react";
import moment from "moment";
import _ from "lodash";
import { useSelector } from "react-redux";
import axios from "axios";
import api from "../../../axios.js";

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
  let lastEventEnding = null;

  const packedEvents = sortedEvents.map((ev) => {
    const start = ev.startMin;
    const end = ev.startMin + ev.length;

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

  // Tính toán width và left dựa trên nhóm va chạm (Cluster)
  // Logic đơn giản: Nếu tại thời điểm T có Max N cột đang active, thì width = 100/N
  // Tuy nhiên để UI đẹp kiểu Google, ta cần nhóm các event liên quan lại (Cluster)

  // Trả về events đã có style
  return packedEvents.map((ev) => {
    // Tìm tổng số cột max tại thời điểm diễn ra sự kiện này (đơn giản hóa)
    // Để chính xác tuyệt đối như Google Calendar cần thuật toán đồ thị phức tạp hơn,
    // đây là cách tiếp cận "Expand to fit"

    const overlaps = packedEvents.filter(
      (other) =>
        other !== ev &&
        !(
          other.startMin + other.length <= ev.startMin ||
          other.startMin >= ev.startMin + ev.length
        )
    );

    // Tính max colIndex trong nhóm overlap để biết tổng số chia
    let maxCols = ev.colIndex;
    overlaps.forEach((o) => {
      if (o.colIndex > maxCols) maxCols = o.colIndex;
    });

    // Thêm các sự kiện có colIndex lớn hơn (kể cả không overlap trực tiếp nhưng thuộc cùng cụm visual)
    // Đây là phần heuristic để UI không bị vỡ.

    const totalCols = maxCols + 1;
    const width = 100 / totalCols;
    const left = width * ev.colIndex;

    return {
      ...ev,
      style: {
        top: `${ev.startMin}px`, // 1min = 1px height
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
    return [
      {
        ...task,
        start,
        end,
      },
    ];
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

  const weekDays = useMemo(() => {
    const today = moment();
    const days = [];
    for (let i = -2; i <= 4; i++) {
      days.push(today.clone().add(i, "days"));
    }
    return days;
  }, []);
  const fetchTasks = async (offset = 0) => {
    const controller = new AbortController();

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
      console.error("error: ", err.message);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 8 * 60;
    }
    fetchTasks(0);
  }, []);

  const handleOpenCreateModal = () => {
    if (createTaskModalRef.current) {
      createTaskModalRef.current.show();
    }
  };

  const renderSidebar = () => (
    <div className="sidebar-container">
      <h3 style={{ color: "#3a6ea5", fontWeight: "bold" }}>My Calendar</h3>
      <div style={{ marginTop: "20px" }}>
        <button
          className="btn btn-primary w-100"
          style={{ backgroundColor: "#1b65c1" }}
          onClick={handleOpenCreateModal}
        >
          <i className="fa-solid fa-plus"></i> Create Task
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <p className="text-muted small mt-3">My Calendars</p>
        <ul className="list-unstyled">
          <li>
            <input type="checkbox" checked readOnly /> Event
          </li>
          <li>
            <input type="checkbox" checked readOnly /> Personal
          </li>
        </ul>
      </div>
      <Sidebar />
    </div>
  );

  const renderTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(<div key={i} className="hour-line"></div>);
    }
    return slots;
  };

  const renderTimeLabels = () => {
    const labels = [];
    for (let i = 0; i < 24; i++) {
      labels.push(
        <div key={i} className="time-slot-label">
          {i === 0 ? "" : `${i}:00`}
        </div>
      );
    }
    return labels;
  };

  const renderDayEvents = (dayMoment) => {
    const dayEvents = rawEvents
      .filter((ev) => moment(ev.date).isSame(dayMoment, "day"))
      .map((ev) => ({
        ...ev,
        startMin: moment(ev.date).hours() * 60 + moment(ev.date).minutes(),
      }));

    const processedEvents = processEventsForLayout(dayEvents);

    return processedEvents.map((ev, index) => (
      <div
        key={`${ev.id}-${index}-${ev.date}`}
        className="event-card"
        style={ev.style}
        title={`${ev.name} (${moment(ev.date).format("HH:mm")} - ${
          ev.length
        }m)`}
        onClick={() => {
          //
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
      {renderSidebar()}

      <div className="calendar-container">
        <div className="calendar-header">
          {weekDays.map((day, index) => {
            const isToday = day.isSame(moment(), "day");
            return (
              <div
                key={index}
                className={`day-column-header ${isToday ? "is-today" : ""}`}
              >
                <div className="day-name">{day.format("ddd")}</div>
                <div className="day-date">{day.format("DD")}</div>
              </div>
            );
          })}
        </div>

        <div className="calendar-body" ref={scrollRef}>
          <div className="time-axis">{renderTimeLabels()}</div>

          <div className="days-grid">
            <div className="grid-lines">{renderTimeSlots()}</div>

            {weekDays.map((day, index) => {
              const isToday = day.isSame(moment(), "day");
              return (
                <div
                  key={index}
                  className={`day-column ${isToday ? "is-today" : ""}`}
                >
                  {renderDayEvents(day)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <CreateTaskModal
        ref={createTaskModalRef}
        onSuccess={() => fetchTasks(0)}
      />
    </div>
  );
}
