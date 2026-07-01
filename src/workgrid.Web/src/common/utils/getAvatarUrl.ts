import config from "config";
import userDummyImage from "assets/images/users/user-dummy-img.jpg"; 

export const getAvatarUrl = (path?: string): string =>
  path ? `${config.api.FILE_API_URL}/File/${path}` : userDummyImage;
