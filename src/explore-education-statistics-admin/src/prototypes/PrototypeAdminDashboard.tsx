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

          <p>Current publications:</p>
          <ul className="govuk-list govuk-list--spaced govuk-!-margin-bottom-9">
            <li>
              <Link to="/prototypes/admin-publication">
                Pupil absence in schools in England
              </Link>
            </li>
            <li>
              <Link to="/admin-publication">
                Pupil absence in schools in England: autumn and spring
              </Link>
            </li>
            <li>
              <Link to="/admin-publication">
                Pupil absence in schools in England: autumn term
              </Link>
            </li>
          </ul>

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
                  <th>Status</th>
                  <th style={{ width: '210px' }}>Checklist</th>
                  <th style={{ width: '180px' }}>Publish date</th>
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
                  <td>Academic Year 2019/20 (Not live)</td>
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
