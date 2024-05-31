import { request, gql } from 'graphql-request';

const MASTER_URL = "https://api-ap-south-1.hygraph.com/v2/clwrzik3s00gy06w8humklirr/master";

const addCategory = async (data) => {
  const mutationQuery = gql`
    mutation addCategory($name: String!, $iconUrl: String!) {
      createCategory(data: {name: $name, icon: {create: {uploadUrl: $iconUrl}}}) {
        id
      }
      publishManyCategories(to: PUBLISHED) {
        count
      }
    }
  `;

  const variables = {
    name: data.name,
    iconUrl: data.icon,
  };

  const result = await request(MASTER_URL, mutationQuery, variables);
  console.log('Mutation Result:', result); // Debugging line

  return result;
};
const addSlider = async (data) => {
  const mutationQuery = gql`
    mutation MyMutation($name: String!, $imageUrl: String!) {
      createSlider(
        data: {name: $name, image: {create: {uploadUrl: $imageUrl}}}
      ) {
        id
      }
      publishManySliders(to: PUBLISHED) {
        count
      }
    }
  `;

  const variables = {
    name: data.name,
    imageUrl: data.image,
  };

  const result = await request(MASTER_URL, mutationQuery, variables);
  console.log('Mutation Result:', result); // Debugging line

  return result;
};


const getCategories = async () => {
  const query = gql`
    query MyQuery {
      categories {
        id
        name
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result.categories;
};

const getBookings = async () => {
  const query = gql`
    query getBookings {
      bookings {
        id
        bookingStatus
        userName
        userEmail
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result.bookings;
};

const addBusinessList = async (data) => {
  const mutationQuery = gql`
    mutation createBusinessList(
      $name: String!,
      $about: String!,
      $contactPerson: String!,
      $address: String!,
      $email: String!,
      $categoryId: ID!,
      $imageUrl: String!
    ) {
      createBusinessList(
        data: {
          name: $name,
          about: $about,
          contactPerson: $contactPerson,
          address: $address,
          email: $email,
          category: {connect: {id: $categoryId}},
          images: {create: {uploadUrl: $imageUrl}},
          bookings: {}
        }
      ) {
        id
      }
      publishManyBusinessLists(to: PUBLISHED) {
        count
      }
    }
  `;

  const variables = {
    name: data.name,
    about: data.about,
    contactPerson: data.contactPerson,
    address: data.address,
    email: data.email,
    categoryId: data.categoryId,
    imageUrl: data.imageUrl,
  };

  const result = await request(MASTER_URL, mutationQuery, variables);
  console.log('Mutation Result:', result); // Debugging line

  return result;
};



const getBusinessLists = async () => {
  const query = gql`
    query getBusiness {
      businessLists {
        id
        name
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result.businessLists;
};

const addBooking = async (data) => {
  const mutationQuery = gql`
    mutation createBookings(
      $userName: String!,
      $userEmail: String!,
      $date: String!,
      $time: String!,
      $businessListId: ID!
    ) {
      createBooking(
        data: {
          userName: $userName,
          userEmail: $userEmail,
          date: $date,
          time: $time,
          businessList: {connect: {id: $businessListId}},
          bookingStatus: Booked
        }
      ) {
        id
      }
      publishManyBookings(to: PUBLISHED) {
        count
      }
    }
  `;

  const variables = {
    userName: data.userName,
    userEmail: data.userEmail,
    date: data.date,
    time: data.time,
    businessListId: data.businessListId,
  };

  const result = await request(MASTER_URL, mutationQuery, variables);
  return result;
};

const getUserBookings = async () => {
  const GET_USER_BOOKINGS = gql`
    query GetUserBookings {
      bookings(orderBy: updatedAt_DESC) {
        id
        userEmail
        userName
        bookingStatus
        date
        time
        businessList {
          id
          name
          address
          contactPerson
          email
          about
          category {
            name
          }
          images {
            url
          }
        }
      }
    }
  `;

  try {
    const data = await request(MASTER_URL, GET_USER_BOOKINGS);
    return data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error; // Rethrow the error to handle it in the calling component
  }
};

const deleteCategory = async (categoryId) => {
  const DELETE_CATEGORY = gql`
    mutation ($id: ID!) {
      deleteCategory(where: {id: $id}) {
        id
      }
    }
  `;

  try {
    const variables = { id: categoryId };
    const data = await request(MASTER_URL, DELETE_CATEGORY, variables);
    return data.deleteCategory;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error; // Rethrow the error to handle it in the calling component
  }
};

const getAllUserCategories = async () => {
  const GET_ALL_USER_CATEGORIES = `
    query {
      categories {
        id
        name
      }
    }
  `;

  try {
    const data = await request(MASTER_URL, GET_ALL_USER_CATEGORIES);
    return data.categories;
  } catch (error) {
    console.error('Error fetching user categories:', error);
    throw error; // Rethrow the error to handle it in the calling component
  }
};


const deleteBooking = async (id) => {
  const DELETE_BOOKING = gql`
    mutation DeleteBooking($id: ID!) {
      deleteBooking(where: { id: $id }) {
        id
      }
      
      publishManyBookings(to: PUBLISHED) {
        count
      }
    }
  `;

  try {
    const variables = { id };
    const data = await request(MASTER_URL, DELETE_BOOKING, variables);
    console.log('Booking deleted:', data.deleteBooking);
    return data.deleteBooking; // Return the deleted booking ID if needed
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error; // Rethrow the error to handle it in the calling component
  }
};



export default {
  addSlider,
  addCategory,
  getCategories,
  addBusinessList,
  getBookings,
  getBusinessLists,
  addBooking,
  getUserBookings,
  deleteBooking,
  deleteCategory,
  getAllUserCategories,
};
