import {create} from 'zustand';
import {StudentStoreTypes} from '../utility/TypeScriptTypes';

const useStudentStore = create<StudentStoreTypes>((set, get) => ({
  studentDetails: {},
  studentToken: null,
  studentId: null,
  resetStudentStore: () =>
    set({
      studentDetails: {},
      studentToken: null,
      studentId: null,
    }),
}));

export default useStudentStore;
