const mongoose = require('mongoose');
const Role = require('../Models/Role');
const fs = require('node:fs');

// Helpers
const RoleHelper = require('../Services/RoleHelper');
const UserService = require('../Services/UserService');
const Response = require('../Services/Response');
const GeneralHelper = require('../Services/GeneralHelper');

// Constants
const Message = require('../Constants/Message.js');
const RoleConstant = require('../Constants/Role.js');

// Models
const Item = require('../Models/Item');
const Category = require('../Models/Category');

//  Will create "Super Admin" & default roles of "Super Admin" & "Restaurents"
exports.initialSetup = async (req, res, next) => {
  const adminRole = await RoleHelper.create({ body: { title: RoleConstant.SUPER_ADMIN } });

  // Create General Roles.
  await RoleHelper.create({ body: { title: RoleConstant.RESTAURANT } });
  await RoleHelper.create({ body: { title: RoleConstant.WAITER } });
  await RoleHelper.create({ body: { title: RoleConstant.CHEF } });
  await RoleHelper.create({ body: { title: RoleConstant.ACCOUNTANT } });
  await RoleHelper.create({ body: { title: RoleConstant.CUSTOMER } });

  let admin = {
    username: 'admin',
    firstName: 'admin',
    lastName: 'super',
    email: 'admin@super.com',
    role: adminRole._id,
    roleName: adminRole.title,
    password: 'Test@1234',
    isVarified: true,
  };

  const superAdminInfo = await UserService.findByEmail('admin@super.com');

  if (superAdminInfo) {
    admin.password = await GeneralHelper.bcryptPassword(admin.password);
    await UserService.update({ _id: superAdminInfo._id }, admin);
  } else {
    await UserService.create({ body: admin, user: {} }, true);
  }
  return Response.sendResponse(res, Message.REQUEST_SUCCESSFUL);
};

exports.updateItemsTranslation = async (req, res, next) => {
  let items = await Item.find({});
  for (let i = 0; i < items.length; i++) {
    if (typeof items[i].name == 'string') {
      for (let j = 0; j < items[i].variants.length; j++) {
        items[i].variants[j].name = await GeneralHelper.generateMultipleLanguages(
          items[i].variants[j].name
        );
      }
      await Item.updateOne(
        { _id: items[i].id },
        {
          $set: {
            name: await GeneralHelper.generateMultipleLanguages(items[i].name),
            description: await GeneralHelper.generateMultipleLanguages(items[i].description),
            variants: items[i].variants,
          },
        }
      );
    }
  }

  return Response.sendResponse(res, Message.REQUEST_SUCCESSFUL);
};

exports.updateCategoriesTranslation = async (req, res, next) => {
  let categories = await Category.find({});
  for (let i = 0; i < categories.length; i++) {
    if (typeof categories[i].name == 'string') {
      await Category.updateOne(
        { _id: categories[i].id },
        {
          $set: {
            name: await GeneralHelper.generateMultipleLanguages(categories[i].name),
          },
        }
      );
    }
  }

  return Response.sendResponse(res, Message.REQUEST_SUCCESSFUL);
};
