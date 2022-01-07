import React, { useState } from 'react';
import Button from '@common/components/Button';
import Tag from '@common/components/Tag';

const PrototypePublicationMethodologyList = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters govuk-!-margin-bottom-6">
          <h3>Manage methodology</h3>
          <p className="govuk-hint">
            Create new methodology, view or amend existing methodology, select
            existing methodology used in another publication or link to an
            external file that contains methodology details.
          </p>
          <p className="govuk-hint">
            All methodologies listed in the table below will be associated with
            all releases within this publication.
          </p>
        </div>
        <div className="govuk-grid-column-one-quarter">
          <h4>Other options</h4>
          <ul>
            <li>
              <a href="#">add external methodology</a>
            </li>
            <li>
              <a href="#">adopt an existing methodology</a>
            </li>
          </ul>
        </div>
      </div>
      <div style={{ width: '100%', overflow: 'auto' }}>
        <table className="govuk-table">
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
                <a href="#">Remove</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PrototypePublicationMethodologyList;
