// src/lib/gateway/route-factory.ts
import { beforeRequest } from "./before";
import { doRequest } from "./execute";
import { finalizeRequest } from "./after";
import type { Endpoint } from "../types";
import { handleError } from "../error-handler";
import { auditFailure } from "./audit";
import { Timer } from "./telemetry/timer";
import type { PipelineTiming } from "./execute";

export function makeEndpointHandler(opts: { endpoint: Endpoint; schema: any; }) {
    const { endpoint, schema } = opts;

    return async function handler(req: Request) {
        const timer = new Timer();
        const timing: PipelineTiming = {
            timer,
            internal: { adapterMarked: false },
        };
        timing.timer.mark("preflight_start");

        timing.timer.mark("before_start");
        const pre = await beforeRequest(req, endpoint, timing.timer, schema);
        timing.timer.end("before_start");

        // If before failed, log and return error immediately
        if (!pre.ok) {
            // Use error handler directly
            return await handleError({
                stage: "before",
                res: (pre as { ok: false; response: Response }).response,
                endpoint,
                timingHeader: timing.timer.serverTiming(),
                auditFailure,
                req,
            });
        }

        // EXECUTE
        timing.timer.mark("execute_start");
        const exec = await doRequest(pre.ctx, timing);

        // If doRequest returned a Response, it is an error, so return it directly
        if (exec instanceof Response) {
            const header = timing.timer.header();
            pre.ctx.timing = timing.timer.snapshot();
            return await handleError({
                stage: "execute",
                res: exec,
                endpoint,
                ctx: pre.ctx,
                timingHeader: header || undefined,
                auditFailure,
                req,
            });
        }

        // Populate ctx timing snapshot for downstream audit logic
        const header = timing.timer.header();
        pre.ctx.timing = timing.timer.snapshot();
        pre.ctx.timer = timing.timer;

        // Finalise for success
        return finalizeRequest({
            pre,
            exec,
            endpoint,
            timingHeader: header || undefined,
        });
    };
}
