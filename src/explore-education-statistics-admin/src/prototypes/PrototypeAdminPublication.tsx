import PageTitle from '@admin/components/PageTitle';
import Link from '@admin/components/Link';
import PrototypeChangeUserRole from '@admin/prototypes/components/PrototypeChangeUserRole';
import PrototypePage from '@admin/prototypes/components/PrototypePage';
import React, { useState } from 'react';
import ButtonGroup from '@common/components/ButtonGroup';
import Button from '@common/components/Button';
import ButtonLink from '@common/components/ButtonLink';
import { FormGroup, FormTextInput } from '@common/components/form';
import FormEditor from '@admin/components/form/FormEditor';
import ModalConfirm from '@common/components/ModalConfirm';
import useToggle from '@common/hooks/useToggle';
import { isTemplateExpression, isThrowStatement } from 'typescript';
import Details from '@common/components/Details';
import Tabs from '@common/components/Tabs';
import TabsSection from '@common/components/TabsSection';
import SummaryList from '@common/components/SummaryList';
import SummaryListItem from '@common/components/SummaryListItem';
import Tag from '@common/components/Tag';
import TagGroup from '@common/components/TagGroup';
import WarningMessage from '@common/components/WarningMessage';
import RelatedInformation from '@common/components/RelatedInformation';
import ReleaseList from '@admin/prototypes/components/PrototypePublicationReleaseList';
import Nav from '@admin/prototypes/components/PrototypeNavBarPublication';

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

      <Tabs id="manage-release-users">
        <TabsSection title="Releases">
          <ReleaseList />

          {page === undefined || (page === 'releases' && <ReleaseList />)}
          {page === 'methodology' && <>methodology</>}
        </TabsSection>
        <TabsSection title="Methodology">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-three-quarters govuk-!-margin-bottom-6">
              <h3>Manage methodology</h3>
              <p className="govuk-hint">
                Create new methodology, view or amend existing methodology,
                select existing methodology used in another publication or link
                to an external file that contains methodology details.
              </p>
              <p className="govuk-hint">
                All methodologies listed in the table below will be associated
                with all releases within this publication.
              </p>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <h4>Other options</h4>
              <ul>
                <li>
                  <a href="#">Add external methodology</a>
                </li>
                <li>
                  <a href="#">Adopt an existing methodology</a>
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
          {/*}
          <Details 
            summary="Pupil absence statistics: methodology (Owned)"
            summaryAfter={
              <TagGroup className="govuk-!-margin-left-2">
                <Tag>Approved</Tag>
              </TagGroup>
            }
          >
            <div className="dfe-flex">
              <div className="dfe-flex-basis--50">
                <SummaryList>
                  <SummaryListItem term="Publish date">
                    22 March 2020
                  </SummaryListItem>
                </SummaryList>
              </div>
              <div className="dfe-flex-basis--40">
                <div className="dfe-flex  govuk-!-margin-left-4 govuk-!-padding-left-4 govuk-!-padding-left-4 dfe-flex-border--left">
                  <a href="#" className='govuk-!-margin-2'>View</a>
                  <a href="#" className='govuk-!-margin-2'>Amend</a>
                </div>
              </div>
            </div>
          </Details> */}
        </TabsSection>
        <TabsSection title="Contact">
          <h3>Contact for this publication</h3>
          <p className="govuk-hint">
            They will be the main point of contact for data and methodology
            enquiries for this publication and its releases.
          </p>
          <SummaryList>
            <SummaryListItem term="Team">Prototyping team</SummaryListItem>
            <SummaryListItem term="Team email">
              <a href="mailto:#">ProtTeam@education.gov.uk</a>
            </SummaryListItem>
            <SummaryListItem term="Contact name">John Smith</SummaryListItem>
            <SummaryListItem term="Contact telephone">
              01234 0567891
            </SummaryListItem>
          </SummaryList>
          <ButtonLink className="govuk-button--secondary" href="#" as="#">
            Edit contact details
          </ButtonLink>
        </TabsSection>
        <TabsSection title="Publication details">
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
        </TabsSection>
        <TabsSection title="Team access">
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
                    <a href="#">Invite new users</a>
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
        </TabsSection>
        <TabsSection title="Legacy releases">
          <p>Section 5</p>
        </TabsSection>
      </Tabs>
    </PrototypePage>
  );
};

export default PrototypeManagePublication;
