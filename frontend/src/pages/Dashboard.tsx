import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../auth/useAuth';
import { createLog, getLogs } from '../api/logs';
import { connectSocket, disconnectSocket } from '../socket/socket';
import type { LogData } from '../api/logs';

import '../styles/dashboard.css';
import { Header } from '../components/Dashboard/Header/Header';
import { Stats } from '../components/Dashboard/Stats/Stats';
import { LogForm } from '../components/Dashboard/LogForm/LogForm';
import { RecentLogs } from '../components/Dashboard/RecentLogs/RecentLogs';
import MoodChart from '../components/Dashboard/MoodChart/MoodChart';

type FormValues = {
  mood: number;
  anxiety: number;
  sleepHours: number;
  sleepQuality: number;
  physicalActivity: {
    type: string;
    duration: number;
  };
  socialInteractions: number;
  stress: number;
  symptoms: string[];
  notes?: string;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<LogData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  // Load logs on initial render and when user changes
  useEffect(() => {
    const loadLogs = async () => {
      try {
        console.log('Loading logs...');
        const logs = await getLogs();
        console.log('Loaded logs:', logs);
        setLogs(logs);
      } catch (error) {
        console.error('Error loading logs:', error);
      }
    };

    if (user) {
      loadLogs();
    }
  }, [user]);

  // Set up socket connection
  useEffect(() => {
    if (!user) return;
    
    console.log('Setting up socket connection for user:', user.id);
    
    // Make sure we have a valid API URL
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error('VITE_API_URL is not defined in environment variables');
      return;
    }
    
    console.log('Using API URL:', apiUrl);
    const s = connectSocket(apiUrl, user.id);
    
    const handleConnect = () => {
      console.log('Socket connected:', s.id);
      // Join the user's room
      s.emit('join', user.id, (response: any) => {
        console.log('Join room response:', response);
      });
    };
    
    const handleNewLog = (log: LogData) => {
      console.log('Received new log via socket:', log);
      setLogs(prev => {
        // Check if log already exists to prevent duplicates
        const exists = prev.some(l => l.id === log.id);
        if (exists) {
          console.log('Log already exists, skipping:', log.id);
          return prev;
        }
        console.log('Adding new log to state via socket:', log);
        return [log, ...prev];
      });
    };
    
    const handleDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        console.log('Server disconnected, attempting to reconnect...');
        s.connect();
      }
    };
    
    const handleError = (error: any) => {
      console.error('Socket error:', error);
    };
    
    // Set up event listeners
    s.on('connect', handleConnect);
    s.on('disconnect', handleDisconnect);
    s.on('connect_error', handleError);
    s.on('log:new', handleNewLog);
    
    // Log all events for debugging
    s.onAny((event, ...args) => {
      console.log('Socket event:', event, args);
    });
    
    // Initial connection check
    if (s.connected) {
      handleConnect();
    }
    
    return () => {
      console.log('Cleaning up socket listeners');
      s.off('connect', handleConnect);
      s.off('disconnect', handleDisconnect);
      s.off('connect_error', handleError);
      s.off('log:new', handleNewLog);
      s.offAny();
      disconnectSocket();
    };
  }, [user]);

  useEffect(() => {
    getLogs().then(setLogs).catch(console.error);
  }, []);

  const handleFormSubmit = async (values: FormValues): Promise<void> => {
    try {
      // Create a log with all form values
      const logData = {
        ...values,
        symptoms: values.symptoms?.join(', '), // Convert array to string for storage
        activityType: values.physicalActivity.type,
        activityMins: values.physicalActivity.duration,
        socialCount: values.socialInteractions,
        sleepQuality: values.sleepQuality,
        anxiety: values.anxiety,
        mood: values.mood,
        stress: values.stress,
        sleepHours: values.sleepHours,
        date: new Date().toISOString(),
        // Remove the nested physicalActivity object since we've extracted its properties
        physicalActivity: undefined
      } as any; // Temporary type assertion to avoid TypeScript errors
      
      console.log('Submitting log:', logData);
      
      // Close the form immediately to provide better UX
      handleCloseForm();
      
      // Create the log - the socket will handle updating the UI
      await createLog(logData);
      console.log('Log creation request sent');
      
      // The socket event will handle updating the logs state
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
      throw error;
    }
  };

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  // Calculate statistics
  const stats = {
    avgMood: logs.length > 0 
      ? (logs.reduce((sum, log) => sum + (log.mood || 0), 0) / logs.length).toFixed(1)
      : '--',
    avgSleep: logs.length > 0 
      ? (logs.reduce((sum, log) => sum + (log.sleepHours || 0), 0) / logs.length).toFixed(1)
      : '--',
    totalLogs: logs.length,
  };

  // Function to get color based on mood
  const getMoodColor = useCallback((mood?: number) => {
    if (mood === undefined) return '#94a3b8';
    if (mood >= 7) return '#10b981';
    if (mood >= 4) return '#f59e0b';
    return '#ef4444';
  }, []);

  const headerProps = {
    user,
    onLogout: logout,
    onNewEntry: handleOpenForm
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Header {...headerProps} />

        <Stats
          avgMood={stats.avgMood} 
          avgSleep={stats.avgSleep} 
          totalLogs={stats.totalLogs}
          getMoodColor={getMoodColor}
        />
       
        <MoodChart logs={logs} getMoodColor={getMoodColor} />

        <RecentLogs logs={logs} getMoodColor={getMoodColor} />

        <LogForm 
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />

      </div>
    </div>
  );
}
