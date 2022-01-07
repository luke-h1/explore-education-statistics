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

      <h3>Publication details</h3>
      <SummaryList>
        <SummaryListItem term="Publiction title">
          Pupil absence in schools in England
        </SummaryListItem>
        <SummaryListItem term="Theme">Pupil and schools</SummaryListItem>
        <SummaryListItem term="Topic">Pupil absence</SummaryListItem>
      </SummaryList>
      <ButtonLink className="govuk-button--secondary" href="#" as="#">
        Edit contact details
      </ButtonLink>
    </PrototypePage>
  );
};

export default PrototypeManagePublication;
