import { Typography, Paper, Box, Tabs, Tab } from '@mui/material'
import { useState } from 'react'

export default function AdminPanel() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      <Paper sx={{ mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Usuarios" />
          <Tab label="Roles y Permisos" />
          <Tab label="Configuración" />
          <Tab label="Auditoría" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Typography>Gestión de usuarios del sistema</Typography>
          )}
          {tabValue === 1 && (
            <Typography>Configuración de roles y permisos</Typography>
          )}
          {tabValue === 2 && (
            <Typography>Configuración general del sistema</Typography>
          )}
          {tabValue === 3 && (
            <Typography>Logs de auditoría y actividades</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
