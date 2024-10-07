// src/utils/calculations.test.ts

import { calculateSailingPlan } from './calculations';

describe('calculateSailingPlan', () => {
  const defaultSettings = {
    useMetric: false,
    fuelConsumption: 5,
  };

  it('calculates sailing only when possible', () => {
    const result = calculateSailingPlan({
      startTime: new Date('2023-10-07T08:00'),
      arrivalTime: new Date('2023-10-07T12:00'),
      distance: 20,
      sailSpeed: 5,
      motorSpeed: 8,
      settings: defaultSettings,
    });

    expect(result).toContain('Je kunt de hele afstand zeilen');
  });

  it('calculates sailing and motoring when needed', () => {
    const result = calculateSailingPlan({
      startTime: new Date('2023-10-07T08:00'),
      arrivalTime: new Date('2023-10-07T11:00'),
      distance: 20,
      sailSpeed: 5,
      motorSpeed: 8,
      settings: defaultSettings,
    });

    expect(result).toContain('Je kunt');
    expect(result).toContain('zeilen');
    expect(result).toContain('overschakelen naar de motor');
  });

  it('calculates motoring only when necessary', () => {
    const result = calculateSailingPlan({
      startTime: new Date('2023-10-07T08:00'),
      arrivalTime: new Date('2023-10-07T09:00'),
      distance: 20,
      sailSpeed: 5,
      motorSpeed: 8,
      settings: defaultSettings,
    });

    expect(result).toContain('Je kunt de hele afstand op de motor afleggen');
  });

  it('handles cases where arrival time is before start time (next day)', () => {
    const result = calculateSailingPlan({
      startTime: new Date('2023-10-07T22:00'),
      arrivalTime: new Date('2023-10-07T06:00'),
      distance: 20,
      sailSpeed: 5,
      motorSpeed: 8,
      settings: defaultSettings,
    });

    expect(result).toContain('Je kunt de hele afstand zeilen');
  });
});
