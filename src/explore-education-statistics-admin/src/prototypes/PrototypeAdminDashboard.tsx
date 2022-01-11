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
  const [showCreatePub, setShowCreatePub] = useState(true);
  const [showBau, setShowBau] = useState(false);

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
        <TabsSection title="Your publications">
          <h2>View and manage your publications</h2>
          <p>Select a publication to:</p>
          <ul className="govuk-list--bullet">
            <li>create new releases and methodologies</li>
            <li>edit existing releases and methodologies</li>
            <li>view and sign-off releases and methodologies</li>
          </ul>
          {showBau && (
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
          )}

          {!showBau && (
            <>
              <hr />
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-three-quarters">
                  <h3>Pupils and schools / exclusions</h3>
                  <ul className="govuk-list">
                    <li>
                      <Link to="/prototypes/admin-publication">
                        Permanent and fixed-period exclusions in England
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="govuk-grid-column-one-quarter">
                  <div className="dfe-align--right">
                    {showCreatePub && (
                      <a href="#" className="govuk-button">
                        Create new publication
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <hr />
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-three-quarters">
              <h3>Pupils and schools / pupil absence</h3>
              <ul className="govuk-list">
                <li>
                  <Link to="/prototypes/admin-publication">
                    Pupil absence in schools in England
                  </Link>
                </li>
                <li>
                  <Link to="/prototypes/admin-publication">
                    Pupil absence in schools in England: autumn and spring
                  </Link>
                </li>
                <li>
                  <Link to="/prototypes/admin-publication">
                    Pupil absence in schools in England: autumn term
                  </Link>
                </li>
              </ul>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <div className="dfe-align--right">
                {showCreatePub && (
                  <a href="#" className="govuk-button">
                    Create new publication
                  </a>
                )}
              </div>
            </div>
          </div>

          {!showBau && (
            <>
              <hr />
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-three-quarters">
                  <h3>Pupils and schools / school applications</h3>
                  <ul className="govuk-list">
                    <li>
                      <Link to="/prototypes/admin-publication">
                        Secondary and primary school applications and offers
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="govuk-grid-column-one-quarter">
                  <div className="dfe-align--right">
                    {showCreatePub && (
                      <a href="#" className="govuk-button">
                        Create new publication
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsSection>
        <TabsSection title="Draft releases (4)">
          <div style={{ width: '100%', overflow: 'auto' }}>
            <table className="govuk-table">
              <caption className="govuk-table__caption--m">
                Edit draft releases
              </caption>
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th style={{ width: '38%' }}>Publication / Release period</th>
                  <th colSpan={2} style={{ width: '55%' }}>
                    Status
                  </th>
                  <th className="govuk-table__cell--numeric">Actions</th>
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
                  <td style={{ width: '12%' }}>
                    <Tag>Draft</Tag>
                  </td>
                  <td>
                    <Details
                      summary="View issues (9)"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list dfe-flex dfe-justify-content--space-between">
                        <li>
                          <Tag colour="red">3 Errors</Tag>
                        </li>
                        <li>
                          <Tag colour="yellow">3 Warnings</Tag>
                        </li>
                        <li>
                          <Tag colour="grey">3 Unresolved comments</Tag>
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
                          <Tag colour="yellow">1 Warning</Tag>
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
                          <Tag colour="red">3 Errors</Tag>
                        </li>
                        <li>
                          <Tag colour="yellow">3 Warnings</Tag>
                        </li>
                        <li>
                          <Tag colour="grey">3 Unresolved comments</Tag>
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
                      summary="View issues (6)"
                      className="govuk-!-margin-bottom-0"
                    >
                      <ul className="govuk-list dfe-flex">
                        <li>
                          <Tag colour="red">3 Errors</Tag>
                        </li>
                        <li>
                          <Tag colour="yellow">3 Warnings</Tag>
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
        <TabsSection title="Scheduled releases (3)">
          <div style={{ width: '100%', overflow: 'auto' }}>
            <table className="govuk-table">
              <caption className="govuk-table__caption--m">
                View scheduled releases
              </caption>
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th style={{ width: '38%' }}>Publication / Release period</th>
                  <th colSpan={2} style={{ width: '30%' }}>
                    Status
                  </th>
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
                    <Tag colour="red">Validating</Tag>
                  </td>
                  <td style={{ width: '210px' }}>
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
                    <Tag colour="blue">Scheduled</Tag>
                  </td>
                  <td>-</td>
                  <td>20 January 2022</td>
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
      <div className="dfe-align--right govuk-!-margin-top-9">
        <ul className="govuk-list">
          <li>
            {showCreatePub ? (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowCreatePub(false);
                }}
              >
                Remove create role
              </a>
            ) : (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowCreatePub(true);
                }}
              >
                Add create role
              </a>
            )}
          </li>
          <li>
            {showBau ? (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowBau(false);
                }}
              >
                Remove BAU role
              </a>
            ) : (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowBau(true);
                }}
              >
                Add BAU role
              </a>
            )}
          </li>
        </ul>
      </div>
    </PrototypePage>
  );
};

export default PrototypeManageUsers;
