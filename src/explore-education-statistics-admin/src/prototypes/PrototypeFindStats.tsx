import PrototypePage from '@admin/prototypes/components/PrototypePage';
import React, { useState } from 'react';
import classNames from 'classnames';
import Accordion from '@common/components/Accordion';
import AccordionSection from '@common/components/AccordionSection';
import styles2 from '@common/components/PageSearchForm.module.scss';
import { FormCheckboxGroup, FormRadioGroup } from '@common/components/form';
import PrototypeSearchResult from '@admin/prototypes/components/PrototypeSearchResult';
import styles from './PrototypePublicPage.module.scss';

const PrototypeFindStats = () => {
  const [showTopics, setShowTopics] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('');
  const [topic, setTopic] = useState('');
  const [releaseType, setReleaseType] = useState('');

  const showAll = theme === 'all-themes';
  const showExclusions = topic === 'exclusions';
  const showSchoolCapacity = topic === 'school-capacity';
  const showSearchResult =
    searchTerm === 'fsm' || searchTerm === 'free school meals';

  const selectedTheme = 'All themes';

  let searchTally = '62';

  let searchQuery = 'Showing all publications';

  if (showSchoolCapacity) {
    searchTally = releaseType === 'adhoc' ? '1' : '3';
    searchQuery = 'From: Pupils and schools, school capacity';
  } else if (showExclusions) {
    searchTally = '1';
    searchQuery = 'From: Pupils and schools, schools exclusions';
  } else if (showSearchResult) {
    searchTally = '1';
    searchQuery = searchTerm;
  }
  if (showAll) {
    searchTally = '62';
    searchQuery = 'Showing all publications';
  }

  return (
    <div className={styles.prototypePublicPage}>
      <PrototypePage title="Find statistics and data" wide>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <form>
              <div
                className="govuk-form-group govuk-!-margin-bottom-9"
                style={{ position: 'relative' }}
              >
                <h2 className="govuk-label-wrapper">
                  <label
                    className="govuk-label govuk-label--m"
                    htmlFor="search"
                  >
                    Search
                  </label>
                </h2>

                <input
                  type="text"
                  id="search"
                  className="govuk-input"
                  onChange={e => setSearchInput(e.target.value)}
                />
                <button
                  type="submit"
                  className={styles2.searchButton}
                  value="Search"
                  onClick={e => {
                    e.preventDefault();
                    console.log(searchInput);
                    setSearchTerm(searchInput);
                  }}
                >
                  <span className="govuk-visually-hidden">Search</span>
                </button>
              </div>
            </form>
            <h2 className="govuk-heading-m">Filter results</h2>

            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              <FormRadioGroup
                className="govuk-!-padding-left-2"
                id="theme"
                legend="Select a theme"
                legendSize="s"
                name="theme"
                value={theme}
                small
                onChange={e => {
                  setTheme(e.target.value);
                }}
                options={[
                  {
                    label: 'All themes',
                    value: 'all-themes',
                    defaultChecked: true,
                  },
                  {
                    label: "Children's social care",
                    value: 'childrens-social',
                  },
                  {
                    label: 'Covid 19',
                    value: 'covid-19',
                  },
                  {
                    label: 'Destinations of pupils and students',
                    value: 'destination-pupils',
                  },
                  {
                    label: 'Early years',
                    value: 'early-years',
                  },
                  {
                    label: 'Financing and funding',
                    value: 'finance-funding',
                  },
                  {
                    label: 'Further education',
                    value: 'further-educaton',
                    conditional: (
                      <FormCheckboxGroup
                        id="topics"
                        legend="Choose topic"
                        legendSize="s"
                        small
                        name="topic"
                        hint="Select one or more topics to filter results for this theme"
                        value={[topic]}
                        onChange={e => {
                          setTopic(e.target.value);
                        }}
                        options={[
                          { label: 'FE choices', value: 'fe-choices' },
                          {
                            label: 'Further education and skills',
                            value: 'fe-skills',
                          },
                          {
                            label: 'Further education outcomes',
                            value: 'fe-outcomes',
                          },
                        ]}
                      />
                    ),
                  },
                  {
                    label: 'Higher education',
                    value: 'higher-educaton',
                    conditional: (
                      <FormCheckboxGroup
                        id="topics"
                        legend="Choose topic"
                        legendSize="s"
                        small
                        name="topic"
                        hint="Select one or more topics to filter results for this theme"
                        value={[topic]}
                        onChange={e => {
                          setTopic(e.target.value);
                        }}
                        options={[
                          {
                            label: 'Education exports',
                            value: 'education-exports',
                          },
                          {
                            label:
                              'Higher education graduate employment and earnings',
                            value: 'grad-earnings',
                          },
                          {
                            label: 'Participation measures in higher education',
                            value: 'participation-he',
                          },
                          {
                            label: 'Skills Bill: Higher level learners',
                            value: 'skills-bill',
                          },
                          {
                            label: 'Widening participation in higher education',
                            value: 'widening-participation',
                          },
                        ]}
                      />
                    ),
                  },
                  {
                    label: 'Pupils and schools',
                    value: 'pupils-and-schools',
                    conditional: (
                      <FormCheckboxGroup
                        id="topics"
                        legend="Choose topic"
                        legendSize="s"
                        small
                        name="topic"
                        hint="Select one or more topics to filter results for this theme"
                        value={[topic]}
                        onChange={e => {
                          setTopic(e.target.value);
                        }}
                        options={[
                          {
                            label: 'Academy transfers',
                            value: 'academy-transfers',
                          },
                          {
                            label: 'Admission appeals',
                            value: 'admission-appeals',
                          },
                          { label: 'Exclusions', value: 'exclusions' },
                          {
                            label: 'Parental repsonsibility measures',
                            value: 'resposibility-measures',
                          },
                          {
                            label: 'Pupil absence',
                            value: 'pupil-absence',
                          },
                          {
                            label: 'School and pupil numbers',
                            value: 'school-pupil-numbers',
                          },
                          {
                            label: 'School applications',
                            value: 'school-applications',
                          },
                          {
                            label: 'School capacity',
                            value: 'school-capacity',
                          },
                          {
                            label: 'Special educational needs (SEN)',
                            value: 'sen',
                          },
                        ]}
                      />
                    ),
                  },
                  {
                    label: 'Schools and college outcomes and performance',
                    value: 'school-college-performance',
                  },
                  {
                    label: 'Teachers and school workforce',
                    value: 'teachers-workforce',
                  },
                  {
                    label: 'UK training and education statistics',
                    value: 'uk-training-stats',
                    conditional: (
                      <FormCheckboxGroup
                        id="topics2"
                        legend="Choose topic"
                        legendSize="s"
                        small
                        name="topic"
                        value={[topic]}
                        onChange={e => setTopic(e.target.value)}
                        options={[
                          { label: 'Test 1', value: 'test-1' },
                          { label: 'Test 3', value: 'test-2' },
                          { label: 'Test 3', value: 'test-3' },
                        ]}
                      />
                    ),
                  },
                ]}
              />
            </div>

            <h2 className="govuk-heading-m govuk-!-margin-top-6">
              Other filters
            </h2>

            <Accordion id="filters">
              <AccordionSection heading="Release type" goToTop={false}>
                <div className="govuk-form-group">
                  <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                      Filter by release type
                    </legend>
                    <div
                      className="govuk-checkboxes govuk-checkboxes--small"
                      data-module="govuk-checkboxes"
                    >
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="release-show-all"
                          name="release-type"
                          type="checkbox"
                          value="showAll"
                          onChange={e => setReleaseType(e.target.value)}
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="release-show-all"
                        >
                          Show all
                        </label>
                      </div>
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="release-type1"
                          name="release-type"
                          type="checkbox"
                          value="national"
                          onChange={e => setReleaseType(e.target.value)}
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="release-type1"
                        >
                          National statistics
                        </label>
                      </div>
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="release-type2"
                          name="release-type"
                          type="checkbox"
                          value="official"
                          onChange={e => setReleaseType(e.target.value)}
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="release-type2"
                        >
                          Official statistics
                        </label>
                      </div>
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="release-type3"
                          name="release-type"
                          type="checkbox"
                          value="adhoc"
                          onChange={e => setReleaseType(e.target.value)}
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="release-type3"
                        >
                          Ad hoc statistics
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </AccordionSection>
              <AccordionSection heading="Geographical coverage" goToTop={false}>
                <div className="govuk-form-group">
                  <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                      Filter by geographical coverage
                    </legend>
                    <div
                      className="govuk-checkboxes govuk-checkboxes--small"
                      data-module="govuk-checkboxes"
                    >
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="type-show-all"
                          name="type"
                          type="checkbox"
                          value="showAll"
                          onChange={e => setReleaseType(e.target.value)}
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="type-show-all"
                        >
                          Show all
                        </label>
                      </div>
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="type1"
                          name="type"
                          type="checkbox"
                          value="type1"
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="type1"
                        >
                          National
                        </label>
                      </div>
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="type2"
                          name="type"
                          type="checkbox"
                          value="type2"
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="type2"
                        >
                          Local authority
                        </label>
                      </div>
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="type3"
                          name="type"
                          type="checkbox"
                          value="type3"
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="type3"
                        >
                          Parliamentary constituency
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </AccordionSection>
              <AccordionSection heading="Organisation" goToTop={false}>
                <div className="govuk-form-group">
                  <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                      Filter by organisation
                    </legend>
                    <div
                      className="govuk-checkboxes govuk-checkboxes--small"
                      data-module="govuk-checkboxes"
                    >
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="org-show-all"
                          name="org"
                          type="checkbox"
                          value="showAll"
                          checked
                          onChange={e => setReleaseType(e.target.value)}
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="type-show-all"
                        >
                          Show all
                        </label>
                      </div>
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="org1"
                          name="org"
                          type="checkbox"
                          value="org1"
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="org1"
                        >
                          Department for Education (DfE)
                        </label>
                      </div>
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="org2"
                          name="org"
                          type="checkbox"
                          value="org2"
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="org2"
                        >
                          Ministry of Justice (MoJ)
                        </label>
                      </div>
                      <div className="govuk-checkboxes__item">
                        <input
                          className="govuk-checkboxes__input"
                          id="org3"
                          name="org"
                          type="checkbox"
                          value="org3"
                        />
                        <label
                          className="govuk-label govuk-checkboxes__label"
                          htmlFor="org3"
                        >
                          Ofsted
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </AccordionSection>
            </Accordion>
          </div>
          <div className="govuk-grid-column-two-thirds">
            <div className="govuk-grid-row">
              <div
                className="govuk-grid-column-one-half"
                role="region"
                aria-live="polite"
                aria-atomic="true"
              >
                <h2 className="govuk-!-margin-bottom-0">
                  {searchTally} result(s)
                  <span className="govuk-heading-s govuk-!-margin-bottom-0">
                    {searchQuery}
                  </span>
                </h2>
                <p className="govuk-visually-hidden">
                  Sorted by newest publications
                </p>
                <a href="#searchResults" className="govuk-skip-link">
                  Skip to search results
                </a>
              </div>
              <div className="govuk-grid-column-one-half">
                <div className="govuk-form-group">
                  <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s govuk-!-margin-bottom-0">
                      Sort results
                    </legend>
                  </fieldset>
                  <div className="govuk-radios govuk-radios--small  govuk-radios--inline">
                    <div className="govuk-radios__item">
                      <input
                        type="radio"
                        className="govuk-radios__input"
                        name="sort"
                        id="sort-1"
                        checked
                      />
                      <label
                        className={classNames(
                          'govuk-label',
                          'govuk-radios__label',
                        )}
                        htmlFor="sort-1"
                      >
                        Newest
                      </label>
                    </div>
                    <div className="govuk-radios__item">
                      <input
                        type="radio"
                        className="govuk-radios__input"
                        name="sort"
                        id="sort-2"
                      />
                      <label
                        className={classNames(
                          'govuk-label',
                          'govuk-radios__label',
                        )}
                        htmlFor="sort-2"
                      >
                        Oldest
                      </label>
                    </div>
                    <div className="govuk-radios__item">
                      <input
                        type="radio"
                        className="govuk-radios__input"
                        name="sort"
                        id="sort-3"
                      />
                      <label
                        className={classNames(
                          'govuk-label',
                          'govuk-radios__label',
                        )}
                        htmlFor="sort-3"
                      >
                        A to Z
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div id="searchResults">
              {((!showExclusions && !showSchoolCapacity && !showSearchResult) ||
                theme === 'all-themes') && (
                <>
                  <PrototypeSearchResult
                    title="Laptops and tablets data"
                    summary="How many laptops, tablets and routers we've delivered to help disadvantaged children and young people access education."
                    theme="COVID 19"
                    topic="Devices"
                    type="Official statistics"
                    org="Department for Education (DfE)"
                    published="8 March 2022"
                  />

                  <PrototypeSearchResult
                    title="NEET age 16 to 24"
                    summary="Estimates from the Labour Force Survey of young people not in education, employment or training (NEET) in England."
                    theme="Destination of pupils and students"
                    topic="NEET and participation"
                    type="National statistics"
                    org="Department for Education (DfE)"
                    published="24 February 2022"
                  />

                  <PrototypeSearchResult
                    title="Apprenticeships and traineeships"
                    summary="onthly apprenticeship starts to November 2021, and official statistics covering the apprenticeship service and find an apprenticeship."
                    theme="Further education"
                    topic="Further education and skills"
                    type="Official statistics"
                    org="Department for Education (DfE)"
                    published="24 February 2022"
                  />

                  <PrototypeSearchResult
                    title="Children's social work workforce"
                    summary="Information about children's social workers employed in local authorities and agency social workers"
                    theme="Children's social care"
                    topic="Children's social work workforce"
                    type="Official statistics"
                    org="Department for Education (DfE)"
                    published="24 February 2022"
                  />

                  <PrototypeSearchResult
                    title="Attendance in education and early years settings during the coronavirus (COVID-19) pandemic"
                    summary="A summary of attendance in education settings up to 10 February 2022."
                    theme="COVID 19"
                    topic="Attendance"
                    type="Official statistics"
                    org="Department for Education (DfE)"
                    published="24 February 2022"
                  />

                  <PrototypeSearchResult
                    title="Further education and skills"
                    summary="Statistics covering further education and skills summary data, including apprenticeships and detailed non-apprenticeship adult further education, in England (August to October 2021, reported to date)."
                    theme="Further education"
                    topic="Further education and skills"
                    type="National statistics"
                    org="Department for Education (DfE)"
                    published="24 January 2022"
                  />

                  <PrototypeSearchResult
                    title="UK revenue from education related exports and transnational education activity"
                    summary="Statistics on the estimated revenue generated by education related exports and transnational education (TNE) activity in 2019."
                    theme="Higher education"
                    topic="Education exports"
                    type="Experimental statistics"
                    org="Department for Education (DfE)"
                    published="16 December 2021"
                  />

                  <PrototypeSearchResult
                    title="Parental responsibility measures"
                    summary="National and local authority data on penalty notices, cases entering fast-track case management, parenting orders and parenting contracts."
                    theme="Pupils and schools"
                    topic="Parental responsibility measures"
                    type="Official statistics"
                    org="Department for Education (DfE)"
                    published="16 December 2021"
                  />

                  <PrototypeSearchResult
                    title="LA and school expenditure"
                    summary="How schools and local authorities spent their funding on education, children's services and social care in the financial year 2020 to 2021."
                    theme="Finance and funding"
                    topic="Local authority and school finance"
                    type="Official statistics"
                    org="Department for Education (DfE)"
                    published="16 December 2021"
                  />

                  <PrototypeSearchResult
                    title="Further education: outcome-based success measures"
                    summary="Outcomes of learners completing further education training."
                    theme="Further education"
                    topic="Further education outcomes"
                    type="Official statistics"
                    org="Department for Education (DfE)"
                    published="9 December 2021"
                  />
                </>
              )}

              {showExclusions && (
                <PrototypeSearchResult
                  title="Permanent exclusions and suspensions in England"
                  summary="This publication presents statistics on permanent exclusions and suspensions within the 2019/20 academic year across state-funded schools."
                  theme="Pupils and schools"
                  topic="Exclusions"
                  type="National statistics"
                  org="Department for Education (DfE)"
                  published="29 July 2021"
                />
              )}

              {showSchoolCapacity && (
                <>
                  {releaseType !== 'adhoc' && (
                    <>
                      <PrototypeSearchResult
                        title="Local authority school places scorecards"
                        summary="The scorecard release provides a snapshot of the progress local authorities in England are making in delivering good quality primary and secondary school places in 2019."
                        theme="Pupils and schools"
                        topic="School capacity"
                        type="National statistics"
                        org="Department for Education (DfE)"
                        published="29 September 2020"
                      />
                      <PrototypeSearchResult
                        title="School capacity"
                        summary="This release reports on school capacity information in state-funded primary and secondary schools in England in the academic year 2018/19, as of 1 May 2019. Data are as reported by local authorities in the annual School Capacity (SCAP) Survey."
                        theme="Pupils and schools"
                        topic="School capacity"
                        type="Official statistics"
                        org="Department for Education (DfE)"
                        published="20 August 2020"
                      />
                    </>
                  )}

                  <PrototypeSearchResult
                    title="School places sufficiency survey"
                    summary="This release provides transparency data from the voluntary one-off survey on school places, sent to local authorities in England, in September 2020"
                    theme="Pupils and schools"
                    topic="School capacity"
                    type="Ad hoc statistics"
                    org="Department for Education (DfE)"
                    published="26 March 2020"
                  />
                </>
              )}

              {showSearchResult && (
                <>
                  <PrototypeSearchResult
                    title="Schools, pupils and their characteristics"
                    summary="Statistics on pupils in schools in England as collected in the January 2021 school census. Includes, age, gender, free school meals (FSM eligibility), English as an additional language, ethnicity, school characteristics and class sizes"
                    theme="Pupils and schools"
                    topic="School and pupil numbers"
                    type="National statistics"
                    org="Department for Education (DfE)"
                    published="17 June 2021"
                  />
                  <PrototypeSearchResult
                    title="Free school meals: Autumn term TEST"
                    summary="This release presents data on free school meals (FSM) as collected in the Autumn school census. The number of pupils eligible for free school meals on census day (1 October 2020) and the number of pupils who have become eligible since 23 March 2020, that is since the first COVID-19 lockdown was announced"
                    theme="Pupils and schools"
                    topic="School and pupil numbers"
                    type="Ad hoc statistics"
                    org="Department for Education (DfE)"
                    published="30 March 2021"
                  />
                </>
              )}
            </div>

            {((!showExclusions && !showSchoolCapacity && !showSearchResult) ||
              showAll) && (
              <>
                <p>Showing page 1 of 6</p>
                <nav
                  className="dfe-pagination"
                  role="navigation"
                  aria-label="Pagination"
                >
                  <ul className={styles.prototypePagination}>
                    <li>
                      <a className={styles.prototypePaginationLink} href="#">
                        <span className={styles.prototypePaginationTitle}>
                          Previous
                        </span>
                        <span className="govuk-visually-hidden">:</span>
                        <span className="dfe-pagination__page">1 of 6</span>
                      </a>
                    </li>
                    <li>
                      <a className={styles.prototypePaginationLink} href="#">
                        <span className={styles.prototypePaginationTitle}>
                          Next
                        </span>
                        <span className="govuk-visually-hidden">:</span>
                        <span className="dfe-pagination__page">2 of 6</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </>
            )}
          </div>
        </div>
      </PrototypePage>
    </div>
  );
};

export default PrototypeFindStats;
