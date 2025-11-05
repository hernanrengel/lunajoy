import { useState } from 'react';
import type { LogData } from '../../../api/logs';
import { LogDetailsModal } from '../LogDetailsModal/LogDetailsModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Button, 
  ButtonGroup,
  Stack,
} from '@mui/material';
import './RecentLogs.css';

interface RecentLogsProps {
  logs: LogData[];
  getMoodColor: (mood?: number) => string;
  itemsPerPage?: number;
}

export const RecentLogs = ({ logs, getMoodColor, itemsPerPage = 10 }: RecentLogsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<LogData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalPages = Math.ceil(logs.length / itemsPerPage);

  const handleRowClick = (log: LogData) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };
  
  // Get current logs
  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (logs.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Recent Logs</Typography>
        <Typography color="text.secondary">No records yet. Add your first entry!</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" component="h3">Recent Logs</Typography>
        <Typography variant="body2" color="text.secondary">
          Showing {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, logs.length)} of {logs.length} entries
        </Typography>
      </Box>
      
      <TableContainer sx={{ mb: 2, minHeight: 490, maxHeight: 490 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Mood</TableCell>
              <TableCell>Sleep</TableCell>
              <TableCell>Stress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentLogs.map((log, index) => (
              <TableRow 
                key={`${log.id || 'log'}-${index}`}
                hover 
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {indexOfFirstLog + index + 1}
                </TableCell>
                <TableCell>
                  {new Date(log.date).toLocaleString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getMoodColor(log.mood),
                      }}
                    />
                    {log.mood}
                  </Box>
                </TableCell>
                <TableCell>{log.sleepHours}h</TableCell>
                <TableCell>{log.stress || '-'}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleRowClick(log)}
                    aria-label="View details"
                    color="primary"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={prevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <ButtonGroup variant="outlined" size="small">
            {getPageNumbers().map((number) => (
              <Button
                key={number}
                variant={currentPage === number ? 'contained' : 'outlined'}
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            ))}
          </ButtonGroup>
          
          <Button 
            variant="outlined" 
            size="small"
            onClick={nextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Stack>
      </Box>
      
      <LogDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        log={selectedLog}
        getMoodColor={getMoodColor}
      />
    </Paper>
  );
};
