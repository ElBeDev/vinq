import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Row,
  Col,
  Card,
  Tooltip,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  ExportOutlined,
  UserAddOutlined,
  SwapOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { Lead, LeadFilters, LeadStatus, LeadSource, LeadRating } from '@/schemas/lead.schema';
import leadService from '@/services/leadService';
import { colors } from '@/styles/theme';

const { Search } = Input;
const { confirm } = Modal;

const LeadList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeads(filters);
      setLeads(response.data);
      setPagination({
        current: response.pagination.page,
        pageSize: response.pagination.limit,
        total: response.pagination.total,
      });
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al cargar los leads');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: TablePaginationConfig, _filters: any, sorter: any) => {
    setFilters({
      ...filters,
      page: newPagination.current || 1,
      limit: newPagination.pageSize || 10,
      sortBy: sorter.field || 'createdAt',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
    });
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleFilterChange = (key: keyof LeadFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: '¿Estás seguro de eliminar este lead?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await leadService.deleteLead(id);
          message.success('Lead eliminado correctamente');
          fetchLeads();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Error al eliminar el lead');
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Selecciona al menos un lead');
      return;
    }

    confirm({
      title: `¿Eliminar ${selectedRowKeys.length} leads?`,
      content: 'Esta acción no se puede deshacer',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await leadService.bulkDeleteLeads(selectedRowKeys as string[]);
          message.success(`${selectedRowKeys.length} leads eliminados`);
          setSelectedRowKeys([]);
          fetchLeads();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Error al eliminar los leads');
        }
      },
    });
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      NEW: 'blue',
      CONTACTED: 'cyan',
      QUALIFIED: 'green',
      UNQUALIFIED: 'orange',
      CONVERTED: 'purple',
      LOST: 'red',
    };
    return colors[status] || 'default';
  };

  const getRatingColor = (rating?: LeadRating) => {
    if (!rating) return 'default';
    const colors: Record<LeadRating, string> = {
      HOT: 'red',
      WARM: 'orange',
      COLD: 'blue',
    };
    return colors[rating];
  };

  const columns: ColumnsType<Lead> = [
    {
      title: 'Nombre',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      render: (text, record) => (
        <a
          onClick={() => navigate(`/leads/${record._id}`)}
          style={{ color: colors.primary, fontWeight: 500 }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Empresa',
      dataIndex: 'company',
      key: 'company',
      render: (text) => text || '-',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
      render: (text, record) => text || record.mobile || '-',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Nuevo', value: 'NEW' },
        { text: 'Contactado', value: 'CONTACTED' },
        { text: 'Calificado', value: 'QUALIFIED' },
        { text: 'No Calificado', value: 'UNQUALIFIED' },
        { text: 'Convertido', value: 'CONVERTED' },
        { text: 'Perdido', value: 'LOST' },
      ],
      render: (status: LeadStatus) => (
        <Tag color={getStatusColor(status)}>
          {status === 'NEW' ? 'Nuevo' :
           status === 'CONTACTED' ? 'Contactado' :
           status === 'QUALIFIED' ? 'Calificado' :
           status === 'UNQUALIFIED' ? 'No Calificado' :
           status === 'CONVERTED' ? 'Convertido' : 'Perdido'}
        </Tag>
      ),
    },
    {
      title: 'Fuente',
      dataIndex: 'source',
      key: 'source',
      render: (source: LeadSource) => (
        <Tag>{source.replace('_', ' ')}</Tag>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating?: LeadRating) => rating ? (
        <Tag color={getRatingColor(rating)}>{rating}</Tag>
      ) : '-',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: true,
      render: (score?: number) => score !== undefined ? `${score}%` : '-',
    },
    {
      title: 'Asignado a',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo) => assignedTo?.name || '-',
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_: any, record: Lead) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/leads/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/leads/${record._id}/edit`)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'convert',
                  icon: <SwapOutlined />,
                  label: 'Convertir',
                  disabled: record.isConverted,
                },
                {
                  key: 'assign',
                  icon: <UserAddOutlined />,
                  label: 'Asignar',
                },
                { type: 'divider' },
                {
                  key: 'delete',
                  icon: <DeleteOutlined />,
                  label: 'Eliminar',
                  danger: true,
                  onClick: () => handleDelete(record._id),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Leads</h2>
          <p style={{ margin: '4px 0 0', color: colors.textSecondary }}>
            Gestiona tus prospectos y clientes potenciales
          </p>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>Exportar</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/leads/new')}
          >
            Crear Lead
          </Button>
        </Space>
      </div>

      {/* Filtros */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Buscar por nombre, email, empresa..."
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              placeholder="Estado"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('status', value)}
              options={[
                { label: 'Nuevo', value: 'NEW' },
                { label: 'Contactado', value: 'CONTACTED' },
                { label: 'Calificado', value: 'QUALIFIED' },
                { label: 'No Calificado', value: 'UNQUALIFIED' },
                { label: 'Convertido', value: 'CONVERTED' },
                { label: 'Perdido', value: 'LOST' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              placeholder="Fuente"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('source', value)}
              options={[
                { label: 'Website', value: 'WEBSITE' },
                { label: 'Referido', value: 'REFERRAL' },
                { label: 'Redes Sociales', value: 'SOCIAL_MEDIA' },
                { label: 'Email Campaign', value: 'EMAIL_CAMPAIGN' },
                { label: 'Llamada', value: 'PHONE_CALL' },
                { label: 'Feria', value: 'TRADE_SHOW' },
                { label: 'Publicidad', value: 'ADVERTISING' },
                { label: 'Otro', value: 'OTHER' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              placeholder="Rating"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('rating', value)}
              options={[
                { label: '🔥 Hot', value: 'HOT' },
                { label: '🌡️ Warm', value: 'WARM' },
                { label: '❄️ Cold', value: 'COLD' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button icon={<FilterOutlined />}>Más filtros</Button>
              <Button icon={<ReloadOutlined />} onClick={fetchLeads} />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Acciones masivas */}
      {selectedRowKeys.length > 0 && (
        <Card>
          <Space>
            <span style={{ fontWeight: 500 }}>
              {selectedRowKeys.length} seleccionados
            </span>
            <Button icon={<UserAddOutlined />}>Asignar</Button>
            <Button icon={<SwapOutlined />}>Cambiar estado</Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Eliminar
            </Button>
          </Space>
        </Card>
      )}

      {/* Tabla */}
      <Card>
        <Table
          columns={columns}
          dataSource={leads}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </Space>
  );
};

export default LeadList;
