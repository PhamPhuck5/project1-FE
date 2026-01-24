import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import api from "../../axios.js";
import "./postModal.scss";

const EventPostModal = forwardRef(({ onUploadSuccess }, ref) => {
  const [show, setShow] = useState(false);
  const [eventId, setEventId] = useState(null);

  // Gallery data
  const [images, setImages] = useState([]);
  const [imageMap, setImageMap] = useState({});
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);

  // Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const observer = useRef();

  // expose show()
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
    setImageMap({});
    setLastId(null);
    setHasMore(true);
    setSelectedFile(null);
  };

  // ===== FETCH IMAGE (BLOB) =====
  const fetchPostImage = async (postId) => {
    const res = await api.get(`/api/post/${postId}/image`, {
      responseType: "blob",
    });
    return URL.createObjectURL(res);
  };

  // ===== FETCH POSTS =====
  const fetchImages = async (id, currentLastId) => {
    if (!id) return;
    try {
      setIsLoadingImages(true);
      const res = await api.get(`/api/post/event/${id}`, {
        params: { lastId: currentLastId, limit: 12 },
      });

      const posts = res.data || res;
      if (posts.length > 0) {
        setImages((prev) => [...prev, ...posts]);
        setHasMore(posts.length === 12);
        setLastId(posts[posts.length - 1].id);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Load images error:", err);
    } finally {
      setIsLoadingImages(false);
    }
  };

  // ===== LOAD IMAGE BLOBS =====
  useEffect(() => {
    images.forEach((img) => {
      if (!imageMap[img.id]) {
        fetchPostImage(img.id).then((url) => {
          setImageMap((prev) => ({
            ...prev,
            [img.id]: url,
          }));
        });
      }
    });
  }, [images]);

  // ===== CLEANUP OBJECT URL =====
  useEffect(() => {
    return () => {
      Object.values(imageMap).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  // ===== LAZY LOAD =====
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

  // ===== UPLOAD =====
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !eventId) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("eventId", eventId);
    formData.append("senderId", 1);

    try {
      setIsUploading(true);
      const res = await api.post("/api/post", formData);

      if (res.status === 201) {
        resetGallery();
        fetchImages(eventId, null);
        onUploadSuccess?.();
      }
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
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
          <i className="fa-solid fa-images me-2"></i>
          Event Gallery (Event ID: {eventId})
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h6>Recent Photos</h6>
        <div className="image-gallery-container">
          <div className="gallery-grid">
            {images.map((img, index) => {
              const isLast = index === images.length - 1;
              return (
                <img
                  key={img.id}
                  ref={isLast ? lastImageElementRef : null}
                  src={imageMap[img.id]}
                  alt="post"
                  className="gallery-item"
                />
              );
            })}
          </div>

          {isLoadingImages && (
            <div className="text-center mt-3">
              <Spinner animation="border" size="sm" />
            </div>
          )}

          {!hasMore && images.length > 0 && (
            <div className="text-center mt-2 text-muted small">
              No more images
            </div>
          )}

          {!isLoadingImages && images.length === 0 && (
            <div className="text-center mt-5 text-muted">No images found</div>
          )}
        </div>

        {/* Upload */}
        <div className="upload-section">
          <h6>Upload New Photo</h6>
          <div className="d-flex gap-3">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? <Spinner size="sm" /> : "Upload"}
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
