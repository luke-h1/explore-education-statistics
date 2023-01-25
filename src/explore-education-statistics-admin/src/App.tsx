/* eslint-disable no-shadow */
// Load app styles first to ensure correct style ordering
import './styles/_all.scss';

import apiAuthorizationRouteList from '@admin/components/api-authorization/ApiAuthorizationRoutes';
import PageErrorBoundary from '@admin/components/PageErrorBoundary';
import ProtectedRoute from '@admin/components/ProtectedRoute';
import { AuthContextProvider } from '@admin/contexts/AuthContext';
import { ConfigContextProvider } from '@admin/contexts/ConfigContext';
import ServiceProblemsPage from '@admin/pages/errors/ServiceProblemsPage';
import routes from '@admin/routes/routes';
import {
  ApplicationInsightsContextProvider,
  useApplicationInsights,
} from '@common/contexts/ApplicationInsightsContext';
import useAsyncRetry from '@common/hooks/useAsyncRetry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { lazy, Suspense, useEffect } from 'react';
import { Switch } from 'react-router';
import {
  CompatRouter,
  CompatRoute,
  useNavigate,
} from 'react-router-dom-v5-compat';
import PageNotFoundPage from './pages/errors/PageNotFoundPage';
import { LastLocationContextProvider } from './contexts/LastLocationContext';

// NOTE LH: navigate is any but should be fully typed once full migration away from compat is done

const queryClient = new QueryClient();

const PrototypeIndexPage = lazy(
  () => import('@admin/prototypes/PrototypeIndexPage'),
);

function ApplicationInsightsTracking() {
  const appInsights = useApplicationInsights();
  const navigate = useNavigate();

  useEffect(() => {
    if (appInsights) {
      appInsights.trackPageView({
        uri: navigate.location.pathname,
      });

      navigate.listen((navigate: { pathname: string }) => {
        appInsights.trackPageView({
          uri: navigate.pathname,
        });
      });
    }
  }, [appInsights, navigate]);

  return null;
}

function PrototypesEntry() {
  const { value: prototypeRoutes = [] } = useAsyncRetry(() =>
    import('./prototypes/prototypeRoutes').then(module => module.default),
  );

  return (
    <Suspense fallback={<ServiceProblemsPage />}>
      <Switch>
        <CompatRoute exact path="/prototypes" component={PrototypeIndexPage} />
        {prototypeRoutes?.map(route => (
          <CompatRoute
            key={route.path}
            exact={route.exact ?? true}
            {...route}
          />
        ))}
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ConfigContextProvider>
      {config => (
        <ApplicationInsightsContextProvider
          instrumentationKey={config.AppInsightsKey}
        >
          <CompatRouter>
            <ApplicationInsightsTracking />

            <QueryClientProvider client={queryClient}>
              <AuthContextProvider>
                <LastLocationContextProvider>
                  <PageErrorBoundary>
                    <Switch>
                      {Object.entries(apiAuthorizationRouteList).map(
                        ([key, authRoute]) => (
                          <CompatRoute exact key={key} {...authRoute} />
                        ),
                      )}

                      {Object.entries(routes).map(([key, route]) => (
                        <ProtectedRoute key={key} {...route} />
                      ))}

                      {/* Prototype pages are protected by default. To open them up change the ProtectedRoute to: */}
                      {/* <Route path="/prototypes" component={PrototypesEntry} /> */}
                      <ProtectedRoute
                        path="/prototypes"
                        protectionAction={user => user.permissions.isBauUser}
                        component={PrototypesEntry}
                      />

                      <ProtectedRoute
                        path="*"
                        allowAnonymousUsers
                        component={PageNotFoundPage}
                      />
                    </Switch>
                  </PageErrorBoundary>
                </LastLocationContextProvider>
              </AuthContextProvider>
            </QueryClientProvider>
          </CompatRouter>
        </ApplicationInsightsContextProvider>
      )}
    </ConfigContextProvider>
  );
}

export default App;
