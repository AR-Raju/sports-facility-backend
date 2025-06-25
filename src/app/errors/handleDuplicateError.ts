import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = err?.errmsg?.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];

  const errorSources: TErrorSource = [
    {
      path: "",
      message: `${extractedMessage} is already exitst!`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Duplicate Error",
    errorSources,
  };
};

export default handleDuplicateError;
