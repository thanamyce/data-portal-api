import { Controller, Get, Res, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';

// === Common Response DTO ===
export class CommonResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  statusCode: number;

  constructor(partial: Partial<CommonResponse<T>>) {
    Object.assign(this, partial);
  }
}

// === Response Helper ===
export class ResponseHelper {
  static success<T>(data: T, message = 'Success', statusCode = HttpStatus.OK): CommonResponse<T> {
    return new CommonResponse<T>({
      success: true,
      message,
      data,
      statusCode,
    });
  }

  static error<T>(error: any, message = 'Error', statusCode = HttpStatus.INTERNAL_SERVER_ERROR): CommonResponse<T> {
    return new CommonResponse<T>({
      success: false,
      message,
      error,
      statusCode,
    });
  }
}
