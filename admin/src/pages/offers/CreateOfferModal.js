import React, { useState } from "react";
import { Modal, Form, Input, message, Upload, Button } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { createOffer, createOfferImage } from "../../client/offers.client";

export default function CreateOfferModal({
  visible,
  onCreate,
  onCancel,
  refetch,
}) {
  const [form] = Form.useForm();
  const [uploadOfferImages, setUploadOfferImages] = useState([]);
  const [offerImages, setOfferImages] = useState([]);

  const [images, setImages] = useState([]);

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleUpload = async (info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      // console.log(info.file, info.fileList);
      console.log(info.file);
      const formData = new FormData();
      uploadOfferImages.forEach((offerImage) => {
        formData.append("offerImages", offerImage);
      });

      createOfferImage(formData)
        .then((res) => res.json())
        .then(({ data, success, message: msg, error }) => {
          if (success) {
            message.success(msg);
            setOfferImages(data);
          } else {
            message.error(error);
          }
        })
        .then(() => refetch());
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div>
      <Modal
        visible={visible}
        title="Add offer"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          const token = localStorage.getItem("token");
          form
            .validateFields()
            .then((values) => {
              const formData = new FormData();

              formData.append("name", values.name);
              formData.append("discount", values.discount);
              formData.append("description", values.description);
              offerImages.forEach((offerImage) => {
                formData.append("offerImages", offerImage);
              });

              // createOffer(formData, token)
              createOffer(formData, token)
                .then((res) => res.json())
                .then(({ success, message: msg, error }) => {
                  if (success) {
                    form.resetFields();
                    onCreate(values);
                    message.success(msg);
                  } else {
                    message.error(error);
                  }
                });
            })
            .catch((info) => {
              console.log("Validate Failed");
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          // initialValues={{
          //   // modifier: "public",
          // }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {/* offer name */}
          <Form.Item
            name="name"
            label="Offer Name&nbsp;:"
            rules={[
              {
                required: true,
                message: "Please enter offer name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* discount */}
          <Form.Item
            name="discount"
            label="Discount&nbsp;:"
            rules={[
              {
                required: true,
                message: "Please enter discount!",
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
                message: "Please enter description!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          {/* <Form.Item label="Offer Image&nbsp;:">
            <Form.Item
              name="offerImages"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
              rules={[
                {
                  required: true,
                  message: "Please input offer photo",
                },
              ]}
            >
              <Upload.Dragger
                name="files"
                onChange={handleUpload}
                beforeUpload={(file, fileList) => {
                  setOfferImages(fileList);
                  return false;
                }}
                accept="image/*"
                multiple={true}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item> */}
          {/* <Form.Item> */}
          <Upload
            name="files"
            onChange={handleUpload}
            beforeUpload={(file, fileList) => {
              setUploadOfferImages(fileList);
              return false;
            }}
            // showUploadList={false}

            accept="image/*"
          >
            <Button icon={<UploadOutlined />}> add offer Images</Button>
          </Upload>
          {/* </Form.Item> */}

          {
            images.map(image => <p>{image.path}</p>)
          }

          <Upload
            name="offerImages"
            action="http://localhost:4000/api/v1/offer-image/test"
            onChange={
              (info) => {
                console.log(info)
                console.log(info.file.response)
                const {response} = info.file;
                if (response) {
                  if (response.success) {
                    setImages([...images, ...response.data])
                  }
                }
              }
            }
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Add offer Images</Button>
          </Upload>
        </Form>
      </Modal>
    </div>
  );
}
