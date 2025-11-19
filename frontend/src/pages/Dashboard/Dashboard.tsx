import { Grid, Paper, Typography, Box } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

const stats = [
  { title: 'Total Leads', value: '150', icon: <PeopleIcon />, color: '#1976d2' },
  { title: 'Propiedades', value: '45', icon: <HomeWorkIcon />, color: '#2e7d32' },
  { title: 'Oportunidades', value: '32', icon: <TrendingUpIcon />, color: '#ed6c02' },
  { title: 'Ventas del Mes', value: '$250K', icon: <AttachMoneyIcon />, color: '#9c27b0' },
]

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: stat.color,
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  {stat.title}
                </Typography>
                {stat.icon}
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Resumen de Ventas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gráfico de ventas por mes
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Actividades Recientes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Últimas actividades del equipo
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
