// src/components/SettingsDialog.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

interface Settings {
  useMetric: boolean;
  maxDistance: number;
  maxSailSpeed: number;
  maxMotorSpeed: number;
  defaultFuelConsumption: number;
  defaultStartTime: string;
  defaultArrivalTime: string;
  defaultDistance: number;
  defaultSailSpeed: number;
  defaultMotorSpeed: number;
}

interface SettingsDialogProps {
  settings: Settings;
  onUpdate: (newSettings: Settings) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ settings, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<Settings>({ ...settings });

  const handleSave = () => {
    onUpdate(localSettings);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings({ ...settings });
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} style={{ float: 'right' }}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Instellingen</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.useMetric}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, useMetric: e.target.checked })
                }
              />
            }
            label={
              localSettings.useMetric
                ? 'Metrisch (km, km/u)'
                : 'Nautisch (zeemijl, knopen)'
            }
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label={`Maximale afstand (${localSettings.useMetric ? 'km' : 'zeemijl'})`}
                type="number"
                fullWidth
                value={localSettings.maxDistance}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, maxDistance: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Standaard starttijd (HH:mm)"
                type="time"
                fullWidth
                value={localSettings.defaultStartTime}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, defaultStartTime: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 minutes
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Standaard aankomsttijd (HH:mm)"
                type="time"
                fullWidth
                value={localSettings.defaultArrivalTime}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, defaultArrivalTime: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 minutes
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Standaard afstand"
                type="number"
                fullWidth
                value={localSettings.defaultDistance}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, defaultDistance: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Standaard zeilsnelheid"
                type="number"
                fullWidth
                value={localSettings.defaultSailSpeed}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, defaultSailSpeed: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Standaard motorsnelheid"
                type="number"
                fullWidth
                value={localSettings.defaultMotorSpeed}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, defaultMotorSpeed: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Standaard brandstofverbruik (liter per uur)"
                type="number"
                fullWidth
                value={localSettings.defaultFuelConsumption}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, defaultFuelConsumption: Number(e.target.value) })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Annuleren</Button>
          <Button onClick={handleSave} color="primary">
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsDialog;
