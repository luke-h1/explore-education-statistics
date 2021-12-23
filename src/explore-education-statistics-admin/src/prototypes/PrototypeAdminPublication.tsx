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

const PrototypeManagePublication = () => {
  const [showDeleteUserModal, toggleDeleteUserModal] = useToggle(false);
  const [userName, setUserName] = useState('');
  const [roleType, setRoleType] = useState(false);
  const [showRoleModal, toggleRoleModal] = useToggle(false);
  const [showTeamMembers, toggleTeamMembers] = useToggle(true);

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

      <Tabs id="manage-release-users">
        <TabsSection title="Releases">
          <h3>Manage releases</h3>
          <p className="govuk-hint govuk-!-margin-bottom-6">
            View, edit or amend all releases contained within this publication.
          </p>

          <div style={{ width: '100%', overflow: 'auto' }}>
            <table className="govuk-table">
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th>Release period</th>
                  <th>State</th>
                  <th>Status</th>
                  <th style={{ width: '210px' }}>Checklist</th>
                  <th style={{ width: '180px' }}>Publish date</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Academic Year 2020/21 (Not live)</td>
                  <td>
                    <Tag>Draft</Tag>
                  </td>
                  <td>
                    <Tag colour="red">Not ready</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View issues"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list">
                        <li>
                          <Tag colour="red">3 Errors</Tag>
                        </li>
                        <li>
                          <Tag colour="orange">3 Warnings</Tag>
                        </li>
                        <li>
                          <Tag colour="grey">3 Comments</Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td>N/A</td>
                  <td>
                    <a href="#">
                      Edit{' '}
                      <span className="govuk-visually-hidden">
                        Academic Year 2019/20 (Not live)
                      </span>
                    </a>
                  </td>
                  <td />
                </tr>
                <tr>
                  <td>Academic Year 2019/20 (Live - Latest release)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>
                    <Tag colour="green">Complete</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View stages"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list">
                        <li>
                          <Tag colour="green">
                            Data ✓{' '}
                            <span className="govuk-visually-hidden">
                              Complete
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="green">
                            Content ✓{' '}
                            <span className="govuk-visually-hidden">
                              Complete
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="green">
                            Files ✓{' '}
                            <span className="govuk-visually-hidden">
                              Complete
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="green">
                            Publishing ✓
                            <span className="govuk-visually-hidden">
                              Complete
                            </span>{' '}
                          </Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td>25 Sept 20</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td>
                    <a href="#">View</a>
                  </td>
                </tr>
                <tr>
                  <td>Academic Year 2018/19 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>
                    <Tag colour="green">Complete</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View stages"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list">
                        <li>
                          <Tag colour="green">Data ✓</Tag>
                        </li>
                        <li>
                          <Tag colour="green">Content ✓</Tag>
                        </li>
                        <li>
                          <Tag colour="green">Files ✓</Tag>
                        </li>
                        <li>
                          <Tag colour="green">Publishing ✓</Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td>25 Sept 19</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td>
                    <a href="#">View</a>
                  </td>
                </tr>
                <tr>
                  <td>Academic Year 2017/18 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>
                    <Tag colour="green">Complete</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View stages"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list">
                        <li>
                          <Tag colour="green">Data ✓</Tag>
                        </li>
                        <li>
                          <Tag colour="green">Content ✓</Tag>
                        </li>
                        <li>
                          <Tag colour="green">Files ✓</Tag>
                        </li>
                        <li>
                          <Tag colour="green">Publishing ✓</Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td>25 Sept 18</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td>
                    <a href="#">View</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/*}
          <Details 
            summary="Academic Year 2020/21 (Not live)" 
            className='govuk-!-width-three-quarters'
            summaryAfter={
              <TagGroup className="govuk-!-margin-left-2">
                <Tag>Draft</Tag>
                <Tag colour='red'>Requires attention</Tag>
              </TagGroup>
            }
          >
            <div className="dfe-flex">
              <div className="dfe-flex-basis--75">
                <SummaryList>
                  <SummaryListItem term="Publish date">
                    N/A
                  </SummaryListItem>
                  <SummaryListItem term="Lead statistician">
                    Data analyst <br/>
                    <a href="#">explore.statistics@education.gov.uk</a><br />
                    01234100100
                  </SummaryListItem> 
                  <SummaryListItem term="Status">
                    <Tag colour='red'>Requires attention</Tag>
                    <Details summary="Release checklist" className='govuk-!-margin-top-3'>
                      <ul className='govuk-list'>
                        <li><Tag colour="red">3 Errors</Tag></li>
                        <li><Tag colour="orange">3 Warnings</Tag></li>
                        <li><Tag colour="grey">3 Unresolved comments</Tag></li>
                      </ul>
                    </Details>
                  </SummaryListItem>
                </SummaryList>
              </div>
              <div className="dfe-flex-basis--25">
                <div className="dfe-flex dfe-flex-direction--column dfe-justify-content--flex-end govuk-!-margin-left-4 govuk-!-padding-left-4 govuk-!-padding-left-4 dfe-flex-border--left">
                  <a href="#" className="govuk-button govuk-button--secondary">Edit release</a>
                </div>
              </div>
            </div>
            
          </Details>

          <Details 
            summary="Academic Year 2019/20 (Live - Latest release)" 
            summaryAfter={
              <TagGroup className="govuk-!-margin-left-2">
                <Tag colour='green'>Published</Tag>
              </TagGroup>
            }
          >
            Academic Year 2019/20
          </Details>

          <Details 
            summary="Academic Year 2018/19 (Live)" 
            summaryAfter={
              <TagGroup className="govuk-!-margin-left-2">
                <Tag colour='green'>Published</Tag>
              </TagGroup>
            }
          >
            Academic Year 2018/19
          </Details>

          <Details 
            summary="Academic Year 2017/18 (Live)" 
            summaryAfter={
              <TagGroup className="govuk-!-margin-left-2">
                <Tag colour='green'>Published</Tag>
              </TagGroup>
            }
          >
            Academic Year 2017/18
          </Details>

          <Details 
            summary="Academic Year 2016/17 (Live)" 
            summaryAfter={
              <TagGroup className="govuk-!-margin-left-2">
                <Tag colour='green'>Published</Tag>
              </TagGroup>
            }
          >
            Academic Year 2016/17
          </Details>
          
          <a href="#" className="govuk-!-margin-top-9">View more</a>
        */}
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
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td>
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
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td>
                    <a href="#">View</a>
                  </td>
                  <td>
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
