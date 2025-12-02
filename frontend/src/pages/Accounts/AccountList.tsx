import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Dropdown,
  Modal,
  message,
  Select,
  Checkbox,
  Typography,
  Row,
  Col,
  Statistic,
  Card,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  TeamOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  Account,
  AccountType,
  AccountIndustry,
  AccountSize,
  AccountFilters,
} from '../../schemas/account.schema';
import {
  getAccounts,
  bulkDeleteAccounts,
  getAccountStats,
} from '../../services/accountService';

const { Title } = Typography;
const { Option } = Select;

const AccountList: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Filters
  const [filters, setFilters] = useState<AccountFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
    isActive: true,
  });

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load accounts
  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await getAccounts(filters);
      setAccounts(response.data.accounts);
      setPagination({
        current: response.data.pagination.page,
        pageSize: response.data.pagination.limit,
        total: response.data.pagination.total,
      });
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error loading accounts');
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await getAccountStats();
      setStats(response.data);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [filters]);

  useEffect(() => {
    loadStats();
  }, []);

  // Handle table change (pagination, filters, sorter)
  const handleTableChange = (
    newPagination: TablePaginationConfig,
    _filters: any,
    sorter: any
  ) => {
    setFilters({
      ...filters,
      page: newPagination.current || 1,
      limit: newPagination.pageSize || 10,
      sortBy: sorter.field || 'createdAt',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  // Handle filter change
  const handleFilterChange = (key: keyof AccountFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    Modal.confirm({
      title: 'Delete Accounts',
      content: `Are you sure you want to delete ${selectedRowKeys.length} accounts?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          const deletedCount = await bulkDeleteAccounts(
            selectedRowKeys as string[]
          );
          message.success(`${deletedCount} accounts deleted successfully`);
          setSelectedRowKeys([]);
          loadAccounts();
          loadStats();
        } catch (error: any) {
          message.error(
            error.response?.data?.message || 'Error deleting accounts'
          );
        }
      },
    });
  };

  // Get type tag color
  const getTypeColor = (type: AccountType) => {
    const colors: Record<AccountType, string> = {
      [AccountType.CUSTOMER]: 'green',
      [AccountType.PROSPECT]: 'blue',
      [AccountType.PARTNER]: 'purple',
      [AccountType.RESELLER]: 'orange',
      [AccountType.VENDOR]: 'cyan',
      [AccountType.COMPETITOR]: 'red',
      [AccountType.OTHER]: 'default',
    };
    return colors[type];
  };

  // Get industry tag color
  const getIndustryColor = (industry: AccountIndustry) => {
    const colors: Record<AccountIndustry, string> = {
      [AccountIndustry.REAL_ESTATE]: 'gold',
      [AccountIndustry.CONSTRUCTION]: 'orange',
      [AccountIndustry.FINANCE]: 'green',
      [AccountIndustry.TECHNOLOGY]: 'blue',
      [AccountIndustry.HEALTHCARE]: 'red',
      [AccountIndustry.RETAIL]: 'purple',
      [AccountIndustry.MANUFACTURING]: 'cyan',
      [AccountIndustry.EDUCATION]: 'geekblue',
      [AccountIndustry.HOSPITALITY]: 'magenta',
      [AccountIndustry.OTHER]: 'default',
    };
    return colors[industry];
  };

  // Table columns
  const columns: ColumnsType<Account> = [
    {
      title: 'Account Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: Account) => (
        <Space>
          <BankOutlined />
          <a onClick={() => navigate(`/accounts/${record._id}`)}>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Account #',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      width: 120,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: AccountType) => (
        <Tag color={getTypeColor(type)}>{type}</Tag>
      ),
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
      render: (industry: AccountIndustry) => (
        <Tag color={getIndustryColor(industry)}>{industry}</Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size?: AccountSize) => size || '-',
    },
    {
      title: 'Revenue',
      dataIndex: 'annualRevenue',
      key: 'annualRevenue',
      sorter: true,
      render: (revenue?: number) =>
        revenue ? `$${revenue.toLocaleString()}` : '-',
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      key: 'employees',
      sorter: true,
      render: (employees?: number) =>
        employees ? employees.toLocaleString() : '-',
    },
    {
      title: 'Territory',
      dataIndex: 'territory',
      key: 'territory',
      render: (territory?: string) => territory || '-',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo: any) =>
        assignedTo ? `${assignedTo.firstName} ${assignedTo.lastName}` : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: Account) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: 'View',
                onClick: () => navigate(`/accounts/${record._id}`),
              },
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit',
                onClick: () => navigate(`/accounts/${record._id}/edit`),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Delete',
                danger: true,
                onClick: () => handleBulkDelete(),
              },
            ],
          }}
        >
          <Button type="text">Actions</Button>
        </Dropdown>
      ),
    },
  ];

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Stats Cards */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Accounts"
                value={stats.total}
                prefix={<BankOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active"
                value={stats.active}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Inactive"
                value={stats.inactive}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Customers"
                value={stats.byType?.Customer || 0}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={2}>Accounts</Title>
        <Space>
          <Button icon={<UploadOutlined />}>Import</Button>
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/accounts/new')}
          >
            Create Account
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="Search accounts..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Type"
              style={{ width: '100%' }}
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              allowClear
            >
              {Object.values(AccountType).map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Industry"
              style={{ width: '100%' }}
              value={filters.industry}
              onChange={(value) => handleFilterChange('industry', value)}
              allowClear
            >
              {Object.values(AccountIndustry).map((industry) => (
                <Option key={industry} value={industry}>
                  {industry}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Size"
              style={{ width: '100%' }}
              value={filters.size}
              onChange={(value) => handleFilterChange('size', value)}
              allowClear
            >
              {Object.values(AccountSize).map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Checkbox
              checked={filters.isActive}
              onChange={(e) =>
                handleFilterChange('isActive', e.target.checked ? true : undefined)
              }
            >
              Active Only
            </Checkbox>
          </Col>
        </Row>
      </Card>

      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Space>
            <span>{selectedRowKeys.length} selected</span>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </Space>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="_id"
        rowSelection={rowSelection}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default AccountList;
