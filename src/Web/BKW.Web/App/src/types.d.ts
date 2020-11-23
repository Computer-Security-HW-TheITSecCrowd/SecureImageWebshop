import { ReactNode } from "react";

export type User = {
  username: string,
  role: string,
  id: number
} | null;

export type PrivateRouteProps = {
  roles: string[],
  component: Component,
  path: string
}