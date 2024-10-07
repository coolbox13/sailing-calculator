// src/components/SailingForm.tsx

import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Field, FormikProps } from 'formik';

interface SailingFormProps {
  formikProps: FormikProps<any>;
  settings: any;
}

const SailingForm: React.FC<SailingFormProps> = ({ formikProps, settings }) => {
  const { values, errors, touched, setFieldValue } = formikProps;

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={values.useMetric}
            onChange={(e) => {
              setFieldValue('useMetric', e.target.checked);
            }}
            name="useMetric"
          />
        }
        label={
          values.useMetric ? 'Metrisch (km, km/u)' : 'Nautisch (zeemijl, knopen)'
        }
      />
      <Grid container spacing={2}>
        {/* Start Time */}
        <Grid item xs={12} sm={6}>
          <TimePicker
            label="Starttijd"
            ampm={false}
            value={values.startTime}
            onChange={(newValue) => {
              setFieldValue('startTime', newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: touched.startTime && !!errors.startTime,
                helperText:
                  touched.startTime && typeof errors.startTime === 'string'
                    ? errors.startTime
                    : undefined,
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
            onChange={(newValue) => {
              setFieldValue('arrivalTime', newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: touched.arrivalTime && !!errors.arrivalTime,
                helperText:
                  touched.arrivalTime && typeof errors.arrivalTime === 'string'
                    ? errors.arrivalTime
                    : undefined,
              },
            }}
          />
        </Grid>

        {/* Distance */}
        <Grid item xs={12}>
          <Field name="distance">
            {({ field }: any) => (
              <TextField
                {...field}
                label={`Afstand (${values.useMetric ? 'km' : 'zeemijl'})`}
                type="number"
                fullWidth
                error={touched.distance && !!errors.distance}
                helperText={
                  touched.distance && typeof errors.distance === 'string'
                    ? errors.distance
                    : undefined
                }
              />
            )}
          </Field>
        </Grid>

        {/* Sail Speed */}
        <Grid item xs={12}>
          <Field name="sailSpeed">
            {({ field }: any) => (
              <TextField
                {...field}
                label={`Zeilsnelheid (${values.useMetric ? 'km/u' : 'knopen'})`}
                type="number"
                fullWidth
                error={touched.sailSpeed && !!errors.sailSpeed}
                helperText={
                  touched.sailSpeed && typeof errors.sailSpeed === 'string'
                    ? errors.sailSpeed
                    : undefined
                }
              />
            )}
          </Field>
        </Grid>

        {/* Motor Speed */}
        <Grid item xs={12}>
          <Field name="motorSpeed">
            {({ field }: any) => (
              <TextField
                {...field}
                label={`Motorsnelheid (${values.useMetric ? 'km/u' : 'knopen'})`}
                type="number"
                fullWidth
                error={touched.motorSpeed && !!errors.motorSpeed}
                helperText={
                  touched.motorSpeed && typeof errors.motorSpeed === 'string'
                    ? errors.motorSpeed
                    : undefined
                }
              />
            )}
          </Field>
        </Grid>
      </Grid>
    </>
  );
};

export default SailingForm;
