import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Input, Button, message, Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '../../schemas/auth.schema';
import api from '../../services/api';
import { colors } from '../../styles/theme';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      message.error('Token inválido');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      setSuccess(true);
      message.success('Contraseña actualizada exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al resetear contraseña';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: '500px', width: '100%', padding: '0 24px' }}>
        <Result
          status="success"
          title="Contraseña Actualizada"
          subTitle="Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña."
          extra={[
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/login')}
              key="login"
            >
              Ir al Login
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ maxWidth: '500px', width: '100%', padding: '0 24px' }}>
        <Result
          status="error"
          title="Token Inválido"
          subTitle="El link de reseteo es inválido o ha expirado. Por favor solicita uno nuevo."
          extra={[
            <Link to="/forgot-password" key="forgot">
              <Button type="primary" size="large">
                Solicitar Nuevo Link
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
          Nueva Contraseña
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Ingresa tu nueva contraseña
        </p>
      </div>

      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Form.Item
          label="Nueva Contraseña"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined style={{ color: colors.text.tertiary }} />}
                placeholder="Mínimo 8 caracteres"
                size="large"
                autoComplete="new-password"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Confirmar Contraseña"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined style={{ color: colors.text.tertiary }} />}
                placeholder="Repite tu contraseña"
                size="large"
                autoComplete="new-password"
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
              fontWeight: 500,
              marginTop: '8px'
            }}
          >
            Actualizar Contraseña
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

export default ResetPassword;
