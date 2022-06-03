import * as ts from 'typescript'
import * as util from '../util'

export type MessageIds = 'banMomentMutation'

const mutatingMethods = new Set(
  Object.entries({
    format: 'pure',
    startOf: 'mut',
    endOf: 'mut',
    add: 'mut',
    subtract: 'mut',
    calendar: 'pure',
    clone: 'pure',
    valueOf: 'pure',
    local: 'mut',
    isLocal: 'pure',
    utc: 'mut',
    isUTC: 'pure',
    isUtc: 'pure',
    parseZone: 'pure',
    isValid: 'pure',
    invalidAt: 'pure',
    hasAlignedHourOffset: 'pure',
    creationData: 'pure',
    parsingFlags: 'pure',
    year: 'pure',
    years: 'pure',
    quarter: 'pure',
    quarters: 'pure',
    month: 'pure',
    months: 'pure',
    day: 'pure',
    days: 'pure',
    date: 'pure',
    dates: 'pure',
    hour: 'pure',
    hours: 'pure',
    minute: 'pure',
    minutes: 'pure',
    second: 'pure',
    seconds: 'pure',
    millisecond: 'pure',
    milliseconds: 'pure',
    weekday: 'pure',
    isoWeekday: 'pure',
    weekYear: 'pure',
    isoWeekYear: 'pure',
    week: 'pure',
    weeks: 'pure',
    isoWeek: 'pure',
    isoWeeks: 'pure',
    weeksInYear: 'pure',
    isoWeeksInYear: 'pure',
    isoWeeksInISOWeekYear: 'pure',
    dayOfYear: 'pure',
    from: 'pure',
    to: 'pure',
    fromNow: 'pure',
    toNow: 'pure',
    diff: 'pure',
    toArray: 'pure',
    toDate: 'pure',
    toISOString: 'pure',
    inspect: 'pure',
    toJSON: 'pure',
    unix: 'pure',
    isLeapYear: 'pure',
    zone: 'pure',
    utcOffset: 'pure',
    isUtcOffset: 'pure',
    daysInMonth: 'pure',
    isDST: 'pure',
    zoneAbbr: 'pure',
    zoneName: 'pure',
    isBefore: 'pure',
    isAfter: 'pure',
    isSame: 'pure',
    isSameOrAfter: 'pure',
    isSameOrBefore: 'pure',
    isBetween: 'pure',
    lang: 'pure',
    locale: 'pure',
    localeData: 'pure',
    isDSTShifted: 'pure',
    max: 'pure',
    min: 'pure',
    get: 'pure',
    set: 'mut',
    toObject: 'pure',
    tz: 'pure',
  })
    .map(([key, value]) => {
      if (value === 'mut') {
        return key
      }
      return null
    })
    .filter(<T>(x: T | null): x is T => x != null)
)

function isMoment(symbol: ts.Symbol, typeChecker: ts.TypeChecker): boolean {
  return (
    typeChecker.typeToString(typeChecker.getDeclaredTypeOfSymbol(symbol)) ===
    'Moment'
  )
}

export default util.createRule<[], MessageIds>({
  name: 'ban-moment-mutation',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Bans mutating Moment objects',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      banMomentMutation: 'Consider calling .clone() before mutating.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      MemberExpression(node): void {
        const parserServices = util.getParserServices(context)
        const typeChecker = parserServices.program.getTypeChecker()
        const objectType = typeChecker
          .getTypeAtLocation(
            parserServices.esTreeNodeToTSNodeMap.get(node.object)
          )
          .getSymbol()
        if (objectType != null && isMoment(objectType, typeChecker)) {
          const method = typeChecker
            .getTypeAtLocation(
              parserServices.esTreeNodeToTSNodeMap.get(node.property)
            )
            .getSymbol()
            ?.getEscapedName()
          if (method == null) {
            return
          }

          // navigate up to x
          // x.add(1, "day").subtract(1, "day").add(1, "week")
          let n = node
          while (
            n.object.type === 'CallExpression' &&
            n.object.callee.type === 'MemberExpression'
          ) {
            n = n.object.callee
          }
          // x.clone().add(1, "day")
          if (n.property.type === 'Identifier' && n.property.name === 'clone') {
            return
          }
          // moment().add(1, "day")
          if (
            n.object.type === 'CallExpression' &&
            n.object.callee.type === 'Identifier' &&
            n.object.callee.name === 'moment'
          ) {
            return
          }

          const methodName = method.toString()
          if (mutatingMethods.has(methodName)) {
            context.report({
              node,
              data: {
                method: method,
              },
              messageId: 'banMomentMutation',
            })
          }
        }
      },
    }
  },
})
