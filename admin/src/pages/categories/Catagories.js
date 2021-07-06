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
import { getCategories, deleteCategory } from "../../client/category.client";
import { columns } from "./categoryTableColumns";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const { Title } = Typography;

export default function Catagories() {
  const [visibleCreateModal, setVisibleCreateModal] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const token = localStorage.getItem("token");

  function fetchCategories() {
    getCategories()
      .then((res) => res.json())
      .then(({ data }) => {
        setCategoryData(data);
      });
  }

  function onCreateCategory() {
    fetchCategories();
    setVisibleCreateModal(false);
  }

  function onEditCategory() {
    fetchCategories();
    setVisibleEditModal(false);
  }

  function onEdit(record) {
    setVisibleEditModal(true);
    setSelectedCategory(record);
  }

  function handleDelete(categoryId) {
    deleteCategory(token, categoryId)
      .then((res) => res.json())
      .then((res) => {
        const { success, error } = res;
        if (success) {
          message.success(res.message);
        } else {
          message.error(error);
        }
      })
      .then(() => fetchCategories());
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const actionColumn = {
    title: "Action",
    key: "action",
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
          add category
        </Button>

        <CreateCategoryModal
          visible={visibleCreateModal}
          onCreate={onCreateCategory}
          onCancel={() => {
            setVisibleCreateModal(false);
          }}
        />

        <EditCategoryModal
          visible={visibleEditModal}
          onCreate={onEditCategory}
          currentCategory={selectedCategory}
          onCancel={() => {
            setVisibleEditModal(false);
          }}
        />

        <Table
          rowKey={(record) => record.id}
          dataSource={categoryData}
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
                  all categories info
                </Title>
              </Col>
            </Row>
          )}
        />
      </Space>
    </div>
  );
}
