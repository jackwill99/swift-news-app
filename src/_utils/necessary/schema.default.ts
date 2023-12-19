import { Schema, SchemaOptions } from "@nestjs/mongoose";

export const SchemaDefault = (
  options?: SchemaOptions,
  toJsonTransform?: (ret: Record<string, any>) => Record<string, any>
) =>
  Schema({
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, opt) {
        ret.id = ret._id;

        delete ret["_id"];
        delete ret["updatedAt"];
        delete ret["createdAt"];
        delete ret["delete"];
        delete ret["__v"];

        let modifiedRet = ret;
        if (toJsonTransform != undefined) {
          modifiedRet = toJsonTransform(modifiedRet);
        }

        return modifiedRet;
      },
    },
    ...options,
  });

export const aggregateFacetOperation = (extraProject?: {
  [key: string]: 0 | 1;
}) => [
  {
    $addFields: {
      id: "$_id",
    },
  },
  {
    $project: {
      updatedAt: 0,
      createdAt: 0,
      delete: 0,
      __v: 0,
      _id: 0,
      ...extraProject,
    },
  },
];
