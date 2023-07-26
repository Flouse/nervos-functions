import type {APIGatewayEvent, Context} from 'aws-lambda'

import {logger} from 'src/lib/logger'
import axios from "axios";

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
    let statusCode: number = 200;
    let body = {
        code: 0,
        message: '',
        data: null,
    };

    try {
        const {repoName, subPath} = event.queryStringParameters;
        const result = await axios.get(`https://api.github.com/repos/${repoName}/contents/${subPath}`, {
            headers: {
                Authorization: `Bearer ${process.env.CKB_LAB_PROJECTS_GIT_KEY}`
            }
        });
        body.data = result.data;
    } catch (err: unknown) {
        body.code = 1000
        if (err instanceof Error) {
            body.message = err.message
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
