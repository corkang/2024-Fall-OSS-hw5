import React, { useEffect, useState } from "react";
import { Button, Modal, Form, ListGroup, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ShowList() {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: "",
    cname: "",
    credit: "",
    prof: "",
    code: "",
    type: "",
  });
  const [actionType, setActionType] = useState("add");

  // 데이터 가져오기
  const getData = async () => {
    try {
      const response = await fetch(
        "https://672819f2270bd0b975546091.mockapi.io/api/v1/Classes"
      );
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // 모달 열기
  const openModal = (type, data = {}) => {
    setActionType(type);
    setModalData({
      id: data.id || "",
      cname: data.cname || "",
      credit: data.credit || "",
      prof: data.prof || "",
      code: data.code || "",
      type: data.type || "",
    });
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  // 데이터 추가
  const postData = async () => {
    try {
      await fetch("https://672819f2270bd0b975546091.mockapi.io/api/v1/Classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modalData),
      });
      getData();
      closeModal();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // 데이터 수정
  const updateData = async () => {
    try {
      await fetch(
        `https://672819f2270bd0b975546091.mockapi.io/api/v1/Classes/${modalData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modalData),
        }
      );
      getData();
      closeModal();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // 데이터 삭제
  const deleteData = async (id) => {
    try {
      await fetch(
        `https://672819f2270bd0b975546091.mockapi.io/api/v1/Classes/${id}`,
        {
          method: "DELETE",
        }
      );
      getData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // 모달 저장 버튼 클릭 시
  const handleSubmit = () => {
    if (actionType === "add") {
      postData();
    } else if (actionType === "edit") {
      updateData();
    }
  };

  // 모달 데이터 변경 시
  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>수업 목록</h1>
        <div className="button-group">
          <Button variant="primary" onClick={getData}>
            수업 데이터 가져오기
          </Button>
          <Button variant="success" onClick={() => openModal("add")}>
            수업 추가
          </Button>
        </div>
      </div>

      <ListGroup>
        {classes.map((item) => (
          <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
            <span>
              {item.id} - [{item.code}] {item.cname} ({item.prof}) - {item.type}
            </span>
            <div className="button-group">
              <Button
                variant="success"
                size="sm"
                onClick={() => openModal("edit", item)}
              >
                수정
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteData(item.id)}
              >
                삭제
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* 모달 */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "add" ? "수업 추가" : "수업 수정"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                type="text"
                name="cname"
                value={modalData.cname}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Credit</Form.Label>
              <Form.Control
                type="number"
                name="credit"
                value={modalData.credit}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Professor</Form.Label>
              <Form.Control
                type="text"
                name="prof"
                value={modalData.prof}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Class Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={modalData.code}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Grading Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={modalData.type}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {actionType === "add" ? "추가" : "수정"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};