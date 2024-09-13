const nameFormatter = (s: any) => {
  let str = '';
  for (let i = 0; i < s.length; i++) {
    if (i % 2 > 0) str += '*';
    else str += s[i];
  }
  return str;
};

export default nameFormatter;
