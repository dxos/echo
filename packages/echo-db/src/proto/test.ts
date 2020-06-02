import { dxos } from './gen/echo'

const message: dxos.echo.IObjectMutationSet = {
  mutations: [
    {
      objectId: 'object-1',
      mutations: [
        {
          key: 'title',
          value: {
            string: 'DXOS'
          }
        },
        {
          operation: dxos.echo.ObjectMutation.Operation.ARRAY_PUSH,
          key: 'versions',
          value: {
            string: '0.0.1'
          }
        }
      ]
    },
    {
      objectId: 'object-2',
      deleted: true
    }
  ]
};


const encoded = dxos.echo.ObjectMutationSet.encode(message).finish();

const decoded = dxos.echo.ObjectMutationSet.decode(encoded)



console.log(decoded)
