import React, { useState, useEffect } from 'react';
import { Formik, Form, ErrorMessage as FormikErrorMessage } from 'formik';
import { checkTodaysLog as apiCheckTodaysLog } from '../../../api/logs';
import * as Yup from 'yup';
import {
  Autocomplete,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Slider,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  Backdrop,
  CircularProgress
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ConfirmationDialog } from '../../Common/ConfirmationDialog';
import SaveIcon from '@mui/icons-material/Save';
import MoodIcon from '@mui/icons-material/Mood';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NotesIcon from '@mui/icons-material/Notes';

interface FormLabelWithTooltipProps {
  label: string | React.ReactNode;
  tooltip: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
}

const FormLabelWithTooltip = ({ label, tooltip, variant }: FormLabelWithTooltipProps) => {
  const content = typeof label === 'string' ? (
    <Typography variant={variant} component="span">
      {label}
    </Typography>
  ) : (
    label
  );

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {content}
      <Tooltip title={tooltip} arrow>
        <IconButton size="small" sx={{ p: 0, color: 'text.secondary' }}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export interface LogFormValues {
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
}

export interface LogFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LogFormValues) => void | Promise<void>;
}

const validationSchema = Yup.object({
  mood: Yup.number()
    .min(1, 'Mood must be at least 1')
    .max(10, 'Mood cannot be more than 10')
    .required('Mood is required'),
  anxiety: Yup.number()
    .min(0, 'Anxiety level cannot be negative')
    .max(10, 'Anxiety level cannot be more than 10')
    .required('Anxiety level is required'),
  sleepHours: Yup.number()
    .min(0, 'Sleep hours cannot be negative')
    .max(24, 'Sleep hours cannot be more than 24')
    .required('Sleep hours are required'),
  sleepQuality: Yup.number()
    .min(1, 'Sleep quality must be at least 1')
    .max(5, 'Sleep quality cannot be more than 5')
    .required('Sleep quality is required'),
  physicalActivity: Yup.object({
    type: Yup.string().required('Activity type is required'),
    duration: Yup.number()
      .min(0, 'Duration cannot be negative')
      .max(1440, 'Duration cannot be more than 24 hours')
      .required('Duration is required')
  }),
  socialInteractions: Yup.number()
    .min(0, 'Cannot be negative')
    .max(10, 'Cannot be more than 10')
    .required('Required'),
  stress: Yup.number()
    .min(0, 'Stress level cannot be negative')
    .max(10, 'Stress level cannot be more than 10')
    .required('Stress level is required'),
  symptoms: Yup.array().of(Yup.string()),
  notes: Yup.string().max(500, 'Notes cannot be longer than 500 characters')
});

export const LogForm = ({ open, onClose, onSubmit }: LogFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formKey, setFormKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasLogForToday, setHasLogForToday] = useState<boolean | null>(null);
  const [formValues, setFormValues] = useState<LogFormValues | null>(null);
  const [isCheckingLog, setIsCheckingLog] = useState(false);

  // Check for today's log when modal is opened
  useEffect(() => {
    const checkLog = async () => {
      if (!open) return;
      
      setIsCheckingLog(true);
      try {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const { hasLog } = await apiCheckTodaysLog(today);
        setHasLogForToday(hasLog);
      } catch (error) {
        console.error('Error checking for today\'s log:', error);
        setHasLogForToday(false);
      } finally {
        setIsCheckingLog(false);
        setActiveStep(0);
        setFormKey(prev => prev + 1);
      }
    };

    if (open) {
      // checkLog();
    } else {
      // Reset state when closing the dialog
      setHasLogForToday(null);
      setFormValues(null);
    }
  }, [open]);

  const handleFormSubmit = async (values: LogFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    if (hasLogForToday) {
      setSubmitting(false);
      return;
    }
    setFormValues(values);
    setShowConfirmDialog(true);
    setSubmitting(false);
  };

  const handleConfirmSubmit = async () => {
    if (!formValues) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(formValues);
      setShowConfirmDialog(false);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
    setFormValues(null);
  };

  const initialValues: LogFormValues = {
    mood: 5,
    anxiety: 5,
    sleepHours: 7,
    sleepQuality: 3,
    physicalActivity: {
      type: 'none',
      duration: 0
    },
    socialInteractions: 5,
    stress: 5,
    symptoms: [],
    notes: ''
  };

  const activityTypes = [
    { value: 'none', label: 'None' },
    { value: 'walking', label: 'Walking' },
    { value: 'running', label: 'Running' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'gym', label: 'Gym' },
    { value: 'other', label: 'Other' },
  ];

  // activeStep is now defined at the top of the component

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const steps = [
    { label: 'Mood', icon: <MoodIcon /> },
    { label: 'Sleep', icon: <BedtimeIcon /> },
    { label: 'Physical Activity', icon: <FitnessCenterIcon /> },
    { label: 'Symptoms and Notes', icon: <MedicalServicesIcon /> },
  ];

  const [symptomsList] = useState<string[]>([
    'Headache',
    'Nausea',
    'Dizziness',
    'Fatigue',
    'Anxiety',  
    'Insomnia',
    'Muscle Pain',
    'Joint Pain',
    'Digestive Issues',
    'Migraine',
    'Back Pain',
    'Stomach Pain',
    'Drowsiness',
    'Dry Mouth',
    'Appetite Changes'
  ]);

  const theme = useTheme();

  if (isCheckingLog) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box p={4} textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Checking for today's log...</Typography>
        </Box>
      </Dialog>
    );
  }

  if (hasLogForToday) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Already Logged Today</DialogTitle>
        <DialogContent>
          <Typography>You've already submitted a log for today. You can only submit one log per day.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  return (
    <>
      <Backdrop
        sx={{ 
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)'
        }}
        open={isSubmitting}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          p={4}
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow={24}
        >
          <CircularProgress color="primary" size={60} />
          <Typography variant="h6" color="text.primary">
            Saving your log...
          </Typography>
        </Box>
      </Backdrop>

      <ConfirmationDialog
        open={showConfirmDialog}
        title="Confirm submission"
        message="Are you sure you want to submit this log?"
        confirmText="Yes, submit"
        cancelText="No, go back"
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        loading={isSubmitting}
      />
    <Dialog 
      key={`form-dialog-${formKey}`}
      open={open} 
      onClose={isSubmitting ? undefined : onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[4],
          bgcolor: 'background.paper',
          opacity: isSubmitting ? 0.7 : 1,
          transition: 'opacity 0.3s',
          pointerEvents: isSubmitting ? 'none' : 'auto'
        }
      }}
    >
      <Formik
        key={`formik-${formKey}`}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, errors, isSubmitting }) => (
          <Form>
            <DialogTitle sx={{ 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              py: 2,
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              typography: 'h6',
              fontWeight: 600
            }}>
              <MoodIcon />
              New Daily Entry
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, '&.MuiDialogContent-root': { p: 0 } }}>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel
                sx={{ 
                  p: 3, 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  '& .MuiStepLabel-root': {
                    cursor: 'pointer',
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: 'primary.main',
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: 'success.main',
                  },
                }}
              >
                {steps.map((step, index) => (
                  <Step key={step.label} onClick={() => setActiveStep(index)}>
                    <StepLabel 
                      StepIconComponent={({ active, completed }) => (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: active ? 'primary.main' : completed ? 'success.main' : 'action.selected',
                            color: active || completed ? 'primary.contrastText' : 'text.secondary',
                          }}
                        >
                          {React.cloneElement(step.icon, {
                            sx: { fontSize: 16 },
                            color: active || completed ? 'inherit' : 'action'
                          })}
                        </Box>
                      )}
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ p: 3, maxHeight: '60vh', overflowY: 'auto' }}>
                <Grid container spacing={0}>
                {/* Mood - Step 1 */}
                <Grid sx={{ 
                  p: 3,
                  display: activeStep === 0 ? 'block' : 'none'
                }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <MoodIcon color="primary" sx={{ mr: 1.5, fontSize: 28, color: 'primary.main' }} />
                        <FormLabelWithTooltip 
                          label={
                            <Typography variant="subtitle1" component="span" fontWeight={600}>
                              Mood: {values.mood}/10
                            </Typography>
                          }
                          tooltip="Rate your overall mood from 1 (very bad) to 10 (excellent)"
                        />
                      </Box>
                      <Box sx={{ pl: 1, pr: 2 }}>
                        <Slider
                          name="mood"
                          value={values.mood}
                          min={1}
                          max={10}
                          step={1}
                          onChange={(_, value) => setFieldValue('mood', value as number)}
                          valueLabelDisplay="auto"
                          aria-labelledby="mood-slider"
                          sx={{
                            color: 'primary.main',
                            height: 6,
                            '& .MuiSlider-thumb': {
                              width: 16,
                              height: 16,
                              '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                              },
                            },
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={0.5}>
                          <Typography variant="caption" color="text.secondary">😞 1</Typography>
                          <Typography variant="caption" color="text.secondary">😐 5</Typography>
                          <Typography variant="caption" color="text.secondary">😊 10</Typography>
                        </Box>
                        <FormikErrorMessage name="mood">
                          {msg => (
                            <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                              {msg}
                            </Typography>
                          )}
                        </FormikErrorMessage>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Anxiety - Step 1 */}
                <Grid sx={{ 
                  p: 3, 
                  display: activeStep === 0 ? 'block' : 'none'
                }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PsychologyIcon color="primary" sx={{ mr: 1, fontSize: 24 }} />
                        <FormLabelWithTooltip 
                          label={
                            <Typography variant="subtitle1" component="span" fontWeight={600}>
                              Anxiety: {values.anxiety}/10
                            </Typography>
                          }
                          tooltip="Rate your anxiety level from 0 (none) to 10 (severe)"
                        />
                      </Box>
                      <Box sx={{ pl: 1, pr: 2 }}>
                        <Slider
                          name="anxiety"
                          value={values.anxiety}
                          min={0}
                          max={10}
                          step={1}
                          onChange={(_, value) => setFieldValue('anxiety', value as number)}
                          valueLabelDisplay="auto"
                          aria-labelledby="anxiety-slider"
                          sx={{
                            color: 'secondary.main',
                            height: 6,
                            '& .MuiSlider-thumb': {
                              width: 16,
                              height: 16,
                              '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.secondary.main, 0.16)}`,
                              },
                            },
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={0.5}>
                          <Typography variant="caption" color="text.secondary">None</Typography>
                          <Typography variant="caption" color="text.secondary">Moderate</Typography>
                          <Typography variant="caption" color="text.secondary">Severe</Typography>
                        </Box>
                        <FormikErrorMessage name="anxiety">
                          {msg => (
                            <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                              {msg}
                            </Typography>
                          )}
                        </FormikErrorMessage>
                      </Box>
                    </Box>
                  </Grid>

                {/* Sleep Hours - Step 2 */}
                <Grid sx={{ 
                  p: 3,
                  display: activeStep === 1 ? 'block' : 'none'
                }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <BedtimeIcon sx={{ mr: 1.5, fontSize: 28, color: 'info.main' }} />
                        <FormLabelWithTooltip 
                          label={
                            <Typography variant="subtitle1" component="span" fontWeight={600}>
                              Sleep Time: {values.sleepHours}h
                            </Typography>
                          }
                          tooltip="Total hours of sleep you got last night (0-24 hours)"
                        />
                      </Box>
                      <Box sx={{ pl: 1, pr: 2 }}>
                        <Slider
                          name="sleepHours"
                          value={values.sleepHours}
                          min={0}
                          max={24}
                          step={0.5}
                          onChange={(_, value) => setFieldValue('sleepHours', value)}
                          valueLabelDisplay="auto"
                          aria-labelledby="sleep-hours-slider"
                          sx={{
                            color: 'info.main',
                            height: 6,
                            '& .MuiSlider-thumb': {
                              width: 16,
                              height: 16,
                              '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.info.main, 0.16)}`,
                              },
                            },
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={0.5}>
                          <Typography variant="caption" color="text.secondary">0h</Typography>
                          <Typography variant="caption" color="text.secondary">6h</Typography>
                          <Typography variant="caption" color="text.secondary">12h</Typography>
                          <Typography variant="caption" color="text.secondary">24h</Typography>
                        </Box>
                        <FormikErrorMessage name="sleepHours">
                          {msg => (
                            <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                              {msg}
                            </Typography>
                          )}
                        </FormikErrorMessage>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Sleep Quality - Step 2 */}
                <Grid sx={{ 
                  p: 3,
                  display: activeStep === 1 ? 'block' : 'none'
                }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <BedtimeIcon sx={{ mr: 1.5, fontSize: 28, color: 'info.main' }} />
                        <FormLabelWithTooltip 
                          label={
                            <Typography variant="subtitle1" component="span" fontWeight={600}>
                              Sleep Quality: {values.sleepQuality}/5
                            </Typography>
                          }
                          tooltip="Rate the quality of your sleep from 1 (poor) to 5 (excellent)"
                        />
                      </Box>
                      <Box sx={{ pl: 1, pr: 2 }}>
                        <Slider
                          name="sleepQuality"
                          value={values.sleepQuality}
                          min={1}
                          max={5}
                          step={1}
                          onChange={(_, value) => setFieldValue('sleepQuality', value)}
                          valueLabelDisplay="auto"
                          aria-labelledby="sleep-quality-slider"
                          sx={{
                            color: 'info.dark',
                            height: 6,
                            '& .MuiSlider-thumb': {
                              width: 16,
                              height: 16,
                              '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.info.dark, 0.16)}`,
                              },
                            },
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={0.5}>
                          <Typography variant="caption" color="text.secondary">😴 Poor</Typography>
                          <Typography variant="caption" color="text.secondary">😊 Good</Typography>
                        </Box>
                        <FormikErrorMessage name="sleepQuality">
                          {msg => (
                            <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                              {msg}
                            </Typography>
                          )}
                        </FormikErrorMessage>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Physical Activity - Step 3 */}
                <Grid sx={{ 
                  p: 3,
                  display: activeStep === 2 ? 'block' : 'none'
                }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <FitnessCenterIcon sx={{ mr: 1.5, fontSize: 28, color: 'warning.main' }} />
                        <Typography variant="subtitle1" fontWeight={600}>Physical Activity</Typography>
                      </Box>
                      <Box sx={{ pl: 1 }}>
                        <Grid container spacing={2}>
                          <Grid>
                            <FormControl fullWidth size="small">
                              <FormLabelWithTooltip 
                                label={
                                  <Typography variant="body2" color="text.secondary">
                                    Activity Type
                                  </Typography>
                                }
                                tooltip="Select the type of physical activity you did today"
                              />
                              <Select
                                name="physicalActivity.type"
                                value={values.physicalActivity.type}
                                onChange={(e) => setFieldValue('physicalActivity.type', e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                  },
                                }}
                              >
                                {activityTypes.map((type) => (
                                  <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid>
                            <TextField
                              style={{
                                marginTop: '20px',
                              }}
                              fullWidth
                              type="number"
                              name="physicalActivity.duration"
                              label={
                                <FormLabelWithTooltip 
                                  label="Duration" 
                                  tooltip="How many minutes you spent on this activity"
                                />
                              }
                              value={values.physicalActivity.duration || ''}
                              onChange={(e) => setFieldValue('physicalActivity.duration', Number(e.target.value) || 0)}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                endAdornment: <InputAdornment position="end">min</InputAdornment>,
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Social Interactions - Step 1 */}
                <Grid sx={{ 
                  p: 3,
                  display: activeStep === 0 ? 'block' : 'none'
                }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <GroupsIcon sx={{ mr: 1.5, fontSize: 28, color: 'success.main' }} />
                        <FormLabelWithTooltip 
                          label={
                            <Typography variant="subtitle1" component="span" fontWeight={600}>
                              Social: {values.socialInteractions}/10
                            </Typography>
                          }
                          tooltip="Rate your social interactions from 0 (none) to 10 (very social)"
                        />
                      </Box>
                      <Box sx={{ pl: 1, pr: 2 }}>
                        <Slider
                          name="socialInteractions"
                          value={values.socialInteractions}
                          min={0}
                          max={10}
                          step={1}
                          onChange={(_, value) => setFieldValue('socialInteractions', value)}
                          valueLabelDisplay="auto"
                          aria-labelledby="social-slider"
                          sx={{
                            color: 'success.main',
                            height: 6,
                            '& .MuiSlider-thumb': {
                              width: 16,
                              height: 16,
                              '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
                              },
                            },
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={0.5}>
                          <Typography variant="caption" color="text.secondary">None</Typography>
                          <Typography variant="caption" color="text.secondary">Some</Typography>
                          <Typography variant="caption" color="text.secondary">A lot</Typography>
                        </Box>
                        <FormikErrorMessage name="socialInteractions">
                          {msg => (
                            <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                              {msg}
                            </Typography>
                          )}
                        </FormikErrorMessage>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Stress Level - Step 1 */}
                <Grid sx={{ 
                  p: 3,
                  display: activeStep === 0 ? 'block' : 'none'
                }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PsychologyIcon color="primary" sx={{ mr: 1, fontSize: 24 }} />
                        <FormLabelWithTooltip 
                          label={
                            <Typography variant="subtitle1" component="span" fontWeight={600}>
                              Stress: {values.stress}/10
                            </Typography>
                          }
                          tooltip="Rate your stress level from 0 (no stress) to 10 (extreme stress)"
                        />
                      </Box>
                      <Box sx={{ pl: 1, pr: 2 }}>
                        <Slider
                          name="stress"
                          value={values.stress}
                          min={0}
                          max={10}
                          step={1}
                          onChange={(_, value) => setFieldValue('stress', value)}
                          valueLabelDisplay="auto"
                          aria-labelledby="stress-slider"
                          sx={{
                            color: 'error.main',
                            height: 6,
                            '& .MuiSlider-thumb': {
                              width: 16,
                              height: 16,
                              '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.error.main, 0.16)}`,
                              },
                            },
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={0.5}>
                          <Typography variant="caption" color="text.secondary">Low</Typography>
                          <Typography variant="caption" color="text.secondary">Medium</Typography>
                          <Typography variant="caption" color="text.secondary">High</Typography>
                        </Box>
                        <FormikErrorMessage name="stress">
                          {msg => (
                            <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                              {msg}
                            </Typography>
                          )}
                        </FormikErrorMessage>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Symptoms - Step 4 */}
                <Grid sx={{ 
                  p: 3, 
                  display: activeStep === 3 ? 'block' : 'none'
                }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <MedicalServicesIcon sx={{ mr: 1.5, fontSize: 28, color: 'error.main' }} />
                        <Typography variant="subtitle1" fontWeight={600}>Symptoms</Typography>
                      </Box>
                      <Box sx={{ pl: 1 }}>
                        <Autocomplete
                          multiple
                          id="symptoms-autocomplete"
                          options={symptomsList}
                          value={values.symptoms}
                          onChange={(_, newValue) => {
                            setFieldValue('symptoms', newValue);
                          }}
                          renderTags={(value: string[], getTagProps) =>
                            value.map((option: string, index: number) => (
                              <Chip
                                label={option}
                                {...getTagProps({ index })}
                                sx={{
                                  '&.MuiChip-filled': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                      backgroundColor: 'primary.main',
                                    },
                                  },
                                  m: 0.5,
                                }}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder="Add symptoms..."
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                },
                              }}
                            />
                          )}
                          fullWidth
                          freeSolo
                          autoSelect
                          filterSelectedOptions
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                          Type to search or select from the list
                        </Typography>
                        <FormikErrorMessage name="symptoms">
                          {msg => (
                            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                              {msg}
                            </Typography>
                          )}
                        </FormikErrorMessage>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Notes - Step 4 */}
                <Grid sx={{ 
                  p: 3,
                  display: activeStep === 3 ? 'block' : 'none'
                }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <NotesIcon sx={{ mr: 1.5, fontSize: 28, color: 'info.dark' }} />
                        <Typography variant="subtitle1" fontWeight={600}>Additional Notes</Typography>
                      </Box>
                      <Box sx={{ pl: 1 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          name="notes"
                          value={values.notes}
                          onChange={(e) => setFieldValue('notes', e.target.value)}
                          placeholder="Add any additional notes about your day..."
                          variant="outlined"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: 'primary.main',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                              },
                            },
                          }}
                        />
                        <FormikErrorMessage name="notes">
                          {msg => (
                            <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                              {msg}
                            </Typography>
                          )}
                        </FormikErrorMessage>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ textTransform: 'none' }}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={Object.keys(errors).length > 0 || isSubmitting}
                    endIcon={<SaveIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNext();
                    }}
                    sx={{
                      textTransform: 'none',
                      '&.Mui-disabled': {
                        backgroundColor: 'action.disabledBackground',
                        color: 'action.disabled',
                      },
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '&:active': {
                        backgroundColor: 'primary.dark',
                        boxShadow: 'none',
                      },
                      '&:focus': {
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} sx={{ textTransform: 'none' }}>Cancel</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
    </>
  );
};
