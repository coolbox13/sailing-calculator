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
  defaultFuelConsumption: number;
  defaultDistance: number;
  defaultSailSpeed: number;
  defaultMotorSpeed: number;
}

const SETTINGS_KEY = 'sailingCalculatorSettings';

const SailingCalculator: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [settings, setSettings] = useState<Settings>(() => {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    const parsedSettings = storedSettings
      ? JSON.parse(storedSettings)
      : {
          useMetric: false,
          maxDistance: 1000,
          maxSailSpeed: 20,
          maxMotorSpeed: 30,
          defaultFuelConsumption: 5,
          defaultDistance: 25,
          defaultSailSpeed: 5,
          defaultMotorSpeed: 8,
        };
    console.log('Loaded settings from storage:', parsedSettings);
    return parsedSettings;
  });

  const saveSettings = (newSettings: Settings) => {
    const settingsToSave = {
      useMetric: newSettings.useMetric,
      maxDistance: newSettings.maxDistance,
      maxSailSpeed: newSettings.maxSailSpeed,
      maxMotorSpeed: newSettings.maxMotorSpeed,
      defaultFuelConsumption: newSettings.defaultFuelConsumption,
      defaultDistance: newSettings.defaultDistance,
      defaultSailSpeed: newSettings.defaultSailSpeed,
      defaultMotorSpeed: newSettings.defaultMotorSpeed,
    };
    console.log('Saving settings to storage:', settingsToSave);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsToSave));
  };

  const handleSettingsUpdate = (newSettings: Settings) => {
    console.log('Updating settings:', newSettings);
    setSettings(newSettings);
    saveSettings(newSettings);
    formikRef.current?.setFieldValue('fuelConsumption', newSettings.defaultFuelConsumption);
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
    fuelConsumption: Yup.number()
      .required('Brandstofverbruik is verplicht')
      .positive('Brandstofverbruik moet groter zijn dan 0')
      .max(50, 'Brandstofverbruik moet kleiner zijn dan 50 liter/uur'),
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

  const getCurrentTime = (): Date => {
    const now = new Date();
    now.setSeconds(0, 0); // Reset seconds and milliseconds
    return now;
  };

  const getRoundedArrivalTime = (): Date => {
    const now = getCurrentTime();
    const arrivalTime = new Date(now);
    arrivalTime.setHours(arrivalTime.getHours() + 4);
    arrivalTime.setMinutes(0, 0, 0); // Round to the next whole hour
    return arrivalTime;
  };

  const handleCalculate = (values: any) => {
    console.log('Calculating with values:', values);
    const resultText = calculateSailingPlan({
      ...values,
      settings: { ...settings, fuelConsumption: values.fuelConsumption || settings.defaultFuelConsumption },
    });
    console.log('Calculated result:', resultText);
    setResult(resultText);
  };

  useEffect(() => {
    document.title = 'SailingCalculator';
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nlLocale}>
      <Typography variant="h4" align="center" gutterBottom>
        Zeilen of Motoren
        <SettingsDialog settings={settings} onUpdate={handleSettingsUpdate} />
      </Typography>
      <Formik
        innerRef={formikRef}
        initialValues={{
          startTime: getCurrentTime(),
          arrivalTime: getRoundedArrivalTime(),
          distance: settings.defaultDistance,
          fuelConsumption: settings.defaultFuelConsumption,
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
            console.log("Recalculation triggered:");
            console.log("startTime:", values.startTime);
            console.log("arrivalTime:", values.arrivalTime);
            console.log("distance:", values.distance);
            console.log("fuelConsumption:", values.fuelConsumption);
            console.log("sailSpeed:", values.sailSpeed);
            console.log("motorSpeed:", values.motorSpeed);
            console.log("useMetric:", values.useMetric);

            if (formikProps.isValid) {
              handleCalculate(formikProps.values);
            } else {
              setResult('');
            }
          }, [values.startTime, values.arrivalTime, values.distance, values.fuelConsumption, values.sailSpeed, values.motorSpeed, values.useMetric, formikProps.isValid]);

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
          <Typography variant="body1" component="div">
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </Typography>
        </>
      )}
    </LocalizationProvider>
  );
};

export default SailingCalculator;
