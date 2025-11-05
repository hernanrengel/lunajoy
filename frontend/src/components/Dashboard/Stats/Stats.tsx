import { Box, Paper, Typography, Stack } from '@mui/material';

interface StatsProps {
  avgMood: string | number;
  avgSleep: string | number;
  totalLogs: number;
  getMoodColor: (mood?: number) => string;
}

export const Stats = ({ avgMood, avgSleep, totalLogs, getMoodColor }: StatsProps) => (
  <Box sx={{ mb: 4, width: '100%' }}>
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 1.5, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minWidth: 0
        }}
      >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Average Mood
          </Typography>
          <Typography 
            variant="h4" 
            component="div"
            sx={{ color: getMoodColor(Number(avgMood)), fontWeight: 'bold' }}
          >
            {avgMood} <Typography component="span" color="text.secondary" variant="body1">/ 10</Typography>
          </Typography>
      </Paper>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 1.5, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minWidth: 0
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Avg. Sleep Hours
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {avgSleep} <Typography component="span" color="text.secondary" variant="body1">hours</Typography>
        </Typography>
      </Paper>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 1.5, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minWidth: 0
        }}
      >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Total Logs
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {totalLogs}
          </Typography>
      </Paper>
    </Stack>
  </Box>
);
