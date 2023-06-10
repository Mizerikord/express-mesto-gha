const errorHandler = (err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : ` ${message}. Код ошибки ${statusCode}`,
    });
  next();
};

module.exports = { errorHandler };
