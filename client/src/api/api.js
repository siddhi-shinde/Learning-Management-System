import axiosInstance from "./axiosInstance";

// ==============================
// AUTH APIs
// ==============================

export const registerUser = (data) =>
  axiosInstance.post("/auth/register", data);

export const loginUser = (data) =>
  axiosInstance.post("/auth/login", data);

export const logoutUser = () =>
  axiosInstance.post("/auth/logout");

export const getProfile = () =>
  axiosInstance.get("/auth/profile");


// ==============================
// COURSE APIs
// ==============================

export const getAllCourses = () =>
  axiosInstance.get("/courses");

export const getCourseById = (id) =>
  axiosInstance.get(`/courses/${id}`);

export const createCourse = (data) =>
  axiosInstance.post("/courses", data);

export const updateCourse = (id, data) =>
  axiosInstance.put(`/courses/${id}`, data);

export const deleteCourse = (id) =>
  axiosInstance.delete(`/courses/${id}`);

export const togglePublishCourse = (id) =>
  axiosInstance.patch(`/courses/${id}/publish`);


// ==============================
// CATEGORY APIs
// ==============================

export const getAllCategories = () =>
  axiosInstance.get("/categories");

export const getCategoryById = (id) =>
  axiosInstance.get(`/categories/${id}`);

export const createCategory = (data) =>
  axiosInstance.post("/categories", data);

export const updateCategory = (id, data) =>
  axiosInstance.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  axiosInstance.delete(`/categories/${id}`);


// ==============================
// LECTURE APIs
// ==============================

export const getCourseLectures = (courseId) =>
  axiosInstance.get(`/lectures/course/${courseId}`);

export const getLectureById = (id) =>
  axiosInstance.get(`/lectures/single/${id}`);

export const createLecture = (data) =>
  axiosInstance.post("/lectures", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateLecture = (id, data) =>
  axiosInstance.put(`/lectures/${id}`, data);

export const deleteLecture = (id) =>
  axiosInstance.delete(`/lectures/${id}`);