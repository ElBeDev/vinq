import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Tabs,
  Table,
  Modal,
  message,
  Typography,
  Rate,
  Empty,
  Divider,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  FacebookOutlined,
  TeamOutlined,
  PlusOutlined,
  DollarOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { Account } from '../../schemas/account.schema';
import { getAccount, deleteAccount, getChildAccounts } from '../../services/accountService';
import { getContacts } from '../../services/contactService';

const { Title, Text } = Typography;

const AccountDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [childAccounts, setChildAccounts] = useState<Account[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      loadAccount(id);
      loadContacts(id);
    }
  }, [id]);

  const loadAccount = async (accountId: string) => {
    try {
      setLoading(true);
      const data = await getAccount(accountId);
      setAccount(data);
      
      // Load child accounts if exists
      if (data._id) {
        loadChildAccounts(data._id);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error loading account');
      navigate('/accounts');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async (accountId: string) => {
    try {
      const response = await getContacts({ account: accountId, limit: 100 });
      setContacts(response.data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadChildAccounts = async (parentAccountId: string) => {
    try {
      const children = await getChildAccounts(parentAccountId);
      setChildAccounts(children);
    } catch (error) {
      console.error('Error loading child accounts:', error);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Account',
      content: 'Are you sure you want to delete this account? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteAccount(id!);
          message.success('Account deleted successfully');
          navigate('/accounts');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Error deleting account');
        }
      },
    });
  };

  if (loading || !account) {
    return <div style={{ padding: '24px' }}>Loading...</div>;
  }

  // Contact columns
  const contactColumns: ColumnsType<any> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <a onClick={() => navigate(`/contacts/${record._id}`)}>
            {record.firstName} {record.lastName}
          </a>
          {record.isPrimary && <Tag color="gold">Primary</Tag>}
        </Space>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => title || '-',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email || '-',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'default'}>{status}</Tag>
      ),
    },
  ];

  // Child accounts columns
  const childAccountColumns: ColumnsType<Account> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <a onClick={() => navigate(`/accounts/${record._id}`)}>{name}</a>
      ),
    },
    {
      title: 'Account #',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag>{type}</Tag>,
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
  ];

  // Tab items
  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div>
          {/* Company Information */}
          <Card title="Company Information" style={{ marginBottom: 16 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="Account Name">
                {account.name}
              </Descriptions.Item>
              <Descriptions.Item label="Account Number">
                {account.accountNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color="blue">{account.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Industry">
                <Tag color="green">{account.industry}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Size">
                {account.size || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Territory">
                {account.territory || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Annual Revenue">
                {account.annualRevenue ? `$${account.annualRevenue.toLocaleString()}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Employees">
                {account.employees ? account.employees.toLocaleString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Rating">
                <Rate disabled value={account.rating} allowHalf />
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={account.isActive ? 'green' : 'red'}>
                  {account.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {account.description && (
              <>
                <Divider />
                <div>
                  <Text strong>Description:</Text>
                  <div style={{ marginTop: 8 }}>{account.description}</div>
                </div>
              </>
            )}
          </Card>

          {/* Contact Information */}
          <Card title="Contact Information" style={{ marginBottom: 16 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="Website">
                {account.website ? (
                  <a href={account.website} target="_blank" rel="noopener noreferrer">
                    <GlobalOutlined /> {account.website}
                  </a>
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {account.phone ? (
                  <>
                    <PhoneOutlined /> {account.phone}
                  </>
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {account.email ? (
                  <>
                    <MailOutlined /> {account.email}
                  </>
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Assigned To">
                {typeof account.assignedTo === 'object' && account.assignedTo
                  ? `${account.assignedTo.firstName} ${account.assignedTo.lastName}`
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Addresses */}
          <Card title="Addresses" style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <Text strong>Billing Address</Text>
                {account.billingAddress ? (
                  <div style={{ marginTop: 8 }}>
                    <div>{account.billingAddress.street}</div>
                    <div>
                      {account.billingAddress.city}, {account.billingAddress.state}{' '}
                      {account.billingAddress.zipCode}
                    </div>
                    <div>{account.billingAddress.country}</div>
                  </div>
                ) : (
                  <div style={{ marginTop: 8 }}>-</div>
                )}
              </div>
              <div>
                <Text strong>Shipping Address</Text>
                {account.shippingAddress ? (
                  <div style={{ marginTop: 8 }}>
                    <div>{account.shippingAddress.street}</div>
                    <div>
                      {account.shippingAddress.city}, {account.shippingAddress.state}{' '}
                      {account.shippingAddress.zipCode}
                    </div>
                    <div>{account.shippingAddress.country}</div>
                  </div>
                ) : (
                  <div style={{ marginTop: 8 }}>-</div>
                )}
              </div>
            </div>
          </Card>

          {/* Social Media */}
          <Card title="Social Media" style={{ marginBottom: 16 }}>
            <Space direction="vertical">
              {account.linkedInUrl && (
                <div>
                  <LinkedinOutlined style={{ marginRight: 8 }} />
                  <a href={account.linkedInUrl} target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {account.twitterHandle && (
                <div>
                  <TwitterOutlined style={{ marginRight: 8 }} />
                  <a
                    href={`https://twitter.com/${account.twitterHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {account.twitterHandle}
                  </a>
                </div>
              )}
              {account.facebookUrl && (
                <div>
                  <FacebookOutlined style={{ marginRight: 8 }} />
                  <a href={account.facebookUrl} target="_blank" rel="noopener noreferrer">
                    Facebook Page
                  </a>
                </div>
              )}
              {!account.linkedInUrl && !account.twitterHandle && !account.facebookUrl && (
                <Text type="secondary">No social media links</Text>
              )}
            </Space>
          </Card>

          {/* Hierarchy */}
          <Card title="Hierarchy" style={{ marginBottom: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Parent Account">
                {typeof account.parentAccount === 'object' && account.parentAccount ? (
                  <a onClick={() => navigate(`/accounts/${(account.parentAccount as Account)._id}`)}>
                    <ApartmentOutlined /> {(account.parentAccount as Account).name}
                  </a>
                ) : '-'}
              </Descriptions.Item>
            </Descriptions>

            {childAccounts.length > 0 && (
              <>
                <Divider />
                <Text strong>Child Accounts ({childAccounts.length})</Text>
                <Table
                  columns={childAccountColumns}
                  dataSource={childAccounts}
                  rowKey="_id"
                  pagination={false}
                  style={{ marginTop: 16 }}
                />
              </>
            )}
          </Card>
        </div>
      ),
    },
    {
      key: 'contacts',
      label: (
        <span>
          <TeamOutlined /> Contacts ({contacts.length})
        </span>
      ),
      children: (
        <Card
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(`/contacts/new?account=${id}`)}
            >
              Add Contact
            </Button>
          }
        >
          {contacts.length > 0 ? (
            <Table
              columns={contactColumns}
              dataSource={contacts}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          ) : (
            <Empty description="No contacts found for this account" />
          )}
        </Card>
      ),
    },
    {
      key: 'deals',
      label: (
        <span>
          <DollarOutlined /> Deals (0)
        </span>
      ),
      children: (
        <Card>
          <Empty description="Deals feature coming soon (Phase 7)" />
        </Card>
      ),
    },
    {
      key: 'timeline',
      label: 'Timeline',
      children: (
        <Card>
          <Empty description="Activity timeline coming soon" />
        </Card>
      ),
    },
    {
      key: 'notes',
      label: 'Notes',
      children: (
        <Card>
          <Empty description="Notes feature coming soon" />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/accounts')}
          >
            Back
          </Button>
          <BankOutlined style={{ fontSize: 24 }} />
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {account.name}
            </Title>
            <Space style={{ marginTop: 4 }}>
              <Text type="secondary">{account.accountNumber}</Text>
              <Tag color="blue">{account.type}</Tag>
              <Tag color="green">{account.industry}</Tag>
              <Rate disabled value={account.rating} allowHalf style={{ fontSize: 14 }} />
            </Space>
          </div>
        </Space>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/accounts/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Space>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </div>
  );
};

export default AccountDetail;
