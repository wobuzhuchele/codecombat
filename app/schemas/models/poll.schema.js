const c = require('./../schemas')
const str = require('underscore.string')
const countryList = require('country-list')
const countryNames = countryList().getNames().map(str.slugify)

const PollSchema = c.object({ title: 'Poll' })
c.extendNamedProperties(PollSchema) // name first

_.extend(PollSchema.properties, {
  hidden: { type: 'boolean', description: 'Prevents poll from being displayed to users(globally). Useful for a multi-poll or stopping a poll from showing up without deleting.' },
  hiddenCountries: c.array({ title: 'Hidden Countries', description: 'Prevents poll from being displayed to users in these countries. Set hidden to false if you set this value' }, {
    type: 'string',
    description: 'slugify country name (user.country) to hide poll from.',
    enum: countryNames
  }),
  description: { type: 'string', title: 'Description', description: 'Optional: extra context or explanation', format: 'markdown' },
  answers: c.array({ title: 'Answers' },
    c.object({ required: ['key', 'text', 'i18n', 'votes'] }, {
      key: c.shortString({ title: 'Key', description: 'Key for recording votes, like 14-to-17', pattern: '^[a-z0-9-]+$' }),
      text: c.shortString({ title: 'Text', description: 'Answer that the player will see, like 14 - 17.', format: 'markdown' }),
      i18n: { type: 'object', title: 'i18n', format: 'i18n', props: ['text'] },
      votes: { title: 'Votes', type: 'integer', minimum: 0 },
      nextPoll: c.stringID({ title: 'Next Poll', description: 'Which poll to show immediately after this one.' }),
      nextURL: c.shortString({ title: 'Next URL', description: 'URL to redirect to after this poll is answered. Overrides nextPoll.' })
    })),
  i18n: { type: 'object', title: 'i18n', format: 'i18n', props: ['name', 'description'] },
  created: c.date({ title: 'Created', readOnly: true }),
  priority: { title: 'Priority', description: 'Lower numbers will show earlier.', type: 'integer' },
  userProperty: c.shortString({ pattern: c.identifierPattern, description: 'Optional: store the answer inside the User object itself, also, with this property name.' })
})

c.extendBasicProperties(PollSchema, 'poll')
c.extendSearchableProperties(PollSchema)
c.extendTranslationCoverageProperties(PollSchema)
c.extendPatchableProperties(PollSchema)

module.exports = PollSchema
