import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../schemas/auth.schema';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { colors } from '../../styles/theme';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await api.post('/auth/register', registerData);
      
      const { user, accessToken, refreshToken } = response.data.data;

      // Guardar en store
      setAuth(user, accessToken, refreshToken);

      message.success('¡Cuenta creada exitosamente!');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', width: '100%', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', color: colors.text.primary }}>
          Crear Cuenta
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Completa el formulario para registrarte
        </p>
      </div>

      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Form.Item
          label="Nombre Completo"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined style={{ color: colors.text.tertiary }} />}
                placeholder="Juan Pérez"
                size="large"
                autoComplete="name"
              />
            )}
          />
        </Form.Item>

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

        <Form.Item
          label="Teléfono (opcional)"
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<PhoneOutlined style={{ color: colors.text.tertiary }} />}
                placeholder="+57 300 123 4567"
                size="large"
                autoComplete="tel"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Contraseña"
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
            Crear Cuenta
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <span style={{ color: colors.text.secondary }}>
            ¿Ya tienes cuenta?{' '}
          </span>
          <Link 
            to="/login" 
            style={{ 
              color: colors.primary,
              fontWeight: 500
            }}
          >
            Inicia sesión
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
