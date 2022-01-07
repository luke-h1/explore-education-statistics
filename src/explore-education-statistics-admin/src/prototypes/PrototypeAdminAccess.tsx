import PageTitle from '@admin/components/PageTitle';
import Link from '@admin/components/Link';
import PrototypePage from '@admin/prototypes/components/PrototypePage';
import React, { useState } from 'react';
import RelatedInformation from '@common/components/RelatedInformation';
import Nav from '@admin/prototypes/components/PrototypeNavBarPublication';
import Button from '@common/components/Button';
import ButtonLink from '@common/components/ButtonLink';
import SummaryList from '@common/components/SummaryList';
import SummaryListItem from '@common/components/SummaryListItem';
import Tag from '@common/components/Tag';

const PrototypeManagePublication = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const page = queryParams.get('page');

  return (
    <PrototypePage
      wide
      breadcrumbs={[
        { name: 'Dashboard', link: '/prototypes/admin-dashboard' },
        { name: 'Manage publication', link: '#' },
      ]}
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <PageTitle
            title="Pupil absence in schools in England"
            caption="Manage publication"
          />
        </div>
        <div className="govuk-grid-column-one-third">
          <RelatedInformation heading="Help and guidance">
            <ul className="govuk-list">
              <li>
                <Link to="/contact-us" target="_blank">
                  Contact us
                </Link>
              </li>
            </ul>
          </RelatedInformation>
        </div>
      </div>

      <Nav />

      <div className="govuk-!-width-full">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-three-quarters">
            <h3>Update access release access</h3>
            <form>
              <label htmlFor="topic" className="govuk-label">
                Select release
              </label>
              <select name="topic" id="topic" className="govuk-select">
                <option value="">Academic Year 2020/21 (Not live)</option>
                <option value="">
                  Academic Year 2019/20 (Live - Latest release)
                </option>
                <option value="">Academic Year 2018/19 (Live)</option>
                <option value="">Academic Year 2017/18 (Live)</option>
              </select>
            </form>
          </div>
          <div className="govuk-grid-column-one-quarter">
            <h4>Other options</h4>
            <ul>
              <li>
                <a href="#">invite new users</a>
              </li>
            </ul>
          </div>
        </div>

        <table className="govuk-table govuk-!-margin-top-9 govuk-!-width-three-quarters">
          <caption className="govuk-table__caption govuk-table__caption--s">
            Academic Year 2020/21 (Not live) <Tag>DRAFT</Tag>
          </caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th>Name</th>
              <th className="govuk-table__cell--numeric">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Andrew Adams</td>
              <td className="govuk-table__cell--numeric">
                <a href="#">Remove</a>
              </td>
            </tr>
            <tr>
              <td>Ben Browne</td>
              <td className="govuk-table__cell--numeric">
                <a href="#">Remove</a>
              </td>
            </tr>
            <tr>
              <td>Charlotte Chesterton</td>
              <td className="govuk-table__cell--numeric">
                <a href="#">Remove</a>
              </td>
            </tr>
          </tbody>
        </table>
        <Button>Add or remove users</Button>
      </div>
    </PrototypePage>
  );
};

export default PrototypeManagePublication;
