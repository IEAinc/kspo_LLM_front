import { useCallback, useEffect, useState } from 'react';

const DEFAULT_PAGING = { page: 1, size: 10 };

const useServerGrid = ({ fetcher, initialParams = {}, mapper = (rows) => rows }) => {
  const [rows, setRows] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ ...DEFAULT_PAGING, ...initialParams });

  const load = useCallback(
    async (nextParams = params) => {
      setLoading(true);
      setParams(nextParams);
      try {
        const response = await fetcher(nextParams);
        const body = response?.data?.response || response?.data || {};
        const content = Array.isArray(body?.content) ? body.content : [];
        setRows(mapper(content));
        setPageData({
          totalElements: body.totalElements || 0,
          currentPage: body.page || nextParams.page || 1,
          pageSize: body.size || nextParams.size || 10,
        });
      } finally {
        setLoading(false);
      }
    },
    [fetcher, mapper, params]
  );

  useEffect(() => {
    load(params);
  }, []);

  const changePage = (page) => load({ ...params, page });
  const changePageSize = (size) => load({ ...params, page: 1, size });

  return {
    rows,
    pageData,
    loading,
    params,
    load,
    changePage,
    changePageSize,
  };
};

export default useServerGrid;

