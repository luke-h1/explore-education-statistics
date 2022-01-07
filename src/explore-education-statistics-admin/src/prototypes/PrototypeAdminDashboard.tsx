import PageTitle from '@admin/components/PageTitle';
import Link from '@admin/components/Link';
import PrototypeChangeUserRole from '@admin/prototypes/components/PrototypeChangeUserRole';
import PrototypePage from '@admin/prototypes/components/PrototypePage';
import React, { useState } from 'react';
import ButtonGroup from '@common/components/ButtonGroup';
import Button from '@common/components/Button';
import { FormGroup, FormTextInput } from '@common/components/form';
import FormEditor from '@admin/components/form/FormEditor';
import ModalConfirm from '@common/components/ModalConfirm';
import useToggle from '@common/hooks/useToggle';
import { isTemplateExpression, isThrowStatement } from 'typescript';
import Details from '@common/components/Details';
import Tabs from '@common/components/Tabs';
import Tag from '@common/components/Tag';
import TabsSection from '@common/components/TabsSection';
import WarningMessage from '@common/components/WarningMessage';
import RelatedInformation from '@common/components/RelatedInformation';

const PrototypeManageUsers = () => {
  const [showDeleteUserModal, toggleDeleteUserModal] = useToggle(false);
  const [userName, setUserName] = useState('');
  const [roleType, setRoleType] = useState(false);
  const [showRoleModal, toggleRoleModal] = useToggle(false);
  const [showTeamMembers, toggleTeamMembers] = useToggle(true);

  return (
    <PrototypePage
      wide
      breadcrumbs={[{ name: 'Dashboard', link: '/dashboard' }]}
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <PageTitle title="Dashboard" caption="Welcome Bau1" />
          <p className="govuk-body-s">
            Logged in as <strong>Bau1</strong>. Not you?{' '}
            <a className="govuk-link govuk-link" href="/authentication/logout">
              Sign out
            </a>
          </p>
          <p>This is your administration dashboard - here you can:</p>
          <ul className="govuk-!-margin-bottom-6">
            <li>
              <a className="govuk-link" href="/dashboard">
                manage publications and releases
              </a>
            </li>
            <li>
              <a className="govuk-link" href="/themes">
                manage themes and topics
              </a>
            </li>
          </ul>
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
        <TabsSection title="Manage publications, releases and methodology">
          <p>Select publications to:</p>
          <ul className="govuk-list--bullet">
            <li>create new releases and methodologies</li>
            <li>edit exiting releases and methodologies</li>
            <li>view and sign-off releases and methodologies</li>
          </ul>
          <div className="govuk-form-group">
            <div className="dfe-flex dfe-flex-wrap">
              <div className="govuk-!-margin-right-4 govuk-!-width-one-third">
                <label htmlFor="theme" className="govuk-label">
                  Select theme
                </label>
                <select
                  name="theme"
                  id="theme"
                  className="govuk-select govuk-!-width-full"
                >
                  <option value="">Pupils and schools</option>
                </select>
              </div>
              <div className="govuk-!-width-one-third">
                <label htmlFor="topic" className="govuk-label">
                  Select topic
                </label>
                <select
                  name="topic"
                  id="topic"
                  className="govuk-select govuk-select govuk-!-width-full"
                >
                  <option value="">Pupil absence</option>
                </select>
              </div>
            </div>
          </div>

          <hr />

          <h2>Pupils and schools</h2>
          <h3>Pupil absence</h3>

          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col">Current publications</th>
                <th scope="col" className="govuk-table__cell--numeric">
                  <Tag>Draft</Tag>
                </th>
                <th scope="col" className="govuk-table__cell--numeric">
                  <Tag>In review</Tag>
                </th>
                <th scope="col" className="govuk-table__cell--numeric">
                  <Tag colour="blue">Scheduled</Tag>
                </th>
                <th scope="col" className="govuk-table__cell--numeric">
                  <Tag colour="green">Published</Tag>
                </th>
                <th className="govuk-table__cell--numeric">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pupil absence in schools in England</td>
                <td className="govuk-table__cell--numeric">1</td>
                <td className="govuk-table__cell--numeric">1</td>
                <td className="govuk-table__cell--numeric">0</td>
                <td className="govuk-table__cell--numeric">10</td>
                <td className="govuk-table__cell--numeric">
                  <Link to="/prototypes/admin-publication">
                    View{' '}
                    <span className="govuk-visually-hidden">
                      Pupil absence in schools in England
                    </span>
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Pupil absence in schools in England: autumn and spring</td>
                <td className="govuk-table__cell--numeric">2</td>
                <td className="govuk-table__cell--numeric">1</td>
                <td className="govuk-table__cell--numeric">1</td>
                <td className="govuk-table__cell--numeric">15</td>
                <td className="govuk-table__cell--numeric">
                  <Link to="/prototypes/admin-publication">
                    View{' '}
                    <span className="govuk-visually-hidden">
                      Pupil absence in schools in England
                    </span>
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Pupil absence in schools in England: autumn term</td>
                <td className="govuk-table__cell--numeric">1</td>
                <td className="govuk-table__cell--numeric">0</td>
                <td className="govuk-table__cell--numeric">1</td>
                <td className="govuk-table__cell--numeric">10</td>
                <td className="govuk-table__cell--numeric">
                  <Link to="/prototypes/admin-publication">
                    View{' '}
                    <span className="govuk-visually-hidden">
                      Pupil absence in schools in England
                    </span>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>

          <a href="#" className="govuk-button">
            Create new publication
          </a>
        </TabsSection>
        <TabsSection title="View draft releases (4)">
          <div style={{ width: '100%', overflow: 'auto' }}>
            <table className="govuk-table">
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th>Publication / Release period</th>
                  <th>State</th>
                  <th style={{ width: '210px' }}>Checklist</th>
                  <th colSpan={2} className="govuk-table__cell--numeric">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colSpan={6} scope="col" className="govuk-!-padding-top-6">
                    Pupil absence in schools in England
                  </th>
                </tr>
                <tr>
                  <td>Academic Year 2020/21 (Not live)</td>
                  <td>
                    <Tag>Draft</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View issues (9)"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list dfe-flex dfe-justify-content--space-between">
                        <li>
                          <Tag colour="red">
                            <span title="3 errors">3 ✖</span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="yellow">
                            <span title="3 Warnings">3 &#33;</span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="grey">
                            <span title="3 unresolved comments">
                              3 &#8216;&#8217;
                            </span>
                          </Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">
                      Edit{' '}
                      <span className="govuk-visually-hidden">
                        Academic Year 2019/20 (Not live), Pupil absence in
                        schools in England
                      </span>
                    </a>
                  </td>
                  <td />
                </tr>
                <tr>
                  <td>Academic Year 2019/20 (Not live)</td>
                  <td>
                    <Tag>In review</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View issues (1)"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list dfe-flex dfe-justify-content--space-between">
                        <li>
                          <Tag colour="green">
                            <span title="o errors">0 ✖</span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="yellow">
                            <span title="1 Warning">1 &#33;</span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="green">
                            <span title="0 unresolved comments">
                              0 &#8216;&#8217;
                            </span>
                          </Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td className="govuk-table__cell--numeric">
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
                  <th colSpan={6} scope="col" className="govuk-!-padding-top-6">
                    Pupil absence in schools in England: autumn and spring
                  </th>
                </tr>
                <tr>
                  <td>Academic Year 2020/21 (Not live)</td>
                  <td>
                    <Tag>Draft</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View issues (9)"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list dfe-flex dfe-justify-content--space-between">
                        <li>
                          <Tag colour="red">
                            <span title="3 errors">3 ✖</span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="yellow">
                            <span title="3 Warnings">3 &#33;</span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="grey">
                            <span title="3 unresolved comments">
                              3 &#8216;&#8217;
                            </span>
                          </Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td className="govuk-table__cell--numeric">
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
                  <th colSpan={6} scope="col" className="govuk-!-padding-top-6">
                    Pupil absence in schools in England: autumn term
                  </th>
                </tr>
                <tr>
                  <td>Academic Year 2020/21 (Not live)</td>
                  <td>
                    <Tag>Draft</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View issues (9)"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list dfe-flex dfe-justify-content--space-between">
                        <li>
                          <Tag colour="red">
                            <span title="3 errors">3 ✖</span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="yellow">
                            <span title="3 Warnings">3 &#33;</span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="grey">
                            <span title="3 unresolved comments">
                              3 &#8216;&#8217;
                            </span>
                          </Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">
                      Edit{' '}
                      <span className="govuk-visually-hidden">
                        Academic Year 2019/20 (Not live)
                      </span>
                    </a>
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </TabsSection>
        <TabsSection title="View scheduled releases (4)">
          <div style={{ width: '100%', overflow: 'auto' }}>
            <table className="govuk-table">
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th>Publication / Release period</th>
                  <th>State</th>
                  <th>Status</th>
                  <th style={{ width: '210px' }}>Checklist</th>
                  <th style={{ width: '190px' }}>Details / notes</th>
                  <th>Publish date</th>
                  <th colSpan={2} className="govuk-table__cell--numeric">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colSpan={7} scope="col" className="govuk-!-padding-top-6">
                    Pupil absence in schools in England
                  </th>
                </tr>
                <tr>
                  <td>Academic Year 2020/21 (Not live)</td>
                  <td>
                    <Tag>Approved</Tag>
                  </td>
                  <td>
                    <Tag colour="red">Validating</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View stages"
                      className="govuk-!-margin-bottom-0"
                    >
                      <h4>Not started</h4>
                      <ul className="govuk-list">
                        <li>
                          <Tag colour="red">
                            Data ✖{' '}
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="red">
                            Content ✖{' '}
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="red">
                            Files ✖{' '}
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="red">
                            Publishing ✖
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>{' '}
                          </Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td>
                    <Details
                      summary="View details"
                      className="govuk-!-margin-bottom-0"
                    >
                      <h4 className="govuk-!-margin-bottom-0">
                        Internal notes
                      </h4>
                      <p>Approved by UI tests</p>
                      <h4 className="govuk-!-margin-bottom-0">Next release</h4>
                      <p>January 2023</p>
                    </Details>
                  </td>
                  <td>10 January 2022</td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">
                      View{' '}
                      <span className="govuk-visually-hidden">
                        Academic Year 2019/20 (Not live)
                      </span>
                    </a>
                  </td>
                  <td />
                </tr>

                <tr>
                  <th colSpan={6} scope="col" className="govuk-!-padding-top-6">
                    Pupil absence in schools in England: autumn and spring
                  </th>
                </tr>
                <tr>
                  <td>Academic Year 2020/21 (Not live)</td>
                  <td>
                    <Tag>Approved</Tag>
                  </td>
                  <td>
                    <Tag colour="red">Validating</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View stages"
                      className="govuk-!-margin-bottom-0"
                    >
                      <h4>Not started</h4>
                      <ul className="govuk-list">
                        <li>
                          <Tag colour="red">
                            Data ✖{' '}
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="red">
                            Content ✖{' '}
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="red">
                            Files ✖{' '}
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="red">
                            Publishing ✖
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>{' '}
                          </Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td>
                    <Details
                      summary="View details"
                      className="govuk-!-margin-bottom-0"
                    >
                      <h4 className="govuk-!-margin-bottom-0">
                        Internal notes
                      </h4>
                      <p>Approved by UI tests</p>
                      <h4 className="govuk-!-margin-bottom-0">Next release</h4>
                      <p>January 2023</p>
                    </Details>
                  </td>
                  <td>10 January 2022</td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">
                      View{' '}
                      <span className="govuk-visually-hidden">
                        Academic Year 2019/20 (Not live)
                      </span>
                    </a>
                  </td>
                  <td />
                </tr>

                <tr>
                  <th colSpan={6} scope="col" className="govuk-!-padding-top-6">
                    Pupil absence in schools in England: autumn term
                  </th>
                </tr>
                <tr>
                  <td>Academic Year 2020/21 (Not live)</td>
                  <td>
                    <Tag>Approved</Tag>
                  </td>
                  <td>
                    <Tag colour="red">Validating</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View stages"
                      className="govuk-!-margin-bottom-0"
                    >
                      <h4>Not started</h4>
                      <ul className="govuk-list">
                        <li>
                          <Tag colour="red">
                            Data ✖{' '}
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="red">
                            Content ✖{' '}
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="red">
                            Files ✖{' '}
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>
                          </Tag>
                        </li>
                        <li>
                          <Tag colour="red">
                            Publishing ✖
                            <span className="govuk-visually-hidden">
                              Not started
                            </span>{' '}
                          </Tag>
                        </li>
                      </ul>
                    </Details>
                  </td>
                  <td>
                    <Details
                      summary="View details"
                      className="govuk-!-margin-bottom-0"
                    >
                      <h4 className="govuk-!-margin-bottom-0">
                        Internal notes
                      </h4>
                      <p>Approved by UI tests</p>
                      <h4 className="govuk-!-margin-bottom-0">Next release</h4>
                      <p>January 2023</p>
                    </Details>
                  </td>
                  <td>10 January 2022</td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">
                      View{' '}
                      <span className="govuk-visually-hidden">
                        Academic Year 2019/20 (Not live)
                      </span>
                    </a>
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </TabsSection>
      </Tabs>
    </PrototypePage>
  );
};

export default PrototypeManageUsers;
