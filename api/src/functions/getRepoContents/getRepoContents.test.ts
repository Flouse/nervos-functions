import { mockHttpEvent } from '@redwoodjs/testing/api'

import { handler } from './getRepoContents'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

describe('getRepoContents function', () => {

  it('Should respond with 200', async () => {
    const httpEvent = mockHttpEvent({
      queryStringParameters: {
        repoName: 'GitOfJason/ckb-lab-playground-projects',
        subPath: 'tthw',
      },
    })

    const response = await handler(httpEvent, null)

    expect(response.statusCode).toBe(200)
  })

  // You can also use scenarios to test your api functions
  // See guide here: https://redwoodjs.com/docs/testing#scenarios
  //
  // scenario('Scenario test', async () => {
  //
  // })
})
