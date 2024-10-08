import { differenceInMinutes, addDays, addMinutes, format } from 'date-fns';

// Define the CalculationParams interface
interface CalculationParams {
  startTime: Date;
  arrivalTime: Date;
  distance: number;
  sailSpeed: number;
  motorSpeed: number;
  settings: {
    useMetric: boolean;
    fuelConsumption: number;
  };
}

export const calculateSailingPlan = (params: CalculationParams): string => {
  const { startTime, arrivalTime, distance, sailSpeed, motorSpeed, settings } = params;

  let adjustedArrivalTime = arrivalTime;

  // Step 2: Adjust Arrival Time if Arrival Time <= Start Time
  if (arrivalTime <= startTime) {
    adjustedArrivalTime = addDays(arrivalTime, 1);
  }

  // Step 4: Calculate Total Available Time
  const totalTimeInMinutes = differenceInMinutes(adjustedArrivalTime, startTime);
  const totalTimeInHours = totalTimeInMinutes / 60;

  let dist = distance;
  let sailSpd = sailSpeed;
  let motorSpd = motorSpeed;

  // Step 3: Convert Units if Metric
  if (settings.useMetric) {
    dist = dist / 1.852; // km to nautical miles
    sailSpd = sailSpd / 1.852; // km/h to knots
    motorSpd = motorSpd / 1.852; // km/h to knots
  }

  // Step 5: Check if Sailing Only is Possible
  const sailTimeRequired = dist / sailSpd;
  if (sailTimeRequired <= totalTimeInHours) {
    return `
      Je kunt de hele afstand zeilen in ${formatTime(sailTimeRequired)} (${dist.toFixed(2)} ${settings.useMetric ? 'km' : 'zeemijl'}).
      <br>Geschat brandstofverbruik: 0 liter.
    `;
  }

  // Step 6: Check if Sailing + Motoring is Possible
  const k = sailSpd / motorSpd;
  const numerator = totalTimeInHours - (dist / motorSpd);
  const denominator = 1 - k;

  let t_sail = denominator === 0 ? 0 : numerator / denominator;
  if (t_sail >= 0 && t_sail <= totalTimeInHours) {
    const t_motor = totalTimeInHours - t_sail;
    const distanceSailed = sailSpd * t_sail;
    const remainingDistance = dist - distanceSailed;
    const fuelConsumption = t_motor * settings.fuelConsumption;

    return `
      Je kunt ${formatTime(t_sail)} zeilen (${distanceSailed.toFixed(2)} ${settings.useMetric ? 'km' : 'zeemijl'}).
      Daarna moet je overschakelen naar de motor voor de resterende ${remainingDistance.toFixed(2)} ${settings.useMetric ? 'km' : 'zeemijl'},
      wat ${formatTime(t_motor)} duurt.
      <br><br>Geschat brandstofverbruik: ${fuelConsumption.toFixed(2)} liter.
    `;
  }

  // Step 7: Check if Motoring Only Can Arrive on Time
  const motorTimeRequired = dist / motorSpd;
  if (motorTimeRequired <= totalTimeInHours) {
    const fuelConsumption = motorTimeRequired * settings.fuelConsumption;
    return `
      Je kunt de hele afstand op de motor afleggen in ${formatTime(motorTimeRequired)}.
      <br><br>Geschat brandstofverbruik: ${fuelConsumption.toFixed(2)} liter.
    `;
  }

  // Step 8: Motoring Only with Late Arrival
  const extraTimeNeeded = motorTimeRequired - totalTimeInHours;
  const actualArrivalTime = addMinutes(adjustedArrivalTime, extraTimeNeeded * 60);
  const fuelConsumption = motorTimeRequired * settings.fuelConsumption;

  return `
    Je kunt de hele afstand op de motor afleggen, maar je zult niet op tijd aankomen.
    <br>Je verwachte aankomsttijd is ${format(actualArrivalTime, 'HH:mm')}.
    <br><br>Geschat brandstofverbruik: ${fuelConsumption.toFixed(2)} liter.
  `;
};

// Add the formatTime function here
const formatTime = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours} uur${minutes > 0 ? ` en ${minutes} minuten` : ''}`;
};
