import { Response } from "express";

export type ContollerResponse<T = any> = Response<any, ApiResponse<T>>;

export type ApiResponse<T = any> =
  | {
      success: false;
      message: string;
      error?: any;
    }
  | {
      success: true;
      message?: string;
      data: T;
    };
