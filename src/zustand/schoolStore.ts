import {create} from 'zustand';
import {SchoolStoreTypes, StudentStoreTypes} from '../utility/TypeScriptTypes';

const useSchoolStore = create<SchoolStoreTypes>((set, get) => ({
  schoolDetails: {},
  schoolToken: null,
  schoolId: null,
  resetSchoolStore: () =>
    set({
      schoolDetails: {},
      schoolId: null,
      schoolToken: null,
    }),
}));

export default useSchoolStore;
