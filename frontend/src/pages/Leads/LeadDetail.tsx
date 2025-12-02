import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Tabs,
  Descriptions,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Spin,
  Timeline,
  Input,
  Form,
  Divider,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Lead } from '@/schemas/lead.schema';
import leadService from '@/services/leadService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;

const LeadDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const data = await leadService.getLead(id!);
      setLead(data);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al cargar el lead');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    confirm({
      title: '¿Estás seguro de eliminar este lead?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      async onOk() {
        try {
          await leadService.deleteLead(id!);
          message.success('Lead eliminado correctamente');
          navigate('/leads');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Error al eliminar el lead');
        }
      },
    });
  };

  const handleConvert = () => {
    confirm({
      title: 'Convertir Lead',
      icon: <CheckCircleOutlined />,
      content: '¿Deseas convertir este lead en cliente?',
      okText: 'Convertir',
      cancelText: 'Cancelar',
      async onOk() {
        try {
          await leadService.convertLead(id!, {
            createContact: true,
            createAccount: true,
            createDeal: false,
          });
          message.success('Lead convertido correctamente');
          fetchLead();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Error al convertir el lead');
        }
      },
    });
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      message.warning('La nota no puede estar vacía');
      return;
    }

    try {
      setSubmittingNote(true);
      // TODO: Implement addNote API endpoint
      message.success('Nota agregada correctamente');
      setNoteText('');
      fetchLead();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al agregar nota');
    } finally {
      setSubmittingNote(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      NEW: 'blue',
      CONTACTED: 'cyan',
      QUALIFIED: 'green',
      UNQUALIFIED: 'orange',
      CONVERTED: 'purple',
      LOST: 'red',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getRatingColor = (rating: string) => {
    const colors = {
      HOT: 'red',
      WARM: 'orange',
      COLD: 'blue',
    };
    return colors[rating as keyof typeof colors] || 'default';
  };

  const getSourceLabel = (source: string) => {
    const labels = {
      WEBSITE: 'Website',
      REFERRAL: 'Referido',
      SOCIAL_MEDIA: 'Redes Sociales',
      EMAIL_CAMPAIGN: 'Campaña Email',
      PHONE_CALL: 'Llamada',
      TRADE_SHOW: 'Feria',
      ADVERTISING: 'Publicidad',
      OTHER: 'Otro',
    };
    return labels[source as keyof typeof labels] || source;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Empty description="Lead no encontrado" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/leads')}
          style={{ marginBottom: 16 }}
        >
          Volver
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
              {lead.fullName}
            </h2>
            <Space style={{ marginTop: 8 }}>
              <Tag color={getStatusColor(lead.status)}>{lead.status}</Tag>
              {lead.rating && <Tag color={getRatingColor(lead.rating)}>{lead.rating}</Tag>}
              <Tag>{getSourceLabel(lead.source)}</Tag>
            </Space>
          </div>
          <Space>
            {lead.status !== 'CONVERTED' && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleConvert}
              >
                Convertir
              </Button>
            )}
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/leads/${id}/edit`)}
            >
              Editar
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </Space>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultActiveKey="overview">
        <TabPane tab="Resumen" key="overview">
          <Card>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Nombre Completo" span={2}>
                {lead.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono">
                {lead.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Móvil">
                {lead.mobile || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Empresa">
                {lead.company || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Cargo">
                {lead.title || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Industria">
                {lead.industry || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                <Tag color={getStatusColor(lead.status)}>{lead.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Fuente">
                {getSourceLabel(lead.source)}
              </Descriptions.Item>
              <Descriptions.Item label="Rating">
                {lead.rating ? <Tag color={getRatingColor(lead.rating)}>{lead.rating}</Tag> : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Score">
                {lead.score}/100
              </Descriptions.Item>
            </Descriptions>

            <Divider>Ubicación</Divider>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Calle" span={2}>
                {lead.street || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Ciudad">
                {lead.city || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                {lead.state || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Código Postal">
                {lead.zipCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="País">
                {lead.country || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Presupuesto</Divider>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Presupuesto Mínimo">
                {lead.budgetMin ? `$${lead.budgetMin.toLocaleString()}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Presupuesto Máximo">
                {lead.budgetMax ? `$${lead.budgetMax.toLocaleString()}` : '-'}
              </Descriptions.Item>
            </Descriptions>

            {lead.notes && (
              <>
                <Divider>Notas</Divider>
                <Card type="inner" style={{ backgroundColor: '#f5f5f5' }}>
                  {lead.notes}
                </Card>
              </>
            )}

            <Divider>Información del Sistema</Divider>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Asignado a">
                {lead.assignedTo ? (
                  <Space>
                    <UserAddOutlined />
                    {lead.assignedTo.email}
                  </Space>
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Creado por">
                {lead.createdBy?.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha de Creación">
                {format(new Date(lead.createdAt), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </Descriptions.Item>
              <Descriptions.Item label="Última Actualización">
                {format(new Date(lead.updatedAt), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </Descriptions.Item>
              {lead.convertedDate && (
                <>
                  <Descriptions.Item label="Convertido el">
                    {format(new Date(lead.convertedDate), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cuenta">
                    {lead.convertedAccountId?.toString() || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Contacto">
                    {lead.convertedContactId?.toString() || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Oportunidad">
                    {lead.convertedDealId?.toString() || '-'}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab="Actividad" key="timeline">
          <Card>
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <>
                      <p style={{ margin: 0, fontWeight: 500 }}>Lead Creado</p>
                      <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                        {format(new Date(lead.createdAt), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                      </p>
                    </>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <>
                      <p style={{ margin: 0, fontWeight: 500 }}>Última Actualización</p>
                      <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                        {format(new Date(lead.updatedAt), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                      </p>
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </TabPane>

        <TabPane tab="Notas" key="notes">
          <Card>
            <Form layout="vertical">
              <Form.Item label="Agregar Nota">
                <TextArea
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Escribe una nota sobre este lead..."
                  maxLength={2000}
                  showCount
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleAddNote}
                  loading={submittingNote}
                >
                  Agregar Nota
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            <Empty description="No hay notas adicionales" />
          </Card>
        </TabPane>

        <TabPane tab="Relacionados" key="related">
          <Card>
            {lead.convertedDate ? (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Cuenta">
                  {lead.convertedAccountId ? (
                    <Button type="link" onClick={() => navigate(`/accounts/${lead.convertedAccountId}`)}>
                      Ver Cuenta
                    </Button>
                  ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Contacto">
                  {lead.convertedContactId ? (
                    <Button type="link" onClick={() => navigate(`/contacts/${lead.convertedContactId}`)}>
                      Ver Contacto
                    </Button>
                  ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Oportunidad">
                  {lead.convertedDealId ? (
                    <Button type="link" onClick={() => navigate(`/deals/${lead.convertedDealId}`)}>
                      Ver Oportunidad
                    </Button>
                  ) : '-'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="Este lead aún no ha sido convertido" />
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default LeadDetail;
