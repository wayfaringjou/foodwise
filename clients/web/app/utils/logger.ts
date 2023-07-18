import bunyan from "bunyan";

type LogParameters = {
  err?: Error | unknown;
  req?: Request;
  res?: Response;
  payload?: Record<string, any>;
  operationName?: string;
  message: string;
};

const serializers = {
  req(req: Request) {
    try {
      const { body, method, url, headers } = req;
      return {
        method,
        url,
        ...(Object.keys(headers).length > 0 && { headers }),
        ...(body && { body }),
      };
    } catch (error) {
      console.error("Unexpected logger error:");
      console.error(error);
    }
  },
  res(res: Response) {
    try {
      const { headers, status, type } = res;
      return {
        headers,
        status,
        type,
      };
    } catch (error) {
      console.error("Unexpected logger error:");
      console.error(error);
    }
  },
  payload(data: Record<string, any>): Record<string, any> | void {
    const masked = ["password", "email"];
    const mask = "*****";
    if (!data) return data;
    try {
      return masked.reduce(
        (sanitized, maskedField) => ({
          ...sanitized,
          ...(sanitized[maskedField] && { [maskedField]: mask }),
        }),
        data
      );
    } catch (error) {
      console.error("Unexpected logger error:");
      console.error(error);
      return;
    }
  },
};

const logger = bunyan.createLogger({
  name: "Foodwise-web",
  serializers: {
    ...bunyan.stdSerializers,
    ...serializers,
  },
});

/**
 * Log info about errors/req/res with optional masking
 *
 */
function log({ message, ...data }: LogParameters): void {
  if (!data) {
    logger.info(message);
    return;
  }

  if (data.err) {
    logger.error(data, message);
  } else {
    logger.info(data, message);
  }
}

export default log;
