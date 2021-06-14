## Quickstart

```
yarn add depay-web3mock
```

or 

```
npm install --save depay-web3mock
```

```javascript
```

## Functionalities

### blockchain

Mocks basic blockchain functionalities.

```javascript
Web3Mock({
  mocks: ['ethereum']
})
```

### window

Pass a window object incase it does not default to `window`.

```javascript
Web3Mock({
  window: anotherObject,
  mocks: ['ethereum']
})
```

## Development

### Get started

```
yarn install
yarn test
```

### Release

```
npm publish
```

### Testing

