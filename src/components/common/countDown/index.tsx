import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';

const CountDown = ({ date }) => {
  const duration = moment().diff(moment(date), 'seconds');
  const [countDown, setCountDown] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  const pad = input => {
    const Base = '00';

    return input ? Base.substr(0, 2 - Math.ceil(input / 9)) + input : Base;
  };

  const formatRender = duration => {
    const formatted = moment.utc(duration * 1000).format('HH:mm:ss');
    return formatted;
  };

  return (
    <div className="flex flex-row">
      <div className="text-xl font-bold">{formatRender(countDown)}</div>
    </div>
  );
};

export default CountDown;
