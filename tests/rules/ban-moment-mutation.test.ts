import moment from 'moment-timezone'
import rule from '../../src/rules/ban-moment-mutation'
import { RuleTester, getFixturesRootDir } from '../RuleTester'

const rootDir = getFixturesRootDir()
const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    tsconfigRootDir: rootDir,
    project: './tsconfig.json',
  },
})

ruleTester.run('ban-moment-mutation', rule, {
  valid: [
    {
      code: `
      import moment from 'moment-timezone'
      moment().isoWeek()
    `,
    },
    {
      code: `
        import moment from 'moment-timezone'
        function add(x: moment.Moment) {
          return x.clone().add(1, "day")
        }
        add(moment())
      `,
    },
    {
      code: `
        import moment from 'moment-timezone'
        function add(x: moment.Moment) {
          return x.clone().add(1, "day").subtract(1, "hour")
        }
        add(moment())
      `,
    },
    {
      code: `
        import moment from 'moment-timezone'
        moment().add(1, "day")
      `,
    },
    {
      code: `
        import moment from 'moment-timezone'
        moment().add(1, "day").subtract(1, "day")
      `,
    },
  ],
  invalid: [
    {
      code: `
        import moment from 'moment-timezone'
        function add(x: moment.Moment) {
          return x.add(1, "day")
        }
        add(moment())
      `,
      errors: [
        {
          messageId: 'banMomentMutation',
          data: {
            method: 'add',
            suggestion: '',
          },
          line: 4,
          column: 18,
        },
      ],
      options: [],
    },
    {
      code: `
        import moment from 'moment-timezone'
        function add(x: moment.Moment) {
          return x.add(1, "day").subtract(1, "hour")
        }
        add(moment())
      `,
      errors: [
        {
          messageId: 'banMomentMutation',
          data: {
            method: 'subtract',
            suggestion: '',
          },
          line: 4,
          column: 18,
        },
        {
          messageId: 'banMomentMutation',
          data: {
            method: 'add',
            suggestion: '',
          },
          line: 4,
          column: 18,
        },
      ],
      options: [],
    },
    {
      // TODO: we don't handle aliasing
      code: `
        import moment from 'moment-timezone'
        function add(x: moment.Moment) {
          let z = x.clone()
          return z.add(1, "day").subtract(1, "hour")
        }
        add(moment())
      `,
      errors: [
        {
          messageId: 'banMomentMutation',
          data: {
            method: 'subtract',
            suggestion: '',
          },
        },
        {
          messageId: 'banMomentMutation',
          data: {
            method: 'add',
            suggestion: '',
          },
        },
      ],
      options: [],
    },
  ],
})
