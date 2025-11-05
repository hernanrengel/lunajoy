import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Divider } from '@mui/material';
import type { LogData } from '../../../api/logs';

interface LogDetailsModalProps {
  open: boolean;
  onClose: () => void;
  log: LogData | null;
  getMoodColor: (mood?: number) => string;
}

export const LogDetailsModal = ({ open, onClose, log, getMoodColor }: LogDetailsModalProps) => {
  if (!log) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Log Details</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="subtitle2" color="textSecondary">Date & Time</Typography>
          <Typography variant="body1">{formatDate(log.date)}</Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Mood</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                width={16} 
                height={16} 
                borderRadius="50%" 
                bgcolor={getMoodColor(log.mood)}
              />
              <Typography>{log.mood !== undefined ? `${log.mood}/10` : 'N/A'}</Typography>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Stress Level</Typography>
            <Typography>{log.stress !== undefined ? `${log.stress}/10` : 'N/A'}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Sleep Hours</Typography>
            <Typography>{log.sleepHours !== undefined ? `${log.sleepHours}h` : 'N/A'}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Sleep Quality</Typography>
            <Typography>{log.sleepQuality !== undefined ? `${log.sleepQuality}/10` : 'N/A'}</Typography>
          </Box>
          
          {log.anxiety !== undefined && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Anxiety Level</Typography>
              <Typography>{log.anxiety}/10</Typography>
            </Box>
          )}
          
          {log.socialCount !== undefined && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Social Interactions</Typography>
              <Typography>{log.socialCount}</Typography>
            </Box>
          )}
        </Box>
        
        {(log.activityType || log.activityMins) && (
          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary">Physical Activity</Typography>
            <Typography>
              {log.activityType ? `${log.activityType}: ` : ''}
              {log.activityMins ? `${log.activityMins} minutes` : ''}
            </Typography>
          </Box>
        )}
        
        {log.symptoms && (
          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary">Symptoms</Typography>
            <Typography>{log.symptoms}</Typography>
          </Box>
        )}
        
        {log.notes && (
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
            <Typography whiteSpace="pre-wrap">{log.notes}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
