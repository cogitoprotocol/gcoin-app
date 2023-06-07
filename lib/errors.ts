export const getRevertError = (error: unknown) => {
  const str = String(error);
  const reason = str.match(/(?:reverted with the following reason:\n)([^\n]*)/);
  if (reason) {
    return reason[1];
  }
};
