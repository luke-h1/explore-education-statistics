import Details from '@common/components/Details';
import KeyStatTile from '@common/modules/find-statistics/components/KeyStatTile';
import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '@common/modules/find-statistics/components/KeyStat.module.scss';

interface KeyStatContainerProps {
  children: ReactNode;
}

export const KeyStatContainer = ({ children }: KeyStatContainerProps) => {
  return <div className={styles.container}>{children}</div>;
};

interface KeyStatColumnProps {
  children: ReactNode;
  testId?: string;
}

export const KeyStatColumn = ({ children, testId }: KeyStatColumnProps) => {
  return (
    <div className={styles.column} data-testid={testId}>
      {children}
    </div>
  );
};

export interface KeyStatProps {
  children?: ReactNode;

  // NOTE: Cannot accept KeyStatistic as a prop because KeyStatSelectForm keystat preview
  title: string;
  statistic: string;
  trend?: string;
  guidanceTitle?: string;
  guidanceText?: string;

  testId?: string;
}

const KeyStat = ({
  children,
  title,
  statistic,
  trend,
  guidanceTitle = 'Help',
  guidanceText,
  testId = 'keyStat',
}: KeyStatProps) => {
  return (
    <KeyStatColumn testId={testId}>
      {title && statistic && (
        <>
          <KeyStatTile title={title} value={statistic} testId={testId}>
            {trend && (
              <p className="govuk-body-s" data-testid={`${testId}-summary`}>
                {trend}
              </p>
            )}
          </KeyStatTile>

          {guidanceText && guidanceTitle && (
            <Details
              summary={guidanceTitle}
              className={styles.definition}
              hiddenText={guidanceTitle === 'Help' ? `for ${title}` : undefined}
            >
              <div data-testid={`${testId}-definition`}>
                <ReactMarkdown key={guidanceText}>{guidanceText}</ReactMarkdown>
              </div>
            </Details>
          )}
          {children}
        </>
      )}
    </KeyStatColumn>
  );

  return null;
};

export default KeyStat;
