import moment from "moment";

export const SuccessToaster = () => {
  return (
    <>
      {moment().format('DD.MM.YYYY в HH:mm')}
    </>
  );
}

export const ErrorToaster = () => {
  return (
    <>
      {moment().format('DD.MM.YYYY в HH:mm')}
    </>
  );
}