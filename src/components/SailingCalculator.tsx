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

const SailingCalculator: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [settings, setSettings] = useState<Settings>({
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
  });

  const validationSchema = Yup.object({
    startTime: Yup.date().required('Starttijd is verplicht'),
    arrivalTime: Yup.date()
      .required('Aankomsttijd is verplicht')
      .test('is-after-start', 'Aankomsttijd moet na de starttijd zijn', function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        return true;
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
        if (!sailSpeed || !value) return true;
        return value > sailSpeed;
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

  const handleSettingsUpdate = (newSettings: Settings) => {
    setSettings(newSettings);
    formikRef.current?.resetForm({
      values: {
        startTime: parseTimeString(newSettings.defaultStartTime),
        arrivalTime: parseTimeString(newSettings.defaultArrivalTime),
        distance: newSettings.defaultDistance,
        sailSpeed: newSettings.defaultSailSpeed,
        motorSpeed: newSettings.defaultMotorSpeed,
        useMetric: newSettings.useMetric,
      },
    });
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
