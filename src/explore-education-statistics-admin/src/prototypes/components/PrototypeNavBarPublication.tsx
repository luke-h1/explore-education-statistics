import NavLink from '@admin/components/NavLink';
import classNames from 'classnames';
import React from 'react';
import styles from '@admin/components/NavBar.module.scss';

const PrototypeNavBarPublication = () => {
  return (
    <nav
      className={classNames(
        styles.navigation,
        'govuk-!-margin-top-6 govuk-!-margin-bottom-9',
      )}
    >
      <ul className={classNames(styles.list, 'govuk-!-margin-bottom-0')}>
        <li>
          <NavLink to="?page=releases">Releases</NavLink>
        </li>
        <li>
          <NavLink to="?page=methodology">Methodology</NavLink>
        </li>
        <li>
          <NavLink to="/prototypes2">Contact</NavLink>
        </li>
        <li>
          <NavLink to="/prototypes3">Publication details</NavLink>
        </li>
        <li>
          <NavLink to="/prototypes4">Team access</NavLink>
        </li>
        <li>
          <NavLink to="pre-release">Legacy releases</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default PrototypeNavBarPublication;
