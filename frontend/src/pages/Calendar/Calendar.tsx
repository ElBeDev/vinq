import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import activityService, { Activity } from '../../services/activityService';
import { toast } from 'react-toastify';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    activity: Activity;
  };
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    type: 'meeting' as Activity['type'],
    title: '',
    description: '',
    priority: 'medium' as Activity['priority'],
    dueDate: '',
    duration: 60,
    relatedTo: {
      type: 'lead' as Activity['relatedTo']['type'],
      id: '',
    },
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await activityService.getActivities();
      convertToCalendarEvents(data);
    } catch (error) {
      toast.error('Error al cargar actividades');
    }
  };

  const convertToCalendarEvents = (activitiesData: Activity[]) => {
    const calendarEvents: CalendarEvent[] = activitiesData
      .filter(activity => activity.dueDate)
      .map(activity => {
        const color = getActivityColor(activity);
        const endDate = activity.duration
          ? new Date(new Date(activity.dueDate!).getTime() + activity.duration * 60000)
          : undefined;

        return {
          id: activity._id,
          title: activity.title,
          start: activity.dueDate!,
          end: endDate ? endDate.toISOString() : undefined,
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            activity,
          },
        };
      });

    setEvents(calendarEvents);
  };

  const getActivityColor = (activity: Activity) => {
    if (activity.status === 'completed') return '#4caf50';
    if (activity.status === 'cancelled') return '#9e9e9e';
    
    switch (activity.priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return '📞';
      case 'email':
        return '📧';
      case 'meeting':
        return '🤝';
      case 'task':
        return '✅';
      case 'note':
        return '📝';
      default:
        return '📋';
    }
  };

  const handleDateClick = (arg: any) => {
    setSelectedActivity(null);
    setFormData({
      type: 'meeting',
      title: '',
      description: '',
      priority: 'medium',
      dueDate: arg.dateStr,
      duration: 60,
      relatedTo: {
        type: 'lead',
        id: '',
      },
    });
    setOpenDialog(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const activity = clickInfo.event.extendedProps.activity as Activity;
    setSelectedActivity(activity);
    setFormData({
      type: activity.type,
      title: activity.title,
      description: activity.description || '',
      priority: activity.priority,
      dueDate: activity.dueDate ? activity.dueDate.split('T')[0] : '',
      duration: activity.duration || 60,
      relatedTo: activity.relatedTo,
    });
    setOpenDialog(true);
  };

  const handleEventDrop = async (eventDropInfo: any) => {
    const activity = eventDropInfo.event.extendedProps.activity as Activity;
    const newDate = eventDropInfo.event.start;

    try {
      await activityService.updateActivity(activity._id, {
        dueDate: newDate.toISOString(),
      });
      toast.success('Actividad reagendada');
      fetchActivities();
    } catch (error) {
      toast.error('Error al reagendar actividad');
      eventDropInfo.revert();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedActivity(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedActivity) {
        await activityService.updateActivity(selectedActivity._id, formData);
        toast.success('Actividad actualizada');
      } else {
        await activityService.createActivity(formData);
        toast.success('Actividad creada');
      }
      handleCloseDialog();
      fetchActivities();
    } catch (error) {
      toast.error('Error al guardar actividad');
    }
  };

  const handleDelete = async () => {
    if (selectedActivity && window.confirm('¿Eliminar esta actividad?')) {
      try {
        await activityService.deleteActivity(selectedActivity._id);
        toast.success('Actividad eliminada');
        handleCloseDialog();
        fetchActivities();
      } catch (error) {
        toast.error('Error al eliminar actividad');
      }
    }
  };

  const handleComplete = async () => {
    if (selectedActivity) {
      try {
        await activityService.completeActivity(selectedActivity._id);
        toast.success('Actividad completada');
        handleCloseDialog();
        fetchActivities();
      } catch (error) {
        toast.error('Error al completar actividad');
      }
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const activity = eventInfo.event.extendedProps.activity as Activity;
    return (
      <Box sx={{ p: 0.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          {getActivityIcon(activity.type)} {eventInfo.event.title}
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Calendario</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedActivity(null);
            setFormData({
              type: 'meeting',
              title: '',
              description: '',
              priority: 'medium',
              dueDate: new Date().toISOString().split('T')[0],
              duration: 60,
              relatedTo: { type: 'lead', id: '' },
            });
            setOpenDialog(true);
          }}
        >
          Nueva Actividad
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <Chip label="🔴 Alta Prioridad" size="small" />
        <Chip label="🟠 Media Prioridad" size="small" />
        <Chip label="🔵 Baja Prioridad" size="small" />
        <Chip label="🟢 Completada" size="small" />
        <Chip label="⚪ Cancelada" size="small" />
      </Box>

      <Paper sx={{ p: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          editable={true}
          droppable={true}
          eventContent={renderEventContent}
          height="auto"
          locale="es"
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Lista',
          }}
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          nowIndicator={true}
        />
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
                <MenuItem value="call">📞 Llamada</MenuItem>
                <MenuItem value="email">📧 Email</MenuItem>
                <MenuItem value="meeting">🤝 Reunión</MenuItem>
                <MenuItem value="task">✅ Tarea</MenuItem>
                <MenuItem value="note">📝 Nota</MenuItem>
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
                <MenuItem value="low">🔵 Baja</MenuItem>
                <MenuItem value="medium">🟠 Media</MenuItem>
                <MenuItem value="high">🔴 Alta</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Fecha"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />

            <TextField
              label="Duración (minutos)"
              type="number"
              fullWidth
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
            />

            {selectedActivity && (
              <Box display="flex" gap={1}>
                <Chip
                  label={`Estado: ${selectedActivity.status}`}
                  color={selectedActivity.status === 'completed' ? 'success' : 'default'}
                />
                <Chip
                  label={`Tipo: ${selectedActivity.type}`}
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedActivity && (
            <>
              <Button onClick={handleDelete} color="error">
                Eliminar
              </Button>
              {selectedActivity.status === 'pending' && (
                <Button onClick={handleComplete} color="success">
                  Completar
                </Button>
              )}
            </>
          )}
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedActivity ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
