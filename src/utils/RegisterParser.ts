import moment from 'moment';

const currentYear = Number(moment().format('YY'));

const RegisterParser = (registerNumber: any) => {
  let gender = '';
  let age = 0;

  if ((registerNumber[8] * 1) % 2 === 0) gender = 'Эмэгтэй';
  else gender = 'Эрэгтэй';

  let birthYear = Number(registerNumber[2] * 10) + Number(registerNumber[3]);
  if (birthYear > currentYear) {
    age = currentYear + 100 - birthYear;
  } else age = currentYear - birthYear;

  return {
    age: age,
    gender,
  };
};

export default RegisterParser;
