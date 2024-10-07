import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/SettingsDialog.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField, Switch, FormControlLabel, Grid, } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
const SettingsDialog = ({ settings, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [localSettings, setLocalSettings] = useState({ ...settings });
    const handleSave = () => {
        onUpdate(localSettings);
        setOpen(false);
    };
    const handleCancel = () => {
        setLocalSettings({ ...settings });
        setOpen(false);
    };
    return (_jsxs(_Fragment, { children: [_jsx(IconButton, { onClick: () => setOpen(true), style: { float: 'right' }, children: _jsx(SettingsIcon, {}) }), _jsxs(Dialog, { open: open, onClose: handleCancel, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "Instellingen" }), _jsxs(DialogContent, { children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: localSettings.useMetric, onChange: (e) => setLocalSettings({ ...localSettings, useMetric: e.target.checked }) }), label: localSettings.useMetric
                                    ? 'Metrisch (km, km/u)'
                                    : 'Nautisch (zeemijl, knopen)' }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { label: `Maximale afstand (${localSettings.useMetric ? 'km' : 'zeemijl'})`, type: "number", fullWidth: true, value: localSettings.maxDistance, onChange: (e) => setLocalSettings({ ...localSettings, maxDistance: Number(e.target.value) }) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { label: "Standaard starttijd (HH:mm)", type: "time", fullWidth: true, value: localSettings.defaultStartTime, onChange: (e) => setLocalSettings({ ...localSettings, defaultStartTime: e.target.value }), InputLabelProps: {
                                                shrink: true,
                                            }, inputProps: {
                                                step: 300, // 5 minutes
                                            } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { label: "Standaard aankomsttijd (HH:mm)", type: "time", fullWidth: true, value: localSettings.defaultArrivalTime, onChange: (e) => setLocalSettings({ ...localSettings, defaultArrivalTime: e.target.value }), InputLabelProps: {
                                                shrink: true,
                                            }, inputProps: {
                                                step: 300, // 5 minutes
                                            } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { label: "Standaard afstand", type: "number", fullWidth: true, value: localSettings.defaultDistance, onChange: (e) => setLocalSettings({ ...localSettings, defaultDistance: Number(e.target.value) }) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { label: "Standaard zeilsnelheid", type: "number", fullWidth: true, value: localSettings.defaultSailSpeed, onChange: (e) => setLocalSettings({ ...localSettings, defaultSailSpeed: Number(e.target.value) }) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { label: "Standaard motorsnelheid", type: "number", fullWidth: true, value: localSettings.defaultMotorSpeed, onChange: (e) => setLocalSettings({ ...localSettings, defaultMotorSpeed: Number(e.target.value) }) }) })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCancel, children: "Annuleren" }), _jsx(Button, { onClick: handleSave, color: "primary", children: "Opslaan" })] })] })] }));
};
export default SettingsDialog;
