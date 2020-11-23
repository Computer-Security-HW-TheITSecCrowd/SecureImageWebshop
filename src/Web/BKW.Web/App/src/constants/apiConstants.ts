const baseURL: string = 'localhost:42069/api';
const authURL: string = `${baseURL}/auth`;
const animationURL: string = `${baseURL}/animation`;
const userURL: string = `${baseURL}/user`;

export const loginEndpoint: string = `${authURL}/login`;
export const registrationEndpoint: string = `${authURL}/register`;
export const logoutEndpoint: string = `${authURL}/logout`;

export const animationsEndpoint: string = `${animationURL}/`;
export const animationEndpoint = (animID: string) => `${animationURL}/${animID}/`;
export const animationFileEndpoint = (animID: string) => animationEndpoint(animID) + '/file';
export const animationDisableEndpoint = (animID: string) => animationEndpoint(animID) + '/disable';
export const animationCommentsEndpoint = (animID: string) => animationEndpoint(animID) + '/comments';
export const commentEndpoint = (animID: string, commentID: string) => animationCommentsEndpoint(animID) + `/${commentID}`;

export const userAnimationsEndpoint = `${userURL}/animations`;