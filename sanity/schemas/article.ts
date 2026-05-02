import { defineField, defineType } from 'sanity'

export const articleSchema = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'meta', title: 'Métadonnées' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().min(10).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'meta',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Résumé / Meta description',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().min(50).max(160),
      description: 'Résumé court — utilisé aussi comme meta description (50-160 caractères)',
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif (SEO)',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Titre H2', value: 'h2' },
            { title: 'Titre H3', value: 'h3' },
            { title: 'Titre H4', value: 'h4' },
            { title: 'Citation', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Gras', value: 'strong' },
              { title: 'Italique', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lien',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) =>
                      rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Ouvrir dans un nouvel onglet',
                    initialValue: false,
                  },
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Lien interne',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Article lié',
                    to: [{ type: 'article' }],
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texte alternatif',
              validation: (rule) => rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Légende',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'brands',
      title: 'Marques associées',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: { type: 'brand' } }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'readTime',
      title: 'Temps de lecture (minutes)',
      type: 'number',
      group: 'meta',
      description: 'Calculé automatiquement — vous pouvez l\'ajuster manuellement',
    }),
    // SEO overrides
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO (override)',
      type: 'string',
      group: 'seo',
      description: 'Laissez vide pour utiliser le titre de l\'article',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO (override)',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Laissez vide pour utiliser le résumé',
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'publishedAt',
      media: 'mainImage',
    },
    prepare({ title, author, media }) {
      const date = author
        ? new Date(author).toLocaleDateString('fr-FR')
        : 'Non publié'
      return {
        title,
        subtitle: date,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Date de publication (récent)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
