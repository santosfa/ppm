const path = require("path");
const { MongoServerError } = require("mongodb");
const GenericModelService = require("../service/genericModelService");

class BaseController {
  constructor() {}

  loadI18nMessages(language) {
    try {
      return require(path.join(__dirname, "i18n", `${language}.json`));
    } catch (error) {
      console.error("Custom messages file not found", error);
      return {};
    }
  }

  async executeOperation(req, res, modelName, operationFn) {
    const { lang } = req.query;
    const language = lang || "en";
    const i18nMessages = BaseController.prototype.loadI18nMessages.call(
      this,
      language
    );

    try {
      if (!modelName) {
        throw new Error("Model name is not provided.");
      }

      const modelService = new GenericModelService(modelName);
      const result = await operationFn(modelService);

      if (result && result.data) {
        const responseData = Array.isArray(result.data)
          ? result.data
          : [result.data];
        const totalItemCount = responseData.length;
        if (responseData.length > 0) {
          return this.sendSuccessResponse(res, {
            data: responseData,
            totalItemCount
          });
        }
      }

      return this.sendNotFoundResponse(res, i18nMessages[`noDataFound`]);
    } catch (error) {
      console.error(error);
      console.error("error in executeOperation", error);
      return this.handleErrorResponse(res, error, i18nMessages);
    }
  }

  sendSuccessResponse(res, result) {
    return res.status(200).json({
      ...result,
      message: "success",
      statusCode: 200
    });
  }

  sendNotFoundResponse(res) {
    return res.status(404).json({
      message: "No records were found with the specified criteria.",
      statusCode: 404
    });
  }

  handleErrorResponse(res, error, i18nMessages) {
    let statusCode = 500;
    let errorMessageKey = "unknownError";

    switch (true) {
      case error instanceof MongoServerError:
        if (error.code === 11000 || error.code === 11001) {
          statusCode = 400;
          errorMessageKey = "duplicatedId";
          console.log("Handling duplicatedId error");
        }
        break;

      default:
        statusCode = 400;
        errorMessageKey = "unknownError";
        break;
    }

    const errorMessage = i18nMessages[errorMessageKey];
    return res.status(statusCode).json({
      message: errorMessage,
      statusCode
    });
  }

  async listAll(req, res, modelName) {
    const i18nMessages = this.loadI18nMessages(req.query.lang || "en");
    const { page, limit } = req.query;
    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const itemsPerPage = Math.max(parseInt(limit) || 10, 1);
    const skipCount = (pageNumber - 1) * itemsPerPage;

    return this.executeOperation(req, res, modelName, async model => {
      const totalItemCount = await model.getTotalCount();
      const totalPages = Math.ceil(totalItemCount / itemsPerPage);

      if (pageNumber > totalPages) {
        return {
          message: i18nMessages[`pageNotFound`],
          totalPages,
          currentPage: pageNumber
        };
      }

      const data = await model.listAll(skipCount, itemsPerPage);

      if (data.length === 0) {
        return {
          message: i18nMessages[`no${modelName}s`],
          totalPages,
          currentPage: pageNumber
        };
      }

      return { data, totalItemCount, totalPages, currentPage: pageNumber };
    });
  }

  async listByField(req, res, modelName, field, value) {
    const i18nMessages = this.loadI18nMessages(req.query.lang || "en");
    return this.executeOperation(req, res, modelName, async model => {
      let query = {};

      if (field === "_id") {
        query[field] = value;
      } else {
        const regexValue = value.endsWith("*")
          ? value.slice(0, -1)
          : `^${value}$`;
        query[field] = new RegExp(regexValue, "i");
      }

      try {
        const data = await model.listByField(query);
        const totalItemCount =
          field === "_id" ? 1 : await model.getTotalCountByField(query);
        const responseData = Array.isArray(data) ? data : [data];
        if (!data || responseData.length === 0) {
          return {
            message: i18nMessages[`noDataFound`],
            statusCode: 404
          };
        }
        return { data: responseData, totalItemCount };
      } catch (error) {
        if (error.message === "Invalid _id format") {
          return {
            message: i18nMessages.invalidIdFormat,
            statusCode: 400
          };
        }

        throw error;
      }
    });
  }

  async create(req, res, modelName) {
    const i18nMessages = this.loadI18nMessages(req.query.lang || "en");
    return this.executeOperation(req, res, modelName, async model => {
      const modelData = req.body;
      const data = await model.create(modelData);
      return { data };
    });
  }

  async update(req, res, modelName) {
    return this.executeOperation(req, res, modelName, async model => {
      const { modelId } = req.params;
      const { updatedData } = req.body;
      const updatedModel = await model.update(modelId, updatedData);
      if (!updatedModel) {
        return { message: i18nMessages[`${modelName}NotFound`] };
      }

      return { updatedModel };
    });
  }

  async delete(req, res, modelName) {
    return this.executeOperation(req, res, modelName, async model => {
      const { modelId } = req.params;
      const deletedModel = await model.delete(modelId);
      if (!deletedModel) {
        return { message: i18nMessages[`${modelName}NotFound`] };
      }
      return { deletedModel };
    });
  }
}

module.exports = new BaseController();
