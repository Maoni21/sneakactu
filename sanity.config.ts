import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  basePath: '/studio',
  name: 'sneakactu',
  title: 'SneakActu — Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('SneakActu')
          .items([
            S.listItem()
              .title('Articles')
              .child(
                S.documentTypeList('article').title('Tous les articles')
              ),
            S.divider(),
            S.listItem()
              .title('Marques')
              .child(
                S.documentTypeList('brand').title('Toutes les marques')
              ),
            S.listItem()
              .title('Releases')
              .child(
                S.documentTypeList('release').title('Calendrier des sorties')
              ),
            S.divider(),
            S.listItem()
              .title('Catégories')
              .child(
                S.documentTypeList('category').title('Catégories')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
