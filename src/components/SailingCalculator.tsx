// src/components/SailingCalculator.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import nlLocale from 'date-fns/locale/nl';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { calculateSailingPlan } from '../utils/calculations';
import SettingsDialog from './SettingsDialog';
import SailingForm from './SailingForm';

interface Settings {
  useMetric: boolean;
  maxDistance: number;
  maxSailSpeed: number;
  maxMotorSpeed: number;
  fuelConsumption: number;
  defaultStartTime: string;
  defaultArrivalTime: string;
  defaultDistance: number;
  defaultSailSpeed: number;
  defaultMotorSpeed: number;
}

const SETTINGS_KEY = 'sailingCalculatorSettings';

const SailingCalculator: React.FC = () => {
  const [result, setResult] = useState<string>('');
  
  const loadSettings = (): Settings => {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    return storedSettings ? JSON.parse(storedSettings) : {
      useMetric: false,
      maxDistance: 1000,
      maxSailSpeed: 20,
      maxMotorSpeed: 30,
      fuelConsumption: 5,
      defaultStartTime: '08:00',
      defaultArrivalTime: '12:00',
      defaultDistance: 25,
      defaultSailSpeed: 5,
      defaultMotorSpeed: 8,
    };
  };

  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    document.title = 'SailingCalculator';
  }, []);

  const saveSettings = (newSettings: Settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const handleSettingsUpdate = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);

    // Trigger a recalculation using the current form values
    if (formikRef.current) {
      const currentValues = formikRef.current.values;
      handleCalculate(currentValues);
    }
  };

  const validationSchema = Yup.object({
    startTime: Yup.date().required('Starttijd is verplicht'),
    arrivalTime: Yup.date()
      .required('Aankomsttijd is verplicht')
      .test('is-after-start', 'Aankomsttijd moet na de starttijd zijn', function (value) {
        const { startTime } = this.parent;
        return startTime && value ? value > startTime : true;
      }),
    distance: Yup.number()
      .required('Afstand is verplicht')
      .positive('Afstand moet groter zijn dan 0')
      .max(settings.maxDistance, `Afstand moet kleiner zijn dan ${settings.maxDistance}`),
    sailSpeed: Yup.number()
      .required('Zeilsnelheid is verplicht')
      .positive('Zeilsnelheid moet groter zijn dan 0')
      .max(settings.maxSailSpeed, `Zeilsnelheid moet kleiner zijn dan ${settings.maxSailSpeed}`),
    motorSpeed: Yup.number()
      .required('Motorsnelheid is verplicht')
      .positive('Motorsnelheid moet groter zijn dan 0')
      .max(settings.maxMotorSpeed, `Motorsnelheid moet kleiner zijn dan ${settings.maxMotorSpeed}`)
      .test('is-greater-than-sailSpeed', 'Motorsnelheid moet groter zijn dan zeilsnelheid', function (value) {
        const { sailSpeed } = this.parent;
        return sailSpeed && value ? value > sailSpeed : true;
      }),
  });

  const formikRef = useRef<FormikProps<any>>(null);

  const parseTimeString = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setFullYear(2000, 0, 1);
    return date;
  };

  const handleCalculate = (values: any) => {
    const resultText = calculateSailingPlan({
      ...values,
      settings,
    });
    setResult(resultText);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nlLocale}>
      <Typography variant="h4" align="center" gutterBottom>
        Zeilen of Motor Berekening
        <SettingsDialog settings={settings} onUpdate={handleSettingsUpdate} />
      </Typography>
      <Formik
        innerRef={formikRef}
        initialValues={{
          startTime: parseTimeString(settings.defaultStartTime),
          arrivalTime: parseTimeString(settings.defaultArrivalTime),
          distance: settings.defaultDistance,
          sailSpeed: settings.defaultSailSpeed,
          motorSpeed: settings.defaultMotorSpeed,
          useMetric: settings.useMetric,
        }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {(formikProps) => {
          const { values } = formikProps;

          useEffect(() => {
            if (formikProps.isValid) {
              handleCalculate(formikProps.values);
            } else {
              setResult('');
            }
          }, [values, formikProps.isValid]);

          return (
            <Form>
              <SailingForm formikProps={formikProps} settings={settings} />
            </Form>
          );
        }}
      </Formik>
      {result && (
        <>
          <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
            Uitkomst
          </Typography>
          <Typography variant="body1">
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </Typography>
        </>
      )}
    </LocalizationProvider>
  );
};

export default SailingCalculator;
