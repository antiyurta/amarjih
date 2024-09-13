import React, { ReactNode } from 'react';
import style from './navbar.module.scss';

type INavbarProps = {
  children: ReactNode;
};

const Navbar = (props: INavbarProps) => (
  <ul className={style.content}>{props.children}</ul>
);

export { Navbar };
