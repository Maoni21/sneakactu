import { defineField, defineType } from 'sanity'

export const releaseSchema = defineType({
  name: 'release',
  title: 'Release (Sortie)',
  type: 'document',
  fields: [
    defineField({
      name: 'sneakerName',
      title: 'Nom du coloris / modèle',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'sneakerName', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Marque',
      type: 'reference',
      to: [{ type: 'brand' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'releaseDate',
      title: 'Date de sortie',
      type: 'date',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Prix estimé (€)',
      type: 'number',
    }),
    defineField({
      name: 'image',
      title: 'Image de la sneaker',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'buyLinks',
      title: 'Liens d\'achat',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'store', title: 'Boutique', type: 'string' }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: { title: 'store', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'confirmed',
      title: 'Date confirmée',
      type: 'boolean',
      initialValue: true,
      description: 'Décocher si la date est encore spéculative / leak',
    }),
  ],
  preview: {
    select: {
      title: 'sneakerName',
      date: 'releaseDate',
      media: 'image',
      brand: 'brand.name',
    },
    prepare({ title, date, media, brand }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString('fr-FR')
        : 'Date TBD'
      return {
        title: `${brand ? brand + ' · ' : ''}${title}`,
        subtitle: formattedDate,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Date de sortie (prochaine)',
      name: 'releaseDateAsc',
      by: [{ field: 'releaseDate', direction: 'asc' }],
    },
  ],
})
