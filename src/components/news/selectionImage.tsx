import { Card } from 'antd';
import { FC } from 'react';

interface ImageProps {
  path: string;
  title: string;
  isSelect: boolean;
  width?: number;
  onClick?: () => void;
}
const SelectionImage: FC<ImageProps> = ({ path, title, isSelect, width, onClick }) => {
  const { Meta } = Card;
  return (
    <div
      className={`flex flex-col justify-center items-center ${isSelect ? 'border-2 border-blue-500' : 'bg-slate-400'}`}
    >
      <Card hoverable style={{ width }} cover={<img alt={title} src={path} />} onClick={onClick}>
        <Meta title={title} />
      </Card>
    </div>
  );
};
export default SelectionImage;
