import moment from 'moment'

export default {
  filters: {
    _milliToDate (milli) {
      return moment(parseInt(milli)).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    _timeAgoFromMillis (milli) {
      return moment(parseInt(milli)).fromNow()
    }
  },
  methods: {
    _getCustomDateToMillis (dateString) {
      const d = moment(dateString, 'DD-MMMM-YYYY').toDate()
      d.setHours(0, 0, 0)
      return d.getTime()
    },
    _milliToDateYYYYMMDD (milli) {
      return moment(parseInt(milli)).format('YYYY-MM-DD')
    },
    _getDateToMillisFromYYYYMMDD (dateString) {
      const d = moment(dateString, 'YYYY-MM-DD').toDate()
      d.setHours(0, 0, 0)
      return d.getTime()
    }
  }
}
