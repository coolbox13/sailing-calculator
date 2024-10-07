import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Grid, Switch, FormControlLabel, } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
const SailingForm = ({ formikProps, settings }) => {
    const { values, errors, touched, setFieldValue } = formikProps;
    return (_jsxs(_Fragment, { children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: values.useMetric, onChange: (e) => {
                        setFieldValue('useMetric', e.target.checked);
                    }, name: "useMetric" }), label: values.useMetric
                    ? 'Metrisch (km, km/u)'
                    : 'Nautisch (zeemijl, knopen)' }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TimePicker, { label: "Starttijd", ampm: false, value: values.startTime, onChange: (newValue) => {
                                setFieldValue('startTime', newValue);
                            }, slotProps: {
                                textField: {
                                    fullWidth: true,
                                    error: touched.startTime && !!errors.startTime,
                                    helperText: touched.startTime && errors.startTime,
                                },
                            } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TimePicker, { label: "Gewenste aankomsttijd", ampm: false, value: values.arrivalTime, onChange: (newValue) => {
                                setFieldValue('arrivalTime', newValue);
                            }, slotProps: {
                                textField: {
                                    fullWidth: true,
                                    error: touched.arrivalTime && !!errors.arrivalTime,
                                    helperText: touched.arrivalTime && errors.arrivalTime,
                                },
                            } }) })] })] }));
};
export default SailingForm;
