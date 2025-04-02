// Create a new hook in a separate file (e.g., useFilteredFavorites.ts)
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { filterFavourites, filtersApplied, setLoading } from '../features/filter/filterSlice';

export const useFilteredFavorites = () => {
  const dispatch = useAppDispatch();
  const filteredList = useAppSelector(filterFavourites);
  const myListLoading = useAppSelector((state) => state.movie.myListLoading);
  const filterLoading = useAppSelector((state) => state.filter.loading);

  useEffect(() => {
    // Set loading to true when the hook is initialized
    dispatch(setLoading(true));
    console.log('myListLoading', myListLoading);
    console.log('filterLoading', filterLoading);
    console.log('filteredList', filteredList);
  }, [dispatch]);
  
  useEffect(() => {
    // If movie list is loaded and we have filter criteria applied (loading is true)
    if (!myListLoading && filterLoading && filteredList) {
        console.log('myListLoading in', myListLoading);
        console.log('filterLoading in', filterLoading);
        console.log('filteredList in', filteredList);
      // Mark filters as applied when we have the data
      dispatch(filtersApplied());
    }
  }, [myListLoading, filterLoading, filteredList, dispatch]);

  return { filteredList, loading: filterLoading || myListLoading };
};