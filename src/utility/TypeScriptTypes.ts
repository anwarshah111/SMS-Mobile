export interface StudentStoreTypes {
  studentDetails: object;
  studentToken: string | null;
  studentId: string | null;
  resetStudentStore: () => void;
}
export interface SchoolStoreTypes {
  schoolDetails: object;
  schoolToken: string | null;
  schoolId: string | null;
  resetSchoolStore: () => void;
}
