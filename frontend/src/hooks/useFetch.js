import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * useFetch Hook
 * Handles API requests with loading and error state management.
 *
 * @param {string|null} actionPath - API endpoint (e.g. '/user/login') or full URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object|null} body - Request payload
 * @param {object} headers - Custom request headers
 *
 * @returns {object} { data, loading, error, refetch }
 */

const useFetch = (
  actionPath,
  method = 'GET',
  body = null,
  headers = {}
) => {
  // Stores API response
  const [data, setData] = useState(null);

  // Tracks loading state
  const [loading, setLoading] = useState(false);

  // Stores error message (if any)
  const [error, setError] = useState(null);

  /**
   * Executes API request
   * Wrapped in useCallback to prevent unnecessary re-renders
   */
  const fetchData = useCallback(async () => {
    if (!actionPath) return;

    setLoading(true);
    setError(null);

    try {
      // Base backend URL from environment variable
      const baseURL = import.meta.env.VITE_BACKEND_SERVER;

      // Remove trailing slash from baseURL (if present)
      const cleanBaseURL = baseURL?.replace(/\/$/, '');

      // Ensure endpoint starts with '/'
      const cleanActionPath = actionPath.startsWith('/') ? actionPath : `/${actionPath}`;

      // Construct final request URL
      const url = actionPath.startsWith('http') ? actionPath : `${cleanBaseURL}${cleanActionPath}`;

      // Perform API request
      const response = await axios({
        method,
        url,
        data: body,
        headers,
      });

      // Update response data
      setData(response.data);
    } catch (err) {
      // Extract meaningful error message
      setError( err?.response?.data?.message || err?.message || 'Something went wrong' );
    } finally {
      setLoading(false);
    }
  }, [actionPath, method, body, headers]);

  /**
   * Automatically trigger fetch on dependency change
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData, // Allows manual re-trigger
  };
};

export default useFetch;
