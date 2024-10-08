/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/SailingForm.tsx

import React from 'react';
import { TextField, Grid, Switch, FormControlLabel, IconButton } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Field, FormikProps } from 'formik';
import { Add, Remove } from '@mui/icons-material';

interface SailingFormProps {
  formikProps: FormikProps<any>;
  settings: any;
}

const SailingForm: React.FC<SailingFormProps> = ({ formikProps, settings }) => {
  const { values, errors, touched, setFieldValue } = formikProps;

  const handleIncrement = (fieldName: string, increment: number) => {
    const currentValue = values[fieldName];
    const newValue = Math.round((currentValue + increment) * 10) / 10; // Round to one decimal place
    setFieldValue(fieldName, newValue);
  };

  const renderNumericField = (name: string, label: string, min = 0, max = 100) => (
    <Field name={name}>
      {({ field }: any) => (
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={8}>
            <TextField
              {...field}
              label={label}
              type="number"
              fullWidth
              inputProps={{
                step: 0.1,
                min,
                max,
              }}
              error={touched[name] && !!errors[name]}
              helperText={touched[name] && typeof errors[name] === 'string' ? errors[name] : undefined}
              onWheel={(e) => e.currentTarget.blur()} // Disable wheel on inputs for mobile
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => handleIncrement(name, 0.1)} size="small">
              <Add />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => handleIncrement(name, -0.1)} size="small">
              <Remove />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </Field>
  );

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={values.useMetric}
            onChange={(e) => setFieldValue('useMetric', e.target.checked)}
            name="useMetric"
          />
        }
        label={values.useMetric ? 'Metrisch (km, km/u)' : 'Nautisch (zeemijl, knopen)'}
      />
      <Grid container spacing={2}>
        {/* Start Time */}
        <Grid item xs={12} sm={6}>
          <TimePicker
            label="Starttijd"
            ampm={false}
            value={values.startTime}
            onChange={(newValue) => setFieldValue('startTime', newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                error: touched.startTime && !!errors.startTime,
                helperText: touched.startTime && typeof errors.startTime === 'string' ? errors.startTime : undefined,
              },
            }}
          />
        </Grid>

        {/* Arrival Time */}
        <Grid item xs={12} sm={6}>
          <TimePicker
            label="Gewenste aankomsttijd"
            ampm={false}
            value={values.arrivalTime}
            onChange={(newValue) => setFieldValue('arrivalTime', newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                error: touched.arrivalTime && !!errors.arrivalTime,
                helperText: touched.arrivalTime && typeof errors.arrivalTime === 'string' ? errors.arrivalTime : undefined,
              },
            }}
          />
        </Grid>

        {/* Distance */}
        <Grid item xs={12} sm={6}>
          {renderNumericField('distance', `Afstand (${values.useMetric ? 'km' : 'zeemijl'})`, 0, settings.maxDistance)}
        </Grid>

        {/* Fuel Consumption */}
        <Grid item xs={12} sm={6}>
          {renderNumericField('fuelConsumption', 'Brandstofverbruik (liter/uur)', 0, 50)}
        </Grid>

        {/* Sail Speed */}
        <Grid item xs={12} sm={6}>
          {renderNumericField('sailSpeed', `Zeilsnelheid (${values.useMetric ? 'km/u' : 'knopen'})`, 0, settings.maxSailSpeed)}
        </Grid>

        {/* Motor Speed */}
        <Grid item xs={12} sm={6}>
          {renderNumericField('motorSpeed', `Motorsnelheid (${values.useMetric ? 'km/u' : 'knopen'})`, 0, settings.maxMotorSpeed)}
        </Grid>
      </Grid>
    </>
  );
};

export default SailingForm;
