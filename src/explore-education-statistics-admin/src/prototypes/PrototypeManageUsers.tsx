import PageTitle from '@admin/components/PageTitle';
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
import TabsSection from '@common/components/TabsSection';

const PrototypeManageUsers = () => {
  const [edit, setEdit] = useState(false);
  const [newEntry, setNewEntry] = useState(false);
  const [editItem, setEditItem] = useState('');
  const [showDeleteModal, toggleDeleteModal] = useToggle(false);
  const [showDeleteUserModal, toggleDeleteUserModal] = useToggle(false);
  const [userName, setUserName] = useState('');
  const [releaseName, setReleaseName] = useState('');

  const glossaryList = [
    {
      name: 'Absence',
      description: `<p>When a pupil misses (or is absent from) at least 1 possible school session.</p><p>Counted in sessions, where 1 session is equivalent to half-a-day.</p><p>There are 4 types of absence:</p><ul><li><a href="/glossary#authorised-absence">authorised absence</a></li><li><a href="/glossary#overall-absence">overall absence</a></li><li><a href="/glossary#persistent-absence">persistent absence</a></li><li><a href="/glossary#unauthorised-absence">unauthorised absence</a></li></ul>`,
      log: '-',
    },
    {
      name: 'Academic year',
      description: `<p>Lasts from 31 August to 31 July. Generally broken into 3 terms - autumn, spring and summer.</p>`,
      log: '-',
    },
    {
      name: 'Ad hoc statistics',
      description: `<p>Releases of statistics which are not part of DfE's regular annual official statistical release calendar.</p>`,
      log: '14 July 2020, 16:52',
    },
    {
      name: 'Authorised absence',
      description: `<p>Releases of statistics which are not part of DfE's regular annual official statistical release calendar.</p>`,
      log: '-',
    },
    {
      name: 'Dual main registered pupils',
      description: `<p>Dual registered pupils who are enrolled at more than 1 school have a dual main registration (at their main school) and 1 or more subsidiary registrations (at their additional schools).</p><p>See also <a href="/glossary#dual-registered-pupils">Dual registered pupils</a>.</p>`,
      log: '-',
    },
    {
      name: 'Dual registered pupils',
      description: `<p>Pupils who are enrolled at more than 1 school.</p><p>See also <a href="/glossary#dual-main-registered-pupils">dual main registered pupils</a>.</p>`,
      log: '10 July 2020 12:34',
    },
    {
      name: 'Exclusion',
      description: `<p>When a pupil is not allowed to attend (or is excluded from) a school.</p><p>There are 2 types of exclusion:</p><ul><li><a href="/glossary#fixed-period-exclusion">fixed-period exclusion</a></li><li><a href="/glossary#permanent-exclusion">permanent exclusion</a></li></ul>`,
      log: '-',
    },
  ];

  glossaryList.sort((a, b) => (a.name > b.name ? 1 : -1));

  const findItem = glossaryList.find(item => item.name === editItem);

  let glossaryName = findItem?.name;
  const glossaryDescription = findItem?.description;

  const currentReleases = [
    'Academic year 20 / 21',
    'Academic year 19 / 20',
    'Academic year 18 / 19',
    'Academic year 17 / 18',
  ];

  const userList = [
    {
      name: 'Andrea',
      surname: 'Adams',
      releases: [
        {
          release: currentReleases[0],
          role: false,
        },
        {
          release: currentReleases[1],
          role: false,
        },
        {
          release: currentReleases[2],
          role: true,
        },
        {
          release: currentReleases[3],
          role: true,
        },
      ],
    },
    {
      name: 'Ben',
      surname: 'Browne',
      releases: [
        {
          release: currentReleases[0],
          role: false,
        },
        {
          release: currentReleases[1],
          role: true,
        },
        {
          release: currentReleases[2],
          role: true,
        },
        {
          release: currentReleases[3],
          role: true,
        },
      ],
    },
    {
      name: 'Charlie',
      surname: 'Cheeseman',
      releases: [
        {
          release: currentReleases[0],
          role: true,
        },
        {
          release: currentReleases[1],
          role: true,
        },
        {
          release: currentReleases[2],
          role: true,
        },
        {
          release: currentReleases[3],
          role: true,
        },
      ],
    },
  ];

  return (
    <PrototypePage
      wide
      breadcrumbs={[
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'Manage users', link: '#' },
      ]}
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <PageTitle title="Manage users" caption="Publication title" />
        </div>
      </div>

      {edit && (
        <>
          <form id="createMetaForm" className="govuk-!-marin-bottom-9">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
              <h2 className="govuk-heading-m">
                {newEntry ? 'Add new glossary item' : 'Update glossary item'}
              </h2>
            </legend>
            <FormGroup>
              <FormTextInput
                id="name"
                name="name"
                label="Glossary item"
                value={glossaryName}
                className="govuk-!-width-one-half"
                onChange={event => {
                  glossaryName = event.target.value;
                }}
              />
            </FormGroup>
            <FormEditor
              id="description"
              label="Item description"
              value={glossaryDescription || ''}
              onChange={() => {
                setEdit(true);
              }}
            />
            <div className="govuk-!-margin-top-9 govuk-grid-row">
              <div className="govuk-grid-column-one-half">
                <Button
                  className="govuk-!-margin-right-3"
                  onClick={() => {
                    setEdit(false);
                  }}
                >
                  Save
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => {
                    setEdit(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
              <div className="govuk-grid-column-one-half dfe-align--right">
                {!newEntry && (
                  <>
                    <Button
                      variant="warning"
                      onClick={() => {
                        toggleDeleteModal(true);
                      }}
                    >
                      Delete this item
                    </Button>
                    <ModalConfirm
                      open={showDeleteModal}
                      title="Confirm delete"
                      onExit={() => toggleDeleteModal(false)}
                      onConfirm={() => toggleDeleteModal(false)}
                      onCancel={() => toggleDeleteModal(false)}
                    >
                      <p>Are you sure you want to delete this item?</p>
                    </ModalConfirm>
                  </>
                )}
              </div>
            </div>
          </form>
        </>
      )}
      {!edit && (
        <Tabs id="manage-release-users">
          <TabsSection title="Manage existing users">
            <form className="govuk-!-margin-bottom-9">
              <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                  Update access for latest release (Academic year 20 / 21)
                </legend>
                {userList.map((item, index) => (
                  <div
                    className="dfe-flex dfe-flex-wrap dfe-align-items--center dfe-justify-content--space-between dfe-flex-underline"
                    key={index.toString()}
                  >
                    <h2 className="govuk-heading-s govuk-!-margin-bottom-0 dfe-flex-basis--50">{`${item.name} ${item.surname}`}</h2>
                    <PrototypeChangeUserRole
                      selectedRole={item.releases[0].role}
                      name={`${item.name} ${item.surname}`}
                      release="All releases"
                      roleId={`${index}`}
                      className="dfe-flex-basis--30 govuk-!-margin-top-1 govuk-!-margin-bottom-1"
                    />

                    <div className="dfe-align--right dfe-flex-basis--10">
                      <a
                        href="#"
                        onClick={() => {
                          toggleDeleteUserModal(true);
                          setUserName(`${item.name} ${item.surname}`);
                        }}
                      >
                        Remove user
                      </a>
                    </div>

                    {/*<div className="dfe-flex-basis--100">
                      <Details summary="Individual releases">
                        {item.releases.map((item2, index2) =>(
                          <>
                            <div className={`dfe-flex dfe-align-items--center ${index2 < (item.releases.length-1) ? 'dfe-flex-underline' : ''}`} key={index2.toString()}>
                              <div className="dfe-flex-basis--60 dfe-align--right govuk-!-padding-2">
                                <PrototypeChangeUserRole 
                                  selectedRole={item2.role} 
                                  name={`${item.name} ${item.surname}`} 
                                  release={item2.release}
                                  roleId={`${index}-${index2}`} 
                                />
                              </div>
                              <div className="dfe-flex-basis--40 dfe-align--right">
                                <a
                                  href="#"
                                  onClick={() => {
                                    toggleDeleteUserModal(true);
                                    setUserName(`${item.name} ${item.surname}`);
                                    setReleaseName(item2.release);
                                  }}
                                >
                                  Remove
                                </a>
                              </div>
                            </div>
                          </>
                        ))}
                      </Details>
                    </div>*/}
                    <ModalConfirm
                      open={showDeleteUserModal}
                      title="Confirm user delete"
                      onExit={() => toggleDeleteUserModal(false)}
                      onConfirm={() => toggleDeleteUserModal(false)}
                      onCancel={() => toggleDeleteUserModal(false)}
                    >
                      <p>
                        Are you sure you want to delete{' '}
                        <strong>{userName}</strong>?
                      </p>
                      <p>
                        From release:{' '}
                        <strong>{releaseName || 'All releases'}</strong>
                      </p>
                    </ModalConfirm>
                  </div>
                ))}
                <div className="dfe-flex dfe-flex-wrap dfe-align-items--center dfe-justify-content--space-between govuk-!-padding-bottom-3 govuk-!-margin-top-9">
                  <div className="govuk-checkboxes__item">
                    <input
                      type="checkbox"
                      className="govuk-checkboxes__input"
                      name="role"
                      id="role-all"
                    />
                    <label
                      htmlFor="role-all"
                      className="govuk-label govuk-checkboxes__label"
                    >
                      Grant access to all users listed above
                    </label>
                  </div>
                </div>
              </fieldset>
            </form>
            <h2 className="govuk-heading-m">Previous releases</h2>
            {currentReleases.map((item, index) => (
              <div key={index.toString()}>
                <Details summary={item}>Test</Details>
              </div>
            ))}
          </TabsSection>
          <TabsSection title="Invite new users">
            <form>
              <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                  Invite new user to access current releases
                </legend>
                <p className="govuk-hint">
                  The invited user must have an @education.gov.uk email address
                </p>
                <FormGroup>
                  <FormTextInput
                    id="inviteEmail"
                    name="inviteEmail"
                    label="Email address"
                    className="govuk-!-width-three-quarters"
                  />
                </FormGroup>
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                    Set user role for all or individually selected releases
                  </legend>
                  <PrototypeChangeUserRole
                    selectedRole
                    name="Invited user"
                    release="All releases"
                    roleId="invited-user-1"
                    type="invite"
                  />

                  <Details
                    summary="Set roles for individual releases"
                    className="govuk-!-margin-top-6"
                  >
                    {currentReleases.map((item, index) => (
                      <>
                        <div
                          className={`dfe-flex dfe-align-items--center ${
                            index < currentReleases.length - 1
                              ? 'dfe-flex-underline'
                              : ''
                          }`}
                          key={index.toString()}
                        >
                          <div className="dfe-flex-basis--30 dfe-align--right govuk-!-padding-2">
                            <PrototypeChangeUserRole
                              selectedRole
                              name="Invited user"
                              release={item}
                              roleId={`invite-${index}`}
                              type="invite"
                            />
                          </div>
                        </div>
                      </>
                    ))}
                  </Details>
                  <ButtonGroup>
                    <Button>Send invite</Button>
                  </ButtonGroup>
                </fieldset>
              </fieldset>
            </form>
          </TabsSection>
        </Tabs>
      )}
    </PrototypePage>
  );
};

export default PrototypeManageUsers;
