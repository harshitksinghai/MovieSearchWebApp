import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { filtersApplied, filterWatchLater, setLoading } from '../features/filter/filterSlice';

export const useFilteredWatchLater = () => {
  const dispatch = useAppDispatch();
  const filteredList = useAppSelector(filterWatchLater);
  const myListLoading = useAppSelector((state) => state.movie.myListLoading);
  const filterLoading = useAppSelector((state) => state.filter.loading);

  useEffect(() => {
    dispatch(setLoading(true));
  }, [dispatch]);
  
  useEffect(() => {
    if (!myListLoading && filterLoading && filteredList) {
      dispatch(filtersApplied());
    }
  }, [myListLoading, filterLoading, filteredList, dispatch]);

  return { filteredList, loading: filterLoading || myListLoading };
};