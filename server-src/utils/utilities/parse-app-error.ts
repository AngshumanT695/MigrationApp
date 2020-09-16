function parseAppError(err: any) {
  if (err) {
    if (err.message) {
      return { message: err.message };
    } else {
      return err;
    }
  } else {
    return { message: 'An error has occurred. Please try again.' }
  }
}

export default parseAppError;
