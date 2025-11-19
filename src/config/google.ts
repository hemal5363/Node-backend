import axios from "axios";

export const getGooglePayload = async (accessToken: string) => {
  const response = await axios.get(process.env.GOOGLE_GET_USER_DETAILS_URL!, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};
