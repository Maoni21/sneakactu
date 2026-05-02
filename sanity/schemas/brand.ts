import { defineField, defineType } from 'sanity'

export const brandSchema = defineType({
  name: 'brand',
  title: 'Marque',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom de la marque',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'type',
      title: 'Type de marque',
      type: 'string',
      options: {
        list: [
          { title: 'Grande marque', value: 'grande-marque' },
          { title: 'Marque émergente', value: 'emergente' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instagram',
      title: 'URL Instagram',
      type: 'url',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'instagramFollowers',
      title: 'Abonnés Instagram',
      type: 'number',
      description: 'Nombre d\'abonnés (pour les marques émergentes)',
    }),
    defineField({
      name: 'country',
      title: 'Pays d\'origine',
      type: 'string',
    }),
    defineField({
      name: 'productType',
      title: 'Type de produit',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Chaussures', value: 'chaussures' },
          { title: 'Vêtements', value: 'vetements' },
          { title: 'Accessoires', value: 'accessoires' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Mise en avant sur la home',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      media: 'logo',
    },
    prepare({ title, subtitle, media }) {
      const typeLabel =
        subtitle === 'grande-marque' ? '🏆 Grande marque' : '🌱 Émergente'
      return { title, subtitle: typeLabel, media }
    },
  },
})
