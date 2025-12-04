import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../schemas/auth.schema';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { colors } from '../../styles/theme';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@vinq.com',
      password: 'Admin123!',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      
      const { user, accessToken, refreshToken } = response.data.data;

      // Guardar en store
      setAuth(user, accessToken, refreshToken);

      // Guardar en localStorage si "recordarme" está activado
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      message.success('Bienvenido de vuelta!');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', width: '100%', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', color: colors.text.primary }}>
          Iniciar Sesión
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Ingresa tus credenciales para acceder
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
                prefix={<UserOutlined style={{ color: colors.text.tertiary }} />}
                placeholder="tu@email.com"
                size="large"
                autoComplete="email"
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
                placeholder="Tu contraseña"
                size="large"
                autoComplete="current-password"
              />
            )}
          />
        </Form.Item>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Recordarme
          </Checkbox>
          <Link 
            to="/forgot-password" 
            style={{ color: colors.primary }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

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
            Iniciar Sesión
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <span style={{ color: colors.text.secondary }}>
            ¿No tienes cuenta?{' '}
          </span>
          <Link 
            to="/register" 
            style={{ 
              color: colors.primary,
              fontWeight: 500
            }}
          >
            Regístrate aquí
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
