import { Typography, Paper, Box } from '@mui/material'

export default function Properties() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Catálogo de Propiedades
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Aquí se mostrará el catálogo completo de propiedades con filtros, búsqueda y detalles de cada propiedad.
        </Typography>
      </Paper>
    </Box>
  )
}
