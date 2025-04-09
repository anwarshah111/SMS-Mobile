export interface StudentStoreTypes {
  studentDetails: object;
  studentToken: string | null;
  studentId: string | null;
  resetStudentStore: () => void;
}
