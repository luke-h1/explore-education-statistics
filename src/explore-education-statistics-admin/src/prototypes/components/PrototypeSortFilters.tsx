import React from 'react';
import classNames from 'classnames';

const PrototypeSortFilters = () => {
  return (
    <>
      <div className="govuk-form-group govuk-!-margin-bottom-0">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s govuk-!-margin-bottom-0">
            Sort results
          </legend>
          <div className="govuk-radios govuk-radios--small  govuk-radios--inline">
            <div className="govuk-radios__item">
              <input
                type="radio"
                className="govuk-radios__input"
                name="sort"
                id="sort-1"
                checked
              />
              <label
                className={classNames('govuk-label', 'govuk-radios__label')}
                htmlFor="sort-1"
              >
                Newest
              </label>
            </div>
            <div className="govuk-radios__item">
              <input
                type="radio"
                className="govuk-radios__input"
                name="sort"
                id="sort-2"
              />
              <label
                className={classNames('govuk-label', 'govuk-radios__label')}
                htmlFor="sort-2"
              >
                Oldest
              </label>
            </div>
            <div className="govuk-radios__item">
              <input
                type="radio"
                className="govuk-radios__input"
                name="sort"
                id="sort-3"
              />
              <label
                className={classNames('govuk-label', 'govuk-radios__label')}
                htmlFor="sort-3"
              >
                A to Z
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default PrototypeSortFilters;
