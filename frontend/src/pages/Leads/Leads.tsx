import { Typography, Paper, Box } from '@mui/material'

export default function Leads() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Leads
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Aquí se mostrará la lista de leads con opciones para crear, editar y convertir a oportunidades.
        </Typography>
      </Paper>
    </Box>
  )
}
