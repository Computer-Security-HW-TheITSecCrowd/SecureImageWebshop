const useMockedBackend = false;
export const baseURL: string = useMockedBackend ? `http://localhost:3001` : 'http://localhost:42069/api';

export const authURL: string = `${baseURL}/auth`;
export const animationURL: string = `${baseURL}/animation`;
export const userURL: string = `${baseURL}/user`;

export const loginEndpoint: string = `${authURL}/login`;
export const registrationEndpoint: string = `${authURL}/register`;

/* Retrieve all animations */
export const animationsEndpoint: string = useMockedBackend ? `${animationURL}s` : `${animationURL}?count=10`;
export const animationEndpoint = (animID: string) => `${animationsEndpoint}/${animID}/`;
export const animationFileEndpoint = (animID: string) => animationEndpoint(animID) + '/file';
export const animationDisableEndpoint = (animID: string) => animationEndpoint(animID) + '/disable';
export const animationCommentsEndpoint = useMockedBackend ? (animID: string) => `${baseURL}/comments?animID=${animID}` : (animID: string) => animationEndpoint(animID) + '/comments';
export const commentEndpoint = useMockedBackend ? (animID: string, commentID: string) => `${baseURL}/comments?animID=${animID}&id=${commentID}` : (animID: string, commentID: string) => animationCommentsEndpoint(animID) + `/${commentID}`;

export const userAnimationsEndpoint = `${userURL}/animations`;