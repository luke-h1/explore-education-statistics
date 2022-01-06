import React, { useState } from 'react';
import Button from '@common/components/Button';
import Tag from '@common/components/Tag';

const PrototypePublicationReleaseList = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <h3>Manage releases</h3>
      <p className="govuk-hint govuk-!-margin-bottom-6">
        View, edit or amend all releases contained within this publication.
      </p>

      <div style={{ width: '100%', overflow: 'auto' }}>
        <table className="govuk-table">
          <caption>
            Table showing {showMore ? '10' : '5'} of 20 releases
          </caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th>Release period</th>
              <th>State</th>
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
                <Tag colour="red" className="govuk-!-margin-right-1">
                  <span title="3 errors">3 ✖</span>
                </Tag>
                <Tag colour="yellow" className="govuk-!-margin-right-1">
                  <span title="3 Warnings">3 &#33;</span>
                </Tag>
                <Tag colour="grey">
                  <span title="3 unresolved comments">3</span>
                </Tag>
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
            {/* 
                <tr>
                  <td>Academic Year 2020/21 (Not live)</td>
                  <td>
                    <Tag colour='red'>Started</Tag>
                  </td>
                  <td>
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
                */}
            <tr>
              <td>Academic Year 2019/20 (Live - Latest release)</td>
              <td>
                <Tag colour="green">Published</Tag>
              </td>
              <td>-</td>
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
              <td>-</td>
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
              <td>-</td>
              <td>25 Sept 18</td>
              <td>
                <a href="#">Amend</a>
              </td>
              <td>
                <a href="#">View</a>
              </td>
            </tr>
            <tr>
              <td>Academic Year 2016/17 (Live)</td>
              <td>
                <Tag colour="green">Published</Tag>
              </td>
              <td>-</td>
              <td>25 Sept 17</td>
              <td>
                <a href="#">Amend</a>
              </td>
              <td>
                <a href="#">View</a>
              </td>
            </tr>
            {showMore && (
              <>
                <tr>
                  <td>Academic Year 2015/16 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>-</td>
                  <td>25 Sept 16</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td>
                    <a href="#">View</a>
                  </td>
                </tr>
                <tr>
                  <td>Academic Year 2014/15 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>-</td>
                  <td>25 Sept 15</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td>
                    <a href="#">View</a>
                  </td>
                </tr>
                <tr>
                  <td>Academic Year 2013/14 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>-</td>
                  <td>25 Sept 14</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td>
                    <a href="#">View</a>
                  </td>
                </tr>
                <tr>
                  <td>Academic Year 2012/13 (Live)</td>
                  <td>
                    <Tag colour="green">Published</Tag>
                  </td>
                  <td>-</td>
                  <td>25 Sept 13</td>
                  <td>
                    <a href="#">Amend</a>
                  </td>
                  <td>
                    <a href="#">View</a>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            setShowMore(true);
          }}
        >
          Show next 5 releases
        </a>

        <div className="govuk-!-margin-top-9">
          <Button>Create new release</Button>
        </div>
      </div>
    </>
  );
};

export default PrototypePublicationReleaseList;
