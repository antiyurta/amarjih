const timeFormatter = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMins = mins.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMins}`;
};

export default timeFormatter;
