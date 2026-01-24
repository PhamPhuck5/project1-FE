import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../axios.js";

const InviteGroup = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Lấy thông tin group khi component mount
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await api.get(`/api/group/group/${groupId}`);
        setGroupInfo(response);
      } catch (error) {
        console.error("Không tìm thấy thông tin nhóm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupInfo();
  }, [groupId]);

  // 2. Hàm gửi yêu cầu gia nhập
  const handleJoin = async () => {
    setSubmitting(true);
    try {
      const response = await api.post("/api/group/request-join", {
        groupId: groupId,
      });

      if (response.data.status === 200) {
        alert("Đã gửi yêu cầu gia nhập nhóm!");
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi gửi yêu cầu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Đang tải thông tin nhóm...</div>;

  return (
    <div
      className="invite-container"
      style={{
        padding: "40px",
        textAlign: "center",
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      {groupInfo ? (
        <>
          <h1 style={{ color: "#1b65c1" }}>Lời mời tham gia nhóm</h1>
          <div
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0" }}>{groupInfo.name}</h2>
            <p style={{ color: "#666" }}>
              {groupInfo.description || "Không có mô tả cho nhóm này."}
            </p>
          </div>

          <button
            onClick={handleJoin}
            disabled={submitting}
            style={{
              backgroundColor: "#1b65c1", // $common-btn-confirm
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {submitting ? "Đang xử lý..." : "Xác nhận gia nhập"}
          </button>
        </>
      ) : (
        <p>Không tìm thấy thông tin nhóm hoặc nhóm không tồn tại.</p>
      )}

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default InviteGroup;
