import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

export const validationPipe = new ValidationPipe({
  disableErrorMessages: false,
  exceptionFactory: (errors) => {
    const error = exceptionFactory(errors);
    const cleanFormat = error.message
      .substring(0, error.message.length - 1)
      .split(",");
    const format = cleanFormat.map((v, i) => {
      if (cleanFormat.length == 1) {
        return v;
      } else if (i < cleanFormat.length - 2) {
        return `${v}, `;
      } else if (i == cleanFormat.length - 2) {
        return `${v} `;
      } else {
        return `and ${v}`;
      }
    });

    const result = format.join("") + (format.length > 1 ? " are" : " is");

    return new BadRequestException({
      error: true,
      authorized: false,
      message: `${result} invalid request data format`,
      messages: error.messages,
      validationError: true,
    });
  },
});

function exceptionFactory(errors: ValidationError[]) {
  return errors.reduce(
    (acc: { message: string; messages: string[] }, e) => {
      const result = { message: acc.message, messages: [...acc.messages] };

      if (e.children != undefined && e.children.length > 0) {
        const tempResult = exceptionFactory(e.children);
        result.message += !result.message.includes(tempResult.message)
          ? `${tempResult.message}`
          : "";
        result.messages.push(...tempResult.messages);
      } else {
        result.message += `${e.property},`;
        if (e.constraints) {
          result.messages.push(...Object.values(e.constraints));
        }
      }
      return result;
    },
    { message: "", messages: [] },
  );
}
