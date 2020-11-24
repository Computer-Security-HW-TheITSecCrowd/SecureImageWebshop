import { AxiosResponse } from "axios";
import { ReactNode } from "react";
import { RouteProps } from "react-router-dom";

export type User = {
  username: string,
  role: string,
  id: number
} | null;

export interface PrivateRouteProps extends RouteProps {
  roles: string[],
  path: string
};

export type LoginCredentials = {
  username: string,
  password: string
};

export type RegistrationCredentials = {
  username: string,
  password: string,
  passwordConfirmation: string
};

export interface InteractionError extends Error {
  response?: AxiosResponse
}