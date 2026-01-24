import api from "../axios.js";

// Thêm tham số signal vào cuối các hàm để nhận tín hiệu hủy request từ component
export const handleCreateCategory = async (
  groupId,
  name,
  description,
  signal
) => {
  try {
    const res = await api.post(
      `/api/category/create`,
      { groupId, name, description },
      { signal }
    );

    if (!res) {
      console.warn("No response from create category");
      return false;
    }

    return true;
  } catch (err) {
    if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
    console.error("Lỗi create category: ", err);
    return false;
  }
};

export const handleDeleteCategory = async (groupId, name, signal) => {
  try {
    const res = await api.delete(`/api/category/`, {
      data: { groupId, name },
      signal,
    });
    console.log("Delete success:", res.data?.message);
    return true;
  } catch (err) {
    if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
    console.error("Lỗi delete category: ", err);
    return false;
  }
};

const handleFollowCategory = async (categoryId, signal) => {
  try {
    await api.post(`/api/category/follow`, { categoryId }, { signal });
    return true;
  } catch (err) {
    if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
    console.error("Lỗi follow category: ", err);
    return false;
  }
};

const handleUnfollowCategory = async (categoryId, signal) => {
  try {
    await api.post(`/api/category/unfollow`, { categoryId }, { signal });
    return true;
  } catch (err) {
    if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
    console.error("Lỗi unfollow category: ", err);
    return false;
  }
};

export const onClickFollowCategory = async (
  categoryId,
  isFollowing,
  signal
) => {
  console.log("AAAAAAA", categoryId, isFollowing, signal);
  if (isFollowing) {
    return await handleUnfollowCategory(categoryId, signal);
  }
  return await handleFollowCategory(categoryId, signal);
};
