const ERROR_MESSAGES = {
  CARD_INCORRECT_DATA: 'Переданы некорректные данные при создании карточки',
  CARD_NOT_FOUND: 'Карточка с указанным id не найдена',
  LIKE_CARD_INCORRECT_DATA: 'Переданы некорректные данные для постановки лайка',
  DISLIKE_CARD_INCORRECT_DATA: 'Переданы некорректные данные для снятия лайка',
  USER_NOT_FOUND: 'Пользователь по указанному id не найден',
  AVATAR_INCORRECT_DATA: 'Переданы некорректные данные при обновлении аватара',
  USER_INCORRECT_DATA: 'Переданы некорректные данные при создании пользователя',
  USER_NOT_PERMITTED_TO_DELETE_CARD: 'У вас нет прав на удаление этой карточки',
  USER_EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже существует',
  AUTHORIZATION_REQUIRED: 'Необходима авторизация',
  INCORRECT_AUTHORIZATION_DATA: 'Передан неверный логин или пароль',
  INTERNAL_SERVER_ERROR: 'Ошибка сервера',
};

export default ERROR_MESSAGES;
