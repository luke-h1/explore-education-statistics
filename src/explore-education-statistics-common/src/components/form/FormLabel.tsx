import classNames from 'classnames';
import React, { ReactNode } from 'react';

export interface FormLabelProps {
  bold?: boolean;
  className?: string;
  id: string;
  hideLabel?: boolean;
  label: string | ReactNode;
}

const FormLabel = ({
  bold,
  className,
  id,
  hideLabel,
  label,
}: FormLabelProps) => {
  return (
    <label
      className={classNames(
        'govuk-label',
        {
          'govuk-visually-hidden': hideLabel,
          'govuk-!-font-weight-bold': bold,
        },
        className,
      )}
      htmlFor={id}
    >
      {label}
    </label>
  );
};

export default FormLabel;
