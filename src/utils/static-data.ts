export const taskTypes = [
  { value: '2', label: 'Хүлээн авах' },
  { value: '4', label: 'Төрөх тасаг' },
  { value: '5', label: 'Кесарево хагалгаагаар төрөх' },
  { value: '6', label: 'Эмэгтэйчүүдийн хагалгаа' },
];
export const getTaskByValue = (value): string =>
  taskTypes.find(item => item.value == value).label ?? '';
