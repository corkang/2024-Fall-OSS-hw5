import React, { useEffect, useState } from "react";
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
    const modalElement = new window.bootstrap.Modal(
      document.getElementById("exampleModal")
    );
    modalElement.show();
  };

  const closeModal = () => {
    setShowModal(false);
    const modalElement = window.bootstrap.Modal.getInstance(
      document.getElementById("exampleModal")
    );
    modalElement.hide();
  };

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

  const handleSubmit = () => {
    if (actionType === "add") {
      postData();
    } else if (actionType === "edit") {
      updateData();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>수업 목록</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={getData}>
            수업 데이터 가져오기
          </button>
          <button className="btn btn-success" onClick={() => openModal("add")}>
            수업 추가
          </button>
        </div>
      </div>

      <ul className="list-group">
        {classes.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {item.id} - [{item.code}] {item.cname} ({item.prof}) - {item.type}
            </span>
            <div>
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => openModal("edit", item)}
              >
                수정
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteData(item.id)}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {actionType === "add" ? "수업 추가" : "수업 수정"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Class Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cname"
                    value={modalData.cname}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Credit</label>
                  <input
                    type="number"
                    className="form-control"
                    name="credit"
                    value={modalData.credit}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Professor</label>
                  <input
                    type="text"
                    className="form-control"
                    name="prof"
                    value={modalData.prof}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Class Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="code"
                    value={modalData.code}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Grading Type</label>
                  <input
                    type="text"
                    className="form-control"
                    name="type"
                    value={modalData.type}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {actionType === "add" ? "추가" : "수정"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
