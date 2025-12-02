import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Card,
  Space,
  message,
  Row,
  Col,
  Checkbox,
} from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import {
  contactFormSchema,
  ContactFormData,
  ContactLeadSourceEnum,
} from '../../schemas/contact.schema';
import * as contactService from '../../services/contactService';

const { Option } = Select;
const { TextArea } = Input;

const ContactForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      mobile: '',
      title: '',
      department: '',
      isPrimary: false,
      mailingStreet: '',
      mailingCity: '',
      mailingState: '',
      mailingZip: '',
      mailingCountry: '',
      otherStreet: '',
      otherCity: '',
      otherState: '',
      otherZip: '',
      otherCountry: '',
      leadSource: 'WEBSITE',
      description: '',
      linkedInUrl: '',
      twitterHandle: '',
      facebookUrl: '',
    },
  });

  // Load contact data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchContact(id);
    }
  }, [id, isEditMode]);

  const fetchContact = async (contactId: string) => {
    setInitialLoading(true);
    try {
      const contact = await contactService.getContact(contactId);
      reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        title: contact.title || '',
        department: contact.department || '',
        account: contact.account?._id || undefined,
        isPrimary: contact.isPrimary,
        mailingStreet: contact.mailingAddress?.street || '',
        mailingCity: contact.mailingAddress?.city || '',
        mailingState: contact.mailingAddress?.state || '',
        mailingZip: contact.mailingAddress?.zip || '',
        mailingCountry: contact.mailingAddress?.country || '',
        otherStreet: contact.otherAddress?.street || '',
        otherCity: contact.otherAddress?.city || '',
        otherState: contact.otherAddress?.state || '',
        otherZip: contact.otherAddress?.zip || '',
        otherCountry: contact.otherAddress?.country || '',
        dateOfBirth: contact.dateOfBirth || undefined,
        leadSource: contact.leadSource,
        description: contact.description || '',
        linkedInUrl: contact.linkedInUrl || '',
        twitterHandle: contact.twitterHandle || '',
        facebookUrl: contact.facebookUrl || '',
        assignedTo: contact.assignedTo?._id || undefined,
      });
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 'Error al cargar contacto'
      );
      navigate('/contacts');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      // Transform data for API
      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        mobile: data.mobile,
        title: data.title,
        department: data.department,
        account: data.account,
        isPrimary: data.isPrimary,
        leadSource: data.leadSource,
        description: data.description,
        linkedInUrl: data.linkedInUrl,
        twitterHandle: data.twitterHandle,
        facebookUrl: data.facebookUrl,
        assignedTo: data.assignedTo,
        dateOfBirth: data.dateOfBirth,
      };

      // Add mailing address if any field is filled
      if (
        data.mailingStreet ||
        data.mailingCity ||
        data.mailingState ||
        data.mailingZip ||
        data.mailingCountry
      ) {
        payload.mailingAddress = {
          street: data.mailingStreet,
          city: data.mailingCity,
          state: data.mailingState,
          zip: data.mailingZip,
          country: data.mailingCountry,
        };
      }

      // Add other address if any field is filled
      if (
        data.otherStreet ||
        data.otherCity ||
        data.otherState ||
        data.otherZip ||
        data.otherCountry
      ) {
        payload.otherAddress = {
          street: data.otherStreet,
          city: data.otherCity,
          state: data.otherState,
          zip: data.otherZip,
          country: data.otherCountry,
        };
      }

      if (isEditMode && id) {
        await contactService.updateContact(id, payload);
        message.success('Contacto actualizado');
      } else {
        await contactService.createContact(payload);
        message.success('Contacto creado');
      }
      navigate('/contacts');
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
          `Error al ${isEditMode ? 'actualizar' : 'crear'} contacto`
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1>{isEditMode ? 'Editar Contacto' : 'Nuevo Contacto'}</h1>
      </div>

      {/* Form */}
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* 1. Información Básica */}
        <Card title="1. Información Básica" style={{ marginBottom: '16px' }}>
          <Row gutter={16}>
            <Col span={12}>
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
                    <Input {...field} placeholder="Nombre" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                    <Input {...field} placeholder="Apellido" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
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
                    <Input {...field} type="email" placeholder="email@ejemplo.com" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Teléfono"
                validateStatus={errors.phone ? 'error' : ''}
                help={errors.phone?.message}
              >
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="+52 123 456 7890" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Móvil"
                validateStatus={errors.mobile ? 'error' : ''}
                help={errors.mobile?.message}
              >
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="+52 123 456 7890" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Fecha de Nacimiento"
                validateStatus={errors.dateOfBirth ? 'error' : ''}
                help={errors.dateOfBirth?.message}
              >
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : null)
                      }
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 2. Información Profesional */}
        <Card
          title="2. Información Profesional"
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Título/Cargo"
                validateStatus={errors.title ? 'error' : ''}
                help={errors.title?.message}
              >
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Ej: Gerente de Ventas" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Departamento"
                validateStatus={errors.department ? 'error' : ''}
                help={errors.department?.message}
              >
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Ej: Ventas" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Empresa (Account)"
                validateStatus={errors.account ? 'error' : ''}
                help={errors.account?.message}
              >
                <Controller
                  name="account"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Seleccionar empresa"
                      allowClear
                      showSearch
                    >
                      {/* TODO: Load accounts from API */}
                      <Option value="">-- Seleccionar --</Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Contacto Principal"
                validateStatus={errors.isPrimary ? 'error' : ''}
                help={errors.isPrimary?.message}
              >
                <Controller
                  name="isPrimary"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    >
                      Marcar como contacto principal de la empresa
                    </Checkbox>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 3. Dirección de Correspondencia */}
        <Card
          title="3. Dirección de Correspondencia"
          style={{ marginBottom: '16px' }}
        >
          <Form.Item label="Calle">
            <Controller
              name="mailingStreet"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Calle y número" />
              )}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ciudad">
                <Controller
                  name="mailingCity"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Ciudad" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Estado">
                <Controller
                  name="mailingState"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Estado" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Código Postal">
                <Controller
                  name="mailingZip"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="12345" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="País">
                <Controller
                  name="mailingCountry"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="País" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 4. Otra Dirección */}
        <Card title="4. Otra Dirección" style={{ marginBottom: '16px' }}>
          <Form.Item label="Calle">
            <Controller
              name="otherStreet"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Calle y número" />
              )}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ciudad">
                <Controller
                  name="otherCity"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Ciudad" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Estado">
                <Controller
                  name="otherState"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Estado" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Código Postal">
                <Controller
                  name="otherZip"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="12345" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="País">
                <Controller
                  name="otherCountry"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="País" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 5. Información Adicional */}
        <Card
          title="5. Información Adicional"
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Fuente"
                validateStatus={errors.leadSource ? 'error' : ''}
                help={errors.leadSource?.message}
                required
              >
                <Controller
                  name="leadSource"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Seleccionar fuente">
                      {Object.values(ContactLeadSourceEnum).map((source) => (
                        <Option key={source} value={source}>
                          {source}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Asignado a"
                validateStatus={errors.assignedTo ? 'error' : ''}
                help={errors.assignedTo?.message}
              >
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Seleccionar usuario"
                      allowClear
                      showSearch
                    >
                      {/* TODO: Load users from API */}
                      <Option value="">-- Seleccionar --</Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Descripción"
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={4}
                  placeholder="Notas adicionales sobre el contacto"
                />
              )}
            />
          </Form.Item>
        </Card>

        {/* 6. Redes Sociales */}
        <Card title="6. Redes Sociales" style={{ marginBottom: '16px' }}>
          <Form.Item
            label="LinkedIn URL"
            validateStatus={errors.linkedInUrl ? 'error' : ''}
            help={errors.linkedInUrl?.message}
          >
            <Controller
              name="linkedInUrl"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="https://linkedin.com/in/usuario"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Twitter Handle"
            validateStatus={errors.twitterHandle ? 'error' : ''}
            help={errors.twitterHandle?.message}
          >
            <Controller
              name="twitterHandle"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="@usuario" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Facebook URL"
            validateStatus={errors.facebookUrl ? 'error' : ''}
            help={errors.facebookUrl?.message}
          >
            <Controller
              name="facebookUrl"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="https://facebook.com/usuario"
                />
              )}
            />
          </Form.Item>
        </Card>

        {/* Action Buttons */}
        <Card>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              {isEditMode ? 'Actualizar' : 'Crear'} Contacto
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={() => navigate('/contacts')}
            >
              Cancelar
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default ContactForm;
