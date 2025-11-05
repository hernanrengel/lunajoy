import { useState, useMemo, useEffect } from 'react';
import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, Area, AreaChart, Brush
} from 'recharts';
import { 
  Box, Button, ButtonGroup, FormControl, InputLabel, 
  MenuItem, Typography, Paper, Stack
} from '@mui/material';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Download as DownloadIcon,
  FilterAlt as FilterIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon
} from '@mui/icons-material';
import type { LogData } from '../../../api/logs';

interface ChartMetric {
  key: string;
  name: string;
  color: string;
  visible: boolean;
  type: 'line' | 'area';
  yAxisId?: string;
}

interface MoodChartProps {
  logs: LogData[];
  getMoodColor: (mood: number) => string;
}

const MoodChart = ({ logs, getMoodColor }: MoodChartProps) => {
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'month' | 'week' | 'all' | 'custom'>('7days');
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 6));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [chartKey, setChartKey] = useState(0); // Add this line to force chart re-render
  
  const [metrics, setMetrics] = useState<ChartMetric[]>([
    { key: 'mood', name: 'Mood', color: '#4caf50', visible: true, type: 'line' },
    { key: 'anxiety', name: 'Anxiety', color: '#9c27b0', visible: true, type: 'line' },
    { key: 'stress', name: 'Stress', color: '#f44336', visible: true, type: 'line' },
    { key: 'sleepQuality', name: 'Sleep Quality', color: '#2196f3', visible: true, type: 'line', yAxisId: 'right' },
    { key: 'sleepHours', name: 'Sleep Hours', color: '#00bcd4', visible: true, type: 'line', yAxisId: 'right' },
  ]);

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
    { value: 'custom', label: 'Custom range' },
  ];

  // Update date range when dateRange changes
  useEffect(() => {
    if (dateRange === 'custom') return;
    
    let newStartDate: Date;
    let newEndDate = new Date();
    
    if (dateRange === '7days') {
      newStartDate = subDays(newEndDate, 6);
    } else if (dateRange === '30days') {
      newStartDate = subDays(newEndDate, 29);
    } else if (dateRange === 'month') {
      newStartDate = startOfMonth(newEndDate);
      newEndDate = endOfMonth(newEndDate);
    } else if (dateRange === 'week') {
      newStartDate = startOfWeek(newEndDate, { locale: enUS });
      newEndDate = endOfWeek(newEndDate, { locale: enUS });
    } else {
      return;
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, [dateRange]);
  
  // Filter and sort logs by date range
  const filteredLogs = useMemo(() => {
    // Sort logs by date (oldest first)
    const sorted = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Return all logs if no date range is set
    if (!startDate || !endDate) {
      return sorted;
    }

    // Set time to start and end of day for proper date comparison
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    // Filter logs within the date range
    return sorted.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= start && logDate <= end;
    });
  }, [logs, startDate, endDate]);
  
  // Process the data for the chart
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    const processData = () => {
      const result = filteredLogs.map((log, index) => {
        const dataPoint: any = {
          id: log.id ? `${log.id}` : `${log.date}-${index}`,
          date: log.date,
          formattedDate: format(new Date(log.date), 'MMM d, yyyy')
        };
        
        // Add all metrics to the data point
        metrics.forEach(metric => {
          dataPoint[metric.key] = log[metric.key as keyof LogData] !== undefined 
            ? Number(log[metric.key as keyof LogData]) 
            : null;
        });
        
        return dataPoint;
      });
      
      setChartData(result);
      setChartKey(prev => prev + 1); // Force chart re-render
    };
    
    processData();
  }, [filteredLogs, metrics]);
  
  // Calculate moving average for smoother lines
  const [smoothData, setSmoothData] = useState<any[]>([]);
  
  useEffect(() => {
    if (chartData.length <= 3) {
      setSmoothData(chartData);
      return;
    }
    
    const smoothed = chartData.map((point, index) => {
      const newPoint = { ...point };
      const windowSize = Math.min(3, chartData.length - 1);
      const start = Math.max(0, index - Math.floor(windowSize / 2));
      const end = Math.min(chartData.length - 1, start + windowSize - 1);
      
      metrics.forEach(metric => {
        if (!metric.visible) return;
        
        const values = [];
        for (let i = start; i <= end; i++) {
          if (chartData[i][metric.key] !== null) {
            values.push(chartData[i][metric.key]);
          }
        }
        
        if (values.length > 0) {
          const sum = values.reduce((a, b) => a + b, 0);
          newPoint[`${metric.key}Smooth`] = sum / values.length;
        }
      });
      
      return newPoint;
    });
    
    setSmoothData(smoothed);
  }, [chartData]);
  
  const toggleMetric = (key: string) => {
    setMetrics(metrics.map(metric => 
      metric.key === key ? { ...metric, visible: !metric.visible } : metric
    ));
  };
  
  const handleDateRangeChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value as '7days' | '30days' | 'month' | 'all' | 'custom');
  };
  
  const handleExport = () => {
    const headers = ['Date', ...metrics.filter(m => m.visible).map(m => m.name)];
    const csvContent = [
      headers.join(','),
      ...chartData.map(row => 
        [
          `"${format(new Date(row.date), 'yyyy-MM-dd HH:mm')}"`,
          ...metrics
            .filter(m => m.visible)
            .map(m => row[m.key] ?? '')
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-tracker-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMetricLine = (metric: ChartMetric) => {
    if (!metric.visible) return null;
    
    const commonProps = {
      key: metric.key,
      dataKey: chartType === 'line' && smoothData.length > 3 ? `${metric.key}Smooth` : metric.key,
      name: metric.name,
      stroke: metric.color,
      activeDot: { r: 6, strokeWidth: 2, stroke: '#fff' },
      strokeWidth: 2.5,
      isAnimationActive: false,
      connectNulls: true,
      dot: { r: 3, strokeWidth: 1 },
      yAxisId: metric.yAxisId,
    };
    
    if (chartType === 'area') {
      return (
        <Area
          {...commonProps}
          fill={metric.color}
          fillOpacity={0.2}
          stroke={metric.color}
          type="monotone"
        />
      );
    }
    
    return <Line type="monotone" {...commonProps} />;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
        <Typography variant="h5" component="h3">Trends</Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <ButtonGroup variant="outlined" size="small" sx={{ mr: 2 }}>
            <Button
              variant={chartType === 'line' ? 'contained' : 'outlined'}
              onClick={() => setChartType('line')}
              startIcon={<LineChartIcon />}
            >
              Line
            </Button>
            <Button
              variant={chartType === 'area' ? 'contained' : 'outlined'}
              onClick={() => setChartType('area')}
              startIcon={<BarChartIcon />}
            >
              Area
            </Button>
          </ButtonGroup>
          
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="outlined" 
            size="small"
            startIcon={<FilterIcon />}
          >
            Filters
          </Button>
          
          <Button 
            onClick={handleExport}
            variant="outlined" 
            size="small"
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
        </Box>
      </Box>
      
      {showFilters && (
        <Box mb={2} p={2} bgcolor="action.hover" borderRadius={1}>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 180, mr: 2 }}>
              <InputLabel id="date-range-label">Date Range</InputLabel>
              <Select
                labelId="date-range-label"
                value={dateRange}
                label="Date Range"
                onChange={handleDateRangeChange}
              >
                {dateRangeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {dateRange === 'custom' && (
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                    setDateRange('custom');
                  }}
                  maxDate={endDate || undefined}
                  slotProps={{ textField: { size: 'small', sx: { width: 180 } } }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                    setDateRange('custom');
                  }}
                  minDate={startDate || undefined}
                  maxDate={new Date()}
                  slotProps={{ textField: { size: 'small', sx: { width: 180 } } }}
                />
              </LocalizationProvider>
            )}
            
            <Box flexGrow={1} />
            
            <Box display="flex" gap={1} flexWrap="wrap" justifyContent="flex-end">
              {metrics.map(metric => (
                <Button
                  key={metric.key}
                  size="small"
                  onClick={() => toggleMetric(metric.key)}
                  startIcon={metric.visible ? <ToggleOnIcon /> : <ToggleOffIcon />}
                  sx={{
                    color: metric.visible ? metric.color : 'text.secondary',
                    borderColor: metric.visible ? `${metric.color}40` : 'divider',
                    '&:hover': {
                      borderColor: metric.color,
                      backgroundColor: `${metric.color}10`
                    }
                  }}
                  variant={metric.visible ? 'outlined' : 'text'}
                >
                  {metric.name}
                </Button>
              ))}
            </Box>
          </Stack>
        </Box>
      )}
      
      <Box sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer width="100%" height={400} key={`chart-container-${chartKey}`}>
          <AreaChart
            key={`chart-${smoothData.length}-${Date.now()}`}
            data={smoothData}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getMoodColor(7)} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={getMoodColor(7)} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#9c27b0" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f44336" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f44336" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
              tickMargin={10}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
              padding={{ left: 20, right: 20 }}
            />
            
            <YAxis 
              yAxisId="left"
              domain={[0, 10]}
              tickCount={6}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => Math.floor(value) === value ? value.toString() : ''}
            />
            
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, 10]}
              tickCount={6}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => Math.floor(value) === value ? value.toString() : ''}
            />
            
            <Tooltip 
              labelFormatter={(date) => format(new Date(date), 'EEEE, d MMMM yyyy', { locale: enUS })}
              formatter={(value: number, name: string) => {
                const metric = metrics.find(m => m.name === name || m.key === name.replace('Smooth', ''));
                const formattedValue = Number(value).toFixed(1);
                return [formattedValue, metric?.name || name];
              }}
              labelStyle={{ 
                color: '#333', 
                fontWeight: 'bold',
                marginBottom: '8px',
                textTransform: 'capitalize'
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              itemStyle={{ padding: '4px 0' }}
            />
            
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                const metric = metrics.find(m => m.key === value.replace('Smooth', ''));
                return metric?.name || value;
              }}
            />
            
            <Brush 
              dataKey="date"
              height={30}
              stroke="#8884d8"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
            />
            
            {/* Reference lines for better readability */}
            <ReferenceLine y={5} yAxisId="left" stroke="#e0e0e0" strokeDasharray="3 3" />
            
            {/* Render all visible metrics */}
            {metrics.map(metric => renderMetricLine(metric))}
            
            {/* Add average lines */}
            {metrics.filter(m => m.visible).map(metric => {
              const values = chartData
                .map(d => d[metric.key])
                .filter((v): v is number => v !== null && !isNaN(v));
                
              if (values.length === 0) return null;
              
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              
              return (
                <ReferenceLine
                  key={`avg-${metric.key}`}
                  y={avg}
                  yAxisId={metric.yAxisId || 'left'}
                  stroke={metric.color}
                  strokeDasharray="3 3"
                  strokeOpacity={0.7}
                  label={{
                    value: `Avg: ${avg.toFixed(1)}`,
                    position: 'insideBottomRight',
                    fill: metric.color,
                    fontSize: 12,
                  }}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MoodChart;
