CREATE TABLE `users` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(50),
  `password` VARCHAR(100) NOT NULL,
  `key` VARCHAR(20) NOT NULL,
  `gender` TINYINT(1) NOT NULL DEFAULT '1',
  `birthday` DATE,
  `descrption` VARCHAR(50),
  `isActive` TINYINT(1) NOT NULL DEFAULT '1',
  `avatar` VARCHAR(100) DEFAULT '/IMG/avatarDefault.jpg'
  `createTime` DATE NOT NULL,
  `updateTime` DATE NOT NULL
);

CREATE TABLE `relationship` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `uID` INT NOT NULL,
  `fID` INT NOT NULL,
  `createTime` DATETIME NOT NULL,
  `updateTime` DATETIME NOT NULL
);
