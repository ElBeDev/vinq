import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Assignment as TaskIcon,
  Note as NoteIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import activityService, { Activity } from '../../services/activityService';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`activity-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [pendingActivities, setPendingActivities] = useState<Activity[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    type: 'task' as Activity['type'],
    title: '',
    description: '',
    priority: 'medium' as Activity['priority'],
    dueDate: '',
    relatedTo: {
      type: 'lead' as Activity['relatedTo']['type'],
      id: '',
    },
  });

  useEffect(() => {
    fetchActivities();
    fetchTodayActivities();
    fetchPendingActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await activityService.getActivities();
      setActivities(data);
    } catch (error) {
      toast.error('Error al cargar actividades');
    }
  };

  const fetchTodayActivities = async () => {
    try {
      const data = await activityService.getTodayActivities();
      setTodayActivities(data);
    } catch (error) {
      console.error('Error al cargar actividades de hoy:', error);
    }
  };

  const fetchPendingActivities = async () => {
    try {
      const data = await activityService.getPendingActivities();
      setPendingActivities(data);
    } catch (error) {
      console.error('Error al cargar actividades pendientes:', error);
    }
  };

  const handleOpenDialog = (activity?: Activity) => {
    if (activity) {
      setSelectedActivity(activity);
      setFormData({
        type: activity.type,
        title: activity.title,
        description: activity.description || '',
        priority: activity.priority,
        dueDate: activity.dueDate ? activity.dueDate.split('T')[0] : '',
        relatedTo: activity.relatedTo,
      });
    } else {
      setSelectedActivity(null);
      setFormData({
        type: 'task',
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        relatedTo: {
          type: 'lead',
          id: '',
        },
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedActivity(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedActivity) {
        await activityService.updateActivity(selectedActivity._id, formData);
        toast.success('Actividad actualizada exitosamente');
      } else {
        await activityService.createActivity(formData);
        toast.success('Actividad creada exitosamente');
      }
      handleCloseDialog();
      fetchActivities();
      fetchTodayActivities();
      fetchPendingActivities();
    } catch (error) {
      toast.error('Error al guardar la actividad');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await activityService.completeActivity(id);
      toast.success('Actividad completada');
      fetchActivities();
      fetchTodayActivities();
      fetchPendingActivities();
    } catch (error) {
      toast.error('Error al completar la actividad');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
      try {
        await activityService.deleteActivity(id);
        toast.success('Actividad eliminada');
        fetchActivities();
        fetchTodayActivities();
        fetchPendingActivities();
      } catch (error) {
        toast.error('Error al eliminar la actividad');
      }
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <PhoneIcon />;
      case 'email':
        return <EmailIcon />;
      case 'meeting':
        return <EventIcon />;
      case 'task':
        return <TaskIcon />;
      case 'note':
        return <NoteIcon />;
      default:
        return <TaskIcon />;
    }
  };

  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderActivityCard = (activity: Activity) => (
    <Card key={activity._id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            {getActivityIcon(activity.type)}
            <Box>
              <Typography variant="h6">{activity.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {activity.description}
              </Typography>
              <Box mt={1} display="flex" gap={1}>
                <Chip
                  label={activity.type}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={activity.priority}
                  size="small"
                  color={getPriorityColor(activity.priority)}
                />
                <Chip
                  label={activity.status}
                  size="small"
                  color={getStatusColor(activity.status)}
                />
                {activity.dueDate && (
                  <Chip
                    label={new Date(activity.dueDate).toLocaleDateString()}
                    size="small"
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            {activity.status === 'pending' && (
              <IconButton
                color="success"
                onClick={() => handleComplete(activity._id)}
                title="Completar"
              >
                <CheckCircleIcon />
              </IconButton>
            )}
            <IconButton
              color="primary"
              onClick={() => handleOpenDialog(activity)}
              title="Editar"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDelete(activity._id)}
              title="Eliminar"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Actividades</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Actividad
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actividades de Hoy
              </Typography>
              <Typography variant="h3" color="primary">
                {todayActivities.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                tareas programadas para hoy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pendientes
              </Typography>
              <Typography variant="h3" color="error">
                {pendingActivities.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                actividades vencidas o por vencer
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Todas" />
          <Tab label="Hoy" />
          <Tab label="Pendientes" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          {activities.length === 0 ? (
            <Typography color="text.secondary">No hay actividades</Typography>
          ) : (
            activities.map(renderActivityCard)
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {todayActivities.length === 0 ? (
            <Typography color="text.secondary">No hay actividades para hoy</Typography>
          ) : (
            todayActivities.map(renderActivityCard)
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {pendingActivities.length === 0 ? (
            <Typography color="text.secondary">No hay actividades pendientes</Typography>
          ) : (
            pendingActivities.map(renderActivityCard)
          )}
        </TabPanel>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedActivity ? 'Editar Actividad' : 'Nueva Actividad'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.type}
                label="Tipo"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Activity['type'] })}
              >
                <MenuItem value="call">Llamada</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="meeting">Reunión</MenuItem>
                <MenuItem value="task">Tarea</MenuItem>
                <MenuItem value="note">Nota</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Título"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={formData.priority}
                label="Prioridad"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Activity['priority'] })}
              >
                <MenuItem value="low">Baja</MenuItem>
                <MenuItem value="medium">Media</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Fecha de vencimiento"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedActivity ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
