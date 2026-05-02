import { defineField, defineType } from 'sanity'

export const categorySchema = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'color',
      title: 'Couleur badge',
      type: 'string',
      description: 'Classe Tailwind ou code hex pour la couleur du badge',
      options: {
        list: [
          { title: 'Orange (default)', value: 'bg-orange-500' },
          { title: 'Bleu', value: 'bg-blue-500' },
          { title: 'Vert', value: 'bg-green-500' },
          { title: 'Rouge', value: 'bg-red-500' },
          { title: 'Violet', value: 'bg-purple-500' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'description' },
  },
})
