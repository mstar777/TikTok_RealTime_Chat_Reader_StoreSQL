/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 100424
 Source Host           : localhost:3306
 Source Schema         : tiktok

 Target Server Type    : MySQL
 Target Server Version : 100424
 File Encoding         : 65001

 Date: 18/04/2022 18:51:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tik_chat
-- ----------------------------
DROP TABLE IF EXISTS `tik_chat`;
CREATE TABLE `tik_chat`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `profilePictureUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `uniqueId` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `comments` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `likeCount` varchar(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `displayType` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `roomId` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `date_time` datetime NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for tik_gift
-- ----------------------------
DROP TABLE IF EXISTS `tik_gift`;
CREATE TABLE `tik_gift`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `giftId` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `profilePictureUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `uniqueId` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gift_desc` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gift_icon` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gift_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gift_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gift_diamondCount` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `gift_type` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `gift_repeat_count` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `gift_repeat_end` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `roomId` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `date_time` datetime NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for tik_room
-- ----------------------------
DROP TABLE IF EXISTS `tik_room`;
CREATE TABLE `tik_room`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomId` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `viewerCount` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `likeCount` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `totalLikeCount` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `date_time` datetime NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
