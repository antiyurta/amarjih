import { Card } from 'antd';
import { FC } from 'react';
import styles from './SelectionImage.module.css';

interface ImageProps {
  path: string;
  title: string;
  isSelect: boolean;
  width?: number;
  onClick?: () => void;
}
const SelectionImage: FC<ImageProps> = ({ path, title, isSelect, width, onClick }) => {
  return (
    <div
      className={`flex flex-col justify-center m-10 items-center ${isSelect ? 'border-2 border-blue-500' : ''}`}
    >
      <Card
        hoverable
        style={{ width }}
        bodyStyle={{ display: 'none' }}
        onClick={onClick}
        cover={
          <div className={styles.imageContainer}>
            <img alt={title} src={path} className={styles.image} />
            <div className={styles.overlayText}>{title}</div>
          </div>
        }
      ></Card>
    </div>
  );
};
export default SelectionImage;
