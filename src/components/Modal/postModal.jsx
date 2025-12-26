import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import api from "../../axios.js"; // Dùng axios config của bạn
import "./postModal.scss";

const EventPostModal = forwardRef(({ onUploadSuccess }, ref) => {
  const [show, setShow] = useState(false);
  const [eventId, setEventId] = useState(null);

  // State cho Gallery (Lazy Load)
  const [images, setImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);

  // State cho Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const observer = useRef();

  // Expose hàm show cho cha
  useImperativeHandle(ref, () => ({
    show(id) {
      setEventId(id);
      setShow(true);
      resetGallery();
      fetchImages(id, null);
    },
  }));

  const resetGallery = () => {
    setImages([]);
    setLastId(null);
    setHasMore(true);
    setSelectedFile(null);
  };

  const fetchImages = async (id, currentLastId) => {
    if (!id) return;
    try {
      setIsLoadingImages(true);
      // Gọi API getPostsByEvent
      const res = await api.get(`/api/post/event/${id}`, {
        params: { lastId: currentLastId, limit: 12 },
      });

      if (res && res.data) {
        setImages((prev) => [...prev, ...res.data]);
        setHasMore(res.data.length === 12);
        if (res.data.length > 0) {
          setLastId(res.data[res.data.length - 1].id);
        }
      }
    } catch (error) {
      console.error("Load images error:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  // Logic Lazy Load (Intersection Observer)
  const lastImageElementRef = useCallback(
    (node) => {
      if (isLoadingImages) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchImages(eventId, lastId);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingImages, hasMore, eventId, lastId]
  );

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !eventId) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("eventId", eventId);
    // Giả định senderId lấy từ auth hoặc truyền vào, tạm thời fix cứng hoặc lấy từ context
    formData.append("senderId", 1);

    try {
      setIsUploading(true);
      // Gọi API createPost
      const res = await api.post("/api/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res && res.status === 201) {
        setSelectedFile(null);
        // Reset và load lại ảnh mới nhất
        resetGallery();
        fetchImages(eventId, null);
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (error) {
      alert(
        "Upload failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      centered
      className="event-post-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fa-solid fa-images me-2"></i> Event Gallery (Event ID:{" "}
          {eventId})
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Gallery Section */}
        <h6>Recent Photos</h6>
        <div className="image-gallery-container">
          <div className="gallery-grid">
            {images.map((img, index) => {
              const isLast = images.length === index + 1;
              return (
                <img
                  key={img.id}
                  ref={isLast ? lastImageElementRef : null}
                  // API getPostImage trả về stream ảnh
                  src={`${import.meta.env.VITE_BACKEND_URL || ""}/api/post/${
                    img.id
                  }/image`}
                  alt="post"
                  className="gallery-item"
                />
              );
            })}
          </div>
          {isLoadingImages && (
            <div className="text-center mt-3">
              <Spinner animation="border" size="sm" variant="primary" />
            </div>
          )}
          {!hasMore && images.length > 0 && (
            <div className="text-center mt-2 text-muted small">
              No more images to load.
            </div>
          )}
          {!isLoadingImages && images.length === 0 && (
            <div className="text-center mt-5 text-muted">
              No images found for this event.
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <h6>Upload New Photo</h6>
          <div className="d-flex align-items-center gap-3">
            <Form.Group controlId="formFile" className="flex-grow-1">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </Form.Group>
            <Button
              className="btn-upload"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Upload"
              )}
            </Button>
          </div>
          {selectedFile && (
            <div className="mt-2 small text-success">
              Selected: {selectedFile.name}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default EventPostModal;
