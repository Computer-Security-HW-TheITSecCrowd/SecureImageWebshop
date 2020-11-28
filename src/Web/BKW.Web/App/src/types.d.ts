import { AxiosResponse } from "axios";
import { ReactNode } from "react";
import { RouteProps } from "react-router-dom";

export type User = {
  Username: string,
  Role: string,
  Id: string
} | null;

export interface PrivateRouteProps extends RouteProps {
  roles: string[],
  path: string
}

export type AnimationProps = {
  animation: Animation,
  loading: boolean
};

export type CommentProps = {
  comment: Comment
}

export type LoginCredentials = {
  username: string,
  password: string
};

export type RegistrationCredentials = {
  username: string,
  password: string,
  confirmPassword: string
};

export interface InteractionError extends Error {
  response?: AxiosResponse
}

export type Animation = {
  owner: string,
  title: string,
  createdAt: Date,
  numberOfPurchase: number,
  banned: boolean,
  id: string
};

export type AnimationWithComments = {
  owner: string,
  title: string,
  createdAt: Date,
  numberOfPurchase: number,
  comments: Comment[],
  banned: boolean,
  id: string,
  purchasedOrOwnedByUser: boolean
}

export type Comment = {
  createdBy: string,
  createdAt: Date,
  content: string,
  animID: string,
  id: string
};