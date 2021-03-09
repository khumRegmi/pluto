import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Row,
  Col,
  Typography,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { agent } from "../../helpers/agent";
import { columns } from "./userTableColumns";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";

const { Title } = Typography;

const Users = () => {
  const [visibleCreateModal, setVisibleCreateModal] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem("token");

  function onCreate() {
    setVisibleCreateModal(false);
  }

  function onEdit(record) {
    setVisibleEditModal(true);
    setSelectedUser(record);
  }

  function handleDelete(userId) {
    agent
      .deleteUser(token, userId)
      .then((res) => res.json())
      .then(() => message.info("Successfully deleted"));
  }

  useEffect(() => {
    agent
      .getUsers()
      .then((res) => res.json())
      .then(({ data }) => {
        setUserData(data);
      });
  }, []);

  const actionColumn = {
    title: "Action",
    key: "action",
    fixed: "right",
    render: (id, record) => (
      <Space size="middle">
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            onEdit(record);
          }}
        >
          Edit
        </Button>
        <Popconfirm
          placement="top"
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  return (
    <div>
      <Space direction="vertical" size="middle">
        <Button
          type="primary"
          style={{ textTransform: "capitalize" }}
          icon={<PlusOutlined />}
          onClick={() => {
            setVisibleCreateModal(true);
          }}
        >
          add user
        </Button>

        <CreateUserModal
          visible={visibleCreateModal}
          onCreate={onCreate}
          onCancel={() => {
            setVisibleCreateModal(false);
          }}
        />

        <EditUserModal
          visible={visibleEditModal}
          onCreate={onCreate}
          currentUser={selectedUser}
          onCancel={() => {
            setVisibleEditModal(false);
          }}
        />

        <Table
          rowKey={(record) => record.id}
          dataSource={userData}
          size="middle"
          columns={[...columns, actionColumn]}
          bordered
          sticky
          pagination={{ pageSize: 10 }}
          title={() => (
            <Row justify="space-between">
              <Col>
                <Title
                  level={4}
                  style={{ marginBottom: 0, textTransform: "capitalize" }}
                >
                  All users info
                </Title>
              </Col>
            </Row>
          )}
        />
      </Space>
    </div>
  );
};

export default Users;
