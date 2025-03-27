import moment from "moment"

export const formatDate = (date: string) => 
  moment(date).format("DD.MM.YYYY")

export const uploadedDate = (date: string) => 
  moment(date).format("YYYY-MM-DD")