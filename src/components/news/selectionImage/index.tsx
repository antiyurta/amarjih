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

export const ImageCard: FC<ImageProps> = ({ path, title, isSelect, width, onClick }) => {
  return (
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
  );
};

export const SelectionImage: FC<ImageProps> = ({ path, title, isSelect, width, onClick }) => {
  return (
    <div
      className={`flex flex-col justify-center m-10 items-center ${isSelect ? 'border-8 border-blue-500' : ''}`}
    >
      <ImageCard path={path} title={title} isSelect={isSelect} width={width} onClick={onClick} />
    </div>
  );
};
