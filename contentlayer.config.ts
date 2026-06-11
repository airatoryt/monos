import { defineDocumentType, makeSource } from 'contentlayer/source-files';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    subtitle: { type: 'string', required: false },
    date: { type: 'date', required: true },
    tag: {
      type: 'enum',
      options: ['COSMOLOGY', 'PHILOSOPHY', 'EXISTENCE', 'ILLUSION', 'IDENTITY', 'VOID'],
      required: true,
    },
    excerpt: { type: 'string', required: false },
    readTime: { type: 'number', required: false, default: 5 },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.md$/, ''),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/archives/${doc._raw.sourceFileName.replace(/\.md$/, '')}`,
    },
  },
}));

export default makeSource({
  contentDirPath: 'src/content/posts',
  documentTypes: [Post],
});
