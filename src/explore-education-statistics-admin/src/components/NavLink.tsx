import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { NavLinkProps } from 'react-router-dom';

import {
  NavLink as RouterNavLinkV5,
} from 'react-router-dom-v5-compat';


import styles from './NavLink.module.scss';

type Props = {
  children: ReactNode;
  className?: string;
  unvisited?: boolean;
} & NavLinkProps;

const NavLink = ({ children, className, to, ...props }: Props) => {
  return (
    // TS not happy with isActive
    <RouterNavLinkV5
      {...props}
      to={to}
      activeClassName={styles.currentPage}
      className={classNames(
        'govuk-link',
        'govuk-link--no-visited-state',
        className,
      )}
    >
      {children}
    </RouterNavLinkV5>
  );
};

export default NavLink;
