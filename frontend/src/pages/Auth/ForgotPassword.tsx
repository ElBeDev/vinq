import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, message, Result } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../schemas/auth.schema';
import api from '../../services/api';
import { colors } from '../../styles/theme';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setEmailSent(true);
      message.success('Se han enviado instrucciones a tu email');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al procesar solicitud';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div style={{ maxWidth: '500px', width: '100%', padding: '0 24px' }}>
        <Result
          status="success"
          title="Email Enviado"
          subTitle={`Se han enviado instrucciones para resetear tu contraseña a ${email}. Revisa tu bandeja de entrada.`}
          extra={[
            <Link to="/login" key="login">
              <Button type="primary" size="large">
                Volver al Login
              </Button>
            </Link>,
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', width: '100%', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', color: colors.text.primary }}>
          ¿Olvidaste tu Contraseña?
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Ingresa tu email y te enviaremos instrucciones para resetearla
        </p>
      </div>

      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined style={{ color: colors.text.tertiary }} />}
                placeholder="tu@email.com"
                size="large"
                autoComplete="email"
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{ 
              height: '44px',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            Enviar Instrucciones
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link 
            to="/login" 
            style={{ 
              color: colors.primary,
              fontWeight: 500
            }}
          >
            ← Volver al Login
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
