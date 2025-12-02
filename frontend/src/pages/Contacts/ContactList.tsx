import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Dropdown,
  Modal,
  Select,
  message,
  Badge,
  Tooltip,
} from 'antd';
import type { TableProps, MenuProps } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Contact, ContactFilters, ContactLeadSourceEnum } from '../../schemas/contact.schema';
import * as contactService from '../../services/contactService';

const { Search } = Input;
const { Option } = Select;

const ContactList: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Filters
  const [filters, setFilters] = useState<ContactFilters>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Fetch contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await contactService.getContacts(filters);
      setContacts(response.data);
      setPagination({
        current: response.pagination.page,
        pageSize: response.pagination.limit,
        total: response.pagination.total,
      });
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al cargar contactos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  // Handle search
  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  // Handle table change (pagination, filters, sorter)
  const handleTableChange: TableProps<Contact>['onChange'] = (
    newPagination,
    _filters,
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

  // Handle delete
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '¿Eliminar contacto?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await contactService.deleteContact(id);
          message.success('Contacto eliminado');
          fetchContacts();
        } catch (error: any) {
          message.error(
            error.response?.data?.message || 'Error al eliminar contacto'
          );
        }
      },
    });
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    Modal.confirm({
      title: `¿Eliminar ${selectedRowKeys.length} contactos?`,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          const deletedCount = await contactService.bulkDeleteContacts(
            selectedRowKeys as string[]
          );
          message.success(`${deletedCount} contactos eliminados`);
          setSelectedRowKeys([]);
          fetchContacts();
        } catch (error: any) {
          message.error(
            error.response?.data?.message || 'Error al eliminar contactos'
          );
        }
      },
    });
  };

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await contactService.exportContacts(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('Contactos exportados');
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 'Error al exportar contactos'
      );
    }
  };

  // Row actions menu
  const getRowActionsMenu = (record: Contact): MenuProps => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Editar',
        onClick: () => navigate(`/contacts/${record._id}/edit`),
      },
      {
        key: 'view',
        icon: <LinkOutlined />,
        label: 'Ver Detalle',
        onClick: () => navigate(`/contacts/${record._id}`),
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Eliminar',
        danger: true,
        onClick: () => handleDelete(record._id),
      },
    ],
  });

  // Bulk actions menu
  const bulkActionsMenu: MenuProps = {
    items: [
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Eliminar seleccionados',
        danger: true,
        onClick: handleBulkDelete,
      },
      {
        key: 'export',
        icon: <ExportOutlined />,
        label: 'Exportar seleccionados',
        onClick: handleExport,
      },
    ],
  };

  // Table columns
  const columns: TableProps<Contact>['columns'] = [
    {
      title: 'Nombre',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      render: (text: string, record: Contact) => (
        <Space>
          <a onClick={() => navigate(`/contacts/${record._id}`)}>
            {text || `${record.firstName} ${record.lastName}`}
          </a>
          {record.isPrimary && (
            <Tooltip title="Contacto Principal">
              <Badge status="success" />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <a href={`mailto:${email}`}>{email}</a>
      ),
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Empresa',
      dataIndex: ['account', 'name'],
      key: 'account',
      render: (text: string, record: Contact) =>
        record.account ? (
          <a onClick={() => navigate(`/accounts/${record.account!._id}`)}>
            {text}
          </a>
        ) : (
          <span style={{ color: '#999' }}>Sin empresa</span>
        ),
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Móvil',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Fuente',
      dataIndex: 'leadSource',
      key: 'leadSource',
      filters: Object.values(ContactLeadSourceEnum).map((source) => ({
        text: source,
        value: source,
      })),
      render: (source: string) => {
        const colors: { [key: string]: string } = {
          Website: 'blue',
          Referral: 'green',
          'Social Media': 'purple',
          'Email Campaign': 'orange',
          'Phone Call': 'cyan',
          'Trade Show': 'magenta',
          Advertising: 'red',
          Other: 'default',
        };
        return <Tag color={colors[source] || 'default'}>{source}</Tag>;
      },
    },
    {
      title: 'Asignado a',
      dataIndex: ['assignedTo', 'name'],
      key: 'assignedTo',
      render: (text: string) => text || <span style={{ color: '#999' }}>Sin asignar</span>,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 80,
      render: (_: any, record: Contact) => (
        <Dropdown menu={getRowActionsMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ margin: 0 }}>Contactos</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/contacts/new')}
        >
          Crear Contacto
        </Button>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          gap: '16px',
        }}
      >
        <Space style={{ flex: 1 }}>
          <Search
            placeholder="Buscar contactos..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Fuente"
            allowClear
            style={{ width: 150 }}
            onChange={(value) =>
              setFilters({ ...filters, leadSource: value, page: 1 })
            }
          >
            {Object.values(ContactLeadSourceEnum).map((source) => (
              <Option key={source} value={source}>
                {source}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Contacto Principal"
            allowClear
            style={{ width: 150 }}
            onChange={(value) =>
              setFilters({ ...filters, isPrimary: value, page: 1 })
            }
          >
            <Option value={true}>Sí</Option>
            <Option value={false}>No</Option>
          </Select>

          <Button icon={<FilterOutlined />}>Más Filtros</Button>
        </Space>

        <Space>
          {selectedRowKeys.length > 0 && (
            <Dropdown menu={bulkActionsMenu} trigger={['click']}>
              <Button>
                Acciones ({selectedRowKeys.length}) <MoreOutlined />
              </Button>
            </Dropdown>
          )}

          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Exportar
          </Button>
          <Button icon={<ImportOutlined />}>Importar</Button>
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={contacts}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowSelection={rowSelection}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default ContactList;
