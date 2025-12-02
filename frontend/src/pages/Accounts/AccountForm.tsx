import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Switch,
  Row,
  Col,
  Card,
  Typography,
  message,
  Rate,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SaveOutlined,
  CloseOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import {
  createAccountSchema,
  updateAccountSchema,
  AccountType,
  AccountIndustry,
  AccountSize,
  CreateAccountFormData,
  UpdateAccountFormData,
} from '../../schemas/account.schema';
import {
  createAccount,
  updateAccount,
  getAccount,
} from '../../services/accountService';
import { getAccounts } from '../../services/accountService';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AccountForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [parentAccounts, setParentAccounts] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAccountFormData | UpdateAccountFormData>({
    resolver: zodResolver(isEditMode ? updateAccountSchema : createAccountSchema),
    defaultValues: {
      isActive: true,
      rating: 3,
    },
  });

  const billingAddress = watch('billingAddress');

  // Load account data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadAccount(id);
    }
  }, [id, isEditMode]);

  // Load parent accounts for dropdown
  useEffect(() => {
    loadParentAccounts();
  }, []);

  const loadAccount = async (accountId: string) => {
    try {
      setLoading(true);
      const data = await getAccount(accountId);
      
      // Set form values
      Object.keys(data).forEach((key) => {
        if (key === 'parentAccount' && typeof data.parentAccount === 'object') {
          setValue('parentAccount', data.parentAccount?._id);
        } else if (key === 'assignedTo' && typeof data.assignedTo === 'object') {
          setValue('assignedTo', data.assignedTo?._id);
        } else if (key === 'createdBy') {
          // Skip createdBy
        } else {
          setValue(key as any, (data as any)[key]);
        }
      });
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error loading account');
      navigate('/accounts');
    } finally {
      setLoading(false);
    }
  };

  const loadParentAccounts = async () => {
    try {
      const response = await getAccounts({ limit: 100, isActive: true });
      setParentAccounts(response.data.accounts);
    } catch (error) {
      console.error('Error loading parent accounts:', error);
    }
  };

  const onSubmit = async (data: CreateAccountFormData | UpdateAccountFormData) => {
    try {
      setLoading(true);
      
      if (isEditMode && id) {
        await updateAccount(id, data);
        message.success('Account updated successfully');
      } else {
        await createAccount(data as CreateAccountFormData);
        message.success('Account created successfully');
      }
      
      navigate('/accounts');
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 
        `Error ${isEditMode ? 'updating' : 'creating'} account`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBillingToShipping = () => {
    if (billingAddress) {
      setValue('shippingAddress', billingAddress);
      message.success('Billing address copied to shipping address');
    } else {
      message.warning('Please fill in billing address first');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={2}>{isEditMode ? 'Edit Account' : 'Create Account'}</Title>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* 1. Basic Information */}
        <Card title="Basic Information" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Account Name"
                required
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter account name" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Website">
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="https://example.com" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Phone">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="+1 (555) 123-4567" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Email"
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="contact@example.com" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Territory">
                <Controller
                  name="territory"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="e.g., North America" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 2. Classification */}
        <Card title="Classification" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Type"
                required
                validateStatus={errors.type ? 'error' : ''}
                help={errors.type?.message}
              >
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select type">
                      {Object.values(AccountType).map((type) => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Industry"
                required
                validateStatus={errors.industry ? 'error' : ''}
                help={errors.industry?.message}
              >
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select industry">
                      {Object.values(AccountIndustry).map((industry) => (
                        <Option key={industry} value={industry}>
                          {industry}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Size">
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select size" allowClear>
                      {Object.values(AccountSize).map((size) => (
                        <Option key={size} value={size}>
                          {size}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Annual Revenue">
                <Controller
                  name="annualRevenue"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      style={{ width: '100%' }}
                      placeholder="Enter annual revenue"
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, '')) || 0}
                      min={0}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Number of Employees">
                <Controller
                  name="employees"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      style={{ width: '100%' }}
                      placeholder="Enter number of employees"
                      min={0}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 3. Billing Address */}
        <Card title="Billing Address" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Street">
                <Controller
                  name="billingAddress.street"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter street address" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="City">
                <Controller
                  name="billingAddress.city"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter city" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="State/Province">
                <Controller
                  name="billingAddress.state"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter state" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Zip/Postal Code">
                <Controller
                  name="billingAddress.zipCode"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter zip code" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Country">
                <Controller
                  name="billingAddress.country"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter country" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 4. Shipping Address */}
        <Card
          title="Shipping Address"
          extra={
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopyBillingToShipping}
              size="small"
            >
              Copy from Billing
            </Button>
          }
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Street">
                <Controller
                  name="shippingAddress.street"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter street address" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="City">
                <Controller
                  name="shippingAddress.city"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter city" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="State/Province">
                <Controller
                  name="shippingAddress.state"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter state" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Zip/Postal Code">
                <Controller
                  name="shippingAddress.zipCode"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter zip code" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Country">
                <Controller
                  name="shippingAddress.country"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter country" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 5. Hierarchy */}
        <Card title="Hierarchy" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Parent Account">
                <Controller
                  name="parentAccount"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select parent account (optional)"
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children as string)
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {parentAccounts
                        .filter((acc) => acc._id !== id) // Exclude self
                        .map((acc) => (
                          <Option key={acc._id} value={acc._id}>
                            {acc.name} ({acc.accountNumber})
                          </Option>
                        ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 6. Additional Information */}
        <Card title="Additional Information" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Description">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      rows={4}
                      placeholder="Enter description or notes"
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Rating">
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <Rate {...field} allowHalf />
                  )}
                />
              </Form.Item>
              <Form.Item label="Active" valuePropName="checked">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 7. Social Media */}
        <Card title="Social Media" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="LinkedIn URL">
                <Controller
                  name="linkedInUrl"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="https://linkedin.com/company/..."
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Twitter Handle">
                <Controller
                  name="twitterHandle"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="@companyname" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Facebook URL">
                <Controller
                  name="facebookUrl"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="https://facebook.com/..."
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Action Buttons */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              icon={<CloseOutlined />}
              onClick={() => navigate('/accounts')}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
            >
              {isEditMode ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default AccountForm;
