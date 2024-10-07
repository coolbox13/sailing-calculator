import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/SailingCalculator.tsx
import { useState, useRef, useEffect } from 'react';
import { Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import nlLocale from 'date-fns/locale/nl';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { calculateSailingPlan } from '../utils/calculations';
import SettingsDialog from './SettingsDialog';
import SailingForm from './SailingForm';
const SailingCalculator = () => {
    const [result, setResult] = useState('');
    const [settings, setSettings] = useState({
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
            if (!startTime || !value)
                return true;
            if (value <= startTime) {
                // Check if arrival time is the next day
                return true;
            }
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
            if (!sailSpeed || !value)
                return true;
            return value > sailSpeed;
        }),
    });
    const formikRef = useRef(null);
    const parseTimeString = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        // Ensure that the date part is consistent (e.g., use a fixed date or today)
        date.setFullYear(2000, 0, 1); // Set to a fixed date (e.g., January 1, 2000)
        return date;
    };
    const handleCalculate = (values) => {
        const resultText = calculateSailingPlan({
            ...values,
            settings,
        });
        setResult(resultText);
    };
    const handleSettingsUpdate = (newSettings) => {
        setSettings(newSettings);
        // Reinitialize Formik values
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
    return (_jsxs(LocalizationProvider, { dateAdapter: AdapterDateFns, locale: nlLocale, children: [_jsxs(Typography, { variant: "h4", align: "center", gutterBottom: true, children: ["Zeilen of Motor Berekening", _jsx(SettingsDialog, { settings: settings, onUpdate: handleSettingsUpdate })] }), _jsx(Formik, { innerRef: formikRef, initialValues: {
                    startTime: parseTimeString(settings.defaultStartTime),
                    arrivalTime: parseTimeString(settings.defaultArrivalTime),
                    distance: settings.defaultDistance,
                    sailSpeed: settings.defaultSailSpeed,
                    motorSpeed: settings.defaultMotorSpeed,
                    useMetric: settings.useMetric,
                }, validationSchema: validationSchema, onSubmit: () => { }, children: (formikProps) => {
                    const { values } = formikProps;
                    useEffect(() => {
                        if (formikProps.isValid) {
                            handleCalculate(formikProps.values);
                        }
                        else {
                            setResult('');
                        }
                    }, [values, formikProps.isValid]);
                    return (_jsx(Form, { children: _jsx(SailingForm, { formikProps: formikProps, settings: settings }) }));
                } }), result && (_jsxs(_Fragment, { children: [_jsx(Typography, { variant: "h5", gutterBottom: true, style: { marginTop: '20px' }, children: "Uitkomst" }), _jsx(Typography, { variant: "body1", children: _jsx("div", { dangerouslySetInnerHTML: { __html: result } }) })] }))] }));
};
export default SailingCalculator;
