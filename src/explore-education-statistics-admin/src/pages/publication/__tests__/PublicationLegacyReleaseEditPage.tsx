import PublicationLegacyReleaseEditPage from '@admin/pages/publication/PublicationLegacyReleaseEditPage';
import { PublicationContextProvider } from '@admin/pages/publication/contexts/PublicationContext';
import { testPublication as baseTestPublication } from '@admin/pages/publication/__data__/testPublication';
import {
  PublicationEditLegacyReleaseRouteParams,
  publicationEditLegacyReleaseRoute,
} from '@admin/routes/publicationRoutes';
import _legacyReleaseService, {
  LegacyRelease,
} from '@admin/services/legacyReleaseService';
import { MyPublication } from '@admin/services/publicationService';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { generatePath } from 'react-router';
import noop from 'lodash/noop';

jest.mock('@admin/services/legacyReleaseService');
const legacyReleaseService = _legacyReleaseService as jest.Mocked<
  typeof _legacyReleaseService
>;

describe('PublicationLegacyReleaseEditPage', () => {
  const testLegacyReleases: LegacyRelease[] = [
    {
      description: 'Legacy release 3',
      id: 'legacy-release-3',
      order: 3,
      publicationId: 'publication-id-1',
      url: 'http://gov.uk/3',
    },
    {
      description: 'Legacy release 2',
      id: 'legacy-release-2',
      order: 2,
      publicationId: 'publication-id-1',
      url: 'http://gov.uk/2',
    },
    {
      description: 'Legacy release 1',
      id: 'legacy-release-1',
      order: 1,
      publicationId: 'publication-id-1',
      url: 'http://gov.uk/1',
    },
  ];
  const testPublication: MyPublication = {
    ...baseTestPublication,
    legacyReleases: testLegacyReleases,
  };

  beforeEach(() => {
    legacyReleaseService.getLegacyRelease.mockResolvedValue(
      testLegacyReleases[0],
    );
  });

  test('renders the edit legacy release page', async () => {
    renderPage(testPublication);

    await waitFor(() => {
      expect(screen.getByText('Edit legacy release')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Description')).toHaveValue(
      'Legacy release 3',
    );
    expect(screen.getByLabelText('URL')).toHaveValue('http://gov.uk/3');
    expect(screen.getByLabelText('Order')).toHaveValue(3);
    expect(
      screen.getByRole('button', { name: 'Save legacy release' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute(
      'href',
      '/publication/publication-1/legacy',
    );
  });

  test('handles successfully submitting the form', async () => {
    renderPage(testPublication);
    await waitFor(() => {
      expect(screen.getByText('Edit legacy release')).toBeInTheDocument();
    });

    userEvent.type(screen.getByLabelText('Description'), ' edited');
    userEvent.type(screen.getByLabelText('URL'), '/edit');
    userEvent.click(
      screen.getByRole('button', {
        name: 'Save legacy release',
      }),
    );

    await waitFor(() => {
      expect(legacyReleaseService.updateLegacyRelease).toHaveBeenCalledWith(
        'legacy-3',
        {
          description: 'Legacy release 3 edited',
          order: 3,
          publicationId: 'publication-1',
          url: 'http://gov.uk/3/edit',
        },
      );
    });
  });
});

function renderPage(publication: MyPublication) {
  render(
    <MemoryRouter
      initialEntries={[
        generatePath<PublicationEditLegacyReleaseRouteParams>(
          publicationEditLegacyReleaseRoute.path,
          {
            publicationId: publication.id,
            legacyReleaseId: 'legacy-3',
          },
        ),
      ]}
    >
      <PublicationContextProvider
        publication={publication}
        onPublicationChange={noop}
        onReload={noop}
      >
        <Route
          path={publicationEditLegacyReleaseRoute.path}
          component={PublicationLegacyReleaseEditPage}
        />
      </PublicationContextProvider>
    </MemoryRouter>,
  );
}