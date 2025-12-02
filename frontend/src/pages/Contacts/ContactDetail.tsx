import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tabs,
  Tag,
  Badge,
  Modal,
  message,
  Divider,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  FacebookOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Contact } from '../../schemas/contact.schema';
import * as contactService from '../../services/contactService';

const { TabPane } = Tabs;

const ContactDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchContact(id);
    }
  }, [id]);

  const fetchContact = async (contactId: string) => {
    setLoading(true);
    try {
      const data = await contactService.getContact(contactId);
      setContact(data);
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 'Error al cargar contacto'
      );
      navigate('/contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '¿Eliminar contacto?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        if (!id) return;
        try {
          await contactService.deleteContact(id);
          message.success('Contacto eliminado');
          navigate('/contacts');
        } catch (error: any) {
          message.error(
            error.response?.data?.message || 'Error al eliminar contacto'
          );
        }
      },
    });
  };

  if (loading || !contact) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ margin: 0, marginBottom: '8px' }}>
              {contact.fullName || `${contact.firstName} ${contact.lastName}`}
              {contact.isPrimary && (
                <Badge
                  status="success"
                  text="Contacto Principal"
                  style={{ marginLeft: '12px' }}
                />
              )}
            </h1>
            <Space>
              {contact.email && (
                <a href={`mailto:${contact.email}`}>
                  <MailOutlined /> {contact.email}
                </a>
              )}
              {contact.phone && (
                <span>
                  <PhoneOutlined /> {contact.phone}
                </span>
              )}
            </Space>
          </div>

          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/contacts/${id}/edit`)}
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
      </Card>

      {/* Tabs */}
      <Tabs defaultActiveKey="overview">
        {/* Tab 1: Overview */}
        <TabPane tab="Resumen" key="overview">
          <Card title="Información Personal" style={{ marginBottom: '16px' }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Nombre">
                {contact.firstName}
              </Descriptions.Item>
              <Descriptions.Item label="Apellido">
                {contact.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono">
                {contact.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Móvil">
                {contact.mobile || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha de Nacimiento">
                {contact.dateOfBirth
                  ? new Date(contact.dateOfBirth).toLocaleDateString()
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Información Profesional" style={{ marginBottom: '16px' }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Título/Cargo">
                {contact.title || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Departamento">
                {contact.department || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Empresa" span={2}>
                {contact.account ? (
                  <a onClick={() => navigate(`/accounts/${contact.account!._id}`)}>
                    {contact.account.name}
                  </a>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Contacto Principal" span={2}>
                {contact.isPrimary ? (
                  <Badge status="success" text="Sí" />
                ) : (
                  <Badge status="default" text="No" />
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Dirección de Correspondencia" style={{ marginBottom: '16px' }}>
            {contact.mailingAddress ? (
              <Descriptions column={1} bordered>
                <Descriptions.Item label={<><HomeOutlined /> Dirección</>}>
                  {contact.mailingAddress.street && (
                    <div>{contact.mailingAddress.street}</div>
                  )}
                  <div>
                    {contact.mailingAddress.city && `${contact.mailingAddress.city}, `}
                    {contact.mailingAddress.state && `${contact.mailingAddress.state} `}
                    {contact.mailingAddress.zip}
                  </div>
                  {contact.mailingAddress.country && (
                    <div>{contact.mailingAddress.country}</div>
                  )}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <p style={{ color: '#999' }}>Sin dirección registrada</p>
            )}
          </Card>

          {contact.otherAddress && (
            <Card title="Otra Dirección" style={{ marginBottom: '16px' }}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label={<><HomeOutlined /> Dirección</>}>
                  {contact.otherAddress.street && (
                    <div>{contact.otherAddress.street}</div>
                  )}
                  <div>
                    {contact.otherAddress.city && `${contact.otherAddress.city}, `}
                    {contact.otherAddress.state && `${contact.otherAddress.state} `}
                    {contact.otherAddress.zip}
                  </div>
                  {contact.otherAddress.country && (
                    <div>{contact.otherAddress.country}</div>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          <Card title="Información Adicional" style={{ marginBottom: '16px' }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Fuente">
                <Tag>{contact.leadSource}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Asignado a">
                {contact.assignedTo ? (
                  <Space>
                    <UserOutlined />
                    {contact.assignedTo.name}
                  </Space>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Creado por">
                {contact.createdBy ? (
                  <Space>
                    <UserOutlined />
                    {contact.createdBy.name}
                  </Space>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Último Contacto">
                {contact.lastContactedDate
                  ? new Date(contact.lastContactedDate).toLocaleDateString()
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Descripción" span={2}>
                {contact.description || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Redes Sociales */}
          {(contact.linkedInUrl || contact.twitterHandle || contact.facebookUrl) && (
            <Card title="Redes Sociales" style={{ marginBottom: '16px' }}>
              <Space direction="vertical">
                {contact.linkedInUrl && (
                  <a href={contact.linkedInUrl} target="_blank" rel="noopener noreferrer">
                    <LinkedinOutlined /> LinkedIn
                  </a>
                )}
                {contact.twitterHandle && (
                  <a
                    href={`https://twitter.com/${contact.twitterHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterOutlined /> {contact.twitterHandle}
                  </a>
                )}
                {contact.facebookUrl && (
                  <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer">
                    <FacebookOutlined /> Facebook
                  </a>
                )}
              </Space>
            </Card>
          )}
        </TabPane>

        {/* Tab 2: Timeline/Activity */}
        <TabPane tab="Actividad" key="activity">
          <Card>
            <p style={{ color: '#999', textAlign: 'center' }}>
              Las actividades estarán disponibles cuando se implemente el módulo de Actividades (Fase 10)
            </p>
          </Card>
        </TabPane>

        {/* Tab 3: Deals */}
        <TabPane tab="Oportunidades" key="deals">
          <Card>
            <p style={{ color: '#999', textAlign: 'center' }}>
              Las oportunidades relacionadas estarán disponibles cuando se implemente el módulo de Deals (Fase 7)
            </p>
          </Card>
        </TabPane>

        {/* Tab 4: Notes */}
        <TabPane tab="Notas" key="notes">
          <Card>
            <p style={{ color: '#999', textAlign: 'center' }}>
              Las notas estarán disponibles cuando se implemente el módulo de Actividades (Fase 10)
            </p>
          </Card>
        </TabPane>

        {/* Tab 5: Related */}
        <TabPane tab="Relacionados" key="related">
          <Card title="Empresa Vinculada" style={{ marginBottom: '16px' }}>
            {contact.account ? (
              <div>
                <Button
                  type="link"
                  onClick={() => navigate(`/accounts/${contact.account!._id}`)}
                >
                  {contact.account.name}
                </Button>
                <Divider />
                <p>
                  <strong>Contacto Principal:</strong>{' '}
                  {contact.isPrimary ? 'Sí' : 'No'}
                </p>
              </div>
            ) : (
              <p style={{ color: '#999' }}>Sin empresa vinculada</p>
            )}
          </Card>

          <Card title="Otros Contactos de la Empresa">
            <p style={{ color: '#999', textAlign: 'center' }}>
              Los contactos relacionados se mostrarán aquí
            </p>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ContactDetail;
