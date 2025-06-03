import React from 'react'
import { Form, Row, Col, Input, TimePicker, Button } from 'antd'
import moment from 'moment'

function DoctorForm({ onFinish, initialValues = {} }) {
  const iv = { ...initialValues }

  if (Array.isArray(iv.timings) && iv.timings.length === 2) {
    iv.timings = [
      moment(iv.timings[0], 'HH:mm'),
      moment(iv.timings[1], 'HH:mm')
    ]
  } else {
    iv.timings = []
  }

  return (
    <Form layout="vertical" onFinish={onFinish} initialValues={iv}>
      <h1 className="card-title mt-3">Personal Information</h1>
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Website"
            name="website"
            rules={[{ required: true }]}
          >
            <Input placeholder="Website" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
      </Row>

      <hr />
      <h1 className="card-title mt-3">Professional Information</h1>
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Specialization" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Experience"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Experience (in years)" type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Fee Per Consultation"
            name="feePerConsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Fee" type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Timings"
            name="timings"
            rules={[{ required: true, message: 'Please select your timings' }]}
          >
            <TimePicker.RangePicker format="HH:mm" minuteStep={5} />
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Form.Item>
            <Button className="primary-button" htmlType="submit">
              SUBMIT
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default DoctorForm
