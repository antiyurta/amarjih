export const getTypeInfo = type => {
  const map = {
    2: 'Хүлээн авах',
    4: 'Төрөх тасаг',
    5: 'Кесоров хагалгаагаар төрөх',
    6: 'Эмэгтэйчүүдийн хагалгаа',
  };
  return map[type];
};

const columns = [
  {
    id: 1,
    name: 'Эрэмбэлэлт хийгдэж байна',
    columnName: 'Эрэмбэлэлт хийгдэж байна',
    color: 'Brown',
    position: 1,
    taskType: 2,
    isContextMenu: true,
    isCheckRequired: false,
  },
  {
    id: 2,
    name: 'Эмчийн үзлэг хийгдэж байна',
    columnName: 'Эмчийн үзлэг хийгдэж байна',
    color: 'Brown',
    position: 2,
    taskType: 2,
    isContextMenu: true,
    isCheckRequired: true,
  },
  {
    id: 3,
    name: 'Эмчийн үзлэг хийгдэж байна',
    columnName: 'Эмчийн үзлэг хийгдэж байна',
    color: 'Brown',
    position: 2,
    taskType: 2,
    isContextMenu: true,
    isCheckRequired: true,
  },
  {
    id: 4,
    name: 'Эмчийн үзлэг хийгдэж байна',
    columnName: 'Эмчийн үзлэг хийгдэж байна',
    color: 'Brown',
    position: 2,
    taskType: 2,
    isContextMenu: true,
    isCheckRequired: true,
  },
];

export const getColumn = type => {
  return columns?.filter(column => column.taskType === Number(type));
};
