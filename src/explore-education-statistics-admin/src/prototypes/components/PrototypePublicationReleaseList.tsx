import React, { useState } from 'react';
import Button from '@common/components/Button';
import Tag from '@common/components/Tag';
import Details from '@common/components/Details';
import WarningMessage from '@common/components/WarningMessage';
import Link from '@admin/components/Link';

const PrototypePublicationReleaseList = () => {
  const [showMore, setShowMore] = useState(false);
  const [showScheduled, setShowScheduled] = useState(false);
  const [showReleases, setShowReleases] = useState(true);
  const [showDraft, setShowDraft] = useState(true);

  return (
    <>
      <h3 className="govuk-heading-l">Manage releases</h3>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters govuk-!-margin-bottom-6">
          <p className="govuk-hint govuk-!-margin-bottom-6">
            View, edit or amend releases contained within this publication.
          </p>
        </div>
        {showReleases && (
          <div className="govuk-grid-column-one-quarter dfe-align--right">
            <Button>Create new release</Button>
          </div>
        )}
      </div>
      {!showReleases && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-three-quarters">
            <WarningMessage className="govuk-!-margin-bottom-2">
              No releases created in this publication
            </WarningMessage>
          </div>
          <div className="govuk-grid-column-one-quarter dfe-align--right govuk-!-margin-top-3">
            <Button>Create new release</Button>
          </div>
        </div>
      )}

      {showReleases && (
        <>
          {showScheduled && (
            <div style={{ width: '100%', overflow: 'auto' }}>
              <table className="govuk-table govuk-!-margin-bottom-9">
                <caption className="govuk-table__caption--m">
                  Scheduled releases
                </caption>
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th style={{ width: '40%' }}>Release period</th>
                    <th style={{ width: '15%' }}>State</th>
                    <th style={{ width: '17.5%' }} colSpan={3}>
                      Checklist
                    </th>
                    <th style={{ width: '20%' }}>Scheduled Publish date</th>
                    <th colSpan={2} className="govuk-table__cell--numeric">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Academic Year 2020/21 (Not live)</td>
                    <td>
                      <Tag colour="red">Started</Tag>
                    </td>
                    <td colSpan={3}>
                      <Details
                        summary="View stages"
                        className="govuk-!-margin-bottom-0"
                      >
                        <ul className="govuk-list">
                          <li>
                            <Tag colour="green">
                              Content ✓{' '}
                              <span className="govuk-visually-hidden">
                                Complete
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
                    <td>12 Jan 22</td>
                    <td />
                    <td className="govuk-table__cell--numeric">
                      <a href="#">
                        View{' '}
                        <span className="govuk-visually-hidden">
                          Academic Year 2019/20 (Not live)
                        </span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {showDraft && (
            <>
              <div style={{ width: '100%', overflow: 'auto' }}>
                <table className="govuk-table govuk-!-margin-bottom-9">
                  <caption className="govuk-table__caption--m">
                    Draft releases
                  </caption>
                  <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                      <th style={{ width: '40%' }}>Release period</th>
                      <th style={{ width: '15%' }}>State</th>
                      <th style={{ width: '9%' }}>Errors</th>
                      <th style={{ width: '10%' }}>Warnings</th>
                      <th style={{ width: '20%' }}>Unresolved comments</th>
                      <th className="govuk-table__cell--numeric">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Academic Year 2021/22 (Not live)</td>
                      <td>
                        <Tag>Draft</Tag>
                      </td>
                      <td>3</td>
                      <td>3</td>
                      <td>3</td>
                      <td className="govuk-table__cell--numeric">
                        <Link to="/prototypes/admin-release-summary">
                          Edit{' '}
                          <span className="govuk-visually-hidden">
                            Academic Year 2021/22
                          </span>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>Academic Year 2020/21 (Not live)</td>
                      <td>
                        <Tag>in review</Tag>
                      </td>
                      <td>0</td>
                      <td>1</td>
                      <td>0</td>
                      <td className="govuk-table__cell--numeric">
                        <Link to="/prototypes/admin-release-summary">
                          Edit{' '}
                          <span className="govuk-visually-hidden">
                            Academic Year 2020/21 (Not live)
                          </span>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div style={{ width: '100%', overflow: 'auto' }}>
            <table className="govuk-table govuk-!-margin-bottom-9">
              <caption className="govuk-table__caption--m">
                Published releases ({showMore ? '10' : '5'} of 10)
              </caption>
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th style={{ width: '40%' }}>Release period</th>
                  <th style={{ width: '15%' }}>State</th>
                  <th style={{ width: '35%' }}>Published date</th>
                  <th
                    style={{ width: '120px' }}
                    colSpan={2}
                    className="dfe-align--centre"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Academic Year 2019/20 (Live - Latest release)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>25 September 2020</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">View</a>
                  </td>
                </tr>
                <tr>
                  <td>Academic Year 2018/19 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>25 September 2019</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">View</a>
                  </td>
                </tr>
                <tr>
                  <td>Academic Year 2017/18 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>25 September 2018</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">View</a>
                  </td>
                </tr>
                <tr>
                  <td>Academic Year 2015/16 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>25 September 2016</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">View</a>
                  </td>
                </tr>
                <tr>
                  <td>Academic Year 2014/15 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>25 September 2015</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td className="govuk-table__cell--numeric">
                    <a href="#">View</a>
                  </td>
                </tr>
                {showMore && (
                  <>
                    <tr>
                      <td>Academic Year 2013/14 (Live)</td>
                      <td>
                        <Tag colour="green">Published</Tag>
                      </td>

                      <td>25 September 2014</td>
                      <td>
                        <a href="#">Amend</a>
                      </td>
                      <td className="govuk-table__cell--numeric">
                        <a href="#">View</a>
                      </td>
                    </tr>
                    <tr>
                      <td>Academic Year 2016/17 (Live)</td>
                      <td>
                        <Tag colour="green">Published</Tag>
                      </td>

                      <td>25 September 2017</td>
                      <td>
                        <a href="#">Amend</a>
                      </td>
                      <td className="govuk-table__cell--numeric">
                        <a href="#">View</a>
                      </td>
                    </tr>
                    <tr>
                      <td>Academic Year 2015/16 (Live)</td>
                      <td>
                        <Tag colour="green">Published</Tag>
                      </td>

                      <td>25 September 2016</td>
                      <td>
                        <a href="#">Amend</a>
                      </td>
                      <td className="govuk-table__cell--numeric">
                        <a href="#">View</a>
                      </td>
                    </tr>
                    <tr>
                      <td>Academic Year 2014/15 (Live)</td>
                      <td>
                        <Tag colour="green">Published</Tag>
                      </td>

                      <td>25 September 2015</td>
                      <td>
                        <a href="#">Amend</a>
                      </td>
                      <td className="govuk-table__cell--numeric">
                        <a href="#">View</a>
                      </td>
                    </tr>
                    <tr>
                      <td>Academic Year 2013/14 (Live)</td>
                      <td>
                        <Tag colour="green">Published</Tag>
                      </td>

                      <td>25 September 2014</td>
                      <td>
                        <a href="#">Amend</a>
                      </td>
                      <td className="govuk-table__cell--numeric">
                        <a href="#">View</a>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {!showMore ? (
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setShowMore(true);
                }}
              >
                Show next 5 published releases
              </a>
            ) : (
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setShowMore(false);
                }}
              >
                Show next 5 published releases
              </a>
            )}
          </div>
        </>
      )}
      <div className="dfe-align--right govuk-!-margin-top-9">
        <ul className="govuk-list">
          <li>
            {showScheduled ? (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowScheduled(false);
                }}
              >
                Remove scheduled
              </a>
            ) : (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowScheduled(true);
                }}
              >
                Show scheduled
              </a>
            )}
          </li>
          <li>
            {showDraft ? (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowDraft(false);
                }}
              >
                Remove draft releases
              </a>
            ) : (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowDraft(true);
                }}
              >
                Show draft releases
              </a>
            )}
          </li>
          <li>
            {showReleases ? (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowReleases(false);
                }}
              >
                Remove releases
              </a>
            ) : (
              <a
                href="#"
                className="govuk-body-s"
                onClick={e => {
                  e.preventDefault();
                  setShowReleases(true);
                }}
              >
                Show releases
              </a>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default PrototypePublicationReleaseList;
