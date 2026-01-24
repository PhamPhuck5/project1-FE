import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../../../axios.js";

import CreateGroupModal from "../../Modal/CreateGroupModal.jsx";
import CreateCategoryModal from "../../Modal/createCategoryModal.jsx";
import CreateEventModal from "../../Modal/createEventModal.jsx";

import {
  onClickFollowCategory,
  handleDeleteCategory,
} from "../../../containers/category.js";

import "./Sidebar.scss";

const Sidebar = ({ onCreateTask, reFetchTask }) => {
  const [groups, setGroups] = useState([]);
  const [groupCategories, setGroupCategories] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const createGroupModalRef = useRef(null);
  const createCategoryRef = useRef(null);
  const createEventModalRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    fetchMyGroups();
    return () => {
      abortControllerRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyGroups = async () => {
    try {
      const res = await api.get(`/api/group/groups`, {
        signal: abortControllerRef.current.signal,
      });
      const groupData = res || [];

      setGroups(Array.isArray(groupData) ? groupData : []);
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      console.error("Lỗi fetch groups: ", err);
    }
  };

  const handleToggleGroup = async (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));

    const isCached = groupCategories[groupId];
    if (!isCached) {
      await fetchCategoriesByGroup(groupId);
    }
  };

  const fetchCategoriesByGroup = async (groupId) => {
    try {
      const res = await api.get(`/api/category/${groupId}`, {
        signal: abortControllerRef.current.signal,
      });
      const categoryData = res || [];
      setGroupCategories((prev) => ({
        ...prev,
        [groupId]: Array.isArray(categoryData) ? categoryData : [],
      }));
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      console.error(`Lỗi fetch category group ${groupId}: `, err);
    }
  };

  const handleOpenCreateGroup = () => {
    createGroupModalRef.current?.show();
  };

  const handleOpenCreateCategory = (groupId) => {
    createCategoryRef.current?.show(groupId);
  };

  const handleCreatecategorySuccess = async (groupId) => {
    await fetchCategoriesByGroup(groupId);
  };

  const handleDeleteCat = async (groupId, cat) => {
    try {
      const ok = await handleDeleteCategory(groupId, cat.name);
      if (ok) {
        await fetchCategoriesByGroup(groupId);
      } else {
        alert("Xóa thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  const handleOpenCreateEvent = (groupId, categoryId) => {
    createEventModalRef.current?.show(groupId, categoryId);
  };

  const handleLeaveGroup = async (groupId) => {
    if (!confirm("Bạn có muốn rời nhóm này không?")) return;
    try {
      const res = await api.post(
        "/api/group/leave",
        { groupId },
        { signal: abortControllerRef.current.signal }
      );
      if (res?.data?.success === false) {
        // Backend may return a message or success flag
        alert(res.data.message || "Không thể rời nhóm");
      } else {
        await fetchMyGroups();
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      console.error("Error leaving group:", err);
      alert("Lỗi rời nhóm");
    }
  };

  return (
    <div className="sidebar-container">
      <h3 style={{ color: "var(--accent)", fontWeight: "bold" }}>
        My Calendar
      </h3>

      <div style={{ marginTop: "20px" }}>
        <button
          className="btn btn-primary w-100"
          style={{ backgroundColor: "var(--primary)" }}
          onClick={onCreateTask}
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

      <aside className="group-bar-container">
        <h3 className="section-title">Nhóm của bạn</h3>

        <ul className="sidebar-list">
          {groups.length === 0 && (
            <li style={{ fontStyle: "italic", color: "var(--muted)" }}>
              Chưa tham gia nhóm nào
            </li>
          )}

          {groups.map((group) => {
            const isOpen = !!expandedGroups[group.id];
            const categories = groupCategories[group.id] || [];

            return (
              <li
                key={group.id}
                className={`sidebar-group-item ${isOpen ? "expanded" : ""}`}
              >
                <div
                  className={`group-header ${isOpen ? "active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                  onClick={() => handleToggleGroup(group.id)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <i className="icon-group"></i>
                    <span>{group.name}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {group.isAdmin && (
                      <button
                        className="icon-btn icon-btn--add"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCreateCategory(group.id);
                        }}
                        title="Tạo danh mục"
                      >
                        <i className="fa-solid fa-folder-plus"></i>
                      </button>
                    )}

                    <button
                      className="icon-btn icon-btn--leave"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeaveGroup(group.id);
                      }}
                      title="Rời nhóm"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </button>

                    <span className="arrow-icon">{isOpen ? "▼" : "▶"}</span>
                  </div>
                </div>

                {isOpen && (
                  <ul className="category-sub-list">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <li key={cat.id} className="category-item">
                          <span className="category-tag">#</span>
                          <span>{cat.name}</span>

                          <div
                            style={{
                              marginLeft: "auto",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {group.isAdmin && (
                              <button
                                title="Xóa danh mục"
                                onClick={() => handleDeleteCat(group.id, cat)}
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 6,
                                  border: "none",
                                  background: "transparent",
                                  cursor: "pointer",
                                  color: "#f44336",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <i className="fa-solid fa-trash" />
                              </button>
                            )}

                            <button
                              title={
                                cat.isFollowing ? "Bỏ theo dõi" : "Theo dõi"
                              }
                              onClick={async () => {
                                await onClickFollowCategory(
                                  cat.id,
                                  cat.isFollowing
                                );
                                await fetchCategoriesByGroup(group.id);
                              }}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: cat.isFollowing ? "#fbc02d" : "#9e9e9e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i className="fa-solid fa-star" />
                            </button>

                            <button
                              title="Tạo event"
                              onClick={() =>
                                handleOpenCreateEvent(group.id, cat.id)
                              }
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: "#4f8cff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i className="fa-solid fa-calendar-plus" />
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="category-empty">Chưa có danh mục</li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="sidebar-footer">
        <button
          className="btn btn-primary w-100"
          style={{ backgroundColor: "var(--primary)" }}
          onClick={handleOpenCreateGroup}
        >
          <i className="fa-solid fa-plus"></i> Tạo nhóm mới
        </button>
      </div>

      <CreateCategoryModal
        ref={createCategoryRef}
        onSuccess={handleCreatecategorySuccess}
      />
      <CreateGroupModal ref={createGroupModalRef} onSuccess={fetchMyGroups} />
      <CreateEventModal
        ref={createEventModalRef}
        onSuccess={() => reFetchTask()}
      />
    </div>
  );
};

export default Sidebar;
