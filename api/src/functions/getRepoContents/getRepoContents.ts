import type {APIGatewayEvent, Context} from 'aws-lambda'

import {logger} from 'src/lib/logger'
import axios, {AxiosError} from "axios";

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
    logger.info(`${event.httpMethod} ${event.path}: hello function`)
    const {repoName, subPath} = event.queryStringParameters;
    logger.info(`${event.httpMethod} ${event.path} - queryParams: { repoName: ${repoName}, subPath: ${subPath} }`)
    let statusCode: number = 200;
    let body = {
        code: 0,
        message: '',
        data: null,
    };
    const KEY = process.env.CKB_LAB_PROJECTS_GIT_KEY;
    try {
        const result = await axios.get(`https://api.github.com/repos/${repoName}/contents/${subPath}`, {
            headers: KEY ? {
                Authorization: `Bearer ${KEY}`
            } : {}
        });
        body.data = result.data;
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            body.code = err.response?.status ?? -1;
            body.message = err.message;
        } else if (typeof err === 'string') {
            body.message = err
        }
    }
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }
}
