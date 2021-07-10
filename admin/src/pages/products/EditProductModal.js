import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Image,
  Upload,
  Button,
  message,
  Spin,
} from "antd";
import {
  CloseCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { editProduct, deleteProductImage } from "../../client/products.client";
import { getCategories } from "../../client/category.client";
import { getOffers } from "../../client/offers.client";

const { Option } = Select;

const imageStyle = {
  display: "inline-block",
  position: "relative",
};

const titleStyle = {
  display: "inline-block",
  position: "absolute",
  top: "40%",
  width: "300px",
  margin: "0px 20px",
};

const deleteButtonStyle = {
  cursor: "pointer",
  position: "absolute",
  marginLeft: "325px",
  top: "40%",
  fontSize: "25px",
  color: "red",
};

export default function EditProductModal({
  visible,
  onCreate,
  onCancel,
  existingRecord,
  refetch,
}) {
  const [form] = Form.useForm();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [offerOptions, setOfferOptions] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [spinStatus, setspinStatus] = useState(false);

  const deleteImage = (productId) => {
    deleteProductImage(productId)
      .then((res) => res.json())
      .then(({ data }) => {
        refetch();
      });
  };

  useEffect(() => {
    form.resetFields();
    if (existingRecord) {
      getCategories()
        .then((res) => res.json())
        .then(({ data }) => {
          if (data) {
            const processedData = data
              .filter((entry) => entry.children !== null)
              .map((entry) => {
                const childrenList = [];

                for (const child of entry.children) {
                  childrenList.push({
                    id: child.id,
                    name: `${entry.name} / ${child.name}`,
                  });
                }

                return childrenList;
              });

            setCategoryOptions(processedData.flat());
          }
        });
      setProductImages(existingRecord.productImage);

      getOffers()
        .then((res) => res.json())
        .then(({ data }) => {
          setOfferOptions(data.offers);
        });
    }
  }, [existingRecord, form]);

  const handleUpload = async (info) => {
    const { status } = info.file;
    if (status === "uploading") {
      setspinStatus(true);
    }
    if (status !== "uploading") {
      const { response } = info.file;
      if (response) {
        setProductImages([...productImages, ...response.data]);
      }
    }
    if (status === "done") {
      setspinStatus(false);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      setspinStatus(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleImageFromState = (id) => {
    setProductImages(
      productImages.filter((productImage) => productImage.id !== id)
    );
  };

  return (
    <div>
      <Modal
        visible={visible}
        title="Edit Product"
        okText="Save"
        forceRender={true}
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          const token = localStorage.getItem("token");
          form
            .validateFields()
            .then((values) => {
              const newValues = { ...values, productImages };
              editProduct(existingRecord.id, newValues, token)
                .then((res) => res.json())
                .then(({ success, message: msg, error }) => {
                  if (success) {
                    form.resetFields();
                    onCreate(values);
                    message.success(msg);
                    refetch();
                  } else {
                    message.error(error);
                  }
                });
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={existingRecord}
          preserve={false}
        >
          {/* product name */}
          <Form.Item
            name="name"
            label="Product Name&nbsp;:"
            rules={[
              {
                required: true,
                message: "Please enter product name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* price */}
          <Form.Item
            name="price"
            label="Price&nbsp;:"
            rules={[
              {
                required: true,
                message: "Please enter product price!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* summary */}
          <Form.Item
            name="summary"
            label="Summary&nbsp;:"
            rules={[
              {
                required: true,
                message: "Please enter summary!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* description */}
          <Form.Item
            name="description"
            label="Description&nbsp;:"
            rules={[
              {
                required: true,
                message: "Please input product description!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          {/* category */}
          <Form.Item
            label="Category"
            rules={[
              {
                required: true,
                message: "Please input product category",
              },
            ]}
            name="categoryId"
            initialValue={
              existingRecord &&
              existingRecord.category &&
              existingRecord.category.name
            }
          >
            {existingRecord && (
              <Select>
                {categoryOptions.map((category) => (
                  <Option value={category.id} key={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          {/* offer */}
          <Form.Item
            label="Offer"
            name="offerId"
            initialValue={
              existingRecord && existingRecord.offer && existingRecord.offer.id
            }
          >
            {existingRecord && (
              <Select>
                {offerOptions.map((offer) => (
                  <Option value={offer.id} key={offer.id}>
                    {offer.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          {/* image */}
          <Form.Item>
            {productImages &&
              productImages.map((productImage) => (
                <div key={productImage.id}>
                  <div style={imageStyle}>
                    <Image width={100} height={136} src={productImage.path} />
                    <div style={titleStyle}>
                      <p>{productImage.originalname}</p>
                    </div>
                    <CloseCircleOutlined
                      onClick={() => {
                        deleteImage(productImage.id);
                        handleImageFromState(productImage.id);
                      }}
                      style={deleteButtonStyle}
                    />
                  </div>
                </div>
              ))}
            <br />
            {!spinStatus ? (
              <Upload
                name="productImages"
                onChange={handleUpload}
                action="http://localhost:4000/api/v1/product-images"
                showUploadList={false}
                accept="image/*"
                multiple={true}
              >
                <Button icon={<PlusOutlined />}>
                  Add more images to Upload
                </Button>
              </Upload>
            ) : (
              <span>
                <Spin indicator={<LoadingOutlined />} /> Uploading...
              </span>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
