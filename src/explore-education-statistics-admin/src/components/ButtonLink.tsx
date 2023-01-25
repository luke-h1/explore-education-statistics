import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { LinkProps } from 'react-router-dom';

import { Link as RouterLink } from 'react-router-dom-v5-compat';

import {
  SetCommonButtonLink,
  ButtonLinkType,
} from '@common/components/ButtonLink';

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'secondary' | 'warning';
} & LinkProps;

const ButtonLink = ({
  children,
  className,
  disabled = false,
  to,
  variant,
  ...props
}: Props) => {
  return (
    <RouterLink
      {...props}
      to={to}
      className={classNames(
        'govuk-button',
        {
          'govuk-button--disabled': disabled,
          'govuk-button--secondary': variant === 'secondary',
          'govuk-button--warning': variant === 'warning',
        },
        className,
      )}
      aria-disabled={disabled}
    >
      {children}
    </RouterLink>
  );
};
// is this necessary? TODO: LH - investigate more
SetCommonButtonLink(ButtonLink as ButtonLinkType);

export default ButtonLink;
