import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Space,
  Row,
  Col,
  InputNumber,
  message,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { leadFormSchema, LeadFormData } from '@/schemas/lead.schema';
import leadService from '@/services/leadService';

const { TextArea } = Input;
const { Option } = Select;

const LeadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      status: 'NEW',
      country: 'México',
      score: 0,
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      const lead = await leadService.getLead(id!);
      reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        mobile: lead.mobile,
        company: lead.company,
        title: lead.title,
        industry: lead.industry,
        status: lead.status,
        source: lead.source,
        rating: lead.rating,
        score: lead.score,
        street: lead.street,
        city: lead.city,
        state: lead.state,
        zipCode: lead.zipCode,
        country: lead.country,
        assignedTo: lead.assignedTo?._id,
        propertyInterest: lead.propertyInterest,
        budgetMin: lead.budgetMin,
        budgetMax: lead.budgetMax,
        notes: lead.notes,
      });
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al cargar el lead');
      navigate('/leads');
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    try {
      if (isEditMode) {
        await leadService.updateLead(id!, data);
        message.success('Lead actualizado correctamente');
      } else {
        await leadService.createLead(data);
        message.success('Lead creado correctamente');
      }
      navigate('/leads');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al guardar el lead');
    }
  };

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
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
          {isEditMode ? 'Editar Lead' : 'Crear Nuevo Lead'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Información Básica */}
          <Card title="Información Básica" bordered={false}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nombre"
                  validateStatus={errors.firstName ? 'error' : ''}
                  help={errors.firstName?.message}
                  required
                >
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Nombre" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Apellido"
                  validateStatus={errors.lastName ? 'error' : ''}
                  help={errors.lastName?.message}
                  required
                >
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Apellido" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  validateStatus={errors.email ? 'error' : ''}
                  help={errors.email?.message}
                  required
                >
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="email" placeholder="email@ejemplo.com" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Teléfono"
                  validateStatus={errors.phone ? 'error' : ''}
                  help={errors.phone?.message}
                >
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="+52 123 456 7890" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Móvil">
                  <Controller
                    name="mobile"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="+52 987 654 3210" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Fuente"
                  validateStatus={errors.source ? 'error' : ''}
                  help={errors.source?.message}
                  required
                >
                  <Controller
                    name="source"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="Selecciona una fuente" size="large">
                        <Option value="WEBSITE">Website</Option>
                        <Option value="REFERRAL">Referido</Option>
                        <Option value="SOCIAL_MEDIA">Redes Sociales</Option>
                        <Option value="EMAIL_CAMPAIGN">Campaña de Email</Option>
                        <Option value="PHONE_CALL">Llamada Telefónica</Option>
                        <Option value="TRADE_SHOW">Feria/Evento</Option>
                        <Option value="ADVERTISING">Publicidad</Option>
                        <Option value="OTHER">Otro</Option>
                      </Select>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Información de la Empresa */}
          <Card title="Información de la Empresa" bordered={false}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Empresa">
                  <Controller
                    name="company"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Nombre de la empresa" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Cargo">
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Ej: Gerente de Ventas" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Industria">
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Ej: Tecnología" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Estado y Clasificación */}
          <Card title="Estado y Clasificación" bordered={false}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Estado">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="large">
                        <Option value="NEW">Nuevo</Option>
                        <Option value="CONTACTED">Contactado</Option>
                        <Option value="QUALIFIED">Calificado</Option>
                        <Option value="UNQUALIFIED">No Calificado</Option>
                        <Option value="CONVERTED">Convertido</Option>
                        <Option value="LOST">Perdido</Option>
                      </Select>
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Rating">
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="Selecciona rating" size="large" allowClear>
                        <Option value="HOT">🔥 Hot</Option>
                        <Option value="WARM">🌡️ Warm</Option>
                        <Option value="COLD">❄️ Cold</Option>
                      </Select>
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Score (0-100)">
                  <Controller
                    name="score"
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        max={100}
                        style={{ width: '100%' }}
                        size="large"
                        placeholder="0"
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Ubicación */}
          <Card title="Ubicación" bordered={false}>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item label="Calle">
                  <Controller
                    name="street"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Calle y número" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Ciudad">
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Ciudad" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Estado">
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Estado" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Código Postal">
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="12345" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="País">
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="País" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Presupuesto */}
          <Card title="Presupuesto e Intereses" bordered={false}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Presupuesto Mínimo"
                  validateStatus={errors.budgetMin ? 'error' : ''}
                  help={errors.budgetMin?.message}
                >
                  <Controller
                    name="budgetMin"
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        style={{ width: '100%' }}
                        size="large"
                        placeholder="0"
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Presupuesto Máximo"
                  validateStatus={errors.budgetMax ? 'error' : ''}
                  help={errors.budgetMax?.message}
                >
                  <Controller
                    name="budgetMax"
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        style={{ width: '100%' }}
                        size="large"
                        placeholder="0"
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item label="Notas">
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        rows={4}
                        placeholder="Notas adicionales sobre el lead..."
                        maxLength={2000}
                        showCount
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Botones */}
          <Card bordered={false}>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={isSubmitting}
                size="large"
              >
                {isEditMode ? 'Actualizar Lead' : 'Crear Lead'}
              </Button>
              <Button size="large" onClick={() => navigate('/leads')}>
                Cancelar
              </Button>
            </Space>
          </Card>
        </Space>
      </form>
    </div>
  );
};

export default LeadForm;
