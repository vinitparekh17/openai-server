import { PollyClient } from "@aws-sdk/client-polly";
import { REGION } from "../config";

export const pollyClient = new PollyClient({ region: REGION });
