export default {
  type: "object",
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    image: { type: 'string' },
    price: { type: 'integer' },
    count: { type: 'integer' }
  },
  required: ['title']
} as const;
