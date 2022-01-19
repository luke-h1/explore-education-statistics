import React, { useState } from 'react';
import Button from '@common/components/Button';
import Tag from '@common/components/Tag';
import WarningMessage from '@common/components/WarningMessage';

const PrototypePublicationMethodologyList = () => {
  const [showMethodology, setShowMethodology] = useState(true);

  const dfeLinkWarning = {
    color: '#d4351c',
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters govuk-!-margin-bottom-6">
          <h3 className="govuk-heading-l">Manage methodology</h3>
          <p className="govuk-hint">
            Create new methodology, view or amend existing methodology, select
            existing methodology used in another publication or link to an
            external file that contains methodology details.
          </p>
        </div>
        <div className="govuk-grid-column-one-quarter" />
      </div>
      {!showMethodology && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-three-quarters">
            <WarningMessage className="govuk-!-margin-bottom-2">
              No releases created in this publication
            </WarningMessage>
          </div>
          <div className="govuk-grid-column-one-quarter dfe-align--right govuk-!-margin-top-3">
            <Button>Create new methodology</Button>
          </div>
        </div>
      )}

      {showMethodology && (
        <div style={{ width: '100%', overflow: 'auto' }}>
          <table className="govuk-table">
            <caption className="govuk-table__caption--m">
              Methodologies associated to releases in this publication
            </caption>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th>Methodology</th>
                <th>Type</th>
                <th>Status</th>
                <th>Publish date</th>
                <th colSpan={3}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pupil absence statistics</td>
                <td>Owned</td>
                <td>
                  <Tag>Approved</Tag>
                </td>
                <td>28 March 2021</td>
                <td className="dfe-align--left">
                  <a href="#">Amend</a>
                </td>
                <td className="dfe-align--centre">
                  <a href="#">View</a>
                </td>
                <td />
              </tr>
              <tr>
                <td>Pupil exclusions statistics</td>
                <td>Adopted</td>
                <td>
                  <Tag>Approved</Tag>
                </td>
                <td>28 March 2021</td>
                <td className="dfe-align--left">
                  <a href="#">Amend</a>
                </td>
                <td className="dfe-align--centre">
                  <a href="#">View</a>
                </td>
                <td className="dfe-align--right">
                  <a href="#" style={dfeLinkWarning}>
                    Remove
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <h4>Other options</h4>
      <ul>
        <li>
          <a href="#">add external methodology</a>
        </li>
        <li>
          <a href="#">adopt an existing methodology</a>
        </li>
      </ul>
      <div className="dfe-align--right govuk-!-margin-top-9">
        <ul className="govuk-list">
          <li>
            {showMethodology ? (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowMethodology(false);
                }}
              >
                Remove methodology
              </a>
            ) : (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowMethodology(true);
                }}
              >
                Show methodology
              </a>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default PrototypePublicationMethodologyList;
