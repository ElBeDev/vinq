import { Typography, Paper, Box } from '@mui/material'

export default function Opportunities() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pipeline de Oportunidades
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Aquí se mostrará el pipeline de ventas con las oportunidades en diferentes etapas.
        </Typography>
      </Paper>
    </Box>
  )
}
