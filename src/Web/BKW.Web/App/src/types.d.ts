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