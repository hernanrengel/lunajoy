import type { SxProps, Theme } from '@mui/material';

export interface FormStep {
  label: string;
  icon: React.ReactNode;
}

export interface FormFieldProps {
  name: string;
  label: string;
  tooltip?: string;
  type?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  sx?: SxProps<Theme>;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

export interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export interface FormSliderProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  valueLabelDisplay?: 'on' | 'auto' | 'off';
  marks?: { value: number; label: string }[];
  sx?: SxProps<Theme>;
}

export interface FormValues {
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

export interface FormActionsProps {
  activeStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasErrors: boolean;
}
