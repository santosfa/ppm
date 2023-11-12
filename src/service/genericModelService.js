class GenericModelService {
    constructor(modelName) {
      const modelPath = `../model/${modelName}/${modelName}Model`;
      this.model = require(modelPath);
    }
  
    async listAll(skip, limit) {
      try {
        const items = await this.model.find().skip(skip).limit(limit).lean();
        return items;
      } catch (error) {
        throw error;
      }
    }
  
    async listByField(query) {
      try {
        const items = query._id
          ? await this.model.findOne({ _id: query._id }).select('-__v').lean()
          : await this.model.find(query).select('-__v').lean();
  
        return items || null;
      } catch (error) {
        console.error(`Error listing items:`, error);
        throw error;
      }
    }
  
    async getTotalCount() {
      try {
        const totalCount = await this.model.countDocuments();
        return totalCount;
      } catch (error) {
        console.error("Error getting total count:", error);
        throw error;
      }
    }
  
    async getTotalCountByField(query) {
      try {
        const totalCount = await this.model.countDocuments(query);
        return totalCount;
      } catch (error) {
        console.error("Error getting total count by field:", error);
        throw error;
      }
    }
  
    async create(data) {
      try {
        const newItem = await this.model.create(data);
        return newItem;
      } catch (error) {
        console.error("Error creating item:", error);
        throw error;
      }
    }
  
    async update(itemId, updatedData) {
      try {
        const updatedItem = await this.model.findOneAndUpdate(
          { _id: itemId },
          { $set: updatedData },
          { new: true }
        );
        return updatedItem;
      } catch (error) {
        console.error("Error updating item:", error);
        throw error;
      }
    }
  
    async delete(itemId) {
      try {
        const deletedItem = await this.model.findOneAndDelete({ _id: itemId });
        return deletedItem;
      } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
      }
    }
  }
  
  module.exports = GenericModelService;
  