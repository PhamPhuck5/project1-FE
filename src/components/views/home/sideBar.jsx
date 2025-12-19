import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import api from "../../../axios.js";
import CreateGroupModal from "../../Modal/CreateGroupModal.jsx";
import "./Sidebar.scss";

const Sidebar = () => {
  const [groups, setGroups] = useState([]);
  // Cache categories theo groupId: { 1: [...], 2: [...] }
  const [groupCategories, setGroupCategories] = useState({});
  // Trạng thái mở rộng của từng group: { 1: true, 2: false }
  const [expandedGroups, setExpandedGroups] = useState({});

  const createGroupModalRef = useRef(null);
  // Dùng useRef để giữ controller, tránh bị re-create mỗi lần render
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    fetchMyGroups();

    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  const fetchMyGroups = async () => {
    try {
      const res = await api.get(`/api/group/my-groups`, {
        signal: abortControllerRef.current.signal,
      });

      const groupData = res.data.data || res.data;
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

    const isExpanding = !expandedGroups[groupId];
    const isCached = groupCategories[groupId];

    if (isExpanding && !isCached) {
      await fetchCategoriesByGroup(groupId);
    }
  };

  const fetchCategoriesByGroup = async (groupId) => {
    try {
      const res = await api.get(`/api/category/${groupId}`);
      const categoryData = res.data.data || res.data;

      setGroupCategories((prev) => ({
        ...prev,
        [groupId]: categoryData,
      }));
    } catch (err) {
      console.error(`Lỗi fetch category group ${groupId}: `, err);
    }
  };
  const handleOpenCreateGroup = () => {
    if (createGroupModalRef.current) {
      createGroupModalRef.current.show();
    }
  };
  return (
    <aside className="group-bar-container">
      <div className="sidebar-section">
        <h3 className="section-title">Nhóm của bạn</h3>

        <ul className="sidebar-list">
          {groups.length > 0 ? (
            groups.map((group) => {
              const isOpen = expandedGroups[group.id];
              const categories = groupCategories[group.id] || [];

              return (
                <li
                  key={group.id}
                  className={`sidebar-group-item ${isOpen ? "expanded" : ""}`}
                >
                  <div
                    className={`group-header ${isOpen ? "active" : ""}`}
                    onClick={() => handleToggleGroup(group.id)}
                  >
                    <i className="icon-group"></i>
                    <span>{group.name}</span>
                    <span className="arrow-icon">{isOpen ? "▼" : "▶"}</span>
                  </div>

                  {isOpen && (
                    <ul className="category-sub-list">
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <li key={cat.id} className="category-item">
                            <span className="category-tag">#</span>
                            <span>{cat.name}</span>
                          </li>
                        ))
                      ) : (
                        <li className="category-empty">Chưa có danh mục</li>
                      )}
                    </ul>
                  )}
                </li>
              );
            })
          ) : (
            <li
              className="sidebar-item"
              style={{ fontStyle: "italic", color: "#888" }}
            >
              Chưa tham gia nhóm nào
            </li>
          )}
        </ul>
      </div>

      <div className="sidebar-footer">
        <button
          className="btn btn-primary w-100"
          style={{ backgroundColor: "#1b65c1" }}
          onClick={handleOpenCreateGroup}
        >
          <i className="fa-solid fa-plus"></i> Tạo nhóm mới
        </button>
      </div>
      <CreateGroupModal ref={createGroupModalRef} onSuccess={fetchMyGroups} />
    </aside>
  );
};

export default Sidebar;
