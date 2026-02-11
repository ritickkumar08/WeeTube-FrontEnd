import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';

const RouteErrorBoundary = () => {
  const error = useRouteError();

  let status = '500', title = 'Something went wrong', message = 'An unexpected error occurred. Please try again later.';

  if (isRouteErrorResponse(error)) {
    status = error.status.toString();
    const msgs = {
      404: ['Page Not Found', 'The page you are looking for does not exist or has been moved.'],
      403: ['Access Denied', 'You do not have permission to access this page.'],
      401: ['Unauthorized', 'Please log in to access this page.'],
      500: ['Server Error', 'The server encountered an error. Please try again later.'],
      503: ['Service Unavailable', 'The service is temporarily unavailable. Please try again later.']
    };
    [title, message] = msgs[error.status] || [`Error ${error.status}`, error.statusText || message];
  } else if (error instanceof Error) {
    console.error('Route Error:', error);
    if (/Network Error|Failed to fetch/.test(error.message)) {
      status = 'offline';
      title = 'Connection Error';
      message = 'Unable to connect to the server. Please check your internet connection.';
    } else {
      status = '500';
      title = 'Application Error';
      message = 'An unexpected error occurred in the application.';
    }
  } else {
    console.error('Unknown Error:', error);
  }

  return <ErrorPage status={status} title={title} message={message} />;
};


export default RouteErrorBoundary;
