import FormattedDate from '@common/components/FormattedDate';
import React from 'react';

interface Props {
  title: string;
  summary: string;
  published: string;
  type: string;
  slug: string;
  theme: string;
  topic: string;
}

const PrototypeSearchResult = ({
  title,
  summary,
  published,
  type,
  slug,
  theme,
  topic,
}: Props) => {
  return (
    <>
      <h3 className="govuk-heading-m govuk-!-margin-bottom-2">
        <a
          href={`https://explore-education-statistics.service.gov.uk/find-statistics/${slug}`}
        >
          {title}
        </a>
      </h3>
      <p>{summary}</p>

      <div className="govuk-grid-row govuk-body-s">
        <div className="govuk-grid-column-one-half">
          <dl className="govuk-!-margin-top-0">
            <div className="dfe-flex">
              <dt>Type:</dt>
              <dd className="govuk-!-margin-left-2">{type}</dd>
            </div>
            <div className="dfe-flex">
              <dt>Published:</dt>
              <dd className="govuk-!-margin-left-2">
                <FormattedDate format="d MMM yyyy">{published}</FormattedDate>
              </dd>
            </div>
          </dl>
        </div>
        <div className="govuk-grid-column-one-half">
          <dl className="govuk-!-margin-top-0">
            <div className="dfe-flex">
              <dt>Theme:</dt>
              <dd className="govuk-!-margin-left-2">{theme}</dd>
            </div>
            <div className="dfe-flex">
              <dt>Topic:</dt>
              <dd className="govuk-!-margin-left-2">{topic}</dd>
            </div>
          </dl>
        </div>
      </div>
      <hr />
    </>
  );
};

export default PrototypeSearchResult;
